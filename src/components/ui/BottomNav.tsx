import { Home, History, User } from 'lucide-react'

interface BottomNavProps {
  active?: 'home' | 'history' | 'profile'
}

export function BottomNav({ active = 'home' }: BottomNavProps) {
  const items = [
    { key: 'home' as const, icon: Home, label: 'Home', href: '/' },
    { key: 'history' as const, icon: History, label: 'History', href: '#' },
    { key: 'profile' as const, icon: User, label: 'Profile', href: '#' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface/95 backdrop-blur-md border-t border-surface-variant safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {items.map((item) => {
          const isActive = active === item.key
          const Icon = item.icon
          return (
            <a
              key={item.key}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-2xl transition-all duration-200 min-w-[64px] ${
                isActive
                  ? 'bg-primary/10 text-primary scale-105'
                  : 'text-on-surface-variant hover:bg-surface-variant/50'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] font-medium">{item.label}</span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
