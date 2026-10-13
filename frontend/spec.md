# Frontend Design Specification (Horizon Theme)

## 1. Overview
The design system is centered on the **Horizon Glow** celestial palette—a deep, high-contrast dark theme punctuated by vivid atmospheric gradients. Every surface, text style, and interactive element across the entire website derives from these core tokens.

---

## 2. Base & Canvas Tokens

| Token | CSS Variable | Hex Code | HSL / Value | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Background** | `--background`, `--color-background` | `#09090B` | `hsl(240 10% 3.9%)` | Primary canvas & planet disk body |
| **Foreground** | `--foreground`, `--color-foreground` | `#FAFAFA` | `hsl(0 0% 98%)` | Primary high-contrast text & glowing apex highlight |
| **Muted Foreground** | `--muted-foreground`, `--color-muted-foreground` | `#A1A1AA` | `hsl(240 5% 64.9%)` | Secondary copy, metadata, and subtitles |

---

## 3. Atmospheric Accent Palette (Chart Tokens)
These five colors form the vibrant conic rim gradient of the horizon glow and serve as brand accents, chart visualizers, tags, and dynamic highlights across the website.

| Token | CSS Variable | Hex Equivalent | HSL Value | Atmosphere / Visual Role |
| :--- | :--- | :--- | :--- | :--- |
| **Chart 1** | `--chart-1`, `--color-chart-1` | `#2A77F4` | `hsl(217 90% 56%)` | **Electric Cyan-Blue** — Right rim arc (60°–180°), primary tech highlights |
| **Chart 2** | `--chart-2`, `--color-chart-2` | `#1FD693` | `hsl(158 75% 48%)` | **Luminous Emerald Teal** — Top-right arc (10°), success & growth indicators |
| **Chart 3** | `--chart-3`, `--color-chart-3` | `#F9A71A` | `hsl(38 95% 54%)` | **Solar Golden Amber** — Top-left arc (350°), warm warnings & attention badges |
| **Chart 4** | `--chart-4`, `--color-chart-4` | `#AF57DB` | `hsl(280 65% 60%)` | **Nebula Purple** — Cosmic purple accents, secondary badges & features |
| **Chart 5** | `--chart-5`, `--color-chart-5` | `#F35820` | `hsl(16 90% 54%)` | **Flame Sunset Orange-Red** — Left rim arc (180°–300°), energy & alert accents |

### Horizon Rim Conic Gradient Mapping
```css
conic-gradient(
  from 0deg at 50% 50%,
  var(--color-foreground) 0deg,    /* #FAFAFA Radiant Apex */
  var(--color-chart-2) 10deg,      /* #1FD693 Emerald Teal */
  var(--color-chart-1) 60deg,      /* #2A77F4 Electric Blue */
  var(--color-chart-1) 180deg,     /* #2A77F4 Base Right */
  var(--color-chart-5) 180deg,     /* #F35820 Base Left */
  var(--color-chart-5) 300deg,     /* #F35820 Flame Orange-Red */
  var(--color-chart-3) 350deg,     /* #F9A71A Golden Amber */
  var(--color-foreground) 360deg   /* #FAFAFA Radiant Apex */
);
```

---

## 4. UI & Component Surface Tokens

| Token | CSS Variable | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `--primary` | `#FAFAFA` | High-emphasis buttons and active indicators |
| **Primary Foreground** | `--primary-foreground` | `#09090B` | Inverted text on primary buttons |
| **Secondary** | `--secondary` | `#27272A` | Elevated containers, cards, and secondary buttons |
| **Secondary Foreground** | `--secondary-foreground` | `#FAFAFA` | Text on secondary elements |
| **Accent** | `--accent` | `#27272A` | Hover states and active navigation chips |
| **Accent Foreground** | `--accent-foreground` | `#FAFAFA` | Text on accent surfaces |
| **Card** | `--card` | `#09090B` | Card container background |
| **Card Foreground** | `--card-foreground` | `#FAFAFA` | Headings and text inside cards |
| **Muted** | `--muted` | `#27272A` | Muted background fill |
| **Border** | `--border` | `#27272A` | Structural dividers, card borders, hairline outlines |
| **Input** | `--input` | `#27272A` | Form field borders and inactive outlines |
| **Ring** | `--ring` | `#D4D4D8` | Focus rings and keyboard navigation outlines |

---

## 5. Atmosphere, Hairline & Streak Values

- **Hairline Grid Texture**:
  - Color: `color-mix(in oklab, var(--color-foreground) 9%, transparent)` (`rgba(250, 250, 250, 0.09)`)
  - Pattern: Repeating vertical linear gradient (1px stroke every 10px)
- **Falling Light Streaks**:
  - Gradient: `linear-gradient(transparent, color-mix(in oklab, var(--color-foreground) 85%, transparent) 50%, transparent)`
  - Peak opacity: `0.16` – `0.26`
- **Atmospheric Halo**:
  - Multi-stop radial gradient fading smoothly between 64% and 98% radius using `color-mix(in oklab, var(--color-foreground) [1.5%-16%], transparent)`
- **Planet Rim Blur Bloom**:
  - Outer Soft Bloom: `blur(10px)` with `opacity: 0.45`
  - Core Rim Line: `blur(2px)` with `opacity: 1.0`

---

## 6. Website Application Rules
1. **Dark Canvas Priority**: All page layouts must use `bg-background` (`#09090B`) and `text-foreground` (`#FAFAFA`).
2. **Atmospheric Gradients**: Use linear or conic gradients combining Chart 5 (Flame Orange-Red) through Chart 1 (Electric Blue) for key callouts, border glows, or header accents.
3. **Contrast & Borders**: Keep cards subtle with `border-border` (`#27272A`) and background `bg-card`/`bg-secondary` to let atmospheric glows draw focus.
4. **Typography**:
   - **Headlines & Display (`font-serif`)**: High-contrast Editorial Serif (**Instrument Serif**, with Georgia fallback). Used for the main hero headline, section titles, and display text with elegant tracking and optical high-contrast stroke weights.
   - **Body & UI Elements (`font-sans`)**: Clean modern sans-serif (**Plus Jakarta Sans** / **Satoshi** / **Inter**) for navigation items, badges, body copy, and action buttons.
