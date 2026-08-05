import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/ui/Header'

type Answer = 'agree' | 'neutral' | 'disagree' | null

const QUESTIONS = [
  { id: 1, category: 'Communication', text: 'We handle disagreements in a healthy and constructive way.' },
  { id: 2, category: 'Communication', text: 'We feel comfortable expressing our true feelings to each other.' },
  { id: 3, category: 'Values', text: 'We share similar core values about family and relationships.' },
  { id: 4, category: 'Lifestyle', text: 'We enjoy spending quality time together on weekends.' },
  { id: 5, category: 'Values', text: 'We are aligned on our long-term life goals and aspirations.' },
]

export function ActiveSession() {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, Answer>>({})

  const question = QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100

  const handleAnswer = (answer: Answer) => {
    setAnswers((prev) => ({ ...prev, [question.id]: answer }))

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
      } else {
        navigate('/session/results')
      }
    }, 300)
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="flex-1 w-full max-w-md mx-auto flex flex-col justify-between px-5 pt-4 pb-6 relative">
        <div className="w-full flex flex-col gap-3 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-on-surface-variant">
              {currentQuestion + 1}/{QUESTIONS.length}
            </span>
            <span className="text-sm font-medium text-secondary uppercase tracking-widest bg-secondary-container/30 px-3 py-1 rounded-full">
              {question.category}
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center py-8 my-8 text-center">
          <h2 className="text-[28px] leading-[36px] font-semibold text-on-surface leading-tight mb-6">
            {question.text}
          </h2>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-surface-container-low rounded-full">
            <span className="material-symbols-outlined text-tertiary" style={{ fontSize: '16px' }}>
              schedule
            </span>
            <span className="text-xs text-on-surface-variant">Your turn</span>
          </div>
        </div>

        <div className="w-full flex justify-between items-center gap-3 mt-auto mb-2">
          <button
            onClick={() => handleAnswer('disagree')}
            className={`flex-1 flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300 group ${
              answers[question.id] === 'disagree'
                ? 'bg-error-container/20 border-error shadow-soft'
                : 'bg-surface border-outline-variant hover:bg-error-container/20 hover:border-error hover:shadow-soft'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-error-container/30 flex items-center justify-center text-error group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">close</span>
            </div>
            <span className="text-sm font-medium text-on-surface">Disagree</span>
          </button>

          <button
            onClick={() => handleAnswer('neutral')}
            className={`flex-1 flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300 group ${
              answers[question.id] === 'neutral'
                ? 'bg-surface-variant/50 border-outline shadow-soft'
                : 'bg-surface border-outline-variant hover:bg-surface-variant/50 hover:border-outline hover:shadow-soft'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">remove</span>
            </div>
            <span className="text-sm font-medium text-on-surface">Neutral</span>
          </button>

          <button
            onClick={() => handleAnswer('agree')}
            className={`flex-1 flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300 group ${
              answers[question.id] === 'agree'
                ? 'bg-secondary-container/20 border-secondary shadow-soft'
                : 'bg-surface border-outline-variant hover:bg-secondary-container/20 hover:border-secondary hover:shadow-soft'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">check</span>
            </div>
            <span className="text-sm font-medium text-on-surface">Agree</span>
          </button>
        </div>
      </main>
    </div>
  )
}
