import { useParams, useNavigate } from 'react-router-dom'
import { useSession, getSessionInviteUrl } from '@/hooks/useSupabase'
import { Header } from '@/components/ui/Header'
import { BottomNav } from '@/components/ui/BottomNav'
import { Copy, X, Loader2, Share2, QrCode, Link2, UserCheck } from 'lucide-react'
import { useState, useMemo, useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export function WaitSession() {
  const { code } = useParams<{ code: string }>()
  const { session, loading } = useSession(code ?? null)
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [shareMethod, setShareMethod] = useState<'qr' | 'link'>('qr')
  const [partnerJoined, setPartnerJoined] = useState(false)
  const didRedirect = useRef(false)

  const inviteUrl = useMemo(() => code ? getSessionInviteUrl(code) : '', [code])

  useEffect(() => {
    if (session?.status === 'active' && !partnerJoined && !didRedirect.current) {
      didRedirect.current = true
      setPartnerJoined(true)
      localStorage.setItem('aura_session_code', session.code)
      localStorage.setItem('aura_session_id', session.id)
      localStorage.setItem('aura_language', session.language)
      localStorage.setItem('aura_player_role', 'host')
      if (session.categories) {
        localStorage.setItem('aura_session_categories', JSON.stringify(session.categories))
      }
      setTimeout(() => navigate('/session/quiz'), 1500)
    }
  }, [session?.status])

  if (loading) {
    return (
      <div className="min-h-dvh bg-background flex flex-col items-center justify-center">
        <Header />
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }

  if (partnerJoined) {
    return (
      <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-6">
        <Header />
        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-secondary-container/30 rounded-full flex items-center justify-center">
            <UserCheck className="w-10 h-10 text-secondary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-on-surface mb-2">Partner Joined!</h1>
            <p className="text-sm text-on-surface-variant">Starting quiz together...</p>
          </div>
          <Loader2 className="w-6 h-6 text-primary animate-spin mt-2" />
        </div>
      </div>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Aura',
          text: `Let's discover our compatibility! Use code ${code} or tap the link:`,
          url: inviteUrl,
        })
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center px-5 py-6 max-w-md mx-auto w-full pb-24">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-on-background mb-2">Waiting for Partner</h1>
          <p className="text-sm text-on-surface-variant">
            Share this with your partner to start.
          </p>
        </div>

        {/* Session Code Display */}
        <div className="w-full max-w-[260px] mb-6">
          <div className="bg-surface p-5 rounded-3xl shadow-soft border border-surface-variant flex flex-col items-center">
            <div className="text-[10px] text-on-surface-variant mb-2 uppercase tracking-[0.2em] font-medium">
              Session Code
            </div>
            <div className="text-4xl tracking-[0.2em] font-bold text-primary mb-3">
              {code}
            </div>
            <div className="flex items-center gap-2 bg-secondary-fixed/50 px-3 py-1.5 rounded-full">
              <span className="text-xs text-on-secondary-fixed-variant font-medium">Waiting</span>
              <div className="dot-flashing" />
            </div>
          </div>
        </div>

        {/* QR / Link Toggle */}
        <div className="w-full max-w-[260px] mb-6">
          <div className="flex bg-surface-variant/50 rounded-xl p-1 mb-4">
            <button
              onClick={() => setShareMethod('qr')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                shareMethod === 'qr'
                  ? 'bg-surface text-on-surface shadow-soft'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              QR Code
            </button>
            <button
              onClick={() => setShareMethod('link')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                shareMethod === 'link'
                  ? 'bg-surface text-on-surface shadow-soft'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              Link
            </button>
          </div>

          {shareMethod === 'qr' ? (
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl shadow-soft border border-surface-variant">
                <QRCodeSVG
                  value={inviteUrl}
                  size={180}
                  bgColor="transparent"
                  fgColor="#1b1c1c"
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-[11px] text-on-surface-variant mt-3 text-center">
                Scan to join session
              </p>
            </div>
          ) : (
            <div className="bg-surface rounded-2xl p-4 border border-surface-variant shadow-soft">
              <div className="text-[10px] text-on-surface-variant mb-2 uppercase tracking-wider font-medium">
                Shareable Link
              </div>
              <div className="bg-surface-container-low rounded-xl px-3 py-2.5 mb-3">
                <p className="text-xs text-on-surface truncate font-mono">{inviteUrl}</p>
              </div>
              <button
                onClick={handleCopyLink}
                className="w-full h-10 bg-primary/10 text-primary text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 border border-primary/20 hover:bg-primary/15 active:scale-[0.98] transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-[260px] space-y-3 mt-auto">
          <button
            onClick={handleShare}
            className="w-full h-13 bg-primary text-on-primary text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-soft hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Share2 className="w-4 h-4" />
            Share Invite
          </button>
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
