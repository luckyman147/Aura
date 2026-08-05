import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type {
  Session,
  Question,
  Answer,
  Result,
  Message,
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
      .then(({ data }) => {
        setSession(data)
        setLoading(false)
      })
  }, [code])

  // Realtime subscription with unique channel name
  useEffect(() => {
    if (!code) return
    const channelName = `session:${code}:${Math.random().toString(36).slice(2)}`
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'sessions',
        filter: `code=eq.${code.toUpperCase()}`,
      }, (payload) => {
        setSession(payload.new as Session)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [code])

  // Polling fallback — aggressive 1s poll while waiting
  useEffect(() => {
    if (!code || !session || session.status !== 'waiting') return
    let stopped = false
    const interval = setInterval(async () => {
      if (stopped) return
      const { data } = await supabase
        .from('sessions')
        .select('*')
        .eq('code', code.toUpperCase())
        .single()
      if (data && data.status !== 'waiting') {
        stopped = true
        clearInterval(interval)
        setSession(data)
      }
    }, 1000)
    return () => { stopped = true; clearInterval(interval) }
  }, [code, session?.status])

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
    const ansChannel = supabase
      .channel(`answers:${sessionId}:${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'answers',
        filter: `session_id=eq.${sessionId}`,
      }, (payload) => {
        setAnswers((prev) => [...prev, payload.new as Answer])
      })
      .subscribe()
    return () => { supabase.removeChannel(ansChannel) }
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

  // Step 1: Atomic join via SECURITY DEFINER (safe, prevents race conditions)
  const { data, error } = await supabase
    .rpc('join_session', {
      p_code: normalizedCode,
      p_partner_id: partnerId,
    })
    .single()

  if (error || !data) {
    return { data: null, error: { message: error?.message || 'Session not found or already full' } }
  }

  // Step 2: Touch the row via anon client to FIRE Realtime for the host
  // SECURITY DEFINER updates don't fire Realtime, but a client-side update does
  await supabase
    .from('sessions')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', (data as Session).id)

  return { data: data as Session, error: null }
}

export function getSessionInviteUrl(code: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://aura-app.netlify.app'
  return `${base}/session/join?code=${code}`
}

export function useMessages(sessionId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) { setLoading(false); return }

    supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setMessages(data ?? [])
        setLoading(false)
      })
  }, [sessionId])

  useEffect(() => {
    if (!sessionId) return
    const msgChannel = supabase
      .channel(`messages:${sessionId}:${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `session_id=eq.${sessionId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message])
      })
      .subscribe()
    return () => { supabase.removeChannel(msgChannel) }
  }, [sessionId])

  const sendMessage = useCallback(async (senderId: string, text: string) => {
    if (!sessionId || !text.trim()) return
    await supabase.from('messages').insert({
      session_id: sessionId,
      sender_id: senderId,
      text: text.trim(),
    })
  }, [sessionId])

  return { messages, loading, sendMessage }
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
