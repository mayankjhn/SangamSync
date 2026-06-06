import React, { useState, useEffect, useCallback } from 'react'
import api from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Users, UserPlus, Search, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SECTORS = ['Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 5', 'Sector 6', 'Sector 7', 'Sector 8']
const SKILL_OPTIONS = [
  'Medical', 'First Aid', 'Search & Rescue', 'Communication',
  'Crowd Management', 'Security', 'Law Enforcement', 'Fire Safety',
  'Technical', 'Logistics', 'General Assistance',
]
const EXPERIENCE_LEVELS = ['Trainee', 'Intermediate', 'Expert']

const EMPTY_FORM = {
  name: '',
  phone: '',
  sector: 'Sector 1',
  skills: [],
  experience_level: 'Trainee',
}

function parseVolunteers(data) {
  return data.map(vol => {
    let parsedSkills = []
    try {
      parsedSkills = typeof vol.skills === 'string' ? JSON.parse(vol.skills) : vol.skills
    } catch (e) {}
    return { ...vol, skills: parsedSkills || [] }
  })
}

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([])
  const [search, setSearch] = useState('')
  const [sectorFilter, setSectorFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchVolunteers = useCallback(() => {
    api.get('/api/volunteers')
      .then(res => setVolunteers(parseVolunteers(res.data)))
      .catch(console.error)
  }, [])

  useEffect(() => {
    fetchVolunteers()
  }, [fetchVolunteers])

  const toggleSkill = (skill) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || form.skills.length === 0) return
    setSubmitting(true)
    setSuccessMsg('')
    try {
      await api.post('/api/volunteers', form)
      setSuccessMsg(`${form.name} registered successfully!`)
      setForm(EMPTY_FORM)
      setShowForm(false)
      fetchVolunteers()
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err) {
      console.error(err)
      alert('Registration failed. Check backend connection.')
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = volunteers.filter(vol => {
    const q = search.toLowerCase()
    const matchesSearch = !q ||
      vol.name.toLowerCase().includes(q) ||
      vol.phone.includes(q) ||
      vol.skills.some(s => s.toLowerCase().includes(q))
    const matchesSector = sectorFilter === 'All' || vol.sector === sectorFilter
    return matchesSearch && matchesSector
  })

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-green-500/20 border border-green-500/40 rounded-xl flex items-center gap-2 text-green-300 text-sm font-medium"
          >
            <CheckCircle2 className="w-5 h-5" /> {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="bg-card/50 border-white/5">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="text-blue-500 w-6 h-6" />
              Volunteer Registry
            </CardTitle>
            <CardDescription>Recruit, search, and manage all workforce personnel.</CardDescription>
          </div>
          <Button
            onClick={() => setShowForm(v => !v)}
            className="bg-indigo-600 hover:bg-indigo-700 gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Register Volunteer'}
          </Button>
        </CardHeader>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <CardContent className="border-t border-white/10 pt-6">
                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Full Name *</label>
                    <Input
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Rahul Sharma"
                      className="bg-black/40 border-white/10"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Phone *</label>
                    <Input
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="bg-black/40 border-white/10"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Sector</label>
                    <select
                      value={form.sector}
                      onChange={e => setForm({ ...form, sector: e.target.value })}
                      className="w-full h-10 px-3 rounded-md bg-black/40 border border-white/10 text-sm text-white"
                    >
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Experience</label>
                    <select
                      value={form.experience_level}
                      onChange={e => setForm({ ...form, experience_level: e.target.value })}
                      className="w-full h-10 px-3 rounded-md bg-black/40 border border-white/10 text-sm text-white"
                    >
                      {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground mb-2 block">Skills * (select at least one)</label>
                    <div className="flex flex-wrap gap-2">
                      {SKILL_OPTIONS.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                            form.skills.includes(skill)
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button
                      type="submit"
                      disabled={submitting || form.skills.length === 0}
                      className="bg-green-600 hover:bg-green-700 gap-2 px-8"
                    >
                      <UserPlus className="w-4 h-4" />
                      {submitting ? 'Registering...' : 'Register Volunteer'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>

        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, phone, or skill..."
                className="pl-9 bg-black/40 border-white/10"
              />
            </div>
            <select
              value={sectorFilter}
              onChange={e => setSectorFilter(e.target.value)}
              className="h-10 px-3 rounded-md bg-black/40 border border-white/10 text-sm text-white sm:w-40"
            >
              <option value="All">All Sectors</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {volunteers.length} volunteers
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/40 border-b border-white/10 text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Sector</th>
                  <th className="px-6 py-4 font-medium">Skills</th>
                  <th className="px-6 py-4 font-medium">Experience</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(vol => (
                  <tr key={vol.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      {vol.name}
                      <br />
                      <span className="text-xs text-muted-foreground font-normal">{vol.phone}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{vol.sector}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {vol.skills.slice(0, 2).map(s => (
                          <Badge key={s} variant="outline" className="text-[10px] py-0">{s}</Badge>
                        ))}
                        {vol.skills.length > 2 && (
                          <span className="text-xs text-muted-foreground ml-1">+{vol.skills.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{vol.experience_level}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={vol.availability === 'Available' ? 'default' : 'secondary'}
                        className={vol.availability === 'Available' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-transparent' : ''}
                      >
                        {vol.availability}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No volunteers match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
