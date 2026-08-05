import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/ui/Header'
import { BottomNav } from '@/components/ui/BottomNav'
import { createSession } from '@/hooks/useSupabase'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/database'
import type { Category, AppLanguage } from '@/types/database'
import {
  Clock, Zap, Globe, ArrowRight, Check, Loader2,
  MessageCircle, Heart, Leaf, Handshake, PiggyBank, Baby, Diamond,
} from 'lucide-react'

type SessionType = 'online' | 'realtime'

const ALL_CATEGORIES: Category[] = [
  'communication', 'values', 'lifestyle', 'intimacy', 'finances', 'children', 'marriage',
]

const CATEGORY_LUCIDE: Record<Category, typeof Heart> = {
  communication: MessageCircle,
  values: Heart,
  lifestyle: Leaf,
  intimacy: Handshake,
  finances: PiggyBank,
  children: Baby,
  marriage: Diamond,
}

const FLAGS: Record<AppLanguage, { label: string; emoji: string }> = {
  en: { label: 'English', emoji: '🇬🇧' },
  fr: { label: 'Français', emoji: '🇫🇷' },
  ar: { label: 'العربية', emoji: '🇸🇦' },
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
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const handleCreate = async () => {
    if (selectedCategories.length === 0 || creating) return
    setCreating(true)
    localStorage.setItem('aura_language', language)
    const playerId = getOrCreatePlayerId()
    const { data } = await createSession(sessionType, language, selectedCategories, playerId)
    if (data) {
      localStorage.setItem('aura_session_code', data.code)
      localStorage.setItem('aura_session_id', data.id)
      localStorage.setItem('aura_session_categories', JSON.stringify(selectedCategories))
      localStorage.setItem('aura_player_role', 'host')
      navigate(`/session/wait/${data.code}`)
    }
    setCreating(false)
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col px-5 pb-24 w-full max-w-lg mx-auto overflow-y-auto">
        {/* Mode Selection */}
        <section className="pt-4 pb-6">
          <h2 className="text-xl font-bold text-on-surface mb-1">How do you want to play?</h2>
          <p className="text-sm text-on-surface-variant mb-4">Pick a mode that fits your vibe.</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSessionType('online')}
              className={`relative flex flex-col items-center p-5 rounded-2xl border-2 transition-all duration-200 active:scale-[0.97] ${
                sessionType === 'online'
                  ? 'border-primary bg-primary/5 shadow-soft'
                  : 'border-surface-variant bg-surface hover:border-outline'
              }`}
            >
              {sessionType === 'online' && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-on-primary" strokeWidth={3} />
                </div>
              )}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                sessionType === 'online' ? 'bg-primary text-on-primary' : 'bg-secondary-container/20 text-secondary'
              }`}>
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-on-surface">Online</span>
              <span className="text-xs text-on-surface-variant mt-1">Anytime</span>
            </button>

            <button
              onClick={() => setSessionType('realtime')}
              className={`relative flex flex-col items-center p-5 rounded-2xl border-2 transition-all duration-200 active:scale-[0.97] ${
                sessionType === 'realtime'
                  ? 'border-primary bg-primary/5 shadow-soft'
                  : 'border-surface-variant bg-surface hover:border-outline'
              }`}
            >
              {sessionType === 'realtime' && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-on-primary" strokeWidth={3} />
                </div>
              )}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                sessionType === 'realtime' ? 'bg-primary text-on-primary' : 'bg-secondary-container/20 text-secondary'
              }`}>
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-on-surface">Realtime</span>
              <span className="text-xs text-on-surface-variant mt-1">Together</span>
            </button>
          </div>
        </section>

        {/* Category Selection */}
        <section className="pb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wide">Sections</h3>
            <span className="text-xs text-primary font-medium">{selectedCategories.length} selected</span>
          </div>
          <div className="flex flex-col gap-2">
            {ALL_CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat)
              const Icon = CATEGORY_LUCIDE[cat]
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] text-left ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-soft'
                      : 'border-surface-variant bg-surface hover:border-outline'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-on-surface block">
                      {CATEGORY_LABELS[cat][language]}
                    </span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'border-primary bg-primary' : 'border-outline-variant'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-on-primary" strokeWidth={3} />}
                  </div>
                </button>
              )
            })}
          </div>
          {selectedCategories.length === 0 && (
            <p className="text-xs text-error mt-2 text-center font-medium">Select at least one section</p>
          )}
        </section>

        {/* Language Selection */}
        <section className="pb-6">
          <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wide mb-3">Language</h3>
          <div className="flex gap-2">
            {(['en', 'fr', 'ar'] as AppLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 transition-all duration-200 active:scale-[0.97] ${
                  language === lang
                    ? 'border-primary bg-primary/5 shadow-soft'
                    : 'border-surface-variant bg-surface hover:border-outline'
                }`}
              >
                <span className="text-xl">{FLAGS[lang].emoji}</span>
                <span className="text-sm font-medium text-on-surface">{FLAGS[lang].label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Create Button */}
        <div className="mt-auto pt-2 pb-4">
          <button
            onClick={handleCreate}
            disabled={selectedCategories.length === 0 || creating}
            className="w-full h-14 bg-primary text-on-primary rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-soft hover:shadow-[0_8px_30px_rgba(174,47,52,0.25)] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {creating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Create Session
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  )
}
