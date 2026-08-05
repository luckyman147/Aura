export type Category =
  | 'communication'
  | 'values'
  | 'lifestyle'
  | 'intimacy'
  | 'finances'
  | 'children'
  | 'marriage'

export type SessionMode = 'online' | 'realtime'
export type SessionStatus = 'waiting' | 'active' | 'completed'
export type AppLanguage = 'en' | 'fr' | 'ar'
export type AnswerValue = 'agree' | 'neutral' | 'disagree' | 'skipped'

export interface Question {
  id: string
  category: Category
  text_en: string
  text_fr: string
  text_ar: string
  order_index: number
  created_at: string
}

export interface Session {
  id: string
  code: string
  mode: SessionMode
  language: AppLanguage
  categories: Category[]
  status: SessionStatus
  host_id: string
  partner_id: string | null
  created_at: string
  updated_at: string
}

export interface Answer {
  id: string
  session_id: string
  player_id: string
  question_id: string
  answer: AnswerValue
  created_at: string
}

export interface Message {
  id: string
  session_id: string
  sender_id: string
  text: string
  created_at: string
}

export interface Result {
  id: string
  session_id: string
  overall_score: number
  communication_score: number | null
  values_score: number | null
  lifestyle_score: number | null
  intimacy_score: number | null
  finances_score: number | null
  children_score: number | null
  marriage_score: number | null
  biggest_alignment: string | null
  biggest_gap: string | null
  created_at: string
}

export const CATEGORY_LABELS: Record<Category, Record<AppLanguage, string>> = {
  communication: { en: 'Communication', fr: 'Communication', ar: 'التواصل' },
  values: { en: 'Values', fr: 'Valeurs', ar: 'القيم' },
  lifestyle: { en: 'Lifestyle', fr: 'Style de vie', ar: 'نمط الحياة' },
  intimacy: { en: 'Intimacy', fr: 'Intimité', ar: 'الحميمية' },
  finances: { en: 'Finances', fr: 'Finances', ar: 'المالية' },
  children: { en: 'Children', fr: 'Enfants', ar: 'الأطفال' },
  marriage: { en: 'Marriage', fr: 'Mariage', ar: 'الزواج' },
}

export const CATEGORY_ICONS: Record<Category, string> = {
  communication: 'chat',
  values: 'favorite',
  lifestyle: 'eco',
  intimacy: 'heart_handshake',
  finances: 'savings',
  children: 'child_care',
  marriage: 'diamond',
}

export function getQuestionText(q: Question, lang: AppLanguage): string {
  switch (lang) {
    case 'fr': return q.text_fr
    case 'ar': return q.text_ar
    default: return q.text_en
  }
}
