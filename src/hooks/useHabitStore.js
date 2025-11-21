import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'habitspark:v1'

function todayKey(date = new Date()) {
  const d = new Date(date)
  d.setHours(0,0,0,0)
  return d.toISOString().slice(0,10)
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { habits: [], completions: {} }
    const parsed = JSON.parse(raw)
    if (!parsed.habits) parsed.habits = []
    if (!parsed.completions) parsed.completions = {}
    return parsed
  } catch {
    return { habits: [], completions: {} }
  }
}

function persist(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useHabitStore() {
  const [habits, setHabits] = useState(() => loadInitial().habits)
  const [completions, setCompletions] = useState(() => loadInitial().completions)

  // persist on change
  useEffect(() => {
    persist({ habits, completions })
  }, [habits, completions])

  const addHabit = useCallback((name, color) => {
    const newHabit = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color,
      createdAt: Date.now(),
    }
    setHabits(prev => [newHabit, ...prev])
    return newHabit
  }, [])

  const deleteHabit = useCallback((id) => {
    setHabits(prev => prev.filter(h => h.id !== id))
    setCompletions(prev => {
      const next = { ...prev }
      for (const day of Object.keys(next)) {
        if (next[day] && next[day][id]) {
          const { [id]:_, ...rest } = next[day]
          next[day] = rest
        }
      }
      return next
    })
  }, [])

  const renameHabit = useCallback((id, name) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, name: name.trim() } : h))
  }, [])

  const setHabitColor = useCallback((id, color) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, color } : h))
  }, [])

  const isCompleted = useCallback((id, date = new Date()) => {
    const key = todayKey(date)
    return !!(completions[key] && completions[key][id])
  }, [completions])

  const toggleCompletion = useCallback((id, date = new Date()) => {
    const key = todayKey(date)
    setCompletions(prev => {
      const day = { ...(prev[key] || {}) }
      if (day[id]) {
        delete day[id]
      } else {
        day[id] = true
      }
      return { ...prev, [key]: day }
    })
  }, [])

  const completionRateLast7 = useMemo(() => {
    if (habits.length === 0) return 0
    let total = 0
    let done = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = todayKey(d)
      total += habits.length
      const day = completions[key] || {}
      done += Object.keys(day).length
    }
    return Math.round((done / Math.max(1,total)) * 100)
  }, [habits, completions])

  const streakForHabit = useCallback((id) => {
    let streak = 0
    for (let i = 0; i < 365; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = todayKey(d)
      const day = completions[key] || {}
      if (day[id]) streak++
      else break
    }
    return streak
  }, [completions])

  const overallStreak = useMemo(() => {
    // longest streak across habits today backwards where ALL habits done per day
    if (habits.length === 0) return 0
    let streak = 0
    for (let i = 0; i < 365; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = todayKey(d)
      const day = completions[key] || {}
      const count = Object.keys(day).length
      if (count === habits.length && habits.length > 0) streak++
      else break
    }
    return streak
  }, [habits, completions])

  const weekSeries = useMemo(() => {
    const arr = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = todayKey(d)
      const day = completions[key] || {}
      arr.push({ key, count: Object.keys(day).length, date: new Date(d) })
    }
    return arr
  }, [completions])

  return {
    habits,
    completions,
    addHabit,
    deleteHabit,
    renameHabit,
    setHabitColor,
    isCompleted,
    toggleCompletion,
    completionRateLast7,
    streakForHabit,
    overallStreak,
    weekSeries,
  }
}

export function useMotivation({ completionRate, overallStreak }) {
  return useMemo(() => {
    if (overallStreak >= 7) return 'On fire! A full week of consistency. Keep the spark alive.'
    if (overallStreak >= 3) return 'Momentum locked. You’re building a strong streak.'
    if (completionRate >= 80) return 'Amazing focus today. You’re smashing it.'
    if (completionRate >= 40) return 'Nice progress. A few more taps to hit your goal.'
    if (completionRate > 0) return 'Good start. One habit at a time.'
    return 'New day, new wins. Let’s spark your habits.'
  }, [completionRate, overallStreak])
}
