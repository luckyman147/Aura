# Couple Compatibility Quiz — Design Doc

**Date:** 2026-08-05  
**Status:** Draft  
**Author:** YC Office Hours Session

---

## Thesis

Build a couples compatibility quiz app that spreads through QR code sessions. One partner opens the app, shares a QR code, both scan, and questions begin. Each partner answers independently — agree, neutral, or disagree. Compare results. See where you align and where you don't. Trilingual from day one: Arabic, French, English.

---

## Product Principles

1. **QR code is the product.** The magic moment is two phones, one QR code, questions appearing. Everything else is scaffolding.
2. **Depth over virality (but virality still matters).** Go deeper than Instagram quizzes. But if the results aren't shareable, nobody sees the depth.
3. **Trilingual is not a feature — it's the foundation.** Arabic, French, English. Not "we'll add languages later." The content architecture must support RTL, LTR, and mixed from the first line of code.
4. **Both new and long-term couples.** Same app, different question sets. New couples get fun/light. Long-term couples get deep/meaningful. The app detects and adapts.
5. **Two ways to play.** Online (async) — answer when you want, no pressure. Realtime — both online, answer together, see reactions live. User chooses.

---

## Core Flow

### Two Play Modes

| Mode | How It Works | When to Use |
|------|--------------|-------------|
| **Online (Async)** | One partner answers, other answers later. No need to be online together. | Different time zones, busy schedules, low pressure |
| **Realtime** | Both online, answer simultaneously, see reactions live. | Date night, fun together, immediate feedback |

User selects mode when creating session. QR code works for both.

### Session Lifecycle — Online (Async)

```
┌─────────────────────────────────────────────────────────┐
│  PARTNER A opens app                                    │
│  → Selects language (AR/FR/EN)                          │
│  → Selects mode: ONLINE                                 │
│  → Taps "Start Session"                                 │
│  → App generates unique QR code                         │
│  → QR code displayed on screen                          │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  PARTNER B scans QR code                                │
│  → Joins the session                                    │
│  → Session starts in ASYNC mode                         │
│  → Partner B sees: "Answer when you're ready!"          │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  QUESTION FLOW (ASYNC)                                  │
│                                                         │
│  Question 1 appears on Partner A's phone                │
│  Partner A answers: Agree / Neutral / Disagree          │
│  → Partner A sees: "Waiting for [Partner B]..."         │
│                                                         │
│  ...later...                                            │
│                                                         │
│  Question 1 appears on Partner B's phone                │
│  Partner B answers: Agree / Neutral / Disagree          │
│  → Both see: "You both said [X]!" or "Mismatch!"       │
│  → Next question appears                                │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  SESSION COMPLETE                                       │
│  → Compatibility score: 73%                             │
│  → Breakdown by category                                │
│  → Shareable result card                                │
└─────────────────────────────────────────────────────────┘
```

### Session Lifecycle — Realtime

```
┌─────────────────────────────────────────────────────────┐
│  PARTNER A opens app                                    │
│  → Selects language (AR/FR/EN)                          │
│  → Selects mode: REALTIME                               │
│  → Taps "Start Session"                                 │
│  → App generates unique QR code                         │
│  → QR code displayed on screen                          │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  PARTNER B scans QR code                                │
│  → Joins the session                                    │
│  → Both see: "You're connected! Starting in 3..."       │
│  → Countdown begins                                     │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  QUESTION FLOW (REALTIME)                               │
│                                                         │
│  Question appears on BOTH phones simultaneously         │
│  Both answer at the same time                           │
│  → Lock in answers (30 sec timer optional)              │
│  → Both see: "You both said [X]!" or "Mismatch!"       │
│  → Next question appears                                │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  SESSION COMPLETE                                       │
│  → Compatibility score: 73%                             │
│  → Breakdown by category                                │
│  → Shareable result card                                │
└─────────────────────────────────────────────────────────┘
```

### Mode Selection

```
┌─────────────────────────────────────┐
│  How do you want to play?           │
│                                     │
│  ┌─────────────┐ ┌─────────────┐   │
│  │  ONLINE     │ │  REALTIME   │   │
│  │  ▶          │ │  ▶▶         │   │
│  │  Answer     │ │  Answer     │   │
│  │  anytime    │ │  together   │   │
│  │             │ │  now        │   │
│  └─────────────┘ └─────────────┘   │
│                                     │
│  No rush, answer when ready.        │  See each other's answers live.
└─────────────────────────────────────┘
```

### QR Code Mechanics

- **Code format:** Short URL + session ID (e.g., `quiz.app/s/abc123`)
- **QR contains:** Session URL only. No embedded data.
- **Fallback:** Manual code entry if camera fails
- **Session TTL:** 10 minutes to scan, otherwise expires
- **Reconnection:** If one partner drops, re-scan same QR

---

## Content Architecture

### Sections → Subjects → Questions

```
SECTION: Daily Life
├── Subject: Morning Routines
│   ├── Q1: "I need alone time before starting the day"
│   ├── Q2: "Breakfast should be eaten together"
│   └── Q3: "Phone checking first thing in the morning is fine"
├── Subject: Chores & Responsibilities
│   ├── Q1: "Housework should be split 50/50"
│   ├── Q2: "I don't mind doing dishes every night"
│   └── Q3: "Hiring help is better than arguing about chores"
├── Subject: Food & Cooking
...

SECTION: Communication
├── Subject: Conflict Resolution
│   ├── Q1: "I need to talk about problems immediately"
│   ├── Q2: "Silence during an argument is okay"
│   └── Q3: "Saying sorry first shows strength, not weakness"
├── Subject: Emotional Expression
...

SECTION: Finances
├── Subject: Spending Habits
├── Subject: Saving Goals
├── Subject: Financial Transparency
...

SECTION: Family & Future
├── Subject: Children
├── Subject: In-Laws
├── Subject: Career vs Family
...

SECTION: Intimacy & Romance
├── Subject: Physical Affection
├── Subject: Quality Time
├── Subject: Love Languages
...

SECTION: Values & Beliefs
├── Subject: Religion & Spirituality
├── Subject: Social Views
├── Subject: Life Goals
...
```

### Question Tone Spectrum

| Couple Type | Tone | Example |
|-------------|------|---------|
| New (0-6 months) | Playful, fun | "Pineapple on pizza: agree or disagree?" |
| New (6-18 months) | Getting serious | "I expect a goodnight text every night" |
| Long-term (1-3 years) | Honest, real | "I sometimes feel we're roommates, not partners" |
| Long-term (3+ years) | Deep, vulnerable | "I fear we've stopped growing together" |

**Adaptive question selection:** App asks "How long have you been together?" and serves appropriate question depth.

---

## Scoring Logic

### Per-Question

| Match Type | Points |
|------------|--------|
| Both Agree | +10 alignment |
| Both Disagree | +10 alignment |
| Both Neutral | +5 alignment |
| One Agree, One Disagree | -5 alignment |
| Any + Neutral (mixed) | 0 (neutral) |

### Category Score

```
Category Score = (sum of question scores / max possible) × 100
```

### Overall Score

```
Overall Score = average of all category scores
```

### Result Tiers

| Score | Tier | Result Card Text |
|-------|------|------------------|
| 90-100% | Perfect Match | "You two are on the same wavelength" |
| 75-89% | Strong Match | "Strong foundation with room to grow" |
| 60-74% | Good Match | "You complement each other beautifully" |
| 40-59% | Mixed | "Different perspectives, same love" |
| 0-39% | Challenging | "Time to talk — and that's okay" |

### Mismatch Highlights

After session, show:
- **Biggest alignment:** Category where you scored highest
- **Biggest gap:** Category where you scored lowest
- **Surprise moment:** Question where you expected match but got mismatch
- **Connection point:** Question where you both said the same thing unexpectedly

---

## Multi-Language Architecture

### Language Selection

- First screen: language picker (3 flags + names)
- AR: العربية (RTL)
- FR: Français (LTR)
- EN: English (LTR)

### Content Translation Rules

1. **Questions are translated, not transliterated.** Each language has native phrasing, not machine translation.
2. **Cultural adaptation.** "In-laws" concept differs in Arab vs French vs English contexts. Questions must resonate culturally.
3. **RTL layout.** Arabic mode: full RTL. Numbers and English words remain LTR within RTL flow.
4. **Result cards.** Generated in the session language. Shareable image respects the language.

### Content Structure

```json
{
  "questionId": "daily-morning-01",
  "content": {
    "en": "I need alone time before starting the day",
    "fr": "J'ai besoin de temps seul avant de commencer la journée",
    "ar": "أحتاج وقتا وحدي قبل أن أبدأ اليوم"
  },
  "subjectId": "morning-routines",
  "sectionId": "daily-life",
  "depth": "light|medium|deep"
}
```

---

## Tech Architecture (Confirmed Stack)

### Frontend

- **React (Vite)** — SPA, fast dev server, simple setup
- **React Router** — client-side routing
- **Tailwind CSS** — for the result card design
- **QR code library** — `qrcode.react` for generation, native camera API for scanning
- **i18n** — `react-i18next` for AR/FR/EN with RTL support

### Backend

- **Supabase** — real-time sync, auth, database, edge functions (replaces API routes)
- **Database** — questions, sessions, results (PostgreSQL via Supabase)
- **Edge Functions** — session creation, QR generation, scoring (Supabase Edge Functions)

### Realtime

- **Supabase Realtime** — both partners see questions simultaneously via WebSocket subscriptions

### Hosting

- **Netlify** — React SPA deployment
- **Supabase** — database, auth, realtime, edge functions

### DevSecOps

- **CI/CD:** GitHub Actions → Netlify (auto-deploy on push to main)
- **Security scanning:** `npm audit`, `snyk` for dependency vulnerabilities
- **Secrets:** Netlify environment variables (never in code)
- **Headers:** CSP, HSTS, X-Frame-Options via `netlify.toml`
- **Rate limiting:** Supabase Edge Functions to prevent session abuse
- **Input validation:** Zod schemas on all edge functions
- **QR session TTL:** 10 min expiry, server-side cleanup
- **Database RLS:** Supabase Row Level Security — partners can only read their own session
- **Lighthouse CI:** Performance + accessibility checks on every PR

### Decisions Locked

- Platform: **React (Vite)** ✅
- Question authoring: **Curated (you write all)** ✅
- Monetization: **Free now, monetize later** ✅

---

## MVP Scope (Week 1)

### Must Have

- [ ] Language selector (AR/FR/EN)
- [ ] Start session → QR code
- [ ] Join session via QR scan
- [ ] 10 questions (1 section, 2 subjects)
- [ ] Agree / Neutral / Disagree flow
- [ ] Real-time sync between partners
- [ ] Compatibility score
- [ ] Shareable result card (screenshot-able)

### Nice to Have

- [ ] Multiple sections
- [ ] Adaptive depth based on relationship length
- [ ] Session history
- [ ] Custom question creation

### Out of Scope (for now)

- [ ] User accounts / profiles
- [ ] Payment / monetization
- [ ] Push notifications
- [ ] Relationship coaching integration

---

## Question Research — Web Scraping Strategy

Before writing questions, scrape existing sources to find what resonates.

### Sources to Scrape

| Source | Type | What to Extract |
|--------|------|-----------------|
| **Reddit** r/relationships, r/marriage, r/dating_advice | Forum posts | Top-voted questions couples argue about |
| **BuzzFeed Quizzes** | Quiz content | Question phrasing, answer options |
| **The Gottman Institute** | Research articles | Evidence-based relationship questions |
| **Love Is Bigger Than The Fight** (book excerpts) | Written content | Deep vulnerability questions |
| **Arabic relationship forums** (علاقة, حب) | Forum posts | Culturally relevant Arabic questions |
| **French relationship blogs** (commentfabriquermasentimentale) | Blog content | French-native phrasing |
| **Instagram #couplesquiz** | Captions/comments | What couples actually ask each other |
| **TikTok couple challenges** | Video comments | Viral question formats |
| **Attachment style quizzes** | Psychology content | Deep compatibility questions |
| **Pre-marriage counseling questionnaires** | Clinical content | Therapist-approved questions |

### Scraping Flow

```
1. Scrape Reddit (top 100 posts per subreddit)
   → Extract questions, upvotes, comment sentiment

2. Scrape quiz sites (BuzzFeed, Playbuzz)
   → Extract question text, answer options, share counts

3. Scrape psychology sources (Gottman, attachment theory)
   → Extract evidence-based questions, categorize by topic

4. Scrape Arabic/French sources
   → Translate and adapt, not literal translate

5. Deduplicate + categorize
   → Group by section/subject, remove duplicates

6. Score questions
   → Rate: clarity (1-5), emotional impact (1-5), cultural fit (1-5)

7. Final selection
   → Top 10 questions per subject, balanced across languages
```

### Scraping Tools

- **Playwright** — headless browser for dynamic sites (Reddit, Instagram)
- **Cheerio** — fast HTML parsing for static sites
- **Google Sheets** — output destination for question bank
- **Manual review** — you curate the final list, AI doesn't decide

### Output Format

```json
{
  "source": "reddit/relationships",
  "question": "What's the one thing your partner does that makes you feel loved?",
  "category": "communication",
  "subject": "love-languages",
  "depth": "deep",
  "upvotes": 2341,
  "sentiment": "positive",
  "languages": {
    "en": "What's the one thing your partner does that makes you feel loved?",
    "fr": "Quelle est la chose que votre partenaire fait qui vous fait sentir aimé?",
    "ar": "ما هو الشيء الوحيد الذي يفعله شريكك يجعلك تشعر أنك محبوب؟"
  }
}
```

---

## Open Questions

1. **QR code scanning:** Native camera or in-app scanner?
2. **Offline support:** What happens if connection drops mid-session?
3. **Result sharing:** Image only, or also a unique URL?
4. **Question ownership:** Who writes the questions? Curated list or user-generated?
5. **Moderation:** How do you prevent offensive questions if user-generated?

---

## Success Metrics

| Metric | Target | Why |
|--------|--------|-----|
| QR scan → session start | >70% | QR flow works |
| Session completion | >80% | Questions are engaging |
| Result card share rate | >40% | Viral loop works |
| Return rate (7-day) | >20% | Retention exists |
| Language distribution | 33/33/33 | All markets reached |

---

## Next Steps

1. Decide: Web app (Next.js) or mobile (React Native)?
2. Write first 10 questions in all 3 languages
3. Build QR pairing mechanic
4. Build question flow with real-time sync
5. Build result card generator
6. Test with 5 real couples
7. Iterate on question quality based on feedback
