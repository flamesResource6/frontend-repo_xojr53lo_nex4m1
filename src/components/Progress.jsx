import { useHabitStore } from '../hooks/useHabitStore'

export default function Progress() {
  const store = useHabitStore()

  return (
    <div className="pb-28">
      <header className="pt-10 pb-6">
        <h1 className="text-2xl font-bold text-white">Progress</h1>
        <p className="text-blue-200/80 mt-1">Your week at a glance and current streaks.</p>
      </header>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
        <div className="flex items-end gap-2 h-24">
          {store.weekSeries.map((d) => (
            <div key={d.key} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-white/10 rounded">
                <div className="bg-blue-500 rounded transition-all" style={{ height: `${(d.count/(store.habits.length||1))*100}%` }}>&nbsp;</div>
              </div>
              <span className="text-[10px] text-blue-200/70">
                {new Date(d.date).toLocaleDateString(undefined,{ weekday:'short'})}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-blue-100 text-sm">
          Completion last 7 days: <span className="font-semibold text-white">{store.completionRateLast7}%</span>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-blue-200 text-xs">Overall streak</div>
          <div className="text-3xl font-bold text-white">{store.overallStreak} days</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-blue-200 text-xs">Habits</div>
          <div className="text-3xl font-bold text-white">{store.habits.length}</div>
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-white/90 font-medium mb-2">Streaks by habit</h3>
        <div className="space-y-2">
          {store.habits.map(h => (
            <div key={h.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: h.color }} />
                <span className="text-white">{h.name}</span>
              </div>
              <div className="text-white/90"><span className="font-semibold">{store.streakForHabit(h.id)}</span> day streak</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
