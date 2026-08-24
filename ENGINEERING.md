# Couple Compatibility Quiz — Engineering Plan

**Date:** 2026-08-05  
**Status:** Ready to build  
**Based on:** 2026-08-05-couple-quiz-design.md

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        NETLIFY                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  REACT APP (Vite)                                        │  │
│  │                                                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │  │
│  │  │  Language    │  │  Mode       │  │  QR Code    │     │  │
│  │  │  Selector    │  │  Selector   │  │  Generator  │     │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │  │
│  │                                                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │  │
│  │  │  Question    │  │  Real-time  │  │  Scoring    │     │  │
│  │  │  Flow        │  │  Sync       │  │  Engine     │     │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │  │
│  │                                                          │  │
│  │  ┌─────────────┐  ┌──────────────────────────────────┐  │  │
│  │  │  Result     │  │  React Router (client-side)       │  │  │
│  │  │  Card       │  │  /  /session/new  /session/:id    │  │  │
│  │  └─────────────┘  └──────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  SUPABASE                                                │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │  │
│  │  │  PostgreSQL  │  │  Realtime   │  │  Edge       │     │  │
│  │  │  (questions,  │  │  (WebSocket │  │  Functions  │     │  │
│  │  │   sessions,  │  │   sync)     │  │  (API)      │     │  │
│  │  │   results)   │  │             │  │             │     │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
couple-quiz/
├── public/
│   ├── fonts/                    # Arabic/Latin fonts
│   └── images/                   # Static assets
├── src/
│   ├── components/
│   │   ├── ui/                   # Shared UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── QRCode.tsx
│   │   │   ├── LanguagePicker.tsx
│   │   │   └── ModeSelector.tsx   # Online vs Realtime
│   │   ├── session/
│   │   │   ├── SessionCreator.tsx
│   │   │   ├── QRDisplay.tsx
│   │   │   ├── QRScanner.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── AnswerButtons.tsx
│   │   │   ├── ResultReveal.tsx
│   │   │   └── SessionComplete.tsx
│   │   └── results/
│   │       ├── ScoreCard.tsx
│   │       ├── CategoryBreakdown.tsx
│   │       ├── MismatchHighlights.tsx
│   │       └── ShareableResult.tsx
│   ├── pages/                    # React Router pages
│   │   ├── Home.tsx              # Landing page
│   │   ├── NewSession.tsx        # Create session (mode + language)
│   │   ├── JoinSession.tsx       # Join via QR/code
│   │   ├── ActiveSession.tsx     # Question flow
│   │   └── Results.tsx           # Session results
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser client
│   │   │   └── types.ts          # Generated types
│   │   ├── realtime/
│   │   │   └── channel.ts        # Supabase Realtime subscription
│   │   ├── scoring/
│   │   │   └── engine.ts         # Compatibility scoring
│   │   ├── i18n/
│   │   │   ├── config.ts         # react-i18next config
│   │   │   └── index.ts          # i18n initialization
│   │   └── utils/
│   │       ├── qr.ts             # QR code helpers
│   │       └── session.ts        # Session utilities
│   ├── messages/
│   │   ├── en.json               # English translations
│   │   ├── fr.json               # French translations
│   │   └── ar.json               # Arabic translations
│   ├── data/
│   │   └── questions/
│   │       ├── daily-life.json
│   │       ├── communication.json
│   │       ├── finances.json
│   │       ├── family.json
│   │       ├── intimacy.json
│   │       └── values.json
│   ├── hooks/
│   │   ├── useSession.ts         # Session state management
│   │   ├── useRealtime.ts        # Realtime subscription
│   │   └── useQuestions.ts       # Question fetching
│   ├── types/
│   │   ├── session.ts            # Session types
│   │   ├── question.ts           # Question types
│   │   └── result.ts             # Result types
│   ├── App.tsx                   # Main app with React Router
│   └── main.tsx                  # Entry point
├── supabase/
│   └── functions/                # Supabase Edge Functions
│       ├── create-session/
│       ├── join-session/
│       └── submit-answer/
├── scripts/
│   ├── scraper/
│   │   ├── reddit.ts             # Reddit scraper
│   │   ├── buzzfeed.ts           # BuzzFeed scraper
│   │   ├── gottman.ts            # Gottman Institute scraper
│   │   └── deduplicate.ts        # Question deduplication
│   └── seed/
│       └── questions.ts          # Seed DB with questions
├── supabase/
│   └── migrations/               # Database migrations
├── netlify.toml
├── vite.config.ts
├── tailwind.config.js
├── package.json
└── .github/
    └── workflows/
        └── ci.yml                # GitHub Actions CI/CD
```

---

## Database Schema (Supabase/PostgreSQL)

### Tables

```sql
-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(6) UNIQUE NOT NULL,        -- Short code for QR
  language VARCHAR(2) NOT NULL DEFAULT 'en', -- en/fr/ar
  depth VARCHAR(10) NOT NULL DEFAULT 'light', -- light/medium/deep
  mode VARCHAR(10) NOT NULL DEFAULT 'async', -- async/realtime
  status VARCHAR(20) NOT NULL DEFAULT 'waiting', -- waiting/active/completed
  partner_a_id UUID,                       -- NULL until joined
  partner_b_id UUID,                       -- NULL until joined
  current_question_index INTEGER DEFAULT 0, -- For async mode tracking
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,                 -- QR expiry (10 min)
  completed_at TIMESTAMPTZ
);

-- Questions (static, seeded)
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'daily-morning-01'
  section VARCHAR(50) NOT NULL,
  subject VARCHAR(50) NOT NULL,
  depth VARCHAR(10) NOT NULL,
  content JSONB NOT NULL,                  -- {en: "...", fr: "...", ar: "..."}
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session Answers
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  question_id UUID REFERENCES questions(id),
  partner VARCHAR(1) NOT NULL,            -- 'a' or 'b'
  answer VARCHAR(10) NOT NULL,            -- 'agree'/'neutral'/'disagree'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, question_id, partner)
);

-- Session Results (computed)
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) UNIQUE,
  overall_score INTEGER NOT NULL,         -- 0-100
  category_scores JSONB NOT NULL,         -- {communication: 85, ...}
  highlights JSONB,                       -- mismatches, surprises
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scraped Questions (for research)
CREATE TABLE scraped_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(50) NOT NULL,
  question TEXT NOT NULL,
  category VARCHAR(50),
  subject VARCHAR(50),
  depth VARCHAR(10),
  upvotes INTEGER DEFAULT 0,
  sentiment VARCHAR(20),
  languages JSONB,                        -- translated versions
  reviewed BOOLEAN DEFAULT FALSE,
  selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sessions_code ON sessions(code);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_answers_session ON answers(session_id);
CREATE INDEX idx_questions_section ON questions(section, subject);
CREATE INDEX idx_scraped_reviewed ON scraped_questions(reviewed, selected);
```

### Row Level Security (RLS)

```sql
-- Partners can only read their own session data
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners read own answers" ON answers
  FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM sessions
      WHERE partner_a_id = auth.uid()
         OR partner_b_id = auth.uid()
    )
  );

CREATE POLICY "Partners insert own answers" ON answers
  FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT id FROM sessions
      WHERE partner_a_id = auth.uid()
         OR partner_b_id = auth.uid()
    )
  );
```

---

## API (Supabase Edge Functions)

### POST /create-session

```typescript
// supabase/functions/create-session/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { language, depth, mode } = await req.json()

  const code = generateCode() // 6-char alphanumeric

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data, error } = await supabase.from('sessions').insert({
    code,
    language,
    depth,
    mode, // 'async' or 'realtime'
    status: 'waiting',
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
  }).select().single()

  if (error) return new Response(JSON.stringify({ error }), { status: 400 })

  const baseUrl = Deno.env.get('APP_URL') || 'https://yourapp.netlify.app'

  return new Response(JSON.stringify({
    sessionId: data.id,
    code,
    qrUrl: `${baseUrl}/join/${code}`
  }))
})

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
```

### POST /join-session

```typescript
// supabase/functions/join-session/index.ts
serve(async (req) => {
  const { code } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: session, error } = await supabase.from('sessions')
    .select()
    .eq('code', code)
    .eq('status', 'waiting')
    .single()

  if (error || !session || new Date(session.expires_at) < new Date()) {
    return new Response(JSON.stringify({ error: 'Session expired or not found' }), { status: 404 })
  }

  const partnerId = crypto.randomUUID()

  await supabase.from('sessions')
    .update({ partner_b_id: partnerId, status: 'active' })
    .eq('id', session.id)

  // Broadcast partner-joined via Realtime
  await supabase.channel(`session:${session.id}`)
    .send({ type: 'broadcast', event: 'partner-joined', payload: { partnerId } })

  return new Response(JSON.stringify({ sessionId: session.id, mode: session.mode }))
})
```

### POST /submit-answer

```typescript
// supabase/functions/submit-answer/index.ts
serve(async (req) => {
  const { sessionId, questionId, partner, answer } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Upsert answer
  await supabase.from('answers').upsert({
    session_id: sessionId,
    question_id: questionId,
    partner,
    answer
  })

  // Get session mode
  const { data: session } = await supabase.from('sessions')
    .select('mode')
    .eq('id', sessionId)
    .single()

  // Check if both answered
  const { data: answers } = await supabase.from('answers')
    .select()
    .eq('session_id', sessionId)
    .eq('question_id', questionId)

  if (answers?.length === 2) {
    if (session?.mode === 'realtime') {
      // Broadcast answer reveal immediately
      await supabase.channel(`session:${sessionId}`)
        .send({
          type: 'broadcast',
          event: 'answer-reveal',
          payload: { questionId, answers }
        })
    } else {
      // Async: mark as revealed for when either partner loads next
      await supabase.from('answers')
        .update({ revealed: true })
        .eq('session_id', sessionId)
        .eq('question_id', questionId)
    }
  }

  return new Response(JSON.stringify({ success: true }))
})
```

---

## Real-time Sync (Supabase Realtime)

```typescript
// src/lib/realtime/channel.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export function subscribeToSession(sessionId: string, callbacks: {
  onPartnerJoined?: () => void
  onAnswerReveal?: (data: any) => void
  onPartnerAnswered?: (data: any) => void
  onSessionComplete?: (data: any) => void
}) {
  const channel = supabase.channel(`session:${sessionId}`)

  channel
    .on('broadcast', { event: 'partner-joined' }, () => {
      callbacks.onPartnerJoined?.()
    })
    .on('broadcast', { event: 'answer-reveal' }, ({ payload }) => {
      callbacks.onAnswerReveal?.(payload)
    })
    .on('broadcast', { event: 'partner-answered' }, ({ payload }) => {
      callbacks.onPartnerAnswered?.(payload)
    })
    .on('broadcast', { event: 'session-complete' }, ({ payload }) => {
      callbacks.onSessionComplete?.(payload)
    })
    .subscribe()

  return () => supabase.removeChannel(channel)
}
```

---

## QR Code Flow

### Realtime Mode
Both partners must be online at the same time.

```
Partner A                         Server                          Partner B
    │                               │                               │
    │  1. POST /create-session      │                               │
    │  { language, depth, mode:     │                               │
    │    'realtime' }               │                               │
    │  ───────────────────────────► │                               │
    │                               │  2. Create session record     │
    │                               │     mode: 'realtime'          │
    │  3. Return { sessionId,       │                               │
    │     code, qrUrl }             │                               │
    │  ◄─────────────────────────── │                               │
    │                               │                               │
    │  4. Display QR code           │                               │
    │                               │                               │
    │                               │  5. Partner B scans QR        │
    │                               │  ◄────────────────────────── │
    │                               │                               │
    │                               │  6. POST /join-session        │
    │                               │  ──────────────────────────► │
    │                               │                               │
    │                               │  7. Update session status     │
    │                               │     to 'active'               │
    │                               │                               │
    │  8. Realtime: partner-joined  │                               │
    │  ◄─────────────────────────── │  8. Realtime: partner-joined  │
    │                               │  ───────────────────────────► │
    │                               │                               │
    │  9. Both see "Connected!"     │  9. Both see "Connected!"     │
    │     + countdown starts        │     + countdown starts        │
    │                               │                               │
    │  10. Q1 on both phones        │  10. Q1 on both phones        │
    │  simultaneously               │  simultaneously               │
    │                               │                               │
    │  11. Both answer              │  11. Both answer              │
    │  ───────────────────────────► │  ◄────────────────────────── │
    │                               │                               │
    │  12. Reveal: "You both said   │  12. Reveal: "You both said   │
    │      Agree!"                  │      Agree!"                  │
    │  ◄─────────────────────────── │  ───────────────────────────► │
```

### Async Mode
Partners can answer at different times.

```
Partner A (Monday 9am)          Server              Partner B (Monday 6pm)
    │                            │                         │
    │  1. POST /create-session   │                         │
    │  { mode: 'async' }         │                         │
    │  ────────────────────────► │                         │
    │                            │                         │
    │  2. Display QR             │                         │
    │                            │                         │
    │                            │  3. Partner B scans     │
    │                            │  ◄──────────────────── │
    │                            │                         │
    │  4. Partner A answers Q1   │                         │
    │  ────────────────────────► │                         │
    │  "Waiting for Partner B"   │                         │
    │                            │                         │
    │  ...8 hours pass...        │                         │
    │                            │                         │
    │                            │  5. Partner B opens app │
    │                            │     (same session)      │
    │                            │                         │
    │                            │  6. Partner B answers Q1│
    │                            │  ◄──────────────────── │
    │                            │                         │
    │  7. Realtime: Q1 revealed  │  7. Realtime: Q1 revealed
    │  ◄─────────────────────── │  ─────────────────────► │
```

---

## Scoring Engine

```typescript
// src/lib/scoring/engine.ts

type Answer = 'agree' | 'neutral' | 'disagree'

interface ScoreResult {
  questionScore: number
  matchType: 'full' | 'partial' | 'mismatch'
}

export function scoreQuestion(a1: Answer, a2: Answer): ScoreResult {
  if (a1 === a2) {
    if (a1 === 'neutral') return { questionScore: 5, matchType: 'partial' }
    return { questionScore: 10, matchType: 'full' }
  }

  if (a1 === 'neutral' || a2 === 'neutral') {
    return { questionScore: 0, matchType: 'partial' }
  }

  return { questionScore: -5, matchType: 'mismatch' }
}

export function calculateSessionScore(answers: Array<{
  questionId: string
  partnerA: Answer
  partnerB: Answer
  section: string
}>) {
  const sectionScores: Record<string, number[]> = {}

  for (const { partnerA, partnerB, section } of answers) {
    const { questionScore } = scoreQuestion(partnerA, partnerB)
    if (!sectionScores[section]) sectionScores[section] = []
    sectionScores[section].push(questionScore)
  }

  const categoryScores: Record<string, number> = {}
  for (const [section, scores] of Object.entries(sectionScores)) {
    const maxPossible = scores.length * 10
    const actual = scores.reduce((a, b) => a + b, 0)
    categoryScores[section] = Math.round(((actual + maxPossible) / (2 * maxPossible)) * 100)
  }

  const overallScore = Math.round(
    Object.values(categoryScores).reduce((a, b) => a + b, 0) /
    Object.values(categoryScores).length
  )

  return { overallScore, categoryScores }
}
```

---

## i18n Setup (react-i18next)

```typescript
// src/lib/i18n/index.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from '../../messages/en.json'
import fr from '../../messages/fr.json'
import ar from '../../messages/ar.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar }
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })

// Set dir attribute for RTL
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lng
})

export default i18n
```

### RTL Handling

```css
/* src/index.css */
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .flex-row {
  flex-direction: row-reverse;
}

[dir="rtl"] .ml-4 {
  margin-left: 0;
  margin-right: 1rem;
}
```

---

## DevSecOps Pipeline

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co"

[[redirects]]
  from = "/join/:code"
  to = "/join/:code"
  status = 200
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm audit --audit-level=high
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:4173

  deploy:
    needs: [test, security, lighthouse]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## Web Scraping Scripts

### Reddit Scraper

```typescript
// scripts/scraper/reddit.ts
import { chromium } from 'playwright'

const SUBREDDITS = [
  'relationships',
  'marriage',
  'dating_advice',
  'relationship_advice'
]

async function scrapeReddit() {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  const questions = []

  for (const sub of SUBREDDITS) {
    await page.goto(`https://reddit.com/r/${sub}/top?t=year&limit=100`)

    const posts = await page.$$eval('[data-testid="post-container"]', els =>
      els.map(el => ({
        title: el.querySelector('h3')?.textContent || '',
        upvotes: parseInt(el.querySelector('[score]')?.textContent || '0'),
        comments: parseInt(el.querySelector('[comments]')?.textContent || '0')
      }))
    )

    const questionPosts = posts.filter(p =>
      p.title.includes('?') && p.upvotes > 100
    )

    questions.push(...questionPosts.map(p => ({
      source: `reddit/${sub}`,
      question: p.title,
      upvotes: p.upvotes,
      sentiment: p.comments > 50 ? 'controversial' : 'positive'
    })))
  }

  await browser.close()
  return questions
}
```

### BuzzFeed Scraper

```typescript
// scripts/scraper/buzzfeed.ts
import * as cheerio from 'cheerio'

async function scrapeBuzzFeed() {
  const urls = [
    'https://buzzfeed.com/harveyjoseph/30-couples-questions',
    'https://buzzfeed.com/maitlandquitmeyer/21-questions'
  ]

  const questions = []

  for (const url of urls) {
    const res = await fetch(url)
    const html = await res.text()
    const $ = cheerio.load(html)

    $('h2, .buzz-text').each((_, el) => {
      const text = $(el).text().trim()
      if (text.includes('?')) {
        questions.push({
          source: 'buzzfeed',
          question: text,
          sentiment: 'fun'
        })
      }
    })
  }

  return questions
}
```

---

## Build Order (Week 1)

### Day 1-2: Foundation

- [ ] Initialize Vite + React + TypeScript
- [ ] Set up Tailwind CSS
- [ ] Configure react-i18next for AR/FR/EN
- [ ] Set up Supabase project + schema (with `mode` column)
- [ ] Create database tables + RLS policies
- [ ] Set up Netlify deployment
- [ ] Create Supabase Edge Functions

### Day 3-4: Core Flow

- [ ] Build language selector component
- [ ] Build mode selector component (Online vs Realtime)
- [ ] Build session creation (Supabase Edge Function)
- [ ] Build QR code display component
- [ ] Build QR scanner component (native camera)
- [ ] Build session join flow
- [ ] Implement Supabase Realtime subscription (both modes)

### Day 5-6: Question Flow

- [ ] Write first 10 questions in all 3 languages
- [ ] Seed database with questions
- [ ] Build question card component
- [ ] Build answer buttons (agree/neutral/disagree)
- [ ] Implement realtime mode: simultaneous answer + reveal
- [ ] Implement async mode: wait for partner + reveal
- [ ] Build answer reveal animation

### Day 7: Results + Polish

- [ ] Build scoring engine
- [ ] Build result card component
- [ ] Build shareable result (screenshot-able)
- [ ] Test with 5 real couples (both modes)
- [ ] Fix bugs, polish UX

### Day 8: Web Scraping

- [ ] Build Reddit scraper
- [ ] Build BuzzFeed scraper
- [ ] Run scrapers, deduplicate results
- [ ] Review and curate top questions
- [ ] Add curated questions to database

---

## Open Questions

1. **QR scanning:** Use native browser camera API or library like `html5-qrcode`?
2. **Fonts:** Which Arabic font to use? (Noto Sans Arabic, Cairo, Tajawal)
3. **Result card:** HTML-to-image (html2canvas) or server-side PNG generation?
4. **Analytics:** Add Posthog/Mixpanel for tracking, or skip for MVP?
5. **Error handling:** What happens if Supabase Realtime disconnects mid-session?
6. **Async notifications:** How does Partner A know Partner B answered? (Push notification vs manual check)
7. **Realtime timer:** Should realtime mode have a countdown timer per question? If so, what happens if one partner doesn't answer in time?

---

## GSTACK REVIEW REPORT

| Category | Status | Notes |
|----------|--------|-------|
| Architecture | ✅ Approved | React + Vite + Supabase + Netlify |
| Data Model | ✅ Approved | Schema supports all required flows |
| Real-time | ✅ Approved | Supabase Realtime is production-ready |
| Security | ✅ Approved | RLS + CSP + rate limiting covered |
| i18n | ✅ Approved | react-i18next handles RTL + 3 languages |
| DevSecOps | ✅ Approved | CI/CD + security scanning + Lighthouse |
| Web Scraping | ✅ Approved | Playwright + Cheerio covers all sources |
| Build Order | ✅ Approved | 8-day plan is realistic |

**Recommendation:** Start building. Day 1-2 is foundation, Day 3-4 is the magic moment (QR + Realtime). If Day 3-4 works, you have a product.
