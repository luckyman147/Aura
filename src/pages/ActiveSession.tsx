import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/ui/Header'
import { useQuestions, useAnswers } from '@/hooks/useSupabase'
import { getQuestionText, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/database'
import type { AnswerValue, AppLanguage, Category } from '@/types/database'
import { Loader2, SkipForward, X, Minus, Check, Clock } from 'lucide-react'
import { MessageCircle, Heart, Leaf, Handshake, PiggyBank, Baby, Diamond } from 'lucide-react'

function getOrCreatePlayerId(): string {
  return localStorage.getItem('aura_player_id') ?? ''
}

function getLanguage(): AppLanguage {
  return (localStorage.getItem('aura_language') as AppLanguage) ?? 'en'
}

const CATEGORY_LUCIDE: Record<Category, typeof Heart> = {
  communication: MessageCircle,
  values: Heart,
  lifestyle: Leaf,
  intimacy: Handshake,
  finances: PiggyBank,
  children: Baby,
  marriage: Diamond,
}

export function ActiveSession() {
  const navigate = useNavigate()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answered, setAnswered] = useState(false)

  const playerId = getOrCreatePlayerId()
  const language = getLanguage()
  const categories: Category[] = ['communication', 'values', 'lifestyle', 'intimacy', 'finances', 'children', 'marriage']

  const { questions, loading: questionsLoading } = useQuestions(categories, language)
  const { submitAnswer } = useAnswers(
    localStorage.getItem('aura_session_id') ?? null,
    playerId,
  )

  const question = questions[currentIdx]
  const totalQuestions = questions.length
  const progress = totalQuestions > 0 ? ((currentIdx + 1) / totalQuestions) * 100 : 0

  const handleAnswer = useCallback(async (answer: AnswerValue) => {
    if (!question || answered) return
    setAnswered(true)

    await submitAnswer(question.id, answer)

    setTimeout(() => {
      if (currentIdx < totalQuestions - 1) {
        setCurrentIdx((prev) => prev + 1)
        setAnswered(false)
      } else {
        navigate('/session/results')
      }
    }, 400)
  }, [question, currentIdx, totalQuestions, submitAnswer, navigate, answered])

  if (questionsLoading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center">
        <Header />
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-on-surface-variant mt-4 text-sm">Loading questions...</p>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6">
        <Header />
        <p className="text-on-surface-variant text-sm">No questions available.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-primary text-sm font-medium underline">
          Go Home
        </button>
      </div>
    )
  }

  const questionText = getQuestionText(question, language)
  const CatIcon = CATEGORY_LUCIDE[question.category]

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full max-w-md mx-auto flex flex-col px-5 pt-3 pb-6">
        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-on-surface-variant">
              {currentIdx + 1} / {totalQuestions}
            </span>
            <div className="flex items-center gap-1.5 bg-secondary-container/30 px-2.5 py-1 rounded-full">
              <CatIcon className="w-3.5 h-3.5 text-secondary" />
              <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                {CATEGORY_LABELS[question.category][language]}
              </span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col justify-center items-center py-6 my-4 text-center">
          <div className="inline-flex items-center gap-1.5 mb-6 px-3 py-1.5 bg-surface-container-low rounded-full">
            <Clock className="w-3.5 h-3.5 text-on-surface-variant" />
            <span className="text-[11px] font-medium text-on-surface-variant">Your turn</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface leading-snug px-2">
            {questionText}
          </h2>
        </div>

        {/* Answer Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <button
            onClick={() => handleAnswer('disagree')}
            disabled={answered}
            className="flex flex-col items-center gap-2.5 py-5 px-3 bg-surface border-2 border-outline-variant rounded-2xl hover:bg-error-container/15 hover:border-error/50 active:scale-[0.96] transition-all duration-200 disabled:opacity-50"
          >
            <div className="w-11 h-11 rounded-full bg-error-container/30 flex items-center justify-center">
              <X className="w-5 h-5 text-error" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-semibold text-on-surface">Disagree</span>
          </button>

          <button
            onClick={() => handleAnswer('neutral')}
            disabled={answered}
            className="flex flex-col items-center gap-2.5 py-5 px-3 bg-surface border-2 border-outline-variant rounded-2xl hover:bg-surface-variant/50 hover:border-outline active:scale-[0.96] transition-all duration-200 disabled:opacity-50"
          >
            <div className="w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center">
              <Minus className="w-5 h-5 text-on-surface-variant" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-semibold text-on-surface">Neutral</span>
          </button>

          <button
            onClick={() => handleAnswer('agree')}
            disabled={answered}
            className="flex flex-col items-center gap-2.5 py-5 px-3 bg-surface border-2 border-outline-variant rounded-2xl hover:bg-secondary-container/15 hover:border-secondary/50 active:scale-[0.96] transition-all duration-200 disabled:opacity-50"
          >
            <div className="w-11 h-11 rounded-full bg-secondary-container/40 flex items-center justify-center">
              <Check className="w-5 h-5 text-secondary" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-semibold text-on-surface">Agree</span>
          </button>
        </div>

        {/* Skip */}
        <button
          onClick={() => handleAnswer('skipped')}
          disabled={answered}
          className="w-full py-3.5 flex items-center justify-center gap-2 text-on-surface-variant hover:text-on-surface text-sm font-medium rounded-2xl hover:bg-surface-variant/30 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <SkipForward className="w-4 h-4" />
          Skip Question
        </button>
      </main>
    </div>
  )
}
