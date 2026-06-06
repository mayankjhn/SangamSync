import React, { useState } from 'react'
import api from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { AlertCircle, Brain, Send, Users, CheckCircle2, Clock, MapPin, Zap, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PRIORITY_STYLES = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  Low: 'bg-green-500/20 text-green-400 border-green-500/40',
}

export default function Dispatch() {
  const [incidentText, setIncidentText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [volunteers, setVolunteers] = useState([])
  const [isDispatching, setIsDispatching] = useState(false)
  const [dispatched, setDispatched] = useState(false)
  const [dispatchResult, setDispatchResult] = useState(null)

  const handleAnalyze = async () => {
    if (!incidentText.trim()) return
    setIsAnalyzing(true)
    setAiResult(null)
    setVolunteers([])
    setDispatched(false)
    setDispatchResult(null)
    try {
      const res = await api.post(`/api/ai/analyze-incident?text=${encodeURIComponent(incidentText)}`)
      setAiResult(res.data)
      const allocRes = await api.post('/api/ai/allocate-volunteers', res.data)
      setVolunteers(allocRes.data)
    } catch (err) {
      console.error(err)
      alert("Backend connection error. Is the server running?")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDispatch = async () => {
    if (!aiResult || volunteers.length === 0) return
    setIsDispatching(true)
    try {
      const res = await api.post('/api/dispatch', {
        incident_text: incidentText,
        incident_data: aiResult,
        volunteer_ids: volunteers.map(v => v.volunteer.id)
      })
      setDispatchResult(res.data)
      setDispatched(true)
    } catch (err) {
      console.error(err)
      alert("Dispatch failed. Check backend connection.")
    } finally {
      setIsDispatching(false)
    }
  }

  const handleReset = () => {
    setIncidentText('')
    setAiResult(null)
    setVolunteers([])
    setDispatched(false)
    setDispatchResult(null)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-white/5 shadow-xl border-t-2 border-t-red-500/50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <AlertCircle className="text-red-500 w-6 h-6" />
            Report Emergency Incident
          </CardTitle>
          <CardDescription>Describe the situation in plain language — Hindi or English. The engine classifies instantly.</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full h-28 p-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-base leading-relaxed"
            placeholder={"Try:\n• Medical emergency at Sector 3, person unconscious\n• Child missing near Sector 5\n• Massive crowd surge at Sector 8 entry"}
            value={incidentText}
            onChange={(e) => setIncidentText(e.target.value)}
            disabled={dispatched}
          />
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          {dispatched ? (
            <Button onClick={handleReset} className="bg-white/10 hover:bg-white/20 gap-2">
              <RefreshCw className="w-4 h-4" /> Report New Incident
            </Button>
          ) : (
            <div />
          )}
          <Button
            onClick={handleAnalyze}
            disabled={!incidentText.trim() || isAnalyzing || dispatched}
            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-8 h-12 text-base shadow-[0_0_20px_rgba(79,70,229,0.4)]"
          >
            {isAnalyzing
              ? <><Brain className="w-4 h-4 animate-pulse" /> Analyzing...</>
              : <><Zap className="w-4 h-4" /> Analyze & Allocate</>}
          </Button>
        </CardFooter>
      </Card>

      {/* Dispatch Success Banner */}
      <AnimatePresence>
        {dispatched && dispatchResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-500/20 border border-green-500/40 rounded-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="text-green-400 w-6 h-6 shrink-0" />
            <div>
              <p className="font-semibold text-green-300">{dispatchResult.message}</p>
              <p className="text-xs text-green-400/70 mt-0.5">{dispatchResult.dispatched_volunteers.length} volunteers marked Busy. Stats updating across dashboard.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {aiResult && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6"
          >
            {/* Classification Panel */}
            <div className="lg:col-span-2">
              <Card className="bg-indigo-950/40 border-indigo-500/30 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-300 text-lg">
                    <CheckCircle2 className="w-5 h-5" /> Incident Classification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4 border border-white/10 rounded-xl bg-white/5">
                    <div className="text-4xl mb-2">{aiResult.icon}</div>
                    <p className="font-bold text-xl text-white">{aiResult.incident_type}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/30 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Priority</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${PRIORITY_STYLES[aiResult.priority] || PRIORITY_STYLES.Medium}`}>
                        {aiResult.priority}
                      </span>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                      <p className="font-bold text-lg text-green-400">{aiResult.confidence}%</p>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                    <p className="font-semibold text-white">{aiResult.sector}</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {aiResult.required_skills?.map(s => (
                        <Badge key={s} variant="outline" className="border-indigo-500/50 text-indigo-300 bg-indigo-500/10 text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Volunteers Needed</p>
                    <p className="font-bold text-2xl text-white">{aiResult.required_count}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Volunteer Allocation Panel */}
            <div className="lg:col-span-3">
              <Card className="bg-card/50 border-white/5 h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5 text-blue-400" /> Smart Allocation — Top Matches
                  </CardTitle>
                  <CardDescription>Ranked by skill fit, proximity, experience & workload.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  {volunteers.map((item, idx) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      key={item.volunteer.id}
                      className={`p-4 border rounded-2xl transition-colors ${dispatched ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-lg font-bold text-white">#{idx + 1} {item.volunteer.name}</span>
                            <Badge variant="outline" className="text-[10px] border-white/20 text-gray-400">{item.volunteer.experience_level}</Badge>
                            {dispatched && <Badge className="text-[10px] bg-green-500/20 text-green-400 border-0">Dispatched</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{item.volunteer.sector}</p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="font-black text-3xl text-green-400">{Math.round(item.match_score)}%</p>
                          <p className="text-xs text-muted-foreground">Match</p>
                        </div>
                      </div>
                      <div className="w-full bg-black/50 rounded-full h-2 mb-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(item.match_score, 100)}%` }}
                          transition={{ delay: idx * 0.15 + 0.2, duration: 0.6 }}
                          className="bg-gradient-to-r from-blue-500 via-indigo-400 to-green-400 h-2 rounded-full"
                        />
                      </div>
                      <div className="space-y-1 mb-3">
                        {item.reasons?.map((reason, i) => (
                          <p key={i} className="text-xs text-gray-300">{reason}</p>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                        <Clock className="w-3 h-3" /> ETA: {item.response_time}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
                <CardFooter className="pt-4 border-t border-white/10">
                  <Button
                    onClick={handleDispatch}
                    disabled={isDispatching || dispatched || volunteers.length === 0}
                    className={`w-full h-12 text-base font-semibold ${dispatched ? 'bg-green-600 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]`}
                  >
                    {dispatched
                      ? <><CheckCircle2 className="mr-2 w-5 h-5" /> Team Dispatched & Saved to System</>
                      : isDispatching
                      ? 'Dispatching...'
                      : <><Send className="mr-2 w-4 h-4" /> Dispatch Team Now</>}
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
