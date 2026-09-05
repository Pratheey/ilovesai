# PENDING.md — I LOVE SAI

> Living work-tracker + decision log. Companion to `AI_HANDOFF.md` / `PROJECT_CONTEXT.md`.
> Last updated 2026-06-29 after a product/scoping session.
> **Reading order:** §A (what the site is) frames everything; §B is settled design;
> §C onward is what's left. Items marked **[DECIDED / TO IMPLEMENT]** are agreed but
> **not yet in the code** — the repo still reflects the pre-decision state.

---

## A. What this site actually is (the framing that scopes everything)

The org already runs its operations entirely on **WhatsApp + Excel**, and that works
for them. A website cannot meaningfully improve that internal machinery, and shouldn't
try. **The website's only job is the front door:** take a stranger and turn them into
someone who has either (1) gotten involved, or (2) donated — while letting them see what
I LOVE SAI is about.

Everything that doesn't serve **stranger → involved or donated** is out of scope.
This is the test to apply to any future feature idea.

---

## B. Settled design decisions (this session) — [DECIDED / TO IMPLEMENT]

### B1. "Get involved" path — replace the email/form stack with two buttons
The current intake reality: a newcomer talks to **the main guy**, who vets them in a
personal chat, sends info, adds them to the WhatsApp group, and *then* they fill the
org's big existing interest form (downstream, in WhatsApp). The website only needs to
deliver the stranger to the **front of that line** — it must not reproduce the line.

- **Primary door (loud):** a "Message us on WhatsApp" button → `wa.me/<main guy's number>`
  with a pre-filled greeting (e.g. "Hi, I found you through the website and I'd like to
  get involved.").
- **Safety net (quiet):** an "Email us" `mailto:` button → the org `@ilovesai` address.
- **No backend** on this path at all.
- Both the WhatsApp number and the org email live **once in `lib/`** (data-layer
  pattern), so a future handoff is a one-value swap, not a code hunt.

**Consequences (the big win):** this **deletes**, rather than fixes, a chunk of the
old plan:
- Remove the Astro **contact Action** and the **Resend** dependency.
- **Bug #2** (forms 500 in prod on the placeholder-email guard) — dissolved (no action).
- **Bug #3** (`replyTo` vs `reply_to` snake-case) — dissolved (no Resend call).
- **Turnstile on the contact route** + "what if send fails / lost devotee" — dissolved.
- The **`RESEND_API_KEY`** secret — no longer needed.
- DNS/email-deliverability anxiety — dissolved (org address already implies owned DNS).

**Known accepted tradeoffs:**
- `wa.me/<number>` exposes the number in plaintext in the href (unavoidable — the number
  *is* the URL; the scraper-obfuscation trick only protects `mailto:`). Owner accepted
  the main guy being publicly reachable. Later mitigation if he gets spammed: WhatsApp
  Business number / click-to-chat alias. Do **not** pre-solve.
- The `mailto:` org email should render as a button, **never** as plaintext on the page.

**Follow-on cleanup [DECIDED / TO IMPLEMENT]:** with both forms gone, `/get-involved`
and `/contact` no longer process POSTs or read runtime env, so they can likely drop
`prerender = false` and become **SSG** — removing per-route Turnstile/CSP-insert/
middleware machinery on those routes. Do this as a deliberate pass *after* the buttons
land, not blindly.

### B2. Donate page — PayPal, tiered, honest
**Processor is PayPal, not Donorbox.** (The handoff doc's Donorbox framing was
aspirational and wrong — the live site uses PayPal.) The current live PayPal donate
flow was **tested and confirmed working** by the owner.

- **Principle preserved from §9:** PayPal as an **outbound hosted link only — never an
  on-page embed/JS SDK.** Embedding card-adjacent fields would force the CSP loosening
  §9 exists to avoid and break PCI SAQ-A posture. (The principle was never really about
  Donorbox — it's "redirect, don't embed.")
- **Four giving options** carried over from the old site: **General**, **Plant a tree in
  Shirdi in a loved one's name** (~₹2,000), **Sponsor a Satcharitra chapter** (~₹6,200),
  **Sponsor an entire language** (~₹300,000 ≈ $3,600).
- **Tiered, NOT four flat equal boxes.** Lead with the two a stranger immediately
  understands — **General** + **Tree-in-a-loved-one's-name** — each with warmth and a
  sentence of context. Put **Chapter** + **Language** in a **secondary tier** for
  devotees who already know what they are. (Rationale: the $3,600 language ask is a
  major-donor ask; placing it as a peer of a $24 gift suppresses small giving and makes
  the page feel "not for" a normal newcomer.)
- **Option 1 implementation (now):** all four options link to the **one verified PayPal
  donate URL**. Amounts shown as **guidance, not promises** — e.g. "a tree is about
  ₹2,000 (≈ $24)" — honest that the donor enters their own amount on PayPal. **No
  pre-fill, no hard currency claim in copy.**
- **Currency:** PayPal localizes to the *viewer* (US viewer sees USD, India likely INR,
  UK likely GBP) and will cross-convert if needed. Because it adapts per person, page
  copy must **never** hard-promise a currency. Show conversions as approximate guidance.
- **`lib/donate.ts` grows** from a single `DONATE_URL` constant into a small **array of
  giving options** (label, blurb, suggested amount, link) — structured so individual
  options can later swap to dedicated PayPal hosted buttons (the "Option 2" upgrade)
  without touching the page.
- **Tone:** one calm reverent page, ties giving to the real `lib/projects.ts` projects,
  zero urgency/guilt mechanics ("never flashy").

**Owner must confirm before launch (gates two options):**
- Are the **tree program** and **translation drive** *still actually running*? These name
  a concrete deliverable (esp. the memorial tree — the most emotionally loaded gift on
  the page). A blank general-donation page mislabeled "plant a tree in her name" when no
  tree will be planted = a trust/ethics failure. If unconfirmed, ship **General** + only
  the options the main guy stands behind; hold the memorial tree until confirmed.
  (Stale *prices* are fine to fix later; an unfulfillable *memorial promise* is not.)

**Security note on the live link:** the existing donate URL carries a `token=` param —
treat donate links as semi-sensitive (don't post publicly). If in doubt about token
scope, regenerate a fresh hosted-button/donate link from the PayPal dashboard for the
new site. Currency presentation is a **PayPal dashboard** setting, not a code change.

### B3. Social links — add to footer
Old site links to Facebook, Reddit, Twitter/X, etc. Add as a row of icon buttons in
`SiteFooter`, sourced from a `lib/` array of `{platform, url}` (same data-layer pattern;
a dead account becomes a one-line edit). Riders:
- Each external link: `rel="noopener noreferrer"`.
- Icon-only links need real `aria-label`s ("I LOVE SAI on Facebook") per the §8 a11y floor.
- **Audit each URL first** — old WP sites accumulate dead/abandoned/hijacked handles; a
  footer of 404s reads worse than no links.

---

## C. URGENT — do this first, independent of everything

- [ ] **Commit & push the working tree.** Per handoff §2, essentially the entire site
      exists only as **uncommitted working-tree changes** on one machine; the last real
      commit is just the homepage. One disk failure / bad `git clean` loses ~40 files of
      finished work. **Do the ugly version now**
      (`git checkout -b wip-snapshot && git add -A && git commit -m "WIP snapshot" && git push`),
      then do the tasteful 10-commit split later against a backup that already exists.
      Do **not** let "split it nicely" block "get it off this disk."

---

## D. Coding pending (you, not waiting on anyone)

- [ ] **Implement B1** — WhatsApp + email buttons; rip out contact Action + Resend;
      add contact/WhatsApp data to `lib/`.
- [ ] **Implement B2** — restructure donate into the tiered 4-option page reading from a
      `lib/donate.ts` options array; set the real verified PayPal link; guidance-amount copy.
- [ ] **Implement B3** — social icon buttons in footer from `lib/`.
- [ ] **SSR→SSG cleanup** (follow-on from B1) — drop `prerender=false` on
      `/get-involved` + `/contact` once they're button-only; remove now-dead
      Turnstile/CSP-insert/middleware on those routes. Deliberate pass, post-buttons.
- [ ] **Bug #4** — homepage cards are dead hardcoded placeholders (no `href`); Serve/
      Organise CTAs point at `#`. Migrate homepage to `lib/projects.ts` (§6's noted lone
      data-inlining page) and wire the links.
- [ ] **OG/Twitter/canonical meta** in `BaseLayout` + **`robots.txt`** (§11.5). High
      payoff for a newcomer-reach site — every shared link is currently a previewless
      dead rectangle.
- [ ] **Minimal CI** (`check` + `lint` + `build`) (§15.7) — the solo-dev safety net.
- [ ] *Optional but cheap:* pin the 3 security-critical behaviors with tests —
      `verifyTurnstile()`, HTML-escaping, honeypot — *only* for whatever survives the
      form removal. (If forms are fully gone, this shrinks to near-nothing.)

---

## E. Decisions still owned by you (org reality, not code)

- [ ] **Charitable-registration name/number** for footer/legal + donate trust signal
      (§10 "never invent" — must be the real text).
- [ ] **Is Sanity ever actually worth standing up?** Currently deferred. A CMS earns its
      keep when *non-technical* people edit *frequently* — if the honest answer is "me,
      rarely," MDX + git (free, versioned, already in use) may be the permanent answer,
      not just the interim one. (See §G.)
- [ ] **Which i18n language first**, if ever.

---

## F. Content & assets (the genuine long poles)

- [ ] Real copy for the dozens of `[PLACEHOLDER]`s. **§10 hard rule:** devotional/
      historical text (Eleven Assurances, biography, Shirdi history, Satcharitra
      citations) must be **verified, never invented**; unknown copy stays
      `[PLACEHOLDER: …]` (never lorem ipsum).
- [ ] Real photography sitewide (currently `PlaceholderImage` everywhere; load via
      `astro:assets` `<Image>`).
- [x] ~~**Real org email string** for B1~~ — **done 2026-08-23:** front door uses
      `usa@ilovesai.com` (owner's call). Revisit if a region-neutral inbox is ever created.
- [ ] **Main guy's WhatsApp number** for B1.
- [x] ~~**Social URLs**~~ — **done 2026-08-23:** Facebook, X, Pinterest supplied by owner and
      wired into `lib/social.ts`. (No Reddit/Instagram/YouTube account given; icon artwork for
      those three is retained in `SiteFooter.astro`, so adding one later is a one-line edit.)
- [ ] Favicon set + **OG image** + apple-touch / maskable icons (needs design assets).
- [x] ~~Real per-region contact details~~ — **done 2026-08-23:** postal address, phone, and
      email for India (Shirdi), UK (Harrow) and USA (Livingston) are in `lib/locations.ts` and
      render on `/contact` and each `/locations/<region>`. Still missing: a **named human**
      per region (`contactName` is now omitted rather than a placeholder, so nothing renders).

---

## G. Credentials & external config

- [ ] Real **PayPal** donate link verified for the new site (and confirm currency
      presentation in the PayPal dashboard).
- [ ] **Turnstile** site + secret keys — **only if** any form survives the B1 removal.
      If forms are fully gone, **drop Turnstile entirely** (and the two
      `TURNSTILE_*` secrets).
- [ ] ~~**Resend** API key~~ — **removed** by B1 (no transactional email).
- [ ] `EMAIL_FROM` — only relevant if any email-sending survives (it doesn't, under B1).

---

## H. Dashboard-only (can't be done from the repo)

- [ ] **Enable Cloudflare Web Analytics** for this site in the Cloudflare dashboard
      (Web Analytics → **Add a site** → **Manage site** → copy the token from the JS snippet),
      and paste it into `CLOUDFLARE_WEB_ANALYTICS_TOKEN` in `src/lib/analytics.ts`. The beacon +
      CSP allowances are already wired and stay off until the token is set. *(added 2026-07-21)*
      **Role needed:** account **Administrator** or **Super Administrator** — the read-only
      **Analytics** role can view data but not add a site. **Do not use the Pages project's
      Metrics → Web Analytics toggle instead:** that auto-injects the beacon at the edge, which
      our CSP will block, because the CSP only widens when the token constant above is set.
      **Which hostname to register:** Cloudflare does *postfix* hostname matching, so a token
      registered for `ilovesai.com` accepts data only from that apex and its subdomains. Until
      the real domain is under our control, register the hostname the site is actually served
      from (the Pages hostname, e.g. `ilovesai.pages.dev`); a token for it will not carry over
      to `ilovesai.com` later, so expect to add a second site and swap the constant at launch.
      Owning/proxying the domain is not required for this manual-beacon setup.
      *(verified against Cloudflare docs 2026-08-23)*
- [ ] **HSTS preload** (currently HSTS without `preload`).
- [x] ~~Cloudflare rate-limit rule on SSR endpoints~~ — **moot as of 2026-07-21:** the
      SSR→SSG cleanup removed both form endpoints, so there are no SSR routes to
      rate-limit. (The `_headers`/CSP still cover the now-static pages.)

---

## I. Deferred by design (confirm still deferred)

- [ ] **Sanity CMS** — still on the roadmap, still deferred: on hold until after a
      user-feedback round settles content structure (and possibly forever — see §E). The
      `lib/*.ts` data-layer pattern is deliberately shaped for a contained swap to it.
- [ ] Full **i18n** (`/[lang]/`; Mukta already covers Devanagari). See also §L (Hindi).
- [ ] Events **calendar view**.
- [ ] **Newsletter** backend.
- [x] ~~Analytics~~ — **done 2026-07-21** (Cloudflare Web Analytics wired; owner enables
      it in the dashboard — see §H and §L).
- [ ] Broader **test suite** (beyond the optional security-critical pins in §D).

---

## J. Immediate plan (owner's stated next move)

Owner is **not** drawing a launch line yet — the next step is to **show the product to
some users** for a feedback round (which also informs the deferred Sanity/content-
structure decision). So the near-term goal is "presentable enough to demo," not "done."
After feedback, revisit scope and draw the actual launch line.

---

## K. Resolved this session (was open in handoff §16 / §15)

- Email routing model → **resolved**: no transactional email; WhatsApp button + org
  `mailto:` button (B1).
- Submitter confirmation email → **resolved**: none; on-page/native-client success only.
- Donations processor → **resolved**: **PayPal** (not Donorbox), verified working.
- Per-region contact *for the front-door path* → **resolved**: front door is the single
  main guy, not region-routed. (Per-region details still wanted elsewhere — §F.)
- DNS/deliverability unknown → **dissolved** by using the org-owned email.

---

## L. Follow-ups from the 2026-07-21 build + review session

**Shipped & committed this session** (branch `wip-snapshot`, not yet pushed):
B1/B2/B3 front-door rework, SSR→SSG cleanup, Bug #4 (homepage links), OG/Twitter/
canonical meta + `robots.txt`, minimal CI, and the homepage **daily Arathi schedule**
(temple tabs + per-temple city). Design + security reviews run and fixes applied.

**Guiding priority (owner, 2026-07-21):** the site's #1 job is **getting people
involved** — donate is secondary. Weight homepage hierarchy accordingly (arathi "come
visit, it's free" as the soft first step → get involved → donate).

**To-do (coding, no owner input needed):**
- [x] **Enrich `/donate`** with real per-project impact copy from `lib/projects.ts`
      ("Where your gift goes" section). *Done 2026-07-21.* *(idea #3)*
- [x] **Cloudflare Web Analytics** — wired (cookieless, token-gated, conditional CSP so
      the policy stays tight until enabled). *Done 2026-07-21.* **Owner step to activate:**
      enable Web Analytics for this site in the Cloudflare dashboard, copy the token, and
      paste it into `CLOUDFLARE_WEB_ANALYTICS_TOKEN` in `src/lib/analytics.ts`. *(idea #6/my rec)*

**Roadmap / maybe (needs a decision or a conversation):**
- [ ] **Hindi / i18n** — biggest reach lever for the audience; Mukta already ships
      Devanagari. Owner to discuss with others first. *(idea #5, "maybe")*
- [ ] **Meet-the-team / "who we are" page** — trust + human connection for the
      involved-first goal. *Under discussion* (privacy/consent of volunteers, scope,
      page vs section). *(idea #4)*
- [x] **"We got you" — response expectations.** *Done 2026-08-23.* New
      `ResponseAssurance.astro` under the front-door buttons on `/contact` and
      `/get-involved`: the real three-step intake sequence, an explicit "please nudge us"
      permission slip, and a regional-contact fallback route. No backend. `responseTimeframe`
      in `lib/contact.ts` is set to **within 2–3 days** (owner, 2026-08-23); the placeholder
      fallback line remains in the component if it is ever blanked. *(idea #7, part 1)*
- [ ] **Reduce single-point-of-failure intake** — WhatsApp Business auto-reply and/or a hosted
      fallback form → spreadsheet. **Deferred by owner 2026-08-23** pending a conversation with
      the main coordinator. *(idea #7, part 2)*