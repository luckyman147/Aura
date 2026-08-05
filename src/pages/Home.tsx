import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/ui/Header'
import { Heart, ArrowRight, Users } from 'lucide-react'
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
    <div className="min-h-dvh flex flex-col bg-romantic-gradient relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/30 blur-[100px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary-container/20 blur-[120px] animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 py-8 w-full max-w-lg mx-auto">
        <div className="text-center mb-10 w-full animate-float">
          <div className="w-28 h-28 mx-auto mb-5 rounded-full glass-panel shadow-soft flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
            <Heart className="w-14 h-14 text-primary fill-primary/20" strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl font-bold text-on-surface mb-3 tracking-tight">SoulSync</h2>
          <p className="text-base text-on-surface-variant max-w-xs mx-auto leading-relaxed">
            Discover deeper connection through meaningful conversation.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => navigate('/session/new')}
            className="group w-full h-14 bg-primary text-on-primary rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-soft hover:shadow-[0_8px_30px_rgba(174,47,52,0.25)] active:scale-[0.98] transition-all duration-200"
          >
            <Heart className="w-5 h-5 fill-current" />
            Start Session
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => navigate('/session/join')}
            className="w-full h-14 bg-white/60 text-on-secondary-container rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 glass-panel border border-white/40 hover:bg-white/80 active:scale-[0.98] transition-all duration-200"
          >
            <Users className="w-5 h-5" />
            Join Session
          </button>
        </div>

        {playerId && (
          <p className="text-[10px] text-on-surface-variant/40 mt-8 font-mono">
            {playerId.slice(0, 8)}
          </p>
        )}
      </main>
    </div>
  )
}
