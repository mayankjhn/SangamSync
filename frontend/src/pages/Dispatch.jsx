import React, { useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { AlertCircle, Brain, Send, Users, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Dispatch() {
  const [incidentText, setIncidentText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [volunteers, setVolunteers] = useState([])
  const [isDispatching, setIsDispatching] = useState(false)
  const [dispatched, setDispatched] = useState(false)

  const handleAnalyze = async () => {
    if (!incidentText) return
    setIsAnalyzing(true)
    setAiResult(null)
    setVolunteers([])
    setDispatched(false)
    
    try {
      const res = await axios.post(`http://localhost:8000/api/ai/analyze-incident?text=${encodeURIComponent(incidentText)}`)
      const parsed = res.data
      setAiResult(parsed)
      
      // Auto trigger allocation
      const allocRes = await axios.post('http://localhost:8000/api/ai/allocate-volunteers', parsed)
      setVolunteers(allocRes.data)
    } catch (err) {
      console.error(err)
      alert("Error analyzing incident. Is the backend running with Gemini configured?")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDispatch = () => {
    setIsDispatching(true)
    setTimeout(() => {
      setIsDispatching(false)
      setDispatched(true)
    }, 1500)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-white/5 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <AlertCircle className="text-red-500 w-6 h-6" />
            Report New Incident
          </CardTitle>
          <CardDescription>Enter emergency details in plain text. AI will parse it automatically.</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full h-32 p-4 bg-black/50 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-lg"
            placeholder="e.g. A child is missing near Sector 5..."
            value={incidentText}
            onChange={(e) => setIncidentText(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleAnalyze} 
            disabled={!incidentText || isAnalyzing}
            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-6 h-12 text-lg shadow-[0_0_15px_rgba(79,70,229,0.5)]"
          >
            {isAnalyzing ? (
              <span className="animate-pulse flex items-center gap-2"><Brain className="animate-spin" /> Analyzing...</span>
            ) : (
              <><Brain /> AI Analyze</>
            )}
          </Button>
        </CardFooter>
      </Card>

      <AnimatePresence>
        {aiResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-1">
              <Card className="bg-indigo-950/30 border-indigo-500/30 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-400">
                    <CheckCircle2 className="w-5 h-5" />
                    AI Understanding
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Incident Type</p>
                    <p className="font-semibold text-lg">{aiResult.incident_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Priority</p>
                    <Badge variant={aiResult.priority === 'Critical' ? 'destructive' : 'default'} className="mt-1 text-sm px-3">
                      {aiResult.priority}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{aiResult.sector}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Required Skills</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {aiResult.required_skills?.map(s => (
                        <Badge key={s} variant="outline" className="border-indigo-500/50 text-indigo-300 bg-indigo-500/10">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="bg-card/50 backdrop-blur-sm border-white/5 h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Smart Allocation Recommendations
                  </CardTitle>
                  <CardDescription>Based on skill match, distance, availability, and workload.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  {volunteers.map((item, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      key={item.volunteer.id} 
                      className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-lg">{item.volunteer.name}</p>
                        <p className="text-sm text-muted-foreground">{item.volunteer.sector} • {item.volunteer.experience_level}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-black/50 rounded-full h-2.5 w-24">
                            <div className="bg-gradient-to-r from-blue-500 to-green-400 h-2.5 rounded-full" style={{ width: `${Math.min(item.match_score, 100)}%` }}></div>
                          </div>
                          <p className="font-bold text-xl text-green-400">{Math.round(item.match_score)}%</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Match Score</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
                <CardFooter className="pt-4 border-t border-white/10">
                  <Button 
                    onClick={handleDispatch}
                    disabled={isDispatching || dispatched || volunteers.length === 0}
                    className={`w-full h-12 text-lg ${dispatched ? 'bg-green-600 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]`}
                  >
                    {dispatched ? <><CheckCircle2 className="mr-2" /> Team Dispatched Successfully</> : 
                     isDispatching ? "Dispatching..." : <><Send className="mr-2" /> Dispatch Team</>}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
