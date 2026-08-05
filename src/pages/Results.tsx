import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/ui/Header'
import { BottomNav } from '@/components/ui/BottomNav'
import { useResults, computeResults } from '@/hooks/useSupabase'
import { useEffect, useState } from 'react'
import { Share2, RotateCcw, Star, Brain, Trophy, TrendingUp, Loader2 } from 'lucide-react'

export function Results() {
  const navigate = useNavigate()
  const sessionId = localStorage.getItem('aura_session_id') ?? ''
  const { result, loading } = useResults(sessionId || null)
  const [computing, setComputing] = useState(false)

  useEffect(() => {
    if (!sessionId) return
    setComputing(true)
    ;(async () => {
      try { await computeResults(sessionId) } catch { /* ignore */ }
      setComputing(false)
    })()
  }, [sessionId])

  const score = result?.overall_score ?? 73
  const categories = [
    { name: 'Communication', score: result?.communication_score ?? 60, color: 'bg-secondary' },
    { name: 'Values', score: result?.values_score ?? 85, color: 'bg-primary' },
    { name: 'Lifestyle', score: result?.lifestyle_score ?? 75, color: 'bg-primary-container' },
  ]

  const alignment = result?.biggest_alignment
    ?? 'You both deeply value Family & Connection, forming a strong foundation.'
  const gap = result?.biggest_gap
    ?? 'Your approaches to Conflict Resolution differ; proactive communication will be key.'

  if (loading || computing) {
    return (
      <div className="min-h-dvh bg-background flex flex-col items-center justify-center">
        <Header />
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm text-on-surface-variant mt-3">Computing your results...</p>
      </div>
    )
  }

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

          {/* Category Breakdown */}
          <section className="bg-surface shadow-soft rounded-2xl p-4 border border-surface-variant">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-on-surface uppercase tracking-wide">Breakdown</h2>
            </div>
            <div className="flex flex-col gap-4">
              {categories.map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-on-surface">{cat.name}</span>
                    <span className="text-xs font-semibold text-on-surface-variant">{cat.score}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-2">
                    <div
                      className={`${cat.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
              ))}
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
