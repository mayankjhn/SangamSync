import React, { useState, useEffect } from 'react'
import api from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Users, AlertTriangle, Shield, TrendingUp } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts'
import { motion } from 'framer-motion'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export default function Overview() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetch = () => {
      api.get('/api/dashboard/stats').then(res => setStats(res.data)).catch(console.error)
    }
    fetch()
    const interval = setInterval(fetch, 10000)
    return () => clearInterval(interval)
  }, [])

  const statCards = stats ? [
    { label: 'Total Volunteers', value: stats.total_volunteers, icon: Users, color: 'text-blue-400', bg: 'from-blue-500/10 to-transparent' },
    { label: 'Active & Available', value: stats.active_volunteers, icon: Shield, color: 'text-green-400', bg: 'from-green-500/10 to-transparent' },
    { label: 'Open Incidents', value: stats.ongoing_incidents, icon: AlertTriangle, color: 'text-yellow-400', bg: 'from-yellow-500/10 to-transparent' },
    { label: 'Critical Alerts', value: stats.critical_alerts, icon: TrendingUp, color: 'text-red-400', bg: 'from-red-500/10 to-transparent' },
  ] : []

  // Pie chart: sector coverage
  const pieData = stats?.sector_stats?.map(s => ({ name: s.sector, value: s.available })) || []

  // Bar chart: incidents by type
  const barData = stats?.incident_type_counts
    ? Object.entries(stats.incident_type_counts).map(([name, count]) => ({ name: name.replace(' Emergency', '').replace(' Failure', ''), count }))
    : []

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`bg-gradient-to-br ${stat.bg} border-white/5 relative overflow-hidden`}>
              <CardContent className="p-5">
                <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                <p className="text-4xl font-black text-white">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volunteer distribution by sector */}
        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-base">Volunteer Distribution by Sector</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                    {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0f1729', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Loading data...</div>
            )}
          </CardContent>
        </Card>

        {/* Incidents by type */}
        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-base">Incidents by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#0f1729', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
                <AlertTriangle className="w-8 h-8 opacity-30" />
                <p>No incidents yet</p>
                <p className="text-xs opacity-60">Report one in Emergency Dispatch to see data here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sector Coverage Table */}
      {stats?.sector_stats && (
        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-base">Sector Coverage Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.sector_stats.map(s => (
                <div key={s.sector} className={`p-3 rounded-xl border text-center ${
                  s.status === 'safe' ? 'border-green-500/30 bg-green-500/10' :
                  s.status === 'warning' ? 'border-yellow-500/30 bg-yellow-500/10' :
                  'border-red-500/30 bg-red-500/10'
                }`}>
                  <p className="font-semibold text-sm">{s.sector}</p>
                  <p className={`text-xl font-black ${s.status === 'safe' ? 'text-green-400' : s.status === 'warning' ? 'text-yellow-400' : 'text-red-400'}`}>{s.coverage}%</p>
                  <p className="text-xs text-muted-foreground">{s.available}/{s.total} active</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
