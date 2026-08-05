import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { NewSession } from '@/pages/NewSession'
import { JoinSession } from '@/pages/JoinSession'
import { WaitSession } from '@/pages/WaitSession'
import { ActiveSession } from '@/pages/ActiveSession'
import { Results } from '@/pages/Results'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/session/new" element={<NewSession />} />
        <Route path="/session/join" element={<JoinSession />} />
        <Route path="/session/wait/:code" element={<WaitSession />} />
        <Route path="/session/quiz" element={<ActiveSession />} />
        <Route path="/session/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  )
}
