# Background System Documentation

## Overview

This document explains the background system and how to properly add/modify backgrounds to avoid common issues.

## Architecture

### Layer Structure (from back to front)

```
z-index order:
├── GlobalBackground (z-index: -20) ← Global animated background
├── WebGLBackground (z-index: -2)   ← Three.js particle system (optional)
└── Main Content (z-index: 10)      ← Page content
```

### Key Components

1. **GlobalBackground** (`src/components/ui/global-background.tsx`)
   - Primary background system using DOM elements + CSS
   - Contains animated dots, lines, and gradient blobs
   - Fixed position, z-index: -20

2. **WebGLBackground** (`src/components/three/webgl-background.tsx`)
   - Optional Three.js particle system
   - Currently NOT used in layout (can be added back if needed)
   - z-index: -2

3. **client-layout.tsx** (`src/components/layout/client-layout.tsx`)
   - Root layout component
   - Contains GlobalBackground at top level (outside main container)

## Common Issues & Solutions

### Problem: Background not showing

**Causes:**
1. Body/html has solid background color in `globals.css` that blocks background
2. Background component is inside a container with background
3. Wrong z-index (background must be lower than content)

**Solutions:**
```css
/* globals.css - body must be transparent */
html { background: transparent; }
body { background: transparent; }
```

```tsx
/* client-layout.tsx - GlobalBackground outside main container */
<ThemeProvider>
  <GlobalBackground />           {/* ← Outside the div */}
  <div className="relative z-10"> {/* ← Content with higher z-index */}
    ...
  </div>
</ThemeProvider>
```

### Problem: Hydration mismatch with Date/Time

**Cause:** Using `new Date()` in initial state

**Solution:**
```tsx
// Bad - causes hydration mismatch
const [date] = useState(new Date())

// Good - client-only
const [date, setDate] = useState<string | null>(null)
useEffect(() => { setDate(new Date().toLocaleTimeString()) }, [])
```

### Problem: SVG background cut off

**Cause:** Using `background-attachment: fixed` with percentage-based sizes

**Solution:** Use explicit viewport units or cover:
```css
background-size: 100vw 100vh;
background-position: center;
```

## Adding New Background

### Option 1: CSS-only (simplest)

Add to `globals.css`:
```css
@layer base {
  body {
    background: linear-gradient(...) ;
  }
}
```

### Option 2: Component-based (for animations)

Create new component in `src/components/ui/`:
```tsx
export function NewBackground() {
  return (
    <div className="fixed inset-0 -z-20">
      {/* background content */}
    </div>
  )
}
```

Then add to `client-layout.tsx`:
```tsx
<GlobalBackground />
<NewBackground />
```

### Option 3: WebGL/Three.js

Import and add to layout:
```tsx
const WebGLBackground = dynamic(() => import("@/components/three/webgl-background"), { ssr: false })
```

## Color System

Background uses CSS variables defined in `globals.css`:
- `--background`: Base background color
- `--primary`: Primary accent color  
- `--accent`: Secondary accent color
- `--foreground`: Text color

Dark mode uses `.dark` class with adjusted values.

## Best Practices

1. **Always use `fixed` + `-z-20` or lower** for background components
2. **Keep body/html transparent** to allow background to show through
3. **Use `pointer-events-none`** so background doesn't block interactions
4. **Test in both light and dark modes**
5. **Add `mounted` check for client-only components** to avoid hydration mismatch