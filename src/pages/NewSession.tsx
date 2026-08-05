import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/ui/Header'
import { BottomNav } from '@/components/ui/BottomNav'
import { createSession } from '@/hooks/useSupabase'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/database'
import type { Category, AppLanguage } from '@/types/database'

type SessionType = 'online' | 'realtime'

const ALL_CATEGORIES: Category[] = [
  'communication', 'values', 'lifestyle', 'intimacy', 'finances', 'children', 'marriage',
]

const FLAGS: Record<AppLanguage, string> = {
  en: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdcoEPbmrfhGjp7kmanpMEdoVWEhHgZ5FdwcJ-mUdg0gXH_P7QA1iHFYIKyQ28AZjJpnsKHwpJ0kVley1Qbf6sqlT57dYw1_dvufy2Qy-alkkMk3Fr1zrBczqT2OJ91plldVyvrrL-08S9FCynkWKmxcUDWBMSf0MV1xzdAbJi-9Q8fYxgM7ZiRluhwLkQjZwFWemvoS9WAfdvYJCGuB5HfoXclXFSiNtP5NgE5B6Ul075he_6wt3hEw',
  fr: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxVNNXqH1OcUtaezbZVc2q7Y3nDZSLCvO3yu8mCa5WmZdQ7K8o_YtMShyBp5qvoXoJDUJUL2Y_22_-8L8GHvPYgQh6k9HiGtE49VkXuBc7Uj7dDLJTu-Aqynnl0Bc3WGkyZm5PalSxM81t_B1vBRNnqPwrM5iXHjSiHiE1HBIbvqwoZiQFG9m8ie-Xrb4D4DmI1Qnw1HmBwDmXxQ1QM6pv14I0Tdb0f7z5PvUWQCuHuJ2hPlOuJKuzEQ',
  ar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgwFJ12-UHgPmAV3XJOoYWsbxr3jPelKbEko3SJEvvEaSPvXQVG6rR7MOIWTsqMgTrukF0Q66s_XWakGyQtXqWh4cr9r8ft-N3p6E8gLhQ5cmLs6fmyZGTDckjiUiOw0kYDTkD_xUnwJjsWaznD1v4lIeA7zBJo3B43JdK5juulOD5Ma3lrNjdkrI6E7R2s9ivqPwnfPkiyoEKP3s4c7Q04UJvTGQemamEfZReWV6gbfXFqs2QBFFebw',
}

function getOrCreatePlayerId(): string {
  let id = localStorage.getItem('aura_player_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('aura_player_id', id)
  }
  return id
}

export function NewSession() {
  const navigate = useNavigate()
  const [sessionType, setSessionType] = useState<SessionType>('online')
  const [language, setLanguage] = useState<AppLanguage>('en')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([
    'communication', 'values', 'lifestyle',
  ])
  const [creating, setCreating] = useState(false)

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    )
  }

  const handleCreate = async () => {
    if (selectedCategories.length === 0 || creating) return
    setCreating(true)
    const playerId = getOrCreatePlayerId()
    const { data } = await createSession(sessionType, language, selectedCategories, playerId)
    if (data) {
      localStorage.setItem('aura_session_code', data.code)
      localStorage.setItem('aura_player_role', 'host')
      navigate(`/session/wait/${data.code}`)
    }
    setCreating(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center pt-8 pb-24 px-5 w-full max-w-3xl mx-auto">
        <div className="text-center w-full mb-8">
          <h2 className="text-[28px] leading-[36px] font-semibold text-on-surface mb-2">
            How do you want to play?
          </h2>
          <p className="text-base text-on-surface-variant">
            Select a session type to begin your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
          <label className="relative cursor-pointer group w-full h-full block">
            <input
              type="radio"
              name="session_type"
              value="online"
              checked={sessionType === 'online'}
              onChange={() => setSessionType('online')}
              className="sr-only peer"
            />
            <div className="bg-surface rounded-xl p-6 h-full flex flex-col items-start shadow-soft border border-[#EEEEEE] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] group-active:scale-[0.98] peer-checked:border-primary peer-checked:border-2 peer-checked:bg-primary/5">
              <div className="w-12 h-12 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center mb-4 transition-colors duration-300 peer-checked:bg-primary peer-checked:text-white">
                <span className="material-symbols-outlined text-[28px]">schedule</span>
              </div>
              <div className="mt-auto">
                <h3 className="text-xl font-semibold text-on-surface mb-1">Online</h3>
                <p className="text-sm text-on-surface-variant">Answer anytime, no rush</p>
              </div>
            </div>
          </label>

          <label className="relative cursor-pointer group w-full h-full block">
            <input
              type="radio"
              name="session_type"
              value="realtime"
              checked={sessionType === 'realtime'}
              onChange={() => setSessionType('realtime')}
              className="sr-only peer"
            />
            <div className="bg-surface rounded-xl p-6 h-full flex flex-col items-start shadow-soft border border-[#EEEEEE] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] group-active:scale-[0.98] peer-checked:border-primary peer-checked:border-2 peer-checked:bg-primary/5">
              <div className="w-12 h-12 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center mb-4 transition-colors duration-300 peer-checked:bg-primary peer-checked:text-white">
                <span className="material-symbols-outlined text-[28px]">bolt</span>
              </div>
              <div className="mt-auto">
                <h3 className="text-xl font-semibold text-on-surface mb-1">Realtime</h3>
                <p className="text-sm text-on-surface-variant">Answer together, now</p>
              </div>
            </div>
          </label>
        </div>

        <div className="w-full mb-8">
          <p className="text-sm font-medium text-on-surface-variant mb-4 uppercase tracking-wider text-center">
            Select Sections
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ALL_CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat)
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
                    isSelected
                      ? 'bg-primary/5 border-primary border-2 shadow-soft'
                      : 'bg-surface border-outline-variant hover:border-outline hover:shadow-soft'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-primary text-on-primary' : 'bg-secondary-container/20 text-secondary'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {CATEGORY_ICONS[cat]}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-on-surface">
                    {CATEGORY_LABELS[cat][language]}
                  </span>
                </button>
              )
            })}
          </div>
          {selectedCategories.length === 0 && (
            <p className="text-xs text-error mt-2 text-center">Select at least one section</p>
          )}
        </div>

        <div className="w-full mb-8 flex flex-col items-center">
          <p className="text-sm font-medium text-on-surface-variant mb-4 uppercase tracking-wider">
            Select Language
          </p>
          <div className="flex space-x-4">
            {(['en', 'fr', 'ar'] as AppLanguage[]).map((lang) => (
              <label key={lang} className="cursor-pointer group relative">
                <input
                  type="radio"
                  name="language"
                  value={lang}
                  checked={language === lang}
                  onChange={() => setLanguage(lang)}
                  className="sr-only peer"
                />
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-transparent peer-checked:border-primary peer-checked:shadow-[0_0_0_4px_rgba(174,47,52,0.1)] transition-all duration-300 shadow-soft">
                  <img src={FLAGS[lang]} alt={`${lang} flag`} className="w-full h-full object-cover" />
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="w-full mt-auto pt-4">
          <button
            onClick={handleCreate}
            disabled={selectedCategories.length === 0 || creating}
            className="w-full min-h-[56px] bg-primary text-on-primary text-sm font-medium rounded-full shadow-soft hover:shadow-[0_6px_24px_rgba(174,47,52,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              <>
                Create Session
                <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  )
}
