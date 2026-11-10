---
name: EduBeer
description: An exploratory beer atlas with precise, readable style comparisons.
colors:
  background: "#fafcfc"
  surface-1: "#ffffff"
  surface-2: "#edf2f3"
  surface-3: "#dfe8e9"
  foreground: "#302922"
  foreground-muted: "#605a54"
  foreground-faint: "#68625d"
  border: "#7a8585"
  border-soft: "#d6dfe0"
  accent: "#175a63"
  accent-hover: "#10434b"
  on-accent: "#ffffff"
  accent-ink: "#175a63"
  accent-soft: "#e6f0f1"
  series-1: "#175a63"
  series-2: "#a34c24"
  series-3: "#66528e"
  series-4: "#426935"
  series-5: "#a3315c"
  foam: "#fffcef"
typography:
  display:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "clamp(2rem, 3.4vw, 3.15rem)"
    fontWeight: 650
    lineHeight: 1.16
    letterSpacing: "-.025em"
  headline:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "1.9rem"
    fontWeight: 650
    lineHeight: 1.16
    letterSpacing: "-.025em"
  title:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "1.4rem"
    fontWeight: 650
    lineHeight: 1.16
    letterSpacing: "-.025em"
  body:
    fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  lede:
    fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif"
    fontSize: ".9375rem"
    fontWeight: 600
  caption:
    fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif"
    fontSize: ".8125rem"
    fontWeight: 400
rounded:
  xs: "3px"
  sm: "6px"
  md: "12px"
  pill: "999px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "24px"
  s6: "32px"
  s7: "48px"
  s8: "72px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.sm}"
    padding: "8px 14px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.on-accent}"
  button-secondary:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    padding: "8px 14px"
  compare-selected:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.sm}"
    padding: "8px 14px"
  input-search:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    padding: "10px 42px 10px 14px"
  chip-selected:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.sm}"
    padding: "5px 11px"
---

# Design System: EduBeer

## Overview

**Creative North Star: "Atlante da esplorare, confronto da degustazione"**

EduBeer is a calm, approachable atlas whose identity comes from consulting beer styles. Porcelain backgrounds, espresso text and petrol selections hold together humanist headings, geometric beer glasses and exact numerical intervals. Open lists invite exploration; the comparison surface increases information density within the same visual language.

The interface distinguishes Italian introductions, official English BJCP descriptions and curated beer content. Source captions and explicit units belong beside the information they explain. The shipping visual vocabulary uses SVG geometry and locally hosted fonts, with no raster imagery.

**Key Characteristics:**

- Porcelain, espresso and petrol with restrained tonal surfaces.
- Humanist serif headings and practical sans text and controls.
- Flat separators, open lists and modest control corners.
- Illustrative SVG glasses and source-based SRM color.
- Exact ranges, visible units and text alongside chart color.

## Colors

The palette combines cool porcelain surfaces with warm espresso reading text and a deep petrol action color. The frontmatter records the implemented values from `src/tokens.css`.

The sidecar's eight-step OKLCH tonal ramps are synthesized palette previews, not additional shipping CSS tokens.

### Primary

- **Petrol** (`accent`, `accent-ink`): primary actions, active navigation, links, focus and selected range samples.
- **Deep petrol** (`accent-hover`): hover on filled primary actions.
- **Pale petrol** (`accent-soft`): selected rows, selected controls, search results and contextual information.
- **On petrol** (`on-accent`): text on filled primary actions and family selections.

### Secondary

- **Chart series** (`series-1` through `series-5`): petrol, burnt copper, muted violet, leaf green and berry identify selection positions consistently across charts and legends. These are categorical series, not a beer quality scale.
- **Foam** (`foam`): the cream-colored cap and bubbles inside illustrative beer glasses.

### Neutral

- **Porcelain** (`background`): page canvas.
- **White** (`surface-1`): header, input and button surfaces; search popover.
- **Cool mist** (`surface-2`): filters, chart tracks, table headers and explanatory notes.
- **Deeper mist** (`surface-3`): chip hover.
- **Espresso** (`foreground`): headings, body text and interval midpoint marks.
- **Warm gray** (`foreground-muted`, `foreground-faint`): supporting text and placeholders.
- **Control edge** (`border`): recognizable field and button boundaries, glass outlines and chart axes.
- **Quiet divider** (`border-soft`): list, section and table separators.

**The Boundary Rule.** Use the control-edge token for interactive boundaries; the quiet-divider token separates content.

SRM colors are calculated from the data by `src/lib/color.ts`, rather than selected from the brand palette. Comparison SRM intervals retain their actual-color gradient and a high-contrast espresso inset outline (1px), preserving visibility for pale beer colors.

## Typography

**Display Font:** Source Serif 4, with Georgia and serif fallbacks.

**Body Font:** Source Sans 3, with Segoe UI and sans-serif fallbacks.

Both families load local WOFF2 files from `src/assets`, use `font-display: swap`, and declare the normal variable weight range (400–700). Their OFL licenses are stored beside them. No remote font service is needed.

The serif lends warmth and editorial hierarchy; the sans carries descriptions, source information and controls. Headings use balanced wrapping. Numerical ranges and comparison tables use tabular numerals rather than a decorative monospace face.

- **Display:** fluid page titles; mobile style-overview titles use a compact override (1.9rem).
- **Headline:** section headings; compact style previews have a fluid override (1.7–2.6rem).
- **Title:** subsection headings; list names adapt to context (1.55rem desktop, 1.6rem below 760px, 1.4rem below 480px).
- **Body:** continuous reading, with a primary measure (70ch). Official reading sections increase line height (1.7).
- **Lede:** short introductions, usually constrained to 64ch; becomes body size below 480px.
- **Label and caption:** sentence-case control labels and source context. The caption class uses the small text size (.9375rem); the compact caption token (.8125rem) is used for source labels, chart axes and small metadata.

## Layout

The main container is centered with a maximum width (1480px) and desktop padding (44px 36px 72px). Detail pages narrow to 1180px, comparison to 1160px. The spacing rhythm is built from the frontmatter's 4–72px scale, supplemented by contextual gaps in lists and charts.

The atlas pairs an open list and sticky preview in two flexible columns (1.05fr / 1fr, 40px gap). Its preview uses a left divider rather than an enclosing card. Detail reading pairs text and references (1.8fr / 1fr, 64px gap). Beer and editorial indexes use three columns with horizontal row separators. Filters expand in normal document flow with four columns.

- **At 1200px and below:** header and atlas gaps tighten; the preview hides its duplicate glass and stacks its heading.
- **At 1000px and below:** the header wraps and stops being sticky; navigation occupies a full row. Main padding becomes 32px 24px 56px; grids and filters become two columns. Comparison label columns narrow.
- **At 760px and below:** the atlas preview and preview controls disappear; full style links remain available. Reading becomes a single column with references below a top divider. Each interval shows its name and exact value above a full-width track.
- **At 480px and below:** main padding becomes 28px 18px 48px; filters and index grids become one column. Header search results use a fixed popover with 16px side gutters. Small action controls and chips have a minimum height (44px). Detail specifications use two columns.

The comparison table scrolls within its labeled, focusable region. The page itself stays within the viewport. Long names wrap, prose has no fixed clipping height, and toolbars wrap their actions.

## Elevation & Depth

The system is flat at rest: whitespace, tonal surfaces and fine separators establish groups. Cards and rows do not cast shadows. The search result popover alone uses the soft popover shadow (`--shadow-popover`: `0 10px 30px #3029221a`), supported by a quiet border. The header's sticky position is navigational, not a floating-card treatment.

Transitions are limited to background and text color on links and buttons (140ms), enabled only when the user has no reduced-motion preference. Reduced motion disables transitions, animation and smooth scrolling. The defined 220ms duration and snap easing are available tokens, but are not currently applied to the shared transition rule.

## Shapes

Controls have modest corners (6px). Filter drawers, search popovers and contextual fact blocks use the broader container corner (12px); chart tracks use compact corners (3px). Pill rounding is reserved for the small navigation count, while series dots and slider thumbs are circular. List entries and beer cards rely on bottom dividers rather than enclosing frames.

SVG glasses use a shared coordinate system, fine outlines, clipped SRM-colored liquid, foam and restrained highlights. Boccale, tulipano, calice and snifter geometry exists in the shared glass component. The displayed shape is illustrative and does not assert a BJCP serving recommendation.

## Components

### Buttons and selection controls

Primary buttons use petrol with white text; secondary buttons use a white surface and control-edge border. Both have compact padding (8px 14px), a minimum height (40px desktop, 44px below 480px) and small corners. Primary hover deepens the petrol; secondary hover uses pale petrol. Selected comparison buttons combine pale petrol, a petrol border and explicit “Nel confronto” text with `aria-pressed`.

At five selected styles, further additions are disabled, with the reason explained beside the picker and in the add-button title. Disabled controls use reduced opacity (.55) and the not-allowed cursor. Family buttons use filled petrol for their selected state; filter chips use the softer selected treatment. Removable comparison chips include the full style name and a labeled removal action.

All interactive elements receive a visible petrol focus outline (3px, 4px offset). Links navigate; buttons change state. Icon-only or repeated actions have accessible names that identify their target.

### Inputs and search

Search and select fields use a white surface, control-edge border, small corners and minimum height (44px). Placeholders use the faint text token. Search exposes combobox, expanded and active-option states; arrows move through suggestions, Enter chooses or submits, and Escape closes them. Suggestions carry both the name and entity context. Empty results use a concise textual status.

Dual range sliders pair metric labels and visible minimum–maximum values with petrol tracks and outlined white thumbs. Expanded multiselects remain in flow and show their explicit selection state.

### Lists, containers and reading

Atlas rows align a geometric glass with name, code, short introduction, labeled intervals and separate comparison action. The current desktop preview has pale petrol backing and an explicit preview control state. Beer cards reuse the open row language with a glass, name, style and small metadata. Filter and note surfaces group related information without adding elevation.

Detail pages distinguish the Italian introduction from official English text (`lang="en"`). Source captions state when intervals belong to the style. Technical density values live in a native disclosure; references remain real links.

### Navigation

The serif wordmark sits beside sentence-case sans navigation and global search. The active destination combines petrol text and an underline. The comparison count is a small pale petrol badge. The header wraps without introducing a separate mobile menu, and a keyboard skip link appears on focus.

### Ranges and color

ABV, IBU and SRM comparisons align names, shared metric scales, min–max bars and exact visible values. Baseline domains are ABV (0–14%), IBU (0–100) and SRM (0–40); each scale expands to include selected data beyond its baseline domain. The midpoint tick is labeled as the interval midpoint, not a measurement of a beer. SRM bars use their calculated endpoint colors and the inset outline described in Colors. Accessible group names and adjacent textual values carry the data; decorative tracks and color marks are hidden from assistive technology.

The exact-value table also contains OG and FG. The secondary radar is a native disclosure with named series, documented normalized domains and an explicit statement that it is a numeric summary rather than a sensory profile.

**The Missing-Value Rule.** Missing ranges stay missing: show a dash and explanatory context, draw no interval segment, and do not substitute a numerical zero. A missing SRM value produces an empty glass labeled “Colore non dichiarato”; the color scale explains the absence of a declared range.

## Do's and Don'ts

### Do:

- **Do** keep source context, metric units and exact interval values visible beside the data.
- **Do** use petrol for interaction, tabular numerals for comparisons and serif headings for reading hierarchy.
- **Do** preserve the inset espresso outline around actual-color SRM comparison bars.
- **Do** wrap controls and long names, and keep table overflow inside its own region.
- **Do** pair color with text, explicit selection states and accessible labels.

### Don't:

- **Don't** attribute BJCP style ranges to a single commercial beer or replace missing values with zero.
- **Don't** use SRM color as a quality score or present interval midpoints as measured beer values.
- **Don't** reintroduce graph-paper backgrounds, thick black borders, hard shadows or accumulated decorative badges.
- **Don't** replace the shipped SVG geometry with invented bottle photography or copied study imagery.


## Audit refinements — 7 novembre 2026

The atlas identity is preserved. At widths up to 480px the main top padding is 20px, page-heading bottom margin 16px, page title 1.9rem and family-toolbar bottom margin 12px; touch controls retain their 44px floor. Metric explanations use native details/summary beside numerical content. Provenance is a readable definition list and distinguishes imported editorial values from documented sources. Comparison sharing uses a labeled, selectable URL field and a copy button with a live status/fallback. Searchable style and category pickers identify their subject in the accessible name. Page navigation focuses main while return links restore the list scroll position.

The beer catalog reveals 60 results per group, with an explicit count and native button below the grid. Loading more focuses the first new link; filtered totals and CSV cover the complete result set.
