# Design Prototype Prompt

Use this prompt with AI design tools (v0.dev, Galileo AI, Figma AI, or Claude) to generate UI prototypes.

---

## Prompt

```
Design a mobile-first web app for a couples compatibility quiz. The app has 5 screens:

### Screen 1: Landing Page
- Clean, minimal design with romantic but modern aesthetic
- App logo/name centered
- Two buttons: "Start Session" (primary) and "Join Session" (secondary)
- Language selector in top-right corner (flags: EN/FR/AR)
- Background: soft gradient (warm tones — peach to lavender)
- Font: modern sans-serif, readable

### Screen 2: New Session Setup
- Title: "How do you want to play?"
- Two large cards side by side:
  - Card 1: "Online" — icon of clock, subtitle "Answer anytime, no rush"
  - Card 2: "Realtime" — icon of lightning, subtitle "Answer together, now"
- Below: Language selector (3 flags)
- "Create Session" button at bottom
- Clean white background with subtle shadow on cards

### Screen 3: QR Code Display
- Large QR code centered on screen
- Session code displayed below QR (e.g., "ABC123")
- Timer showing "Expires in 8:32"
- "Share Link" button
- Status indicator: "Waiting for partner..."
- Soft pulsing animation on QR code

### Screen 4: Question Flow
- Question number/total at top (e.g., "3/10")
- Progress bar below
- Question text centered, large readable font
- Three answer buttons in a row:
  - Green checkmark "Agree"
  - Gray minus "Neutral"
  - Red X "Disagree"
- Status text: "Your turn" or "Waiting for [Partner]..."
- Category label (e.g., "Communication")
- Minimal, focused design — no distractions

### Screen 5: Results
- Compatibility score large and centered (e.g., "73%")
- Score tier label (e.g., "Strong Match")
- Breakdown by category (horizontal bar chart)
- Highlight section: "Biggest alignment" and "Biggest gap"
- Share button: "Share Result"
- "Play Again" button
- Celebration animation on high scores

### Design System
- Colors: Warm palette (coral #FF6B6B, lavender #C9B1FF, soft white #FAFAFA)
- Font: Inter or Poppins
- Border radius: 16px for cards, 12px for buttons
- Shadows: Soft, subtle (0 4px 20px rgba(0,0,0,0.08))
- RTL support: Layout should mirror for Arabic
- Mobile-first: 375px base, responsive up to 768px
```

---

## Usage

1. Copy the prompt above
2. Paste into your AI design tool
3. Generate variants
4. Pick the best elements from each
5. Export as Figma frames or PNGs
6. Use as reference when building components

## Tools to Use

| Tool | Best For | Link |
|------|----------|------|
| v0.dev | React component generation | v0.dev |
| Galileo AI | Full screen designs | galileo.ai |
| Figma AI | Layout and spacing | figma.com |
| Claude | Design reasoning | claude.ai |
