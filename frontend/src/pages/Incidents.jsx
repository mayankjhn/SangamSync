import React, { useState, useEffect } from 'react'
import api from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { History, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const PRIORITY_STYLES = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  Low: 'bg-green-500/20 text-green-400 border-green-500/40',
}
const STATUS_STYLES = {
  'In Progress': 'bg-blue-500/20 text-blue-400',
  'Pending': 'bg-yellow-500/20 text-yellow-400',
  'Resolved': 'bg-green-500/20 text-green-400',
}

const INCIDENT_ICONS = {
  'Medical Emergency': '🏥', 'Missing Person': '🔍', 'Crowd Surge': '👥',
  'Security Threat': '🚨', 'Fire Emergency': '🔥', 'Infrastructure Failure': '⚠️', 'General Incident': '📋'
}

export default function Incidents() {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchIncidents = () => {
    api.get('/api/incidents')
      .then(res => { setIncidents(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchIncidents()
    const interval = setInterval(fetchIncidents, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleResolve = async (id) => {
    await api.patch(`/api/incidents/${id}/resolve`)
    fetchIncidents()
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <Card className="bg-card/50 border-white/5">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" /> Incident History
          </CardTitle>
          <CardDescription>All incidents reported through the dispatch system. Auto-refreshes every 10s.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <div className="space-y-3">{Array.from({length: 3}).map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)}</div>}
          {!loading && incidents.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No incidents yet</p>
              <p className="text-sm mt-1 opacity-60">Report and dispatch an incident to see it here</p>
            </div>
          )}
          <div className="space-y-3">
            {incidents.map((inc, idx) => (
              <motion.div
                key={inc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/8 transition-colors"
              >
                <div className="text-2xl">{INCIDENT_ICONS[inc.type] || '📋'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-white">{inc.type}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${PRIORITY_STYLES[inc.priority]}`}>{inc.priority}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[inc.status]}`}>{inc.status}</span>
                  </div>
                  <p className="text-sm text-gray-300 truncate">{inc.description}</p>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span>📍 {inc.sector}</span>
                    <span>🕐 {new Date(inc.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>{new Date(inc.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                {inc.status !== 'Resolved' && (
                  <button
                    onClick={() => handleResolve(inc.id)}
                    className="shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 transition-colors font-medium"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Resolve
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
