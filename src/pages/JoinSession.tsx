import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/ui/Header'
import { BottomNav } from '@/components/ui/BottomNav'
import { joinSession } from '@/hooks/useSupabase'

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
    localStorage.setItem('aura_player_role', 'partner')
    navigate('/session/quiz')
    setJoining(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-5 py-6 max-w-md mx-auto w-full pb-24">
        <div className="text-center mb-8">
          <h1 className="text-[28px] leading-[36px] font-semibold text-on-background mb-2">
            Connect Partner
          </h1>
          <p className="text-base text-on-surface-variant">
            Enter the session code from your partner's screen.
          </p>
        </div>

        <div className="w-full max-w-[280px] mb-8">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
            placeholder="ABC123"
            maxLength={6}
            className="w-full text-center text-[40px] leading-[48px] tracking-[0.1em] font-bold text-primary bg-surface-container-lowest border border-surface-variant rounded-xl p-6 shadow-soft focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/30 uppercase"
          />
        </div>

        {error && (
          <div className="bg-error-container/30 text-on-error-container text-sm px-4 py-2 rounded-full mb-4">
            {error}
          </div>
        )}

        <div className="w-full space-y-3 mt-auto">
          <button
            onClick={handleJoin}
            disabled={code.length < 6 || joining}
            className="w-full bg-primary text-on-primary text-sm font-medium py-4 rounded-full flex items-center justify-center shadow-soft hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {joining ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              'Join Session'
            )}
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-secondary-container/10 text-secondary text-sm font-medium py-4 rounded-full hover:bg-secondary-container/20 transition-colors"
          >
            Go Back
          </button>
        </div>
      </main>

      <BottomNav active="profile" />
    </div>
  )
}
