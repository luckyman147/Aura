import { Heart, Globe, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  showLogo?: boolean
  showHome?: boolean
}

export function Header({ showLogo = false, showHome = false }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="bg-surface/80 backdrop-blur-md shadow-soft sticky top-0 z-50 flex justify-between items-center w-full px-4 h-14 safe-area-top">
      {showHome ? (
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors active:scale-95"
        >
          <Home className="w-5 h-5 text-on-surface-variant" />
        </button>
      ) : (
        <div className="w-10 h-10" />
      )}

      {showLogo ? (
        <img src="/logo.png" alt="SoulSync" className="h-9 w-auto" />
      ) : (
        <h1 className="text-2xl font-bold text-primary tracking-tight">SoulSync</h1>
      )}

      <div className="w-10 h-10" />
    </header>
  )
}
