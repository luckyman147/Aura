import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/ui/Header'
import { BottomNav } from '@/components/ui/BottomNav'

const CATEGORIES = [
  { name: 'Values', score: 85, color: 'bg-primary' },
  { name: 'Communication', score: 60, color: 'bg-secondary' },
  { name: 'Lifestyle', score: 75, color: 'bg-primary-container' },
]

export function Results() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 overflow-y-auto px-5 pb-24 pt-4">
        <div className="max-w-3xl mx-auto flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-8">
          <section className="flex flex-col items-center justify-center py-8 md:col-span-2 relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              <div className="w-64 h-64 bg-secondary-container rounded-full blur-3xl opacity-20 animate-pulse-slow" />
              <div className="absolute w-48 h-48 bg-primary-container rounded-full blur-3xl opacity-20 translate-x-12 translate-y-12" />
            </div>
            <div className="w-48 h-48 rounded-full border-4 border-secondary-container flex flex-col items-center justify-center bg-surface relative z-10 shadow-[0_0_40px_rgba(199,175,253,0.3)]">
              <span className="text-[40px] leading-[48px] tracking-[-0.02em] font-bold text-primary">73%</span>
              <span className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">Compatibility</span>
            </div>
            <h1 className="text-[28px] leading-[36px] font-semibold text-on-surface mt-6 text-center">
              Strong Match
            </h1>
            <p className="text-base text-on-surface-variant text-center max-w-md mt-2">
              Your auras blend beautifully, suggesting a deep understanding and shared perspective on life's key themes.
            </p>
          </section>

          <section className="bg-surface shadow-soft rounded-xl p-4 border border-surface-variant">
            <h2 className="text-xl font-semibold mb-4 text-on-surface">Category Breakdown</h2>
            <div className="flex flex-col gap-3">
              {CATEGORIES.map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-on-surface">{cat.name}</span>
                    <span className="text-xs text-on-surface-variant">{cat.score}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-2">
                    <div
                      className={`${cat.color} h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <div className="bg-secondary-fixed/30 rounded-xl p-4 border border-secondary-fixed-dim/50 shadow-soft hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <h3 className="text-sm font-medium text-on-surface">Biggest Alignment</h3>
              </div>
              <p className="text-base text-on-surface">
                You both deeply value <strong>Family & Connection</strong>, forming a strong foundation for future planning.
              </p>
            </div>

            <div className="bg-surface rounded-xl p-4 border border-surface-variant shadow-soft hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-outline">psychology</span>
                <h3 className="text-sm font-medium text-on-surface">Area for Growth</h3>
              </div>
              <p className="text-base text-on-surface">
                Your approaches to <strong>Conflict Resolution</strong> differ; proactive communication will be key.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-3 md:col-span-2 mt-2 items-center">
            <button className="w-full md:w-96 min-h-[56px] bg-primary text-on-primary rounded-xl text-sm font-medium shadow-soft hover:opacity-90 active:scale-[1.02] transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">ios_share</span>
              Share Result
            </button>
            <button
              onClick={() => navigate('/session/new')}
              className="w-full md:w-96 min-h-[56px] bg-secondary-container/10 text-secondary rounded-xl text-sm font-medium hover:bg-secondary-container/20 active:scale-[1.02] transition-all"
            >
              Play Again
            </button>
          </section>
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  )
}
