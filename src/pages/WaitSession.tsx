import { useParams, useNavigate } from 'react-router-dom'
import { useSession } from '@/hooks/useSupabase'
import { Header } from '@/components/ui/Header'
import { BottomNav } from '@/components/ui/BottomNav'

export function WaitSession() {
  const { code } = useParams<{ code: string }>()
  const { session, loading } = useSession(code ?? null)
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Header />
        <span className="material-symbols-outlined animate-spin text-primary text-[48px]">progress_activity</span>
      </div>
    )
  }

  if (session?.status === 'active') {
    localStorage.setItem('aura_session_code', session.code)
    navigate('/session/quiz')
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-5 py-6 max-w-md mx-auto w-full pb-24">
        <div className="text-center mb-8">
          <h1 className="text-[28px] leading-[36px] font-semibold text-on-background mb-2">
            Waiting for Partner
          </h1>
          <p className="text-base text-on-surface-variant">
            Share this code with your partner to start.
          </p>
        </div>

        <div className="relative mb-8 w-full max-w-[280px]">
          <div className="absolute inset-0 bg-secondary-container/20 rounded-xl pulse-qr blur-md" />
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-soft relative z-10 border border-surface-variant flex flex-col items-center">
            <div className="w-48 h-48 bg-surface-variant rounded-md mb-4 relative overflow-hidden flex items-center justify-center">
              <span className="material-symbols-outlined text-[80px] text-on-surface-variant/30">qr_code_2</span>
            </div>
            <div className="text-center w-full border-t border-surface-variant pt-4">
              <div className="text-xs text-on-surface-variant mb-2 uppercase tracking-wider">
                Session Code
              </div>
              <div className="text-[40px] leading-[48px] tracking-[0.1em] font-bold text-primary">
                {code}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4 mb-8">
          <div className="flex items-center space-x-3 bg-secondary-fixed/50 px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-on-secondary-fixed-variant">
              Waiting for partner
            </span>
            <div className="w-6 flex justify-center text-on-secondary-fixed-variant ml-1">
              <div className="dot-flashing" />
            </div>
          </div>
        </div>

        <div className="w-full space-y-3 mt-auto">
          <button
            onClick={() => {
              navigator.clipboard.writeText(code ?? '')
            }}
            className="w-full bg-secondary-container/10 text-secondary text-sm font-medium py-4 rounded-full flex items-center justify-center space-x-2 border border-secondary-container hover:bg-secondary-container/20 transition-colors"
          >
            <span className="material-symbols-outlined">content_copy</span>
            <span>Copy Code</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-surface text-on-surface-variant text-sm font-medium py-4 rounded-full border border-outline-variant hover:bg-surface-variant/50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  )
}
