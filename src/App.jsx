import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import HabitList from './components/HabitList'
import Progress from './components/Progress'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.06),transparent_50%)]"></div>
      <div className="relative max-w-md mx-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/habits" element={<HabitList />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
        <Navbar />
      </div>
    </div>
  )
}

export default App
