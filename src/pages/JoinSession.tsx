import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/ui/Header'
import { BottomNav } from '@/components/ui/BottomNav'

export function JoinSession() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-5 py-6 max-w-md mx-auto w-full pb-24">
        <div className="text-center mb-8">
          <h1 className="text-[28px] leading-[36px] font-semibold text-on-background mb-2">
            Connect Partner
          </h1>
          <p className="text-base text-on-surface-variant">
            Scan this code to sync your Aura experience.
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
                ABC123
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
          <div className="flex items-center text-outline">
            <span className="material-symbols-outlined text-sm mr-2">timer</span>
            <span className="text-sm font-medium">Expires in 8:32</span>
          </div>
        </div>

        <div className="w-full space-y-3 mt-auto">
          <button className="w-full bg-secondary-container/10 text-secondary text-sm font-medium py-4 rounded-full flex items-center justify-center space-x-2 border border-secondary-container hover:bg-secondary-container/20 transition-colors">
            <span className="material-symbols-outlined">share</span>
            <span>Share Link</span>
          </button>
          <button
            onClick={() => navigate('/session/quiz')}
            className="w-full bg-primary text-on-primary text-sm font-medium py-4 rounded-full flex items-center justify-center shadow-soft hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Start Quiz
          </button>
        </div>
      </main>

      <BottomNav active="profile" />
    </div>
  )
}
