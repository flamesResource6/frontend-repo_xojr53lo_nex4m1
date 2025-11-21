import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useHabitStore, useMotivation } from '../hooks/useHabitStore'

const COLORS = ['#60a5fa','#f472b6','#34d399','#fbbf24','#a78bfa','#f87171']

export default function Dashboard() {
  const store = useHabitStore()
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[0])

  const completionRate = store.completionRateLast7
  const motivation = useMotivation({ completionRate, overallStreak: store.overallStreak })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    store.addHabit(name, color)
    setName('')
  }

  return (
    <div className="pb-28">
      <header className="pt-10 pb-6">
        <h1 className="text-3xl font-bold text-white">HabitSpark</h1>
        <p className="text-blue-200/80 mt-1">Build daily momentum with simple, fast tracking.</p>
      </header>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
        <p className="text-blue-100 text-sm">{motivation}</p>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <h2 className="text-white font-semibold mb-3">Add a daily habit</h2>
        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <div className="flex gap-2">
            {COLORS.map(c => (
              <button key={c} type="button" onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 ${color===c?'border-white':'border-transparent'}`}
                style={{ backgroundColor: c }}
                aria-label={`Pick color ${c}`}
              />
            ))}
          </div>
          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder="e.g. Drink water"
            className="flex-1 bg-slate-900/60 text-white placeholder-blue-200/50 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition">
            <Plus size={18} /> Add
          </button>
        </form>
      </section>

      <section className="mt-6">
        <h3 className="text-white/90 font-medium mb-3">Today</h3>
        <div className="space-y-2">
          {store.habits.length === 0 && (
            <p className="text-blue-200/70 text-sm">No habits yet. Add one above to get started.</p>
          )}
          {store.habits.map(h => (
            <button key={h.id}
              onClick={() => store.toggleCompletion(h.id)}
              className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: h.color }} />
                <span className="text-white">{h.name}</span>
              </div>
              <div className={`w-6 h-6 rounded-full border ${store.isCompleted(h.id)?'bg-green-500 border-green-400':'border-white/20'}`} />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
