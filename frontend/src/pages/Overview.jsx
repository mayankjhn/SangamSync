import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Users, UserCheck, AlertTriangle, ShieldAlert } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function Overview() {
  const [stats, setStats] = useState({
    total_volunteers: 0,
    active_volunteers: 0,
    ongoing_incidents: 0,
    critical_alerts: 0
  })

  useEffect(() => {
    // Fetch stats from backend
    axios.get('http://localhost:8000/api/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
  }, [])

  const statCards = [
    { title: "Total Volunteers", value: stats.total_volunteers, icon: Users, color: "text-blue-500" },
    { title: "Active Now", value: stats.active_volunteers, icon: UserCheck, color: "text-green-500" },
    { title: "Ongoing Incidents", value: stats.ongoing_incidents, icon: AlertTriangle, color: "text-yellow-500" },
    { title: "Critical Alerts", value: stats.critical_alerts, icon: ShieldAlert, color: "text-red-500" },
  ]

  const pieData = [
    { name: 'Active', value: stats.active_volunteers },
    { name: 'Offline/Busy', value: stats.total_volunteers - stats.active_volunteers }
  ]

  const barData = [
    { name: 'Sector A', incidents: 4 },
    { name: 'Sector B', incidents: 2 },
    { name: 'Sector C', incidents: 6 },
    { name: 'Sector D', incidents: 1 },
    { name: 'Sector E', incidents: 1 }
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-white/5 shadow-lg">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                </div>
                <div className={`p-4 rounded-full bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-white/5">
            <CardHeader>
              <CardTitle>Volunteer Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-white/5">
            <CardHeader>
              <CardTitle>Incidents by Sector</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                  <Bar dataKey="incidents" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
