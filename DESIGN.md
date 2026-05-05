---
name: Hardware AI Design System
colors:
  surface: '#0e1416'
  surface-dim: '#0e1416'
  surface-bright: '#343a3c'
  surface-container-lowest: '#090f11'
  surface-container-low: '#161d1e'
  surface-container: '#1a2122'
  surface-container-high: '#242b2d'
  surface-container-highest: '#2f3638'
  on-surface: '#dde4e5'
  on-surface-variant: '#bbc9cd'
  inverse-surface: '#dde4e5'
  inverse-on-surface: '#2b3233'
  outline: '#859397'
  outline-variant: '#3c494c'
  surface-tint: '#2fd9f4'
  primary: '#8aebff'
  on-primary: '#00363e'
  primary-container: '#22d3ee'
  on-primary-container: '#005763'
  inverse-primary: '#006877'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#dad9ff'
  on-tertiary: '#1000a9'
  tertiary-container: '#babbff'
  on-tertiary-container: '#3838c6'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a2eeff'
  primary-fixed-dim: '#2fd9f4'
  on-primary-fixed: '#001f25'
  on-primary-fixed-variant: '#004e5a'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#0e1416'
  on-background: '#dde4e5'
  surface-variant: '#2f3638'
typography:
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  data-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: '0'
  data-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for high-stakes hardware development environments where precision, performance, and clarity are non-negotiable. It adopts a "Cyber-Industrial" aesthetic—a fusion of modern aerospace instrumentation and advanced computing interfaces. The primary objective is to facilitate the tracking of complex hardware roadmaps (TPUs, NPUs, and interconnects) by providing an interface that feels like a specialized tool rather than a generic web application.

The visual narrative is built on the concept of "The Technical Blueprint." This involves using high-density layouts, visible structural alignments, and a color-coded status hierarchy that mimics physical machinery monitors. It prioritizes information over decoration, using subtle glows and thin strokes to guide the eye without cluttering the cognitive space of the engineer.

## Colors

The color palette of this design system is rooted in a deep-space environment. The foundational backgrounds use **Slate (#0f172a)** for the primary canvas and **Charcoal (#1e293b)** for surface-level elements, ensuring a high-contrast ratio for data visualization.

- **Primary (Cyan #22d3ee):** Used for active states, successful completion, and high-priority "In Progress" roadmaps. It provides a "holographic" feel when paired with subtle outer glows.
- **Secondary (Amber #f59e0b):** Reserved for technical warnings, upcoming deadlines, and critical path items requiring attention.
- **Accents:** Tertiary Indigo is used sparingly for secondary data sets or navigation indicators.
- **Neutral Grays:** These define the structural integrity of the UI, with specific emphasis on #334155 for dividers and #475569 for "locked" or "inactive" content tiers.

## Typography

Typography in this design system is split between functional narrative and technical data reporting. 

**Inter** is utilized for the primary interface hierarchy, providing a neutral, highly readable foundation for labels, buttons, and navigation. **JetBrains Mono** is employed for all data-specific outputs—such as version numbers, timestamps, performance metrics, and roadmap IDs. 

Hierarchy is established through weight and letter spacing rather than significant size variance. This maintains a compact, high-density layout. Caps-lock styling with increased tracking should be used for metadata headers and secondary labels to reinforce the industrial documentation feel.

## Layout & Spacing

The design system utilizes a **12-column fixed grid** for top-level dashboard orchestration, ensuring that information density is maximized while maintaining a rigorous structural alignment. 

The spacing rhythm is based on a **4px baseline grid**. Smaller units (4px, 8px) are used to group related technical parameters, while larger units (16px, 24px) define the boundaries between card modules. Alignment is strictly left-justified for text and right-justified for numerical data, creating a clean vertical "line of sight" through complex roadmaps.

## Elevation & Depth

In this design system, depth is achieved through **Tonal Layering** and **Luminescent Accents** rather than traditional drop shadows.

- **Level 0 (Base):** #0f172a (Deep Slate).
- **Level 1 (Cards/Panels):** #1e293b (Charcoal) with a 1px solid border of #334155.
- **Active State Elevation:** Elements in an "Active" or "Focused" state do not rise in Z-space; instead, they receive a 1px Cyan border and a subtle `0px 0px 8px` Cyan outer glow (opacity 20%).
- **Interactive Depth:** When a card is hovered, the border color transitions from #334155 to #475569.
- **Glass Effects:** Used exclusively for modal overlays or temporary dropdowns, utilizing a background blur (12px) and a semi-transparent Charcoal fill.

## Shapes

The shape language is primarily **Industrial/Sharp**. A minimal corner radius of 4px (`roundedness: 1`) is applied to cards, buttons, and input fields to prevent the interface from feeling "hostile" while maintaining its engineering-first character. 

Nested elements (such as chips or status indicators) should maintain the same radius as their parent container to ensure geometric harmony. Status indicators for "Success" or "Warning" are strictly rectangular or circular—avoiding organic or highly rounded shapes.

## Components

### Buttons & Controls
Buttons are strictly rectangular with 4px radii. Primary actions utilize a ghost-style border with a Cyan glow on hover. Secondary actions use the Charcoal surface color with an Amber border only if they are destructive or high-alert.

### Roadmap Cards
Cards represent the core atomic unit of the dashboard.
- **Active State:** Features a high-contrast Cyan left-accent bar, a JetBrains Mono "ACTIVE" label in the top right, and 1px Cyan borders.
- **Locked State:** The background is desaturated. A 45-degree CSS stripe pattern (Slate #334155 at 10% opacity) overlays the card to indicate it is not yet editable. Text opacity is reduced to 50%.

### Data Visualizations
Gauges and progress bars for hardware milestones must use the Cyan-to-Slate gradient for progress. Use the monospaced font for all percentage readouts.

### Input Fields
Inputs are low-profile with a #1e293b fill and a subtle #334155 border. Upon focus, the border transitions to Cyan with a sharp, non-diffused 1px glow.

### Status Chips
Small, high-contrast badges using JetBrains Mono. They should never have icons; they rely on text and the primary/secondary color system to communicate status.
