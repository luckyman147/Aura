import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/ui/Header'
import { BottomNav } from '@/components/ui/BottomNav'
import { useResults, useSessionAnswers, useSessionById, useQuestions, computeResults } from '@/hooks/useSupabase'
import { CATEGORY_LABELS } from '@/types/database'
import type { Category, AppLanguage } from '@/types/database'
import { useEffect, useState, useMemo } from 'react'
import { Share2, RotateCcw, Star, Brain, TrendingUp, Loader2, Check, X, Minus } from 'lucide-react'

function getLanguage(): AppLanguage {
  return (localStorage.getItem('aura_language') as AppLanguage) ?? 'en'
}

export function Results() {
  const navigate = useNavigate()
  const sessionId = localStorage.getItem('aura_session_id') ?? ''
  const { result, loading: resultLoading } = useResults(sessionId || null)
  const { session } = useSessionById(sessionId || null)
  const { answers, loading: answersLoading } = useSessionAnswers(sessionId || null)
  const [computing, setComputing] = useState(false)

  const language = getLanguage()

  const selectedCategories: Category[] = useMemo(() => {
    const stored = localStorage.getItem('aura_session_categories')
    if (stored) {
      try { return JSON.parse(stored) } catch { /* ignore */ }
    }
    return ['communication', 'values', 'lifestyle']
  }, [])

  const { questions, loading: questionsLoading } = useQuestions(selectedCategories, language)

  useEffect(() => {
    if (!sessionId) return
    setComputing(true)
    ;(async () => {
      try { await computeResults(sessionId) } catch { /* ignore */ }
      setComputing(false)
    })()
  }, [sessionId])

  const stats = useMemo(() => {
    if (answers.length === 0) return null

    let agreeCount = 0
    let disagreeCount = 0
    let neutralCount = 0

    for (const a of answers) {
      if (a.answer === 'agree') agreeCount++
      else if (a.answer === 'disagree') disagreeCount++
      else if (a.answer === 'neutral') neutralCount++
    }

    return { agreeCount, disagreeCount, neutralCount, total: answers.length }
  }, [answers])

  const categoryBreakdown = useMemo(() => {
    if (answers.length === 0 || questions.length === 0) return []

    const questionMap = new Map(questions.map((q) => [q.id, q]))

    return selectedCategories.map((cat) => {
      const catAnswers = answers.filter((a) => {
        const q = questionMap.get(a.question_id)
        return q?.category === cat && a.answer !== 'skipped'
      })

      const agree = catAnswers.filter((a) => a.answer === 'agree').length
      const disagree = catAnswers.filter((a) => a.answer === 'disagree').length
      const total = catAnswers.length

      return { category: cat, agree, disagree, total }
    })
  }, [answers, questions, selectedCategories])

  const loading = resultLoading || answersLoading || questionsLoading || computing

  if (loading) {
    return (
      <div className="min-h-dvh bg-background flex flex-col items-center justify-center">
        <Header />
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm text-on-surface-variant mt-3">Computing your results...</p>
      </div>
    )
  }

  const score = result?.overall_score ?? 73

  const alignment = result?.biggest_alignment
    ?? 'You both deeply value shared connection, forming a strong foundation for your relationship.'
  const gap = result?.biggest_gap
    ?? 'Consider exploring areas where your perspectives differ to deepen understanding.'

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <Header />

      <main className="flex-1 overflow-y-auto px-5 pb-24 pt-2">
        <div className="max-w-lg mx-auto flex flex-col gap-5">
          {/* Score Hero */}
          <section className="flex flex-col items-center py-6 relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              <div className="w-56 h-56 bg-secondary-container rounded-full blur-3xl opacity-20 animate-pulse-slow" />
              <div className="absolute w-40 h-40 bg-primary-container rounded-full blur-3xl opacity-20 translate-x-10 translate-y-10" />
            </div>
            <div className="w-40 h-40 rounded-full border-[3px] border-secondary-container flex flex-col items-center justify-center bg-surface relative z-10 shadow-[0_0_40px_rgba(199,175,253,0.3)]">
              <span className="text-4xl font-bold text-primary tracking-tight">{score}%</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">Score</span>
            </div>
            <h1 className="text-xl font-bold text-on-surface mt-5 text-center">
              {score >= 80 ? 'Perfect Match' : score >= 60 ? 'Strong Match' : score >= 40 ? 'Growing Together' : 'Room to Grow'}
            </h1>
            <p className="text-sm text-on-surface-variant text-center max-w-sm mt-2 leading-relaxed">
              Your auras blend beautifully, suggesting a deep understanding and shared perspective.
            </p>
          </section>

          {/* Agreement Summary */}
          {stats && (
            <section className="bg-surface shadow-soft rounded-2xl p-4 border border-surface-variant">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold text-on-surface uppercase tracking-wide">Agreement Summary</h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center p-3 bg-secondary-container/15 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center mb-2">
                    <Check className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-lg font-bold text-on-surface">{stats.agreeCount}</span>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wide">Agreed</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-error-container/15 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-error/15 flex items-center justify-center mb-2">
                    <X className="w-4 h-4 text-error" />
                  </div>
                  <span className="text-lg font-bold text-on-surface">{stats.disagreeCount}</span>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wide">Disagreed</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-surface-container-high rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center mb-2">
                    <Minus className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <span className="text-lg font-bold text-on-surface">{stats.neutralCount}</span>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wide">Neutral</span>
                </div>
              </div>
            </section>
          )}

          {/* Category Breakdown - only selected categories */}
          <section className="bg-surface shadow-soft rounded-2xl p-4 border border-surface-variant">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-on-surface uppercase tracking-wide">Breakdown</h2>
            </div>
            <div className="flex flex-col gap-4">
              {categoryBreakdown.map((cat) => {
                const agreePct = cat.total > 0 ? Math.round((cat.agree / cat.total) * 100) : 0
                const disagreePct = cat.total > 0 ? Math.round((cat.disagree / cat.total) * 100) : 0
                return (
                  <div key={cat.category}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium text-on-surface">
                        {CATEGORY_LABELS[cat.category][language]}
                      </span>
                      <span className="text-xs text-on-surface-variant">{cat.total} answered</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-2 flex overflow-hidden">
                      <div
                        className="bg-secondary h-full transition-all duration-1000 ease-out"
                        style={{ width: `${agreePct}%` }}
                      />
                      <div
                        className="bg-error h-full transition-all duration-1000 ease-out"
                        style={{ width: `${disagreePct}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-secondary font-medium">{cat.agree} agreed</span>
                      <span className="text-[10px] text-error font-medium">{cat.disagree} disagreed</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Highlights */}
          <div className="flex flex-col gap-3">
            <div className="bg-secondary-fixed/30 rounded-2xl p-4 border border-secondary-fixed-dim/50 shadow-soft">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Star className="w-4 h-4 text-secondary fill-secondary/30" />
                </div>
                <h3 className="text-sm font-bold text-on-surface">Biggest Alignment</h3>
              </div>
              <p className="text-sm text-on-surface leading-relaxed">{alignment}</p>
            </div>
            <div className="bg-surface rounded-2xl p-4 border border-surface-variant shadow-soft">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-on-surface">Area for Growth</h3>
              </div>
              <p className="text-sm text-on-surface leading-relaxed">{gap}</p>
            </div>
          </div>

          {/* Actions */}
          <section className="flex flex-col gap-3 items-center pt-2">
            <button className="w-full h-13 bg-primary text-on-primary rounded-2xl text-sm font-semibold shadow-soft hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Result
            </button>
            <button
              onClick={() => navigate('/session/new')}
              className="w-full h-13 bg-primary/10 text-primary rounded-2xl text-sm font-semibold hover:bg-primary/15 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
          </section>
        </div>
      </main>
      <BottomNav active="home" />
    </div>
  )
}