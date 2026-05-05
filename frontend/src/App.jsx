import { useState, useEffect } from 'react'

function App() {
  const [weeks, setWeeks] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Read the VITE_API_BASE_URL or default to localhost for local testing
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const formData = new URLSearchParams()
      formData.append('username', 'admin')
      formData.append('password', password)

      const response = await fetch(`${API_URL}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      })

      if (!response.ok) throw new Error("Invalid password")
      
      const data = await response.json()
      setToken(data.access_token)
      localStorage.setItem('token', data.access_token)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const fetchRoadmap = async () => {
    try {
      const response = await fetch(`${API_URL}/api/roadmap`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.status === 401) {
        setToken('')
        localStorage.removeItem('token')
        return
      }
      const data = await response.json()
      setWeeks(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (token) fetchRoadmap()
  }, [token])

  if (!token) {
    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center p-4">
        <div className="bg-[#1e293b] p-8 rounded border border-slate-700 w-full max-w-md">
          <h1 className="text-cyan-400 font-mono text-xl mb-6 tracking-widest text-center">SYSTEM_LOGIN</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 p-3 rounded font-mono focus:outline-none focus:border-cyan-400 focus:glow-active transition-all"
              placeholder="ENTER_MASTER_PASSWORD"
            />
            {error && <div className="text-amber-500 text-sm font-mono">{error}</div>}
            <button type="submit" className="bg-transparent border border-cyan-400 text-cyan-400 py-3 rounded hover:glow-active font-mono transition-all uppercase tracking-widest">
              Authenticate
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 text-slate-200 font-sans min-h-screen cyber-grid selection:bg-cyan-400 selection:text-slate-900">
      
      {/* TopAppBar from Stitch */}
      <header className="fixed top-0 w-full border-b border-slate-800 bg-slate-950 font-sans tracking-tight text-sm flex justify-between items-center px-6 h-14 z-50">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold tracking-tighter text-cyan-400 uppercase">Hardware AI Sprint</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-slate-400 font-mono text-[12px]">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold glow-active px-2 rounded">ONLINE</span>
            <span className="text-slate-500">SYSTEM STATUS</span>
          </div>
          <div className="h-4 w-px bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">{weeks.filter(w => w.status === 'COMPLETED').length}/12</span>
            <span className="text-slate-500">DELIVERABLES</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-cyan-400">
          <button onClick={() => {setToken(''); localStorage.removeItem('token')}} className="hover:text-cyan-300 transition-colors uppercase font-mono text-[11px] tracking-widest border border-cyan-400/30 px-3 py-1 rounded">
            Logout
          </button>
        </div>
      </header>

      {/* SideNavBar from Stitch */}
      <nav className="fixed left-0 top-14 h-screen w-64 border-r border-slate-800 bg-slate-950 font-mono uppercase text-[11px] tracking-widest flex flex-col pt-4 z-40 hidden md:flex">
        <div className="px-6 pb-6 border-b border-slate-800 mb-4">
          <div className="text-cyan-400 font-black mb-1 text-sm">H/W ENG</div>
          <div className="text-slate-500 text-[10px]">V-90 SPRINT</div>
        </div>
        <div className="flex-1 px-2 space-y-1">
          <a className="bg-slate-800/50 text-cyan-400 border-l-4 border-cyan-400 px-4 py-3 flex items-center gap-3 transition-all" href="#">
            <span className="material-symbols-outlined text-[18px]">route</span>
            <span>Roadmap</span>
          </a>
          <a className="text-slate-500 px-4 py-3 flex items-center gap-3 hover:bg-slate-800/30 hover:text-slate-200 transition-all" href="#">
            <span className="material-symbols-outlined text-[18px]">developer_board</span>
            <span>Silicon Bench</span>
          </a>
        </div>
      </nav>

      {/* Main Content Canvas from Stitch */}
      <main className="pt-14 md:pl-64 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-200 mb-2">Roadmap Tracker</h1>
            <p className="font-mono text-[18px] text-slate-400">Execution Phase</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {weeks.map(week => (
              <WeekCard key={week.id} week={week} token={token} API_URL={API_URL} refresh={fetchRoadmap} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function WeekCard({ week, token, API_URL, refresh }) {
  const isLocked = week.status === 'LOCKED'
  const isCompleted = week.status === 'COMPLETED'
  const isInProgress = week.status === 'IN_PROGRESS'

  const [link, setLink] = useState('')
  const [benchmarks, setBenchmarks] = useState({ power_mw: '', area_luts: '', area_dsps: '', timing_slack_ns: '' })
  
  const submitCompletion = async (e) => {
    e.preventDefault()
    if (!link) return alert("Deliverable link is required by The One Rule.")

    if (benchmarks.power_mw) {
       await fetch(`${API_URL}/api/weeks/${week.id}/benchmarks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            power_mw: parseFloat(benchmarks.power_mw),
            area_luts: parseInt(benchmarks.area_luts),
            area_dsps: parseInt(benchmarks.area_dsps),
            timing_slack_ns: parseFloat(benchmarks.timing_slack_ns)
          })
       })
    }

    await fetch(`${API_URL}/api/weeks/${week.id}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ deliverable_link: link })
    })

    refresh()
  }

  return (
    <div className={`relative rounded p-6 flex flex-col h-full transition-all ${isLocked ? 'bg-[#1e293b] border border-[#334155] striped-bg grayscale opacity-60 pointer-events-none' : isInProgress ? 'bg-[#1e293b] border border-cyan-400 glow-active border-l-4 border-l-cyan-400' : 'bg-[#1e293b] border border-[#334155]'}`}>
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-slate-200">{week.title}</h2>
        <span className={`font-mono text-xs px-2 py-1 rounded tracking-widest ${isLocked ? 'bg-slate-800 text-slate-500' : isCompleted ? 'bg-cyan-400/20 text-cyan-400' : 'bg-transparent border border-cyan-400 text-cyan-400'}`}>
          {week.status}
        </span>
      </div>

      {isCompleted && (
        <div className="mt-4 flex-grow">
          <p className="text-sm text-[#475569] font-mono mb-2">DELIVERABLE_LINK:</p>
          <a href={week.deliverable_link} target="_blank" rel="noreferrer" className="text-cyan underline text-sm truncate block">{week.deliverable_link}</a>
        </div>
      )}

      {isInProgress && (
        <form onSubmit={submitCompletion} className="mt-4 flex flex-col gap-3 flex-grow">
          <div>
            <label className="text-[11px] font-mono text-cyan-400 mb-1 block tracking-widest">DELIVERABLE_LINK *</label>
            <input required value={link} onChange={e=>setLink(e.target.value)} type="url" placeholder="https://..." className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
          </div>
          
          <div className="pt-2 mt-2 border-t border-slate-800">
            <label className="text-[11px] font-mono text-amber-500 mb-2 block tracking-widest">SILICON_BENCH (OPTIONAL)</label>
            <div className="grid grid-cols-2 gap-2">
              <input value={benchmarks.power_mw} onChange={e=>setBenchmarks({...benchmarks, power_mw: e.target.value})} type="number" step="0.1" placeholder="Power (mW)" className="bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded text-xs outline-none focus:border-amber-500" />
              <input value={benchmarks.area_luts} onChange={e=>setBenchmarks({...benchmarks, area_luts: e.target.value})} type="number" placeholder="LUTs" className="bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded text-xs outline-none focus:border-amber-500" />
              <input value={benchmarks.area_dsps} onChange={e=>setBenchmarks({...benchmarks, area_dsps: e.target.value})} type="number" placeholder="DSPs" className="bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded text-xs outline-none focus:border-amber-500" />
              <input value={benchmarks.timing_slack_ns} onChange={e=>setBenchmarks({...benchmarks, timing_slack_ns: e.target.value})} type="number" step="0.01" placeholder="Slack (ns)" className="bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded text-xs outline-none focus:border-amber-500" />
            </div>
          </div>

          <button type="submit" className="mt-4 w-full bg-transparent border border-cyan-400 text-cyan-400 py-2 rounded hover:bg-cyan-400/10 font-mono text-sm tracking-widest transition-colors flex items-center justify-center gap-2">
            SUBMIT_PROOF
          </button>
        </form>
      )}

      {isLocked && (
        <div className="mt-auto pt-4 flex justify-center opacity-50">
          <span className="text-slate-400 font-mono text-xs tracking-widest uppercase">AWAITING_PREV_WEEK</span>
        </div>
      )}
    </div>
  )
}

export default App
