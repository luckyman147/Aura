import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/ui/Header'
import { BottomNav } from '@/components/ui/BottomNav'
import { joinSession } from '@/hooks/useSupabase'
import { Users, ArrowLeft, Loader2 } from 'lucide-react'

function getOrCreatePlayerId(): string {
  let id = localStorage.getItem('aura_player_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('aura_player_id', id)
  }
  return id
}

export function JoinSession() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')

  const handleJoin = async () => {
    if (code.length < 6 || joining) return
    setJoining(true)
    setError('')

    const playerId = getOrCreatePlayerId()
    const { data, error: joinError } = await joinSession(code.toUpperCase(), playerId)

    if (joinError || !data) {
      setError('Invalid code or session already full')
      setJoining(false)
      return
    }

    localStorage.setItem('aura_session_code', data.code)
    localStorage.setItem('aura_session_id', data.id)
    localStorage.setItem('aura_language', data.language)
    localStorage.setItem('aura_player_role', 'partner')
    navigate('/session/quiz')
    setJoining(false)
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center px-5 py-6 max-w-md mx-auto w-full pb-24">
        <div className="w-full mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-on-background mb-2">Join Partner</h1>
          <p className="text-sm text-on-surface-variant">
            Enter the 6-digit code from your partner's screen.
          </p>
        </div>

        <div className="w-full max-w-xs mx-auto mb-6">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
            placeholder="------"
            maxLength={6}
            autoFocus
            className="w-full text-center text-3xl tracking-[0.3em] font-bold text-primary bg-surface border-2 border-surface-variant rounded-2xl py-5 px-4 shadow-soft focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-on-surface-variant/20 uppercase transition-all"
          />
          <div className="flex justify-center gap-1.5 mt-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < code.length ? 'bg-primary' : 'bg-surface-variant'
                }`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-error-container/30 text-on-error-container text-sm px-4 py-2.5 rounded-xl mb-4 font-medium text-center">
            {error}
          </div>
        )}

        <div className="w-full max-w-xs mx-auto space-y-3 mt-auto">
          <button
            onClick={handleJoin}
            disabled={code.length < 6 || joining}
            className="w-full h-14 bg-primary text-on-primary rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-soft hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {joining ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Join Session'
            )}
          </button>
        </div>
      </main>

      <BottomNav active="profile" />
    </div>
  )
}
