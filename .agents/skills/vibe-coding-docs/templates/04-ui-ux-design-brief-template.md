# UI/UX Design Brief — Visual & Interaction Guide

## Aesthetic Direction
- **Overall Vibe**: [e.g. Minimal, dark-mode first, refined developer-tool aesthetic like Linear, Raycast, or Vercel]
- **Mood**: [e.g. Professional, focused, modern, fast]

## Color Palette
| Token | Hex Value | Role |
|---|---|---|
| Primary | `#4F46E5` | Main brand color, active buttons, focus indicators |
| Accent / CTA | `#06B6D4` | Highlights, badges, promotional accents |
| Background (Dark) | `#0B0F17` | Main surface background |
| Background (Light) | `#FFFFFF` | Alternate light surface |
| Text (Primary) | `#F8FAFC` | Headings and primary body copy |
| Text (Muted) | `#94A3B8` | Subtitles, helper text, timestamps |
| Border | `#1E293B` | Subtle card outlines and dividers |
| Error / Danger | `#EF4444` | Validation errors and destructive actions |
| Success | `#10B981` | Success confirmations and positive badges |

## Typography
- **UI / Headings**: [e.g. Inter, sans-serif]
- **Code / Monospace**: [e.g. JetBrains Mono or Geist Mono]
- **Base Size**: `16px` (ensuring touch friendliness on mobile devices)

## Component Styling
- **Border Radius**: [e.g. `8px` rounded for cards/buttons, `9999px` for badges/pills]
- **Shadows**: [e.g. Subtle border glow and soft low-blur shadows, avoid heavy muddy drop shadows]
- **Elevation**: Flat surfaces with 1px border contrast instead of multi-tiered elevation

## Dark / Light Mode Policy
- [e.g. Dark mode default; toggle switcher stored in localStorage with prefers-color-scheme fallback]

## Inspiration & Reference Apps
1. **[App 1, e.g. Linear]**: For sleek keyboard shortcuts, dark palettes, and crisp typography.
2. **[App 2, e.g. Raycast]**: For clean command palette layouts and micro-interactions.
3. **[App 3, e.g. Vercel]**: For monochromatic simplicity and high contrast.

## Mobile Responsiveness & Touch Rules
- Minimum touch target: $44\text{px} \times 44\text{px}$.
- Breakpoints: Mobile ($< 640\text{px}$), Tablet ($640\text{px} - 1024\text{px}$), Desktop ($> 1024\text{px}$).
- Avoid horizontal scrolling on any mobile viewport.
