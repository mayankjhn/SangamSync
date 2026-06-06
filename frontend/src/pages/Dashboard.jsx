import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, AlertTriangle, Map, Activity, MessageSquare } from 'lucide-react'
import { cn } from '../lib/utils'

import Overview from './Overview'
import Dispatch from './Dispatch'
import Heatmap from './Heatmap'

import Volunteers from './Volunteers'
import Burnout from './Burnout'
import Chat from './Chat'

export default function Dashboard() {
  const location = useLocation()

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Emergency Dispatch', path: '/dashboard/dispatch', icon: AlertTriangle },
    { name: 'Sector Heatmap', path: '/dashboard/heatmap', icon: Map },
    { name: 'Optimization', path: '/dashboard/burnout', icon: Activity },
    { name: 'Volunteers', path: '/dashboard/volunteers', icon: Users },
    { name: 'Ops Status Board', path: '/dashboard/chat', icon: Activity },
  ]

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-card/30 flex flex-col backdrop-blur-md">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 text-transparent bg-clip-text tracking-tight">SangamSync</h2>
          <p className="text-xs text-muted-foreground mt-1">Control Room</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">AD</div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-green-400">Online</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 border-b border-white/10 bg-card/30 backdrop-blur-md flex items-center px-6 justify-between">
          <h1 className="text-xl font-semibold">
            {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              3 Critical Alerts
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto relative z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/dispatch" element={<Dispatch />} />
            <Route path="/heatmap" element={<Heatmap />} />
            <Route path="/burnout" element={<Burnout />} />
            <Route path="/volunteers" element={<Volunteers />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
