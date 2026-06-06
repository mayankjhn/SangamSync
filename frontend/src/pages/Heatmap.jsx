import React, { useState, useEffect } from 'react'
import api from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Map } from 'lucide-react'
import { motion } from 'framer-motion'

const STATUS_STYLES = {
  safe: 'bg-green-500/20 border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)]',
  warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.15)]',
  critical: 'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse',
}

const STATUS_EMOJI = { safe: '🟢', warning: '🟡', critical: '🔴' }

export default function Heatmap() {
  const [sectors, setSectors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = () => {
      api.get('/api/dashboard/stats')
        .then(res => { setSectors(res.data.sector_stats || []); setLoading(false) })
        .catch(() => setLoading(false))
    }
    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [])

  const counts = { safe: 0, warning: 0, critical: 0 }
  sectors.forEach(s => { if (counts[s.status] !== undefined) counts[s.status]++ })

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Card className="bg-card/50 border-white/5">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Map className="text-blue-400 w-6 h-6" />
            Sector Status Heatmap
          </CardTitle>
          <CardDescription>Real-time volunteer coverage across all Mahakumbh sectors. Auto-refreshes every 15 seconds.</CardDescription>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="text-green-400">🟢 Safe: {counts.safe}</span>
            <span className="text-yellow-400">🟡 Warning: {counts.warning}</span>
            <span className="text-red-400">🔴 Critical: {counts.critical}</span>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({length: 8}).map((_, i) => (
                <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sectors.map((sector, idx) => (
                <motion.div
                  key={sector.sector}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.07 }}
                  className={`p-5 border-2 rounded-2xl cursor-pointer transition-transform hover:scale-105 ${STATUS_STYLES[sector.status]}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-base">{sector.sector}</p>
                    <span className="text-lg">{STATUS_EMOJI[sector.status]}</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs opacity-70 mb-1">Coverage</p>
                      <div className="w-full bg-black/40 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${sector.status === 'safe' ? 'bg-green-400' : sector.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'}`}
                          style={{ width: `${sector.coverage}%` }}
                        />
                      </div>
                      <p className="text-lg font-black mt-1">{sector.coverage}%</p>
                    </div>
                    <div className="flex justify-between text-xs opacity-80">
                      <span>{sector.available}/{sector.total} active</span>
                      {sector.active_incidents > 0 && (
                        <Badge className="text-[10px] bg-red-500/20 text-red-400 border-0 px-1.5">
                          {sector.active_incidents} incident{sector.active_incidents > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className={`text-[10px] border-current capitalize w-full justify-center`}>
                      {sector.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
