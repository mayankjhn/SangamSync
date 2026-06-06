import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Users } from 'lucide-react'

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8000/api/volunteers')
      .then(res => {
        const parsedData = res.data.map(vol => {
          let parsedSkills = []
          try { parsedSkills = typeof vol.skills === 'string' ? JSON.parse(vol.skills) : vol.skills } catch (e) {}
          return { ...vol, skills: parsedSkills || [] }
        })
        setVolunteers(parsedData)
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-white/5">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="text-blue-500 w-6 h-6" />
            Volunteer Registry
          </CardTitle>
          <CardDescription>Directory of all registered workforce personnel.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/40 border-b border-white/10 text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Sector</th>
                  <th className="px-6 py-4 font-medium">Skills</th>
                  <th className="px-6 py-4 font-medium">Experience</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {volunteers.map(vol => (
                  <tr key={vol.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{vol.name}<br/><span className="text-xs text-muted-foreground font-normal">{vol.phone}</span></td>
                    <td className="px-6 py-4 text-gray-300">{vol.sector}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {vol.skills.slice(0, 2).map(s => <Badge key={s} variant="outline" className="text-[10px] py-0">{s}</Badge>)}
                        {vol.skills.length > 2 && <span className="text-xs text-muted-foreground ml-1">+{vol.skills.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{vol.experience_level}</td>
                    <td className="px-6 py-4">
                      <Badge variant={vol.availability === 'Available' ? 'default' : 'secondary'} className={vol.availability === 'Available' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-transparent' : ''}>
                        {vol.availability}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
