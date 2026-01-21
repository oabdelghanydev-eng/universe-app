# UniVerse Design System
## Cosmic Depth - Premium Dark Theme 2026

A modern, accessible dark theme design system inspired by the cosmos.

---

## 🎨 Color Palette

### Space - Background Tiers
Rich dark blues with subtle purple undertones for layered depth.

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--space-950` | `#020617` | 2, 6, 23 | Page background (deepest) |
| `--space-900` | `#0f172a` | 15, 23, 42 | Sections |
| `--space-800` | `#1e293b` | 30, 41, 59 | Cards |
| `--space-700` | `#334155` | 51, 65, 85 | Elevated surfaces |
| `--space-600` | `#475569` | 71, 85, 105 | Borders |
| `--space-500` | `#64748b` | 100, 116, 139 | Muted elements |

### Nebula - Primary Brand
Vibrant indigo-violet for CTAs and focus states.

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--nebula-200` | `#c7d2fe` | 199, 210, 254 | Light backgrounds |
| `--nebula-300` | `#a5b4fc` | 165, 180, 252 | Light accent |
| `--nebula-400` | `#818cf8` | 129, 140, 248 | Links, hover |
| `--nebula-500` | `#6366f1` | 99, 102, 241 | **Primary** |
| `--nebula-600` | `#4f46e5` | 79, 70, 229 | Button hover |
| `--nebula-700` | `#4338ca` | 67, 56, 202 | Button active |

### Stellar - Secondary Accent
Rich purple for variety and depth.

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--stellar-200` | `#ddd6fe` | 221, 214, 254 | Light backgrounds |
| `--stellar-300` | `#c4b5fd` | 196, 181, 253 | Light accent |
| `--stellar-400` | `#a78bfa` | 167, 139, 250 | Secondary links |
| `--stellar-500` | `#8b5cf6` | 139, 92, 246 | **Secondary** |
| `--stellar-600` | `#7c3aed` | 124, 58, 237 | Hover |
| `--stellar-700` | `#6d28d9` | 109, 40, 217 | Active |

### Cyan - Fresh Highlights (NEW)
Bright cyan for special elements and accents.

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--cyan-300` | `#67e8f9` | 103, 232, 249 | Light accent |
| `--cyan-400` | `#22d3ee` | 34, 211, 238 | Highlights |
| `--cyan-500` | `#06b6d4` | 6, 182, 212 | **Accent** |
| `--cyan-600` | `#0891b2` | 8, 145, 178 | Darker accent |

### Aurora - Semantic Colors
Bright, saturated feedback colors.

| Color | Token | Light | Muted | Usage |
|-------|-------|-------|-------|-------|
| **Success** | `#10b981` | `#34d399` | `rgba(16,185,129,0.15)` | ✅ Confirmations |
| **Warning** | `#f59e0b` | `#fbbf24` | `rgba(245,158,11,0.15)` | ⚠️ Cautions |
| **Danger** | `#ef4444` | `#f87171` | `rgba(239,68,68,0.15)` | ❌ Errors |
| **Info** | `#0ea5e9` | `#38bdf8` | `rgba(14,165,233,0.15)` | ℹ️ Information |

### Stardust - Text Hierarchy
High contrast text for excellent readability.

| Token | Hex | Contrast | Usage |
|-------|-----|----------|-------|
| `--text-primary` | `#f1f5f9` | 15.8:1 | Headlines |
| `--text-secondary` | `#cbd5e1` | 10.5:1 | Body text |
| `--text-muted` | `#94a3b8` | 6.2:1 | Captions |
| `--text-disabled` | `#64748b` | 4.1:1 | Disabled |
| `--text-inverse` | `#0f172a` | — | On light bg |

---

## 🌈 Gradient Presets

```css
--gradient-nebula: linear-gradient(135deg, #6366f1, #8b5cf6);
--gradient-aurora: linear-gradient(135deg, #22d3ee, #6366f1, #8b5cf6);
--gradient-sunset: linear-gradient(135deg, #f87171, #8b5cf6);
--gradient-cosmic: linear-gradient(180deg, #020617, #0f172a, #1e293b);
```

---

## 🪟 Glass Surface System

| Class | Background | Blur | Border | Use Case |
|-------|------------|------|--------|----------|
| `.glass` | 80% opacity | 20px | Light | Standard cards |
| `.glass-elevated` | 85% opacity | 24px | Strong | Modals, dropdowns |
| `.glass-subtle` | 50% opacity | 12px | Light | Overlays |
| `.glass-bg-solid` | Solid `#1e293b` | None | — | Non-blur cards |

---

## 📐 Component Usage

### Buttons
```html
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-danger">Delete</button>
<button class="btn btn-success">Confirm</button>
<button class="btn btn-ghost">Subtle</button>
```

### Cards
```html
<div class="card">Standard card</div>
<div class="card-elevated">Modal/important card</div>
<div class="card-interactive">Clickable card</div>
```

### Text Effects
```html
<h1 class="text-gradient">Gradient Title</h1>
<h1 class="text-shimmer">Animated Shimmer</h1>
<h1 class="text-glow">Glowing Text</h1>
```

---

## ✨ Cosmic Effects

4 floating orbs with different colors:
- **Indigo** (top-right) - 600px, 40% opacity
- **Purple** (bottom-left) - 500px, 35% opacity  
- **Cyan** (center-right) - 400px, 30% opacity
- **Rose** (top-left) - 350px, 25% opacity

All effects respect `prefers-reduced-motion`.

---

## ♿ Accessibility

- ✅ All text meets WCAG AA contrast (4.5:1+)
- ✅ Focus states with 2px nebula outline
- ✅ `prefers-reduced-motion` respected
- ✅ `aria-hidden` on decorative elements
- ✅ RTL text direction support
