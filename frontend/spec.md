# Frontend Design Specification (Dark Mode)

## Overview
Dark "planet horizon" theme based on shadcn semantic tokens and chart variables as used in `HorizonGlowHero.tsx`.

## Base Colors

| Token | CSS Variable | Value | Description |
| :--- | :--- | :--- | :--- |
| **Background** | `--background`, `--color-background` | `#09090b` | Deep dark space background |
| **Foreground** | `--foreground`, `--color-foreground` | `#fafafa` | Bright starlight / high-contrast text |
| **Muted Foreground** | `--color-muted-foreground` | `#a1a1aa` | Muted secondary text and elements |

## Chart Tokens (Horizon Rim Glow)
The planet horizon rim uses conic gradients mapped to chart tokens to create an atmospheric rim glow:

| Token | CSS Variable | Value | Role in Horizon Rim |
| :--- | :--- | :--- | :--- |
| **Chart 1** | `--chart-1`, `--color-chart-1` | `hsl(220 70% 50%)` | Cosmic blue on the right (60°–180°) |
| **Chart 2** | `--chart-2`, `--color-chart-2` | `hsl(160 60% 45%)` | Aurora teal near top-right (10°) |
| **Chart 3** | `--chart-3`, `--color-chart-3` | `hsl(30 80% 55%)` | Solar yellow / amber near the top (350°) |
| **Chart 4** | `--chart-4`, `--color-chart-4` | `hsl(280 65% 60%)` | Nebula purple |
| **Chart 5** | `--chart-5`, `--color-chart-5` | `hsl(340 75% 55%)` | Solar crimson / red on the left (180°–300°) |

## UI & Surface Colors

| Token | CSS Variable | Value | Description |
| :--- | :--- | :--- | :--- |
| **Primary** | `--primary` | `#fafafa` | Primary text and highlight |
| **Primary Foreground** | `--primary-foreground` | `#09090b` | Inverted primary text |
| **Secondary** | `--secondary` | `#27272a` | Elevated surface / dark card |
| **Muted** | `--muted` | `#27272a` | Muted background fill |
| **Border** | `--border` | `#27272a` | Dark subtle border line |
| **Input** | `--input` | `#27272a` | Input container border |
| **Ring** | `--ring` | `#d4d4d8` | Subtle focus ring |
