import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/ui/Header'
import { useQuestions, useAnswers, useSessionById, useMessages, updateSessionQuestionIndex, updateSessionTurn, updateSessionStatus } from '@/hooks/useSupabase'
import { supabase } from '@/lib/supabase/client'
import { getQuestionText, CATEGORY_LABELS } from '@/types/database'
import type { AnswerValue, AppLanguage, Category } from '@/types/database'
import { Loader2, SkipForward, X, Minus, Check, Clock, ChevronLeft, ChevronRight, Send, MessageCircle, AlertTriangle } from 'lucide-react'
import { MessageCircle as MsgCircle, Heart, Leaf, Handshake, PiggyBank, Baby, Diamond } from 'lucide-react'

function getOrCreatePlayerId(): string {
  let id = localStorage.getItem('aura_player_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('aura_player_id', id)
  }
  return id
}

function getLanguage(): AppLanguage {
  return (localStorage.getItem('aura_language') as AppLanguage) ?? 'en'
}

function getPlayerRole(): 'host' | 'partner' {
  return (localStorage.getItem('aura_player_role') as 'host' | 'partner') ?? 'host'
}

function getSessionId(): string {
  return localStorage.getItem('aura_session_id') ?? ''
}

const CATEGORY_LUCIDE: Record<Category, typeof Heart> = {
  communication: MsgCircle,
  values: Heart,
  lifestyle: Leaf,
  intimacy: Handshake,
  finances: PiggyBank,
  children: Baby,
  marriage: Diamond,
}

export function ActiveSession() {
  const navigate = useNavigate()
  const [answered, setAnswered] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [partnerLeft, setPartnerLeft] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const playerId = getOrCreatePlayerId()
  const language = getLanguage()
  const sessionId = getSessionId()

  const categories: Category[] = (() => {
    const stored = localStorage.getItem('aura_session_categories')
    if (stored) {
      try { return JSON.parse(stored) } catch { /* ignore */ }
    }
    return ['communication', 'values', 'lifestyle']
  })()

  const { questions, loading: questionsLoading } = useQuestions(categories, language)
  const { session } = useSessionById(sessionId || null)
  const { submitAnswer } = useAnswers(sessionId || null, playerId)
  const { messages, sendMessage } = useMessages(sessionId || null)

  const currentIdx = session?.current_question_index ?? 0
  const totalQuestions = questions.length
  const progress = totalQuestions > 0 ? ((currentIdx + 1) / totalQuestions) * 100 : 0
  const question = questions[currentIdx]
  const isOnline = session?.mode === 'online'
  const playerRole = getPlayerRole()
  const isMyTurn = session?.current_turn === playerRole

  // Detect partner leaving via Realtime Presence (auto-detects disconnects)
  useEffect(() => {
    if (!sessionId) return
    const channel = supabase.channel(`session:${sessionId}`)
    let partnerPresent = false

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const players = Object.keys(state)
        const online = players.length

        if (partnerPresent && online < 2) {
          setPartnerLeft(true)
        }
      })
      .on('presence', { event: 'join' }, () => {
        partnerPresent = true
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ player_id: playerId, joined_at: Date.now() })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId, playerId])

  // Sync chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-redirect to results when session completes (both players)
  useEffect(() => {
    if (session?.status === 'completed') {
      navigate('/session/results')
    }
  }, [session?.status, navigate])

  const syncIndex = useCallback(async (newIndex: number) => {
    if (!sessionId) return
    await updateSessionQuestionIndex(sessionId, newIndex)
  }, [sessionId])

  const handleAnswer = useCallback(async (answer: AnswerValue) => {
    if (!question || answered || !isMyTurn) return
    setAnswered(true)

    await submitAnswer(question.id, answer)

    // Toggle turn after answering
    const newTurn = session?.current_turn === 'host' ? 'partner' : 'host'
    await updateSessionTurn(sessionId, newTurn)

    setTimeout(async () => {
      if (currentIdx < totalQuestions - 1) {
        await syncIndex(currentIdx + 1)
        setAnswered(false)
      } else {
        await updateSessionStatus(sessionId, 'completed')
      }
    }, 400)
  }, [question, currentIdx, totalQuestions, submitAnswer, answered, syncIndex, session, sessionId, isMyTurn])

  const handlePrev = async () => {
    if (currentIdx > 0 && isMyTurn) {
      setAnswered(false)
      await syncIndex(currentIdx - 1)
    }
  }

  const handleNext = async () => {
    if (currentIdx < totalQuestions - 1 && isMyTurn) {
      setAnswered(false)
      await syncIndex(currentIdx + 1)
    }
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return
    await sendMessage(playerId, chatInput)
    setChatInput('')
  }

  const handleSendKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleLeaveSession = async () => {
    if (sessionId) {
      const channel = supabase.channel(`session:${sessionId}`)
      await channel.untrack()
    }
    localStorage.removeItem('aura_session_code')
    localStorage.removeItem('aura_session_id')
    localStorage.removeItem('aura_session_categories')
    localStorage.removeItem('aura_player_role')
    navigate('/')
  }

  if (questionsLoading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center">
        <Header />
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-on-surface-variant mt-4 text-sm">Loading questions...</p>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6">
        <Header />
        <p className="text-on-surface-variant text-sm">No questions available.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-primary text-sm font-medium underline">
          Go Home
        </button>
      </div>
    )
  }

  const questionText = getQuestionText(question, language)
  const CatIcon = CATEGORY_LUCIDE[question.category]

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <Header />

      {/* Partner Left Banner */}
      {partnerLeft && (
        <div className="bg-error-container/20 border-b border-error/20 px-4 py-3 flex items-center gap-3 shrink-0">
          <AlertTriangle className="w-5 h-5 text-error shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-on-error-container">Partner left the quiz</p>
            <p className="text-xs text-on-error-container/70">They disconnected from the session</p>
          </div>
          <button
            onClick={handleLeaveSession}
            className="text-xs font-semibold text-error px-3 py-1.5 rounded-lg bg-error/10 hover:bg-error/20 transition-colors shrink-0"
          >
            Leave
          </button>
        </div>
      )}

      <main className="flex-1 w-full max-w-md mx-auto flex flex-col px-4 sm:px-5 pt-3 pb-6 overflow-hidden">
        {/* Progress */}
        <div className="mb-4 shrink-0">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0 || !isMyTurn}
              className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs font-semibold">Back</span>
            </button>
            <span className="text-xs font-semibold text-on-surface-variant">
              {currentIdx + 1} / {totalQuestions}
            </span>
            <div className="flex items-center gap-1.5 bg-secondary-container/30 px-2.5 py-1 rounded-full">
              <CatIcon className="w-3.5 h-3.5 text-secondary" />
              <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                {CATEGORY_LABELS[question.category][language]}
              </span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 min-h-0 flex flex-col justify-center items-center py-4 my-2 text-center overflow-y-auto">
          <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 bg-surface-container-low rounded-full shrink-0">
            <Clock className="w-3.5 h-3.5 text-on-surface-variant" />
            <span className="text-[11px] font-medium text-on-surface-variant">
              {isMyTurn ? 'Your turn' : "Partner's turn"}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-on-surface leading-snug px-2 break-words w-full">
            {questionText}
          </h2>
        </div>

        {/* Answer Buttons */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 shrink-0">
          <button
            onClick={() => handleAnswer('disagree')}
            disabled={answered || !isMyTurn}
            className="flex flex-col items-center gap-2 py-4 sm:py-5 px-2 bg-surface border-2 border-outline-variant rounded-2xl hover:bg-error-container/15 hover:border-error/50 active:scale-[0.96] transition-all duration-200 disabled:opacity-50 min-h-[88px]"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-error-container/30 flex items-center justify-center">
              <X className="w-5 h-5 text-error" strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-on-surface">Disagree</span>
          </button>

          <button
            onClick={() => handleAnswer('neutral')}
            disabled={answered || !isMyTurn}
            className="flex flex-col items-center gap-2 py-4 sm:py-5 px-2 bg-surface border-2 border-outline-variant rounded-2xl hover:bg-surface-variant/50 hover:border-outline active:scale-[0.96] transition-all duration-200 disabled:opacity-50 min-h-[88px]"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-surface-container-high flex items-center justify-center">
              <Minus className="w-5 h-5 text-on-surface-variant" strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-on-surface">Neutral</span>
          </button>

          <button
            onClick={() => handleAnswer('agree')}
            disabled={answered || !isMyTurn}
            className="flex flex-col items-center gap-2 py-4 sm:py-5 px-2 bg-surface border-2 border-outline-variant rounded-2xl hover:bg-secondary-container/15 hover:border-secondary/50 active:scale-[0.96] transition-all duration-200 disabled:opacity-50 min-h-[88px]"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-secondary-container/40 flex items-center justify-center">
              <Check className="w-5 h-5 text-secondary" strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-on-surface">Agree</span>
          </button>
        </div>

        {/* Bottom actions */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => handleAnswer('skipped')}
            disabled={answered || !isMyTurn}
            className="flex-1 py-3 flex items-center justify-center gap-2 text-on-surface-variant hover:text-on-surface text-sm font-medium rounded-2xl hover:bg-surface-variant/30 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <SkipForward className="w-4 h-4" />
            Skip
          </button>
          <button
            onClick={handleNext}
            disabled={!isMyTurn}
            className="py-3 px-4 flex items-center justify-center gap-2 text-on-surface-variant hover:text-on-surface text-sm font-medium rounded-2xl hover:bg-surface-variant/30 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          {isOnline && (
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="py-3 px-4 flex items-center justify-center gap-2 text-on-surface-variant hover:text-on-surface text-sm font-medium rounded-2xl hover:bg-surface-variant/30 active:scale-[0.98] transition-all relative"
            >
              <MessageCircle className="w-4 h-4" />
              Chat
              {messages.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {messages.length > 9 ? '9+' : messages.length}
                </span>
              )}
            </button>
          )}
          <button
            onClick={handleLeaveSession}
            className="py-3 px-4 flex items-center justify-center gap-2 text-on-surface-variant hover:text-error text-sm font-medium rounded-2xl hover:bg-error-container/10 active:scale-[0.98] transition-all"
          >
            <X className="w-4 h-4" />
            Leave
          </button>
        </div>
      </main>

      {/* Chat Drawer */}
      {isOnline && chatOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-surface border-t border-surface-variant rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] max-h-[60vh] flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 border-b border-surface-variant">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-on-surface">Chat with Partner</span>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="w-8 h-8 rounded-full bg-surface-variant/50 flex items-center justify-center hover:bg-surface-variant transition-colors"
            >
              <X className="w-4 h-4 text-on-surface-variant" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3 min-h-[120px] max-h-[35vh]">
            {messages.length === 0 && (
              <p className="text-center text-xs text-on-surface-variant py-4">
                Send a message to your partner while you play...
              </p>
            )}
            {messages.map((msg) => {
              const isMe = msg.sender_id === playerId
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                      isMe
                        ? 'bg-primary text-on-primary rounded-br-md'
                        : 'bg-surface-container-high text-on-surface rounded-bl-md'
                    }`}
                  >
                    <p className="break-words">{msg.text}</p>
                    <p className={`text-[9px] mt-1 ${isMe ? 'text-on-primary/60' : 'text-on-surface-variant/60'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={chatEndRef} />
          </div>

          <div className="px-4 py-3 border-t border-surface-variant flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleSendKey}
              placeholder="Type a message..."
              maxLength={500}
              className="flex-1 bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={handleSendMessage}
              disabled={!chatInput.trim()}
              className="w-10 h-10 bg-primary text-on-primary rounded-xl flex items-center justify-center shrink-0 hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
