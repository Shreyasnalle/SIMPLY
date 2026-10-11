# Frontend Design Specification (White Theme)

## Overview
White / Light "planet horizon" theme based on semantic tokens and atmospheric chart gradients.

## Base Colors

| Token | CSS Variable | Value | Description |
| :--- | :--- | :--- | :--- |
| **Background** | `--background`, `--color-background` | `#ffffff` | Clean white page background |
| **Foreground** | `--foreground`, `--color-foreground` | `#09090b` | High-contrast dark typography |
| **Muted Foreground** | `--color-muted-foreground` | `#71717a` | Muted secondary text and elements |

## Chart Tokens (Atmospheric Rim Glow)

| Token | CSS Variable | Value | Role in Horizon Rim |
| :--- | :--- | :--- | :--- |
| **Chart 1** | `--chart-1`, `--color-chart-1` | `hsl(217 90% 50%)` | Electric cyan-blue on the right (60°–180°) |
| **Chart 2** | `--chart-2`, `--color-chart-2` | `hsl(158 75% 42%)` | Luminous emerald teal at top-right (10°) |
| **Chart 3** | `--chart-3`, `--color-chart-3` | `hsl(38 95% 50%)` | Solar golden amber at top-left (350°) |
| **Chart 4** | `--chart-4`, `--color-chart-4` | `hsl(280 65% 55%)` | Nebula purple |
| **Chart 5** | `--chart-5`, `--color-chart-5` | `hsl(16 90% 50%)` | Flame orange-red on the left (180°–300°) |

## UI & Surface Colors

| Token | CSS Variable | Value | Description |
| :--- | :--- | :--- | :--- |
| **Primary** | `--primary` | `#09090b` | Dark primary button / element background |
| **Primary Foreground** | `--primary-foreground` | `#ffffff` | White text on primary buttons |
| **Secondary** | `--secondary` | `#f4f4f5` | Subtle light grey element background |
| **Secondary Foreground** | `--secondary-foreground` | `#09090b` | Text on secondary elements |
| **Border** | `--border` | `#e4e4e7` | Light subtle border lines |
| **Input** | `--input` | `#e4e4e7` | Input field borders |
| **Ring** | `--ring` | `#18181b` | Focus ring |
