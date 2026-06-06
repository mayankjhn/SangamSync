import React, { useState, useEffect } from 'react'
import api from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Activity, Users, AlertTriangle, Shield, TrendingUp, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const SECTOR_COLORS = {
  safe: 'text-green-400 border-green-500/30 bg-green-500/10',
  warning: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  critical: 'text-red-400 border-red-500/30 bg-red-500/10',
}

export default function Chat() {
  const [stats, setStats] = useState(null)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const fetchStats = () => {
      api.get('/api/dashboard/stats')
        .then(res => setStats(res.data))
        .catch(console.error)
    }
    fetchStats()
    const interval = setInterval(fetchStats, 10000) // refresh every 10s
    const clockInterval = setInterval(() => setTime(new Date()), 1000)
    return () => { clearInterval(interval); clearInterval(clockInterval) }
  }, [])

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="text-blue-400 w-6 h-6" />
            Operations Status Board
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Live overview of all sectors and field activity</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-mono font-bold text-white">{time.toLocaleTimeString()}</p>
          <p className="text-xs text-muted-foreground">{time.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Volunteers', value: stats.total_volunteers, icon: Users, color: 'text-blue-400' },
            { label: 'Active Now', value: stats.active_volunteers, icon: Shield, color: 'text-green-400' },
            { label: 'Open Incidents', value: stats.ongoing_incidents, icon: AlertTriangle, color: 'text-yellow-400' },
            { label: 'Critical Alerts', value: stats.critical_alerts, icon: TrendingUp, color: 'text-red-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-card/50 border-white/5 text-center p-4">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Sector Health Table */}
      {stats?.sector_stats && (
        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Sector Coverage Matrix</CardTitle>
            <CardDescription>Real-time volunteer coverage and health status per sector</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stats.sector_stats.map((s, i) => (
                <motion.div
                  key={s.sector}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center justify-between p-4 rounded-xl border ${SECTOR_COLORS[s.status]}`}
                >
                  <div>
                    <p className="font-semibold text-white">{s.sector}</p>
                    <p className="text-xs opacity-70 mt-0.5">{s.available}/{s.total} volunteers active</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-2xl">{s.coverage}%</p>
                    <Badge variant="outline" className={`text-[10px] mt-1 capitalize border-current`}>
                      {s.status === 'safe' ? '🟢' : s.status === 'warning' ? '🟡' : '🔴'} {s.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Status */}
      <Card className="bg-card/50 border-white/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { label: 'Incident Classification Engine', status: 'Operational', color: 'bg-green-500' },
              { label: 'Smart Allocation Engine', status: 'Operational', color: 'bg-green-500' },
              { label: 'Burnout Detection System', status: 'Operational', color: 'bg-green-500' },
              { label: 'Sector Health Monitor', status: 'Live', color: 'bg-green-500' },
              { label: 'Volunteer Registry', status: 'Synced', color: 'bg-green-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color} animate-pulse`} />
                  <span className="text-sm text-gray-300">{item.label}</span>
                </div>
                <span className="text-xs text-green-400 font-medium">{item.status}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
