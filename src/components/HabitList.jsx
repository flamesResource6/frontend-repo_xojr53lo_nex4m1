import { Trash2, Pencil, CheckCircle2, X } from 'lucide-react'
import { useState } from 'react'
import { useHabitStore } from '../hooks/useHabitStore'

export default function HabitList() {
  const store = useHabitStore()
  const [editingId, setEditingId] = useState(null)
  const [tempName, setTempName] = useState('')

  const startEdit = (h) => {
    setEditingId(h.id)
    setTempName(h.name)
  }
  const saveEdit = () => {
    if (editingId) store.renameHabit(editingId, tempName)
    setEditingId(null)
  }

  return (
    <div className="pb-28">
      <header className="pt-10 pb-6">
        <h1 className="text-2xl font-bold text-white">Your Habits</h1>
        <p className="text-blue-200/80 mt-1">Tap a habit to mark complete on the dashboard.</p>
      </header>

      <div className="space-y-2">
        {store.habits.length === 0 && (
          <p className="text-blue-200/70 text-sm">No habits yet.</p>
        )}

        {store.habits.map(h => (
          <div key={h.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: h.color }} />
              {editingId === h.id ? (
                <input className="bg-slate-900/60 text-white border border-white/10 rounded px-2 py-1 flex-1 min-w-0"
                  value={tempName} onChange={e=>setTempName(e.target.value)} />
              ) : (
                <span className="text-white truncate">{h.name}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {editingId === h.id ? (
                <>
                  <button onClick={saveEdit} className="p-2 rounded bg-green-500/20 text-green-300"><CheckCircle2 size={18} /></button>
                  <button onClick={()=>setEditingId(null)} className="p-2 rounded bg-red-500/20 text-red-300"><X size={18} /></button>
                </>
              ) : (
                <>
                  <button onClick={()=>startEdit(h)} className="p-2 rounded bg-white/5 text-blue-100"><Pencil size={18} /></button>
                  <button onClick={()=>store.deleteHabit(h.id)} className="p-2 rounded bg-red-500/20 text-red-300"><Trash2 size={18} /></button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
