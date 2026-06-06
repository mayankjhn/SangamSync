import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { motion } from 'framer-motion'

export default function Heatmap() {
  const sectors = [
    { id: 'Sector A', status: 'safe', incidents: 1, volunteers: 150 },
    { id: 'Sector B', status: 'warning', incidents: 4, volunteers: 80 },
    { id: 'Sector C', status: 'critical', incidents: 12, volunteers: 45 },
    { id: 'Sector D', status: 'safe', incidents: 0, volunteers: 200 },
    { id: 'Sector E', status: 'warning', incidents: 3, volunteers: 90 },
    { id: 'Sector F', status: 'safe', incidents: 2, volunteers: 120 },
    { id: 'Sector G', status: 'safe', incidents: 0, volunteers: 140 },
    { id: 'Sector H', status: 'critical', incidents: 8, volunteers: 30 },
  ]

  const getStatusColors = (status) => {
    switch (status) {
      case 'safe': return 'bg-green-500/20 border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse'
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400'
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 h-full flex flex-col">
      <Card className="bg-card/50 backdrop-blur-sm border-white/5 flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl">Live Sector Heatmap</CardTitle>
          <CardDescription>Real-time geographic distribution of incidents and volunteer density.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl p-6 bg-black/40 rounded-2xl border border-white/10 relative overflow-hidden">
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            
            {sectors.map((sector, i) => (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                key={sector.id}
                className={`relative z-10 p-6 rounded-xl border ${getStatusColors(sector.status)} flex flex-col items-center justify-center aspect-square transition-transform hover:scale-105 cursor-pointer`}
              >
                <h3 className="text-xl font-bold mb-2">{sector.id}</h3>
                <div className="text-sm opacity-90 text-center space-y-1">
                  <p>{sector.incidents} Incidents</p>
                  <p>{sector.volunteers} Volunteers</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-8 mt-12 justify-center">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500/50 border border-green-500"></div> <span className="text-sm text-muted-foreground">Optimal Coverage</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-yellow-500/50 border border-yellow-500"></div> <span className="text-sm text-muted-foreground">Moderate Shortage</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500/50 border border-red-500"></div> <span className="text-sm text-muted-foreground">Critical Shortage</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
