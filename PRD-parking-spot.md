# PRD — ParkHere (working title) · "내 차 어디 세웠지?" 기록 앱

**Status:** Final Draft (grilling 완료)  ·  **Owner:** <you> · **Reviewers:** <mentor> · **Last updated:** 2026-07-25

---

## 1. Summary
A personal web app (PWA on iPhone) that lets **one driver** record exactly where they parked
in **their one regular multi-floor parking lot**, by drawing a simple sketch map **per floor**
once, and on each visit selecting the floor and dropping a single "my car" pin on it.
The maps carry **fixed landmarks** (including the two entrances the driver actually uses), so
reopening the app answers not just *"where is the car"* but *"from where I'm standing now,
which direction do I walk"* — no wandering the garage.

## 2. Problem & Motivation  ← 문제 (5-box #1)
In large parking lots (apartments, malls, offices), drivers routinely forget which floor /
zone / row they left their car in. The cost today: wasted minutes walking floors, stress,
sometimes missed appointments. Existing tricks fail because:
- **A photo of a pillar sign** only helps if you can read/remember the code — it gives no
  sense of *where that pillar is* relative to the exit or your car.
- **GPS pins** are unreliable indoors and underground, exactly where the problem is worst.

A **user-drawn sketch map** sidesteps GPS entirely and captures the one thing that actually
helps: a mental picture the driver already understands ("near pillar B3, second row from the ramp").

## 3. Users & Use Cases  ← 유저 (5-box #2)
- **Primary (and only) user:** me — an individual driver who regularly parks in **one large,
  multi-floor lot** and repeatedly loses track of the spot. Personal single-user app:
  **no accounts, no sharing, no cloud sync — local storage is enough** (D1).
- **Core use case:** Once, I sketch each floor of my lot and mark fixed landmarks on it
  (the two entrances I use, ramps, notable pillars). On each visit I open the app,
  pick the floor, tap where I parked. Later I reopen it, see the pin relative to the
  landmarks, and know which direction to walk from whichever entrance I came in.
- **Not the user (see Non-Goals):** anyone needing automatic detection, multi-car/family
  sharing, or turn-by-turn indoor navigation.

## 4. Goals & Success Metrics  ← MVP (5-box #3)
- **G1 — When I return to the lot, one glance at the saved map tells me the floor, the spot,
  and the direction to walk from where I entered** — without searching the lot.
  (Outcome, not a feature: I *get back to the car faster*, driven by pre-saved floor maps
  with landmarks + one pin per parking event. Direction, not just position, is the value — D2.)
- **Guardrail (counter-metric):** marking must stay effortless — **a few seconds, at most
  two touches: pick floor → tap spot.** If marking gets slower than that, people (me) stop
  doing it in the moment and the app dies. Don't sacrifice speed-of-marking for map richness.

## 5. Non-Goals (defer) ★ most important  ← Non-Goals (5-box #5)
| Deferred | Phase | Why not now |
|---|---|---|
| Accounts / sharing / cloud sync | Out of scope | Single personal user (D1); local storage suffices. |
| Automatic parking detection (GPS / Bluetooth / motion) | Later | Unreliable indoors/underground; the whole premise is that manual sketch beats GPS here. |
| Multi-car & family/shared spots | Later | Depends on accounts + sharing model; MVP is "my 1 car". |
| Indoor turn-by-turn navigation to the car | Later | Requires real indoor positioning; sketch map + landmarks + memory is enough for v0. |
| Multiple saved lots | Phase 2 | I have **one** regular lot; a second lot only matters if habits change. |
| Draw-a-map-fresh-every-time for one-off lots | Phase 2 | MVP assumes the one pre-saved regular lot; ad-hoc lots add scope. |
| Photos attached to a spot | Phase 2 | Nice-to-have on top of the sketch; not needed to prove the core value. |
| Parking-timer / fee / "how long have I been parked" features | Out of scope | Different product; dilutes the one job. |

## 6. Functional Requirements (MoSCoW)
- **Must:**
  - Create & save a hand-drawn sketch map **per floor** of my one parking lot
    (1 lot = a set of floor maps, B안 — floors are first-class, not a text note).
  - Maps support **two kinds of marks** (D4):
    ① **fixed landmarks** (multiple; drawn once with the map — includes both entrances I use),
    ② **one movable "my car" pin** (placed/moved each parking event; placing a new pin
    replaces the old one, across floors too — there is only ever one car).
  - Marking flow: open app → **pick floor → tap spot** (two touches, per §4 guardrail).
  - Reopen later and see the pin on the right floor, relative to the landmarks.
  - All data stored **locally on the device**; works offline (underground lot = no signal).
- **Should:** edit/redraw a saved floor map; add/move landmarks later; a short text note per
  spot (e.g. `"B3, 램프 옆"`).
- **Could:** a second saved lot (only if habits change — see §5).
- **Won't (now):** see §5.
- **Platform (product constraint):** **PWA opened on iPhone Safari, installable to the home
  screen.** Rationale: personal use with no app-store distribution; home-screen icon satisfies
  "open within seconds of parking"; local/offline storage fits D1. (Tech details → TRD/ADR.)
- **Acceptance criteria:** when I pick a floor and tap a location on its saved map, a car pin
  appears there and persists after closing and reopening the app — and any pin previously on
  another floor is gone.
- *How is handed off:* screen layout → UI doc · app architecture & the "map store" seam →
  Design Doc · drawing-canvas tech & offline-storage choice → ADR.

## 7. UX & Edge Cases (product-level only)
- **Happy path:** open app → pick floor → tap spot → done. Later: open app → see floor + pin +
  landmarks → walk the right direction.
- **Empty state (no maps yet):** prompt to draw & save the floor maps of my lot first.
- **Empty/invalid input:** marking with no map saved → guide to create maps first; opening the
  marker screen but tapping nothing → nothing is saved (no phantom pin).
- **Wrong floor / wrong spot:** re-picking a floor and tapping again simply moves the single
  pin there — correcting a mistake is the same gesture as marking, never a separate flow.
- **Stale pin:** reopening the app shows the *last* marked spot; if I forgot to mark this time,
  the pin is from a previous visit. Show **when** the pin was placed (e.g. "어제 21:40") so a
  stale pin is recognizable at a glance.

## 8. Success Criteria & Verification ★  ← 성공 기준 (5-box #4)
Observable check anyone can run: I (a) draw and save floor maps of my real lot with its
landmarks and both entrances, (b) park, pick the floor, tap my spot, (c) close the app, walk
away, and reopen it later, and (d) **from either entrance**, using only the map, I can tell
which floor to go to and which direction to walk, and reach the car directly — no searching
floor by floor, no external notes. Success = right floor + right spot + correct direction
from where I'm standing.

## 9. Open Questions & Risks
- **Product risk — drawing friction:** will I actually finish drawing every floor? The
  per-floor sketch step is upfront friction. → Mitigate: floors of one garage are usually
  near-identical, so support duplicating a floor map as a starting template; keep drawing
  dead-simple; the map is drawn once and reused for every visit.
- **Open — drawing fidelity:** how detailed a sketch is "good enough" to be useful yet fast to
  make? Decide by drawing my real lot rough vs. detailed and testing on actual visits.
- **Open — floor count:** how many floors does my lot actually have? Determines whether the
  floor picker is a couple of big buttons (fast) or needs a list (slower — watch the §4 guardrail).

---

## Appendix — Grilling 결정 기록 (완료)

**최종 갱신:** 2026-07-25 · grilling 완료, 본문 반영됨.

- **D1 — 대상: 나 혼자 쓰는 개인용 앱.** 계정/공유/클라우드 동기화 불필요, 로컬 저장. (§3·§5·§6)
- **D2 — 핵심 가치: 위치 표시가 아니라 "재방문 시 어느 방향으로 갈지".** (§4 G1·§8)
- **D3 — 핵심 메커니즘: 손그림 약도 유지.** 나만 쓰고, 한 번 그리면 재사용, 가장 직관적.
- **D4 — 방향 해결: 고정 랜드마크 여러 개(입구 2곳 포함) + 차 핀 1개.** (§6 Must)
- **D5 — 층 구조: 자주 쓰는 주차장은 여러 층 → 1 주차장 = 층별 지도 여러 장 (B안).**
  마킹은 "층 선택 + 탭" 2단계, 가드레일을 "최대 두 번의 터치"로 갱신. (§4·§6)
- **D6 — 주차장 수: 1개.** "여러 지도"는 Must 아님 → Phase 2로 이동. (§5·§6 Could)
- **D7 — 플랫폼: 아이폰 사파리에서 여는 PWA(홈 화면 설치), 오프라인·로컬 저장.** (§6)
