import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/ui/Header'
import { useQuestions, useAnswers } from '@/hooks/useSupabase'
import { getQuestionText, CATEGORY_LABELS } from '@/types/database'
import type { AnswerValue, AppLanguage, Category } from '@/types/database'

function getOrCreatePlayerId(): string {
  return localStorage.getItem('aura_player_id') ?? ''
}

function getSessionCode(): string {
  return localStorage.getItem('aura_session_code') ?? ''
}

function getLanguage(): AppLanguage {
  return (localStorage.getItem('aura_language') as AppLanguage) ?? 'en'
}

export function ActiveSession() {
  const navigate = useNavigate()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [localAnswers, setLocalAnswers] = useState<Record<string, AnswerValue>>({})

  const sessionCode = getSessionCode()
  const playerId = getOrCreatePlayerId()
  const language = getLanguage()
  const categories: Category[] = ['communication', 'values', 'lifestyle', 'intimacy', 'finances', 'children', 'marriage']

  const { questions, loading: questionsLoading } = useQuestions(categories, language)
  const { answers: dbAnswers, submitAnswer } = useAnswers(
    localStorage.getItem('aura_session_id') ?? null,
    playerId,
  )

  const question = questions[currentIdx]
  const totalQuestions = questions.length
  const progress = totalQuestions > 0 ? ((currentIdx + 1) / totalQuestions) * 100 : 0

  const handleAnswer = useCallback(async (answer: AnswerValue) => {
    if (!question) return

    setLocalAnswers((prev) => ({ ...prev, [question.id]: answer }))

    await submitAnswer(question.id, answer)

    setTimeout(() => {
      if (currentIdx < totalQuestions - 1) {
        setCurrentIdx((prev) => prev + 1)
      } else {
        navigate('/session/results')
      }
    }, 300)
  }, [question, currentIdx, totalQuestions, submitAnswer, navigate])

  const handleSkip = useCallback(() => {
    handleAnswer('skipped')
  }, [handleAnswer])

  if (questionsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Header />
        <span className="material-symbols-outlined animate-spin text-primary text-[48px]">progress_activity</span>
        <p className="text-on-surface-variant mt-4">Loading questions...</p>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Header />
        <p className="text-on-surface-variant">No questions available.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-primary underline">
          Go Home
        </button>
      </div>
    )
  }

  const questionText = getQuestionText(question, language)
  const currentCategory = question.category

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="flex-1 w-full max-w-md mx-auto flex flex-col justify-between px-5 pt-4 pb-6 relative">
        <div className="w-full flex flex-col gap-3 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-on-surface-variant">
              {currentIdx + 1}/{totalQuestions}
            </span>
            <span className="text-sm font-medium text-secondary uppercase tracking-widest bg-secondary-container/30 px-3 py-1 rounded-full">
              {CATEGORY_LABELS[currentCategory][language]}
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
            {questionText}
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
            className="flex-1 flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-outline-variant bg-surface hover:bg-error-container/20 hover:border-error hover:shadow-soft transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-error-container/30 flex items-center justify-center text-error group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">close</span>
            </div>
            <span className="text-sm font-medium text-on-surface">Disagree</span>
          </button>

          <button
            onClick={() => handleAnswer('neutral')}
            className="flex-1 flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-outline-variant bg-surface hover:bg-surface-variant/50 hover:border-outline hover:shadow-soft transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">remove</span>
            </div>
            <span className="text-sm font-medium text-on-surface">Neutral</span>
          </button>

          <button
            onClick={() => handleAnswer('agree')}
            className="flex-1 flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-outline-variant bg-surface hover:bg-secondary-container/20 hover:border-secondary hover:shadow-soft transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">check</span>
            </div>
            <span className="text-sm font-medium text-on-surface">Agree</span>
          </button>
        </div>

        <button
          onClick={handleSkip}
          className="w-full mt-3 py-3 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors rounded-xl hover:bg-surface-variant/30"
        >
          Skip Question →
        </button>
      </main>
    </div>
  )
}
