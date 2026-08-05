import { useParams, useNavigate } from 'react-router-dom'
import { useSession } from '@/hooks/useSupabase'
import { Header } from '@/components/ui/Header'
import { BottomNav } from '@/components/ui/BottomNav'
import { Copy, X, Loader2, QrCode } from 'lucide-react'
import { useState } from 'react'

export function WaitSession() {
  const { code } = useParams<{ code: string }>()
  const { session, loading } = useSession(code ?? null)
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  if (loading) {
    return (
      <div className="min-h-dvh bg-background flex flex-col items-center justify-center">
        <Header />
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }

  if (session?.status === 'active') {
    localStorage.setItem('aura_session_code', session.code)
    localStorage.setItem('aura_session_id', session.id)
    navigate('/session/quiz')
    return null
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center px-5 py-6 max-w-md mx-auto w-full pb-24">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary-container/20 rounded-2xl flex items-center justify-center mx-auto mb-4 pulse-qr">
            <QrCode className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-2xl font-bold text-on-background mb-2">Waiting for Partner</h1>
          <p className="text-sm text-on-surface-variant">
            Share this code and wait for your partner to join.
          </p>
        </div>

        <div className="relative mb-8 w-full max-w-[260px]">
          <div className="absolute inset-0 bg-secondary-container/20 rounded-3xl pulse-qr blur-lg" />
          <div className="bg-surface p-6 rounded-3xl shadow-soft relative z-10 border border-surface-variant flex flex-col items-center">
            <div className="text-[10px] text-on-surface-variant mb-3 uppercase tracking-[0.2em] font-medium">
              Session Code
            </div>
            <div className="text-4xl tracking-[0.2em] font-bold text-primary mb-4">
              {code}
            </div>
            <div className="flex items-center gap-2 bg-secondary-fixed/50 px-3 py-1.5 rounded-full">
              <span className="text-xs text-on-secondary-fixed-variant font-medium">Waiting</span>
              <div className="dot-flashing" />
            </div>
          </div>
        </div>

        <div className="w-full max-w-xs mx-auto space-y-3 mt-auto">
          <button
            onClick={handleCopy}
            className="w-full h-12 bg-primary/10 text-primary text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 border border-primary/20 hover:bg-primary/15 active:scale-[0.98] transition-all"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full h-12 bg-surface text-on-surface-variant text-sm font-medium rounded-2xl flex items-center justify-center gap-2 border border-surface-variant hover:bg-surface-variant/50 active:scale-[0.98] transition-all"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  )
}
