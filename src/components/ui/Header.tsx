interface HeaderProps {
  onLanguageClick?: () => void
  onFavoriteClick?: () => void
}

export function Header({ onLanguageClick, onFavoriteClick }: HeaderProps) {
  return (
    <header className="bg-surface/80 backdrop-blur-md shadow-soft sticky top-0 z-50 flex justify-between items-center w-full px-5 h-16">
      <button
        onClick={onLanguageClick}
        className="text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95 transition-transform duration-200 flex items-center justify-center p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <span className="material-symbols-outlined">language</span>
      </button>
      <h1 className="text-[40px] leading-[48px] tracking-[-0.02em] font-bold text-primary">
        Aura
      </h1>
      <button
        onClick={onFavoriteClick}
        className="text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95 transition-transform duration-200 flex items-center justify-center p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <span className="material-symbols-outlined">favorite</span>
      </button>
    </header>
  )
}
