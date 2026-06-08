# Carbon Pulse — AI Evaluation-Optimized MVP

This implementation plan is built exclusively to maximize the score across the 5 AI Judge Evaluation Criteria *while answering every word of the problem statement*. Every feature maps directly to: *"help individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights."*

## Problem Statement Alignment Map

| PS Keyword | How We Deliver It |
| :--- | :--- |
| **individuals** | Single-user experience. No enterprise auth, no orgs. Zero friction entry. |
| **understand** | Every activity logged shows its CO₂e in relatable terms ("= 2 smartphones charged"). Educational tooltips on what drives emissions. |
| **track** | Per-day footprint meter, 7-day trend line, category breakdown donut. "Last week vs this week" comparison. |
| **reduce** | Micro-challenges (Meatless Monday, Bike to Work), streak system, saved CO₂ counter with tree-planting equivalence. |
| **simple actions** | Log an activity in 5 seconds: pick category → enter value. OR type natural language: *"I drove 12km today"*. |
| **personalized insights** | AI Recommender Agent analyzes *your* logged activities and suggests 3 specific swaps ranked by YOUR potential savings. |

## AI Evaluation Strategy Matrix

| Parameter | Our Implementation Strategy |
| :--- | :--- |
| **Code Quality** | Strict TypeScript (`"strict": true`), modular architecture (UI in `components/`, agent logic in `lib/agents/`, types in `lib/types/`), DRY, zero ESLint warnings, meaningful JSDoc on all public functions. |
| **Security** | All Antigravity SDK calls happen server-side in Next.js API routes (`app/api/`). Strict `zod` validation on all user input (activity values, dates, categories). No API keys ever reach the client bundle. |
| **Efficiency** | Low-token subagent prompts (under 200 tokens each). Pre-bundled emission factors JSON (no external API latency). Framer Motion instead of D3 for lightweight animations. |
| **Testing** | Jest + React Testing Library suite covering: emission factor calculations, Zod validation schemas, agent prompt output parsing, and UI component rendering. `__tests__/` folder visible to the judge. |
| **Accessibility** | 100% semantic HTML (`<main>`, `<nav>`, `<section>`, `<article>`), WCAG AA contrast ratios, full keyboard navigation on all inputs, `aria-labels` on every interactive element, focus trapping on modals. |

## Architecture & Scope

A Next.js 14 app powered by an Antigravity Multi-Agent system. Scope: Quick Log → Calculate → Recommend → Track → Reduce.

### User Flow

```
User lands → Dashboard shows daily footprint meter + past 7 days
    ↓
User logs activity: "car" + "12 km" (or types "I drove 12km")
    ↓
Antigravity Orchestrator spawns subagents in parallel
    ↓
Calculator Agent returns: "2.04 kg CO₂ (12% of daily budget)"
    ↓
Dashboard updates: meter fills, trend lines shift, category breakdown refreshes
    ↓
Recommender Agent suggests: "Swap car → bus on your commute = 280 kg/year ↓"
    ↓
User accepts challenge → streak counter starts → saved CO₂ accumulates
```

### 1. Antigravity Agent Layer (Backend)

**Orchestrator Agent** — Routes user input to the right subagents, composes response.

3 specialized subagents running in parallel:

- **Calculator Subagent**: Takes `{ category, value, unit }` → looks up emission factor → returns CO₂e + relatable equivalent ("= X smartphones charged").
- **Recommender Subagent**: Analyzes user's activity history → returns top 3 personalized swaps ranked by potential annual savings + difficulty level.
- **Insights Subagent**: Generates 1 "aha" insight per session ("You're in the top 15% of low-carbon commuters in your region!"). Tracks streaks, milestones, weekly comparisons.

### 2. Emission Factors (Pre-Bundled — No API Needed)

```
transport: { car: 0.17 kg/km, flight: 0.255 kg/km, bus: 0.08, train: 0.04, bike: 0 }
food: { beef: 27 kg/kg, chicken: 6.9, pork: 7.9, vegetables: 2.0, rice: 4.1 }
energy: { grid_avg: 0.4 kg/kWh, solar: 0.05 }
shopping: { new_laptop: 230 kg, tshirt: 5 kg, jeans: 20 kg }
```

Plus relatable equivalents for every value (e.g., "2.04 kg = charging your phone 68 times").

### 3. File Structure

```
carbon-pulse/
├── package.json               # Next.js 14, Antigravity SDK, Zustand, zod, papaparse
├── tsconfig.json               # strict: true
├── jest.config.ts
├── __tests__/
│   ├── emissions.test.ts       # Core: emission factor lookup + calculation
│   ├── validation.test.ts      # Zod schemas for all inputs
│   └── ActivityLog.test.tsx    # RTL: form submission, validation feedback
├── app/
│   ├── layout.tsx              # Dark theme shell, global nav, footer
│   ├── globals.css             # Design tokens, WCAG AA palette
│   ├── page.tsx                # Main dashboard: meter + trend + breakdown
│   └── api/
│       └── analyze/route.ts    # Server-only: receives activity, calls Orchestrator
├── lib/
│   ├── emissions.ts            # Emission factor data + calculator function
│   ├── equivalents.ts          # CO₂ → relatable comparisons
│   ├── types.ts                # Shared TypeScript types/interfaces
│   └── agents/
│       ├── orchestrator.ts     # Master agent — spawns subagents, composes
│       ├── calculator.ts       # Subagent 1: compute CO₂e
│       ├── recommender.ts      # Subagent 2: personalized swaps
│       └── insights.ts         # Subagent 3: aha moments + streaks
├── components/
│   ├── ActivityLog.tsx         # Quick log form (category dropdown + value)
│   ├── NaturalInput.tsx        # Free-text input ("I drove 12km") — parsed by agent
│   ├── FootprintMeter.tsx      # Circular gauge showing today's vs. budget
│   ├── TrendChart.tsx          # 7-day trend line (Framer Motion)
│   ├── BreakdownChart.tsx      # Donut by category
│   ├── Recommendations.tsx     # Top 3 cards with impact badges
│   ├── ChallengeCard.tsx       # Active challenge with progress bar + streak
│   └── InsightsPanel.tsx       # "Aha" message + weekly summary
└── public/
    └── data/
        └── sample-activities.json  # Pre-loaded demo data for first-time users
```

### 4. State Management (Zustand)

```
store: {
  activities: Activity[],         // All user entries
  dailyFootprint: number,         // Today's total CO₂e
  weeklyTrend: number[],          // Last 7 days
  budgetUsed: number,             // % of daily budget (e.g., 10 kg CO₂)
  challenges: { active, completed, streak },
  recommendations: Recommendation[],
  insight: string | null
}
```

## Verification Plan

### Automated Tests
- `npm run test` — Jest suite covers emissions calc, Zod validation, prompt output parsing.

### Manual Checks
1. `npm run dev` → dashboard loads with sample data.
2. Log activity via dropdown → meter animates, categories update.
3. Log activity via natural language → "I flew 500km" → correct category + value detected.
4. Verify API route (Network tab) — no SDK keys in client response.
5. Lighthouse audit — 90+ Accessibility, 85+ Performance.

## What Makes This Unbeatable

1. **Every feature maps to the PS** — No wasted scope. Judge reads "individuals, understand, track, reduce, simple actions, personalized insights" and sees all 6 delivered.
2. **5-second time-to-value** — No CSV upload wall. User lands, logs an activity, gets instant feedback.
3. **Antigravity subagents used meaningfully** — Not tacked on. The parallel agent pipeline (calculate + recommend + insight) is the *engine*, not a checkbox.
4. **Testing strategy exists and matters** — Testing the emission factor calculator (core business logic) and Zod validation (security boundary) is not busywork.
5. **5 evaluation criteria explicitly engineered for** — Each strategy is a direct answer to what the AI judge checks.

## Submission Assets (separate files)

| Asset | What |
| :--- | :--- |
| Technical Blog | Architecture decisions, prompt design reasoning, emission factor methodology, trade-offs |
| LinkedIn Post | "Built in public" with screenshots, architecture diagram, personal carbon reduction story |
