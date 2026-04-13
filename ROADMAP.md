# The Cut — Roadmap & Monetization Plan

## Current State (v1)
Private 2-person accountability app. Prince vs Austyn, 8-week challenge, $100 bet.
Built on React + Vite + Tailwind + Supabase, deployed to Netlify.
PWA-installable on mobile and desktop.

---

## Monetization Direction: Multi-player Paid Challenges

Model inspired by DietBet / HealthyWage — but positioned as "commitment contracts" to avoid gambling classification.

### How it works
- Anyone can create a "Cut" — pick dates, stakes, metric, invite 2-10 people
- Each participant deposits their stake into escrow (Stripe Connect)
- Winners split the pot — **we take 10–20% platform fee**
- Losers forfeit. In strict jurisdictions, their forfeited stakes go to charity (not winners) to stay clear of gambling laws

### Revenue math
- Avg challenge: 5 people × $50 = $250 pot
- Platform cut 15% = $37.50 per challenge
- ~270 challenges/month = $10K MRR
- Scales well if virality works — challenge culture is inherently shareable

---

## Legal Priority (before any money moves)
- [ ] Consult with a gaming/fintech lawyer ($500–1K, 1-hour minimum)
- [ ] Decide jurisdiction strategy — which states/countries allow winners-take-all, which need charity fallback
- [ ] Draft Terms of Service, especially around refunds, forfeitures, proof of weigh-in
- [ ] Verify Stripe Connect ToS compliance for escrow use case

---

## Tech Additions Needed

### Payments
- Stripe Connect (Standard or Express)
- Escrow pot pattern — money held until challenge ends, then auto-distributed
- Auto-forfeit logic if user misses weigh-ins

### New features
- **Challenge creation flow** — dates, stakes, metric, rules
- **Invite links** — sign-up flow for new users (no pre-existing account)
- **Proof verification** (hardest problem — must solve before launch):
  - Photo weigh-in with daily code word written on paper (DietBet model)
  - Timestamp + GPS optional
  - Possibly third-party verification (gym, friend witness)
- **Automated payouts** at challenge end
- **Dispute / evidence system** — what if someone cheats?

### Competitor research
- HealthyWage (2009+) — individual goals, insurance-style payouts
- DietBet (2012+) — group challenges, 4-week bets
- Stickk — commitment contracts, charity stakes
- Differentiation ideas: private friend groups only, or niche (couples, coworkers, wedding prep)

---

## Staged Rollout

### Stage 1 — Validate (now → 4 weeks)
- Keep current app running for Prince & Austyn
- **Build waitlist landing page** — capture email, name, what challenge they'd run, referral source
- Share on socials, see if demand exists
- Goal: 500+ waitlist signups before investing more dev time

### Stage 2 — Free product (if waitlist hits 500+)
- Build challenge creation flow + invite links
- **No money yet** — free challenges only
- Learn what people actually do with it
- Iterate on proof/verification mechanics

### Stage 3 — Paid launch
- Add Stripe Connect, escrow, payout logic
- Launch with waitlist as first users
- Price: 15% platform fee, minimum $5 stake per person

### Stage 4 — Growth
- Content creator / influencer partnerships (fitness TikTok/IG)
- Referral bonuses
- Corporate wellness tier (companies pay per employee/month for internal challenges — 10x revenue per user, long sales cycle but high LTV)

---

## Risks & Open Questions
- **Proof of weigh-in is THE hardest problem** — need to study HealthyWage's method thoroughly
- **Churn after one challenge** — need rematch mechanics, leagues, seasons to retain users
- Crowded market — HealthyWage & DietBet have millions of users
- Need real differentiation — what's the wedge? Private-only? Niche? Better UX? Social features?

---

## Immediate Next Steps
- [ ] Build waitlist landing page (Stage 1)
- [ ] Run current app as MVP with Prince + Austyn to find UX issues
- [ ] Identify 5-10 friends who'd want to run their own Cut — they're your alpha users
- [ ] Lawyer consult before any money features
