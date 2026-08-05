import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/ui/Header'
import { useEffect, useState } from 'react'

function getOrCreatePlayerId(): string {
  let id = localStorage.getItem('aura_player_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('aura_player_id', id)
  }
  return id
}

export function Home() {
  const navigate = useNavigate()
  const [playerId, setPlayerId] = useState('')

  useEffect(() => {
    setPlayerId(getOrCreatePlayerId())
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-romantic-gradient relative overflow-hidden">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-5 py-8 w-full max-w-lg mx-auto">
        <div className="text-center mb-8 w-full animate-float">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full glass-panel shadow-soft flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
            <span className="material-symbols-outlined text-[64px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
          </div>
          <h2 className="text-[48px] leading-[1.1] font-bold text-on-surface mb-2 tracking-tight">
            SoulSync
          </h2>
          <p className="text-lg text-on-surface-variant max-w-xs mx-auto">
            Discover deeper connection through meaningful conversation.
          </p>
        </div>

        <div className="w-full flex flex-col gap-4">
          <button
            onClick={() => navigate('/session/new')}
            className="w-full h-14 bg-primary text-on-primary rounded-xl text-sm font-medium flex items-center justify-center shadow-soft hover:shadow-[0_8px_30px_rgba(174,47,52,0.2)] hover:opacity-90 active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Start Session
          </button>
          <button
            onClick={() => navigate('/session/join')}
            className="w-full h-14 bg-secondary-container/30 text-on-secondary-container rounded-xl text-sm font-medium flex items-center justify-center glass-panel hover:bg-secondary-container/50 active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-container"
          >
            Join Session
          </button>
        </div>

        {playerId && (
          <p className="text-xs text-on-surface-variant/50 mt-8">
            Player ID: {playerId.slice(0, 8)}...
          </p>
        )}
      </main>
    </div>
  )
}
