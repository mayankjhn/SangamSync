import React, { useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { MessageSquare, Send, Bot, User } from 'lucide-react'

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello Admin. I am the SangamSync Operations Assistant. How can I help you manage Mahakumbh today?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMsg = input
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setIsLoading(true)

    try {
      const res = await axios.post('http://localhost:8000/api/ai/chat', { message: userMsg })
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.response }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error connecting to AI Assistant.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <Card className="bg-card/50 backdrop-blur-sm border-white/5 flex-1 flex flex-col shadow-xl">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bot className="text-blue-400 w-6 h-6" />
            AI Operations Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-white/10'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white/10 text-gray-200 rounded-tl-sm'}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-white/10 rounded-tl-sm flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 border-t border-white/10 bg-black/20">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex w-full gap-2"
          >
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about sectors, volunteers, or current status..."
              className="flex-1 h-12 bg-white/5 border-white/10 focus-visible:ring-indigo-500"
            />
            <Button type="submit" disabled={isLoading} className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700">
              <Send className="w-4 h-4 mr-2" /> Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
