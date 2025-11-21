import { Home, ListChecks, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const base = 'flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition'
  const active = 'bg-white/10 text-white'
  const inactive = 'text-blue-100/80 hover:bg-white/5'
  const linkClass = ({ isActive }) => `${base} ${isActive ? active : inactive}`

  return (
    <nav className="fixed bottom-4 left-0 right-0 mx-auto max-w-md px-4">
      <div className="grid grid-cols-3 gap-3 bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-xl">
        <NavLink to="/" className={linkClass}>
          <Home size={20} />
          <span className="text-xs">Dashboard</span>
        </NavLink>
        <NavLink to="/habits" className={linkClass}>
          <ListChecks size={20} />
          <span className="text-xs">Habits</span>
        </NavLink>
        <NavLink to="/progress" className={linkClass}>
          <Sparkles size={20} />
          <span className="text-xs">Progress</span>
        </NavLink>
      </div>
    </nav>
  )
}
