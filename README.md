# Executive Education Gateway (executive-education.ethanstarke.com)

The Private Hour: the production build of the gateway. Locked spec: Gateway_Spec_v1.0_LOCKED
(Amendments 1 and 2); visual world: Gateway_Art_Direction_Concepts_v1 (DECIDED: Concept One);
selector logic: Gateway_Selector_Routing_Matrix_v1. Canonical home of these documents:
06_VENTURES/EthanStarkeLLC/Executive_Education_Gateway/.

## State of this bundle (v1.0, routing v1.1)
Corrected motion build with the four-answer routing engine, externalized assets, semantic
controls, reduced-motion support, unique inquiry references. Responsive layers added
2026-08-30: the approved desktop composition holds from 1370px up (hero bottom cluster is one
grid row, headline capped by viewport height so it never collides with the proposition on short
laptops); compact desktop and tablet landscape 881 to 1369px; phone and tablet portrait 880px and
under (flow hero, in-flow selector steps, stacked reveal, stacked territories and format panels,
operator portrait above the words). Verified by browser test at 390, 430, 768, 820, 1024, 1280,
1366, 1440, 1650 and 1920 widths; the routed flow, request, confirmation, strip and reduced
motion pass at phone size. Formats strip completed the same day: all eight canonical formats in
ladder order (Keynote, Conversation, Roundtable, Working Session, Laboratory or Workshop, Series,
Intensive or Offsite, Advisory), each with its line drawing, group label, facts line and the
staff-delivery line where the ruling places it; copy stays inside the sealed Commercial Architecture
and the gateway copy document, no natural-next-step language on the buyer page. Below the fold is
built (same day): programs, the institutional lane, the
introduction line and The Starke Perspective subscription, in daylight after the request, wired
through the same endpoint (pathways pathway-programs, pathway-institutional, introduce, subscribe;
Code.gs lands introductions and subscriptions on their own sheets and emails the office). HELD:
the handbook download, because the printed handbook carries prices and the held practice figures;
it returns only on Ethan's decision (a gateway edition, or as printed).
QA pass completed 2026-08-31 (Joshua): all 1,764 selector combinations verified against an
independent transcription of the routing matrix; every session title and line on the page and in
the engine matches Gateway_Copy_v1 word for word; no prices, figures, testimonials, framework names
or bench names anywhere; keyboard operation end to end (inactive selector steps are out of the tab
order, the strip is keyboard-scrollable, disclosure buttons carry aria-expanded); landmarks and
heading order clean under axe-core; reduced motion static at desktop and phone; the display face
renders correctly at both pixel densities. Two corrections from QA: each territory now opens its
remaining canonical sessions in place (all 33 Library sessions are on the page; seven were
unreachable before), and the quietest text was lifted to WCAG AA contrast against its real ground
(answer buttons, counters, notes, small labels, daylight gold labels via --goldink, placeholders,
day-mode nav). Favicon and touch icon built from the mark; share meta added without an image.

Review round one (2026-08-31, commit 36428d9): header mark beside the wordmark (goldlt at
night, ink by day), a Top control, the six territories as a side-by-side strip like the formats,
and summary.html, a printable sheet of every session by territory and every format with pick
boxes that carry into the request (?pick=...&fmt=...). Certificate hierarchy corrected to canon
(9127e92): Resilient Leadership is the flagship certificate cohort with three focused
specializations, never four parallel certificates. Endpoint live (9d9a0ed): Apps Script web app,
sheet "Gateway Inquiries".

## Launch record (2026-08-31, on Ethan's "launch")
1. noindex removed (828d5da); repository public; GitHub Pages from main, built.
2. DNS: CNAME executive-education -> eestarkeai-sketch.github.io added in the Wix zone (additive).
3. Wix redirects: /speaking, /creativity, /executive-education -> the gateway (exact).
4. Wix front page: logos replaced by the typographic name wall; Speaking page removed; menu item
   and home tile relinked to the gateway. Published on Ethan's "publish".
5. HTTPS: GitHub issues the certificate after its domain check; then `_launch.py https`
   (https_enforced) and the three redirects switched from http to https targets.

Remaining, Ethan's hands:
1. Subscriptions currently reach the office by email and sheet; connect to the newsletter tool of record when chosen.
2. Licensed typefaces, if and when purchased (drop-in @font-face swap; the self-hosted open faces are production-ready as they stand).
3. Figures: the three practice figures return to the record screen only on Ethan's provenance
   confirmation (Proof and Evidence Register, amendment of 2026-08-30).
4. Office address: once office@ethanstarke.com exists, set OFFICE in endpoint/Code.gs, deploy a
   new version of the web app (same URL), and the page's reply line and footers name office@.

No pricing appears anywhere. No testimonials by design. Roster held back from the gateway per the launch decision.

## Rename to Executive Engagements (2026-08-31, on Ethan's ruling)
Ethan ruled that his correct description is Executive Advisor, not educator, and that the
subdomain, the Wix redirects and the Wix menu item are all renamed Executive Engagements.

Commit b09ec10, page copy: eyebrow "Ethan Starke - Executive Advisor"; display headline line one
"Executive advisory"; page title, meta description, og:title; summary.html title and eyebrow.
The institutional lane paragraph deliberately keeps "executive education pathways for
institutions", because there the phrase names the buyer's own department, not Ethan's practice.

Commit f4d643d, address: CNAME, og:url and canonical moved to
executive-engagements.ethanstarke.com. The CNAME record was added additively in the Wix zone
through the dashboard, not the Domain DNS API, because that API replaces one record object per
type and the zone carries the Google Workspace MX records; the five MX records were verified
unchanged after the write, and the new host resolved on both Cloudflare and Google resolvers.

The certificate issued immediately on the new hostname (state approved, expires 2026-11-29) and
https is enforced. The previous hostname had been stuck in state "new" for twenty-two hours
because it was registered with GitHub three times during launch while DNS was still propagating;
a clean hostname got it on the first attempt.

Consequence, recorded on purpose: GitHub Pages serves one custom domain per repository, so
executive-education.ethanstarke.com is no longer served by this repo and returns a GitHub 404.
It was live one day. The four Wix redirects (/speaking, /creativity, /executive-education and a
new /executive-engagements) all point to https://executive-engagements.ethanstarke.com, and the
Wix menu item and the home tile were repointed and the site published, so every route people
actually use still works. A one-file forwarding repository could preserve the old hostname if
Ethan wants it; not built.

Still carrying the older framing and not changed here: Gateway_Spec_v1.0_LOCKED Part 11.2 names
executive-education.ethanstarke.com as the CNAME of record. That is now superseded. The locked
document is not edited; the correction belongs in the Portfolio errata record on Ethan's word.
