import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type {
  Session,
  Question,
  Answer,
  Result,
  Category,
  AnswerValue,
  AppLanguage,
} from '@/types/database'

export function useSession(code: string | null) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!code) { setLoading(false); return }

    supabase
      .from('sessions')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()
      .then(({ data, error }) => {
        setSession(data)
        setLoading(false)
      })
  }, [code])

  useEffect(() => {
    if (!code) return
    const channel = supabase
      .channel(`session:${code}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sessions',
        filter: `code=eq.${code.toUpperCase()}`,
      }, (payload) => {
        setSession(payload.new as Session)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [code])

  return { session, loading }
}

export function useQuestions(categories: Category[], language: AppLanguage) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (categories.length === 0) { setLoading(false); return }

    supabase
      .from('questions')
      .select('*')
      .in('category', categories)
      .order('order_index')
      .then(({ data }) => {
        setQuestions(data ?? [])
        setLoading(false)
      })
  }, [categories.join(',')])

  return { questions, loading }
}

export function useAnswers(sessionId: string | null, playerId: string | null) {
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId || !playerId) { setLoading(false); return }

    supabase
      .from('answers')
      .select('*')
      .eq('session_id', sessionId)
      .eq('player_id', playerId)
      .then(({ data }) => {
        setAnswers(data ?? [])
        setLoading(false)
      })
  }, [sessionId, playerId])

  useEffect(() => {
    if (!sessionId) return
    const channel = supabase
      .channel(`answers:${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'answers',
        filter: `session_id=eq.${sessionId}`,
      }, (payload) => {
        setAnswers((prev) => [...prev, payload.new as Answer])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [sessionId])

  const submitAnswer = useCallback(async (
    questionId: string,
    answer: AnswerValue,
  ) => {
    if (!sessionId || !playerId) return
    await supabase.from('answers').upsert({
      session_id: sessionId,
      player_id: playerId,
      question_id: questionId,
      answer,
    }, { onConflict: 'session_id,player_id,question_id' })
  }, [sessionId, playerId])

  return { answers, loading, submitAnswer }
}

export function useResults(sessionId: string | null) {
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) { setLoading(false); return }

    supabase
      .from('results')
      .select('*')
      .eq('session_id', sessionId)
      .single()
      .then(({ data }) => {
        setResult(data)
        setLoading(false)
      })
  }, [sessionId])

  return { result, loading }
}

export async function createSession(
  mode: 'online' | 'realtime',
  language: AppLanguage,
  categories: Category[],
  hostId: string,
) {
  const code = generateCode()
  const { data, error } = await supabase.from('sessions').insert({
    code,
    mode,
    language,
    categories,
    host_id: hostId,
    status: 'waiting',
  }).select().single()

  return { data, error }
}

export async function joinSession(code: string, partnerId: string) {
  const normalizedCode = code.toUpperCase().trim()

  // First, fetch the session to check if it exists and is joinable
  const { data: existing, error: fetchError } = await supabase
    .from('sessions')
    .select('*')
    .eq('code', normalizedCode)
    .single()

  if (fetchError || !existing) {
    return { data: null, error: { message: 'Session not found' } }
  }

  if (existing.partner_id) {
    return { data: null, error: { message: 'Session is already full' } }
  }

  if (existing.status !== 'waiting') {
    return { data: null, error: { message: 'Session is no longer accepting players' } }
  }

  // Now update the session
  const { data, error: updateError } = await supabase
    .from('sessions')
    .update({
      partner_id: partnerId,
      status: 'active',
    })
    .eq('id', existing.id)
    .select()
    .single()

  if (updateError) {
    return { data: null, error: { message: 'Failed to join session' } }
  }

  return { data, error: null }
}

export function getSessionInviteUrl(code: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://aura-app.netlify.app'
  return `${base}/session/join?code=${code}`
}

export function computeResults(sessionId: string) {
  return supabase.rpc('compute_results' as never, {
    p_session_id: sessionId,
  } as never)
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}
