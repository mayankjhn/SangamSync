import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'
import { Button } from '../components/ui/button'

export default function Auth() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="z-10 text-center mb-12 flex flex-col items-center max-w-md w-full">
        <h1 className="text-5xl font-bold tracking-tight mb-4 pb-2 bg-gradient-to-r from-blue-400 to-indigo-600 text-transparent bg-clip-text">SangamSync</h1>
        <p className="text-muted-foreground mb-8 text-lg">Right Volunteer. Right Place. Right Time.</p>
        
        <Card className="w-full bg-card/50 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Control Center Login</CardTitle>
            <CardDescription>Select your role to access the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              onClick={() => navigate('/dashboard')}
            >
              Admin (Control Room)
            </Button>
          </CardContent>
          <CardFooter className="justify-center text-xs text-muted-foreground mt-4">
            <p>Mahakumbh Workforce Optimization Platform</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
