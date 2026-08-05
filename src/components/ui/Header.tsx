import { Heart, Globe } from 'lucide-react'

interface HeaderProps {
  onLanguageClick?: () => void
  onFavoriteClick?: () => void
  showLogo?: boolean
}

export function Header({ onLanguageClick, onFavoriteClick, showLogo = false }: HeaderProps) {
  return (
    <header className="bg-surface/80 backdrop-blur-md shadow-soft sticky top-0 z-50 flex justify-between items-center w-full px-4 h-14 safe-area-top">
      <button
        onClick={onLanguageClick}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors active:scale-95"
      >
        <Globe className="w-5 h-5 text-on-surface-variant" />
      </button>

      {showLogo ? (
        <img src="/logo.png" alt="Aura" className="h-9 w-auto" />
      ) : (
        <h1 className="text-2xl font-bold text-primary tracking-tight">Aura</h1>
      )}

      <button
        onClick={onFavoriteClick}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors active:scale-95"
      >
        <Heart className="w-5 h-5 text-on-surface-variant" />
      </button>
    </header>
  )
}
