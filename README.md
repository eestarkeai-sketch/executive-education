# Executive Education Gateway (executive-education.ethanstarke.com)

The Private Hour: the production build of the gateway. Locked spec: Gateway_Spec_v1.0_LOCKED
(Amendments 1 and 2); visual world: Gateway_Art_Direction_Concepts_v1 (DECIDED: Concept One);
selector logic: Gateway_Selector_Routing_Matrix_v1. Canonical home of these documents:
06_VENTURES/EthanStarkeLLC/Executive_Education_Gateway/.

## State of this bundle (v1.0, routing v1.1)
Corrected motion build with the four-answer routing engine, externalized assets, semantic
controls, reduced-motion support, unique inquiry references. Remaining before launch, in order:
1. Formats strip: extend from three panels to the full eight with their line drawings.
2. Mobile and tablet layout pass (the current build is desktop-first).
3. Below-the-fold: programs, institutional pathways, handbook download, subscribe (per skeleton).
4. Endpoint: deploy endpoint/Code.gs as a web app, set ENDPOINT_URL in js/gateway.js.
5. Replace prototype typefaces with the licensed faces of record when purchased (drop-in @font-face swap).
6. QA against the locked spec, both pixel densities, reduced motion, keyboard.

## Cutover runbook (Ethan's hands, batched, about five minutes in Wix)
1. Repo: eestarkeai-sketch/executive-education (create private; flip public and enable Pages
   from main when QA passes; CNAME file is already in the bundle).
2. DNS: in the Wix domain zone, ADD a CNAME record: executive-education -> eestarkeai-sketch.github.io
   (additive; touch nothing else).
3. Wix URL Redirect Manager: /speaking, /creativity, /executive-education -> https://executive-education.ethanstarke.com
4. Wix editor, same sitting: nav relabel and the front-page logo strip replaced with the unified
   typographic wall (Ryan, Transwestern, Hunt Energy included per the register).
5. Figures: the three practice figures return to the record screen only on Ethan's provenance
   confirmation (Proof and Evidence Register, amendment of 2026-08-30).

No pricing appears anywhere. No testimonials by design. Roster held back per the launch decision.
