interface BottomNavProps {
  active?: 'home' | 'history' | 'profile'
}

export function BottomNav({ active = 'home' }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-5 bg-surface-container-low shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl md:hidden">
      <a
        href="/"
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
          active === 'home'
            ? 'bg-primary-container/10 text-primary scale-110 transition-transform duration-300 ease-out'
            : 'text-on-surface-variant hover:bg-secondary-container/20'
        }`}
      >
        <span className="material-symbols-outlined mb-1" style={active === 'home' ? { fontVariationSettings: "'FILL' 1" } : undefined}>
          home
        </span>
        <span className="text-xs font-medium">Home</span>
      </a>
      <a
        href="#"
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
          active === 'history'
            ? 'bg-primary-container/10 text-primary scale-110 transition-transform duration-300 ease-out'
            : 'text-on-surface-variant hover:bg-secondary-container/20'
        }`}
      >
        <span className="material-symbols-outlined mb-1" style={active === 'history' ? { fontVariationSettings: "'FILL' 1" } : undefined}>
          history
        </span>
        <span className="text-xs font-medium">History</span>
      </a>
      <a
        href="#"
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
          active === 'profile'
            ? 'bg-primary-container/10 text-primary scale-110 transition-transform duration-300 ease-out'
            : 'text-on-surface-variant hover:bg-secondary-container/20'
        }`}
      >
        <span className="material-symbols-outlined mb-1" style={active === 'profile' ? { fontVariationSettings: "'FILL' 1" } : undefined}>
          person
        </span>
        <span className="text-xs font-medium">Profile</span>
      </a>
    </nav>
  )
}
