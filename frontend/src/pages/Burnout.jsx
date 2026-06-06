import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Burnout() {
  const [volunteers, setVolunteers] = useState([])

  useEffect(() => {
    // In a real app we'd have a specific /api/analytics/burnout endpoint
    // For the hackathon demo, we just fetch all and filter in frontend
    axios.get('http://localhost:8000/api/volunteers')
      .then(res => {
        const parsedData = res.data.map(vol => {
          let parsedSkills = []
          try { parsedSkills = typeof vol.skills === 'string' ? JSON.parse(vol.skills) : vol.skills } catch (e) {}
          return { ...vol, skills: parsedSkills || [] }
        })
        const sorted = parsedData.sort((a, b) => b.hours_worked - a.hours_worked)
        setVolunteers(sorted.slice(0, 10)) // Get top 10 most worked
      })
      .catch(err => console.error(err))
  }, [])

  const getRiskLevel = (hours) => {
    if (hours > 10) return { label: 'High Risk', color: 'destructive' }
    if (hours > 7) return { label: 'Medium Risk', color: 'secondary' }
    return { label: 'Low Risk', color: 'default' }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-white/5 border-t-red-500/50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <AlertCircle className="text-red-500 w-6 h-6" />
            Workforce Burnout Detection
          </CardTitle>
          <CardDescription>AI-driven analysis identifying volunteers at risk of exhaustion.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {volunteers.map((vol, idx) => {
              const risk = getRiskLevel(vol.hours_worked)
              return (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={vol.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-lg">{vol.name}</p>
                      <Badge variant={risk.color}>{risk.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{vol.sector} • {vol.skills.join(', ')}</p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold">{vol.hours_worked}h</p>
                      <p className="text-xs text-muted-foreground">Active Shift</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{vol.consecutive_tasks}</p>
                      <p className="text-xs text-muted-foreground">Tasks</p>
                    </div>
                    
                    {risk.label === 'High Risk' && (
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium border border-white/10">
                        <RefreshCw className="w-4 h-4" /> Suggest Replacement
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
