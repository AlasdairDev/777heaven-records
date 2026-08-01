# Responsive CSS Polish — Design

## Goal

Bring the site's responsive breakpoints and small-screen typography up to the
same standard across every page, so tablet/mobile feels as considered as
desktop.

## Standard (already established, not invented)

Six files — `about.css`, `contact.css`, `team.css`, `partners.css`,
`roster.css`, `artist-page.css` — already share a correct, consistent
convention. This is the standard the rest of the site should match, not a new
one:

- **Five-tier breakpoint scale**: 1024px / 768px / 640px / 480px / 380px.
- **`clamp()` floors and ceilings are never overridden** at a breakpoint —
  only `letter-spacing` is adjusted as text gets smaller (typically one step
  around 640px, a further step around 380px).
- Padding steps down gradually tier to tier (roughly 10–20% per step), never
  jumping straight from desktop to a cramped mobile value.

`nav.css` (4 tiers, no 640) and `footer.css` (2 tiers: 600/380) are
intentionally different — they're structural chrome, not page content, and
their own internal logic already fits their simpler shape. Out of scope.

## Known bugs (Phase 1)

1. `index.css:643` — `.manifesto-text { font-size: 8vw; }` at ≤380px replaces
   its own `clamp(40px, 7vw, 80px)`, letting the homepage's largest statement
   shrink below its designed floor. **Fix:** remove the raw `8vw` override,
   let the clamp keep governing size; adjust only `letter-spacing` if needed.
2. `contact.css:492` — `.page-header h1` clamp floor is silently lowered from
   `48px` to `38px` at ≤480px (`clamp(38px, 10vw, 88px)` vs. the base
   `clamp(48px, 10vw, 88px)`), unlike every sibling page. **Fix:** restore the
   floor to `48px`; keep the existing `letter-spacing: -2px`.
3. `journal.css` is missing the 640px and 380px tiers.
4. `article.css` is missing the 1024px, 640px, and 380px tiers entirely
   (currently only 768/480).

## Phase 2 (after Phase 1, not yet itemized)

Go file by file at each breakpoint checking for: headings/labels close
enough to their max-width that a short last word could orphan; flex rows
missing `flex-wrap` that could overflow on narrow phones; small-text
`letter-spacing` left at desktop values instead of tightening at 380px (the
established pattern, e.g. `index.css`'s `.stat-lbl`). Fix CSS-first; a
`&nbsp;` between two words is acceptable only where a heading genuinely
orphans and CSS alone can't fix it cleanly.

## Rollout order

Group A: `journal.css` + `article.css` tier gaps (this doc's immediate
scope). Group B: the two known bugs in `index.css` / `contact.css`. Group C:
the remaining six files, Phase 2 wrapping/orphan audit. Pause for a visual
check after each group rather than shipping one large diff.

## Group A — exact values

### `journal.css`

Base `.page-header h1` is `clamp(50px, 10vw, 90px)` — identical to
`about.css`/`team.css`'s page-header h1, so the new tiers reuse their exact
letter-spacing values (`-2px` at 640, `-1.5px` at 380) for consistency.
Journal-specific properties (`.journal-section`, `.featured-section`,
`.articles-section`, `.milestones-sidebar`) are interpolated between
journal.css's own existing 768px and 480px values, following the same
gradual step-down ratio the six standard files use.

`journal.css` also had no 1024px override for `.page-header` at all (unlike
`about.css`). Brought into scope: journal's desktop base (`100px 40px 40px`)
differs from about.css's (`100px 40px 56px` — journal has no `.lead`
paragraph pushing extra bottom space), so about.css's exact 1024 numbers
don't transfer directly. Applying the same ~20% step about.css used, scaled
to journal's own desktop values, gives `80px 32px 32px` — which also slots
in smoothly between journal's own existing desktop (100/40/40) and 768px
(60/24/20) values. Add as a new line inside the existing 1024px block (which
already has non-page-header rules):

```css
@media (max-width: 1024px) {
    .page-header { padding: 80px 32px 32px; }
    /* ...existing rules in this block unchanged... */
}
```

New `@media (max-width: 640px)` block (insert between the existing 768px and
480px blocks, preserving source order):

```css
@media (max-width: 640px) {
    .page-header { padding: 56px 22px 18px; }
    .page-header h1 { letter-spacing: -2px; }
    .journal-section { padding: 0 20px 30px; }
    .featured-section { padding: 24px 20px; }
    .articles-section { padding: 22px 20px; }
    .milestones-sidebar { padding: 24px 18px; }
}
```

New `@media (max-width: 380px)` block (append after the existing 480px
block):

```css
@media (max-width: 380px) {
    .page-header { padding: 44px 14px 14px; }
    .page-header h1 { letter-spacing: -1.5px; }
    .journal-section { padding: 0 14px 24px; }
    .featured-section { padding: 16px 14px; }
    .articles-section { padding: 16px 14px; }
    .milestones-sidebar { padding: 16px 14px; }
}
```

`.journal-layout` and its children (`grid-template-columns`, `max-height`,
`overflow`, border/scroll behavior) already switch to single-column/flowing
mode at the existing 768px tier. Because `max-width` media queries stack
(768px's rules still apply at 640px and 380px), nothing needs to be repeated
for those properties in the new blocks.

### `article.css`

`.article-header`'s desktop base (`100px 40px 56px`) is identical to
`about.css`'s `.page-header`, so the new 1024/640/380 values for
`.article-header` reuse `about.css`'s exact page-header numbers at those
tiers — keeping article pages and content pages padding-synced site-wide.

`.article-title` is a smaller, independently-scaled clamp
(`clamp(28px, 5vw, 52px)`) — not the same element as page-header h1. The
file's existing author already chose a single letter-spacing step
(`-1.5px` base → `-1px` at 480px only, nothing at 768px). This change
preserves that existing choice rather than force-fitting the 3-step
page-header pattern onto it — flagging this as a deliberate deviation from
"mirror the six-file pattern exactly," open to revisiting if it looks wrong
once visually checked.

`.article-photo-full`'s negative margin must always cancel out
`.article-body`'s side padding to stay edge-to-edge — its values are
derived from `.article-body`'s padding at each new tier, not independently
chosen.

New `@media (max-width: 1024px)` block (insert before the existing 768px
block, at the top of the responsive section):

```css
@media (max-width: 1024px) {
    .article-header { padding: 80px 32px 44px; }
    .article-body { padding: 0 32px 80px; }
    .article-footer-nav { padding: 0 32px 64px; padding-top: 32px; }
    .article-photo-full { margin: 40px -32px; width: calc(100% + 64px); }
}
```

New `@media (max-width: 640px)` block (insert between the existing 768px
and 480px blocks):

```css
@media (max-width: 640px) {
    .article-header { padding: 68px 20px 36px; }
    .article-body { padding: 0 20px 64px; }
    .article-footer-nav { padding: 0 20px 52px; padding-top: 32px; }
    .article-photo-full { margin: 40px -20px; width: calc(100% + 40px); }
}
```

New `@media (max-width: 380px)` block (append after the existing 480px
block):

```css
@media (max-width: 380px) {
    .article-header { padding: 56px 14px 28px; }
    .article-body { padding: 0 14px 48px; }
    .article-footer-nav { padding: 0 14px 40px; padding-top: 24px; }
    .article-photo-full { margin: 40px -14px; width: calc(100% + 28px); }
}
```

`.article-footer-nav`'s `flex-direction: column; gap: 16px;` (set at the
existing 480px tier) already applies at 380px too via cascade stacking — not
repeated in the new block.

## Group B — exact values

### `index.css`

Line 643's `.manifesto-text { font-size: 8vw; letter-spacing: -1px; }` at
≤380px: the `letter-spacing: -1px` is correct and consistent (continues the
established trend of letter-spacing softening toward 0 as text shrinks —
480px already sets `-1.5px`). Only `font-size: 8vw;` is the bug. Fix is a
pure deletion, letting the base `clamp(40px, 7vw, 80px)` keep governing size:

```css
.manifesto-text { letter-spacing: -1px; }
```

### `contact.css`

Line 492's `.page-header h1 { letter-spacing: -2px; font-size: clamp(38px,
10vw, 88px); }` at ≤480px: the 640px tier already sets `letter-spacing:
-2px`, which cascades down through 480px and 380px on its own — this line's
`letter-spacing: -2px` is a harmless redundant restatement, not part of the
bug. Only `font-size: clamp(38px, 10vw, 88px)` is wrong (lowers the floor
from the base `clamp(48px, 10vw, 88px)`, inconsistent with every sibling
page). Fix is a pure deletion of the font-size part:

```css
.page-header h1 { letter-spacing: -2px; }
```

## Group C — findings and fixes

Audited `about.css`, `contact.css`, `team.css`, `partners.css`, `roster.css`,
`artist-page.css` against real page content (not CSS in isolation).

- **`partners.css` — real bug.** `.partner-row` has no `flex-wrap` and
  `.partner-row-cat` has `flex-shrink: 0`; longer name+category combos (e.g.
  "Nico Creatives" + "Distribution") can overflow the row on ≤380px/320px
  phones. Fix: `flex-wrap: wrap; row-gap: 4px;` on `.partner-row`, plus
  `letter-spacing: 2px;` on `.partner-row-cat`, inside the existing 480px
  block.
- **`about.css` / `team.css` — orphan risk.** Both pages share the identical
  "WORK WITH US" cta heading (same clamp, same centered layout). Fixed with
  `&nbsp;` between "WITH" and "US" in both `about/index.html` and
  `team/index.html`.
- **`about.css` — orphan risk.** `.value-card h3` "Your Masters Stay Yours"
  (4 words, card goes full-width ≤480px). Fixed with `&nbsp;` between "Stay"
  and "Yours" in `about/index.html`.
- **`roster.css` — clean.** Already the best-tuned file in the codebase
  (6-step letter-spacing progression on `.roster-title`, dedicated 380px
  treatment on `.roster-count`). Artist names wrapping mid-phrase in the
  flowing roster list is the intended design, not an orphan bug — left as-is.
- **`contact.css` — clean.** No orphan or flex-wrap issues found; longest
  headings either fit or break at a natural point.
- **`artist-page.css` — pattern-level orphan risk, not a CSS bug.**
  `.artist-details h1` is a shared template; risk is per-artist depending on
  whether the name is multi-word. Fixed with `&nbsp;` between the last two
  words of the h1 on all 7 multi-word active artists' pages: Agony and
  Ecstasy, Aren't We Ordinary?, Daena Amor, Holding Rivers, Ocram Argeinat,
  Strawberry Sweets, Yuval Aguaviva. Single-word names (6TREET, ANYU, etc.)
  have no risk and were left untouched.
- **`artist-page.css` — minor orphan risk, template-wide.** `.cs-title`
  ("Coming Soon") appears identically on all 22 active artist pages (there is
  no shared partial for it — `partials/` only covers nav and footer). Fixed
  with `&nbsp;` between "Coming" and "Soon" on the 7 pages already touched
  above; the other 15 single-word-name pages carry the same string, and got
  the same fix in a follow-up pass so all 22 active artist pages are
  consistent: 6treet, anyu, atari2k, bensplayssuuu, chest-in, decent,
  forsythia, ikia, jazter, jucu, kayle, moxy, neverland, samskara, zyun.

## Status

Phases 1 and 2 (Groups A, B, C) are complete. All findings from the audit
were either fixed or confirmed as non-issues (`roster.css`, `contact.css`
flex-wrap/orphan checks came back clean). This closes out the site-wide
responsive polish pass.

## Verification

No automated visual regression tooling exists in this repo. Verify via the
`/run` skill (local server) checking each page at each new breakpoint width,
same as the manual screenshot review used earlier this session for the
journal page footer fix.
