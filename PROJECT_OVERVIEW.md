# cyberkesa Portfolio - Project Overview

## Project Type
**PRJ_FROM_SCRATCH** - Frontend Only Portfolio Website

## Core Requirements
1. **Performance**: 100/100 Lighthouse Score
2. **Visual Quality**: Premium luxury aesthetics
3. **Architecture**: Feature-Sliced Design (light version) adapted for Next.js App Router
4. **Tech Stack**: Next.js 15, TypeScript (Strict), Tailwind CSS, Framer Motion, Lenis, R3F (optional)

## Tech Stack Details

### Core
- **Next.js 15** (App Router, Turbo) - Base framework
- **TypeScript** (Strict Mode) - Type safety
- **Tailwind CSS** - Styling
- **clsx + tailwind-merge** - Class name utilities

### Motion & Visuals
- **Framer Motion** - Animations and orchestration
- **Lenis** (@studio-freight/lenis) - Smooth scroll
- **React Three Fiber** (optional) - 3D visuals

### Typography & Icons
- **Geist Mono** (Vercel) - Terminal aesthetic font
- **Lucide React** - Minimalist vector icons

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Global layout (Lenis, fonts, metadata)
│   ├── page.tsx            # Home page (Hero, Stack, Projects)
│   ├── global.css          # Tailwind + custom CSS variables
│   └── not-found.tsx       # Custom 404 page
│
├── components/             # UI Components
│   ├── ui/                 # Atomic components (Atoms)
│   │   ├── button.tsx      # Reusable button with hover effects
│   │   ├── card.tsx        # Bento Grid card component
│   │   ├── terminal.tsx    # Terminal window component (Hero)
│   │   └── cursor.tsx      # Custom cursor (optional)
│   │
│   ├── layout/             # Layout components (Organisms)
│   │   ├── header.tsx      # Navigation header
│   │   ├── footer.tsx      # Footer with "Initialize Contact"
│   │   └── grid.tsx        # Bento Grid wrapper
│   │
│   └── sections/           # Page sections (Business Logic)
│       ├── hero-section.tsx
│       ├── stack-section.tsx
│       └── projects-section.tsx
│
├── config/                 # Configuration & Data
│   ├── site.ts             # SEO metadata, site config
│   ├── projects.ts         # Projects data (JSON-like structure)
│   └── stack.ts            # Tech stack list for marquee
│
├── lib/                    # Utilities
│   ├── utils.ts            # cn() utility for class merging
│   └── animations.ts       # Framer Motion presets (variants)
│
└── hooks/                  # Custom React hooks
    ├── use-scroll-progress.ts
    └── use-mouse-position.ts
```

## File Descriptions

### App Router Files

**app/layout.tsx**
- Purpose: Root layout component
- Inputs: children (React.ReactNode)
- Outputs: HTML structure with Lenis provider, fonts, global styles
- Responsibilities:
  - Wrap app with Lenis smooth scroll provider
  - Load Geist Mono font
  - Set global metadata (SEO)
  - Apply global CSS

**app/page.tsx**
- Purpose: Home page component
- Inputs: None (static page)
- Outputs: Rendered home page with Hero, Stack, Projects sections
- Responsibilities:
  - Compose sections into single page
  - Handle page-level animations

**app/global.css**
- Purpose: Global styles and Tailwind directives
- Inputs: Tailwind config
- Outputs: Compiled CSS with custom variables
- Responsibilities:
  - Tailwind @base, @components, @utilities
  - CSS custom properties (colors, animations)
  - Noise texture background
  - Global resets

**app/not-found.tsx**
- Purpose: Custom 404 page
- Inputs: None
- Outputs: "System Error" styled 404 page
- Responsibilities:
  - Terminal-style error display
  - Navigation back to home

### UI Components (Atoms)

**components/ui/button.tsx**
- Purpose: Reusable button component
- Inputs: children, variant, size, onClick, className
- Outputs: Styled button with hover effects
- Responsibilities:
  - Consistent button styling
  - Hover animations (glow effect)
  - Accessibility (ARIA)

**components/ui/card.tsx**
- Purpose: Bento Grid card component
- Inputs: title, description, videoUrl, gridSize, className
- Outputs: Card with video/image, title, description
- Responsibilities:
  - Responsive grid sizing (col-span, row-span)
  - Video/image lazy loading
  - Hover effects (glow, scale)

**components/ui/terminal.tsx**
- Purpose: Terminal window component
- Inputs: children, className
- Outputs: Terminal-styled container
- Responsibilities:
  - Terminal window UI (title bar, content)
  - Typewriter effect wrapper
  - Code block styling

**components/ui/cursor.tsx** (Optional)
- Purpose: Custom cursor component
- Inputs: None
- Outputs: Custom cursor element
- Responsibilities:
  - Track mouse position
  - Custom cursor rendering
  - Hide default cursor

### Layout Components (Organisms)

**components/layout/header.tsx**
- Purpose: Site navigation header
- Inputs: None
- Outputs: Header with navigation links
- Responsibilities:
  - Navigation menu
  - Scroll progress indicator
  - Mobile menu (if needed)

**components/layout/footer.tsx**
- Purpose: Site footer
- Inputs: None
- Outputs: Footer with contact info
- Responsibilities:
  - "Initialize Contact" section
  - Social links
  - Copyright

**components/layout/grid.tsx**
- Purpose: Bento Grid wrapper
- Inputs: children, className
- Outputs: CSS Grid container
- Responsibilities:
  - Grid layout (grid-cols-1 md:grid-cols-3)
  - Auto-rows configuration
  - Gap spacing

### Section Components (Business Logic)

**components/sections/hero-section.tsx**
- Purpose: Hero section with typewriter effect
- Inputs: None
- Outputs: Hero section JSX
- Responsibilities:
  - Typewriter animation ("Initializing...")
  - Terminal aesthetic
  - CTA buttons
  - Scroll indicator

**components/sections/stack-section.tsx**
- Purpose: Tech stack marquee section
- Inputs: None
- Outputs: Stack section with running text
- Responsibilities:
  - Infinite marquee animation
  - Tech stack logos/icons
  - Smooth scrolling text

**components/sections/projects-section.tsx**
- Purpose: Projects showcase with Bento Grid
- Inputs: None
- Outputs: Projects grid section
- Responsibilities:
  - Fetch projects from config
  - Render Bento Grid
  - Project card animations
  - Video lazy loading

### Configuration Files

**config/site.ts**
- Purpose: Site metadata and configuration
- Inputs: None
- Outputs: Exported constants
- Responsibilities:
  - SEO metadata (title, description, OG)
  - Site name, URL
  - Social links

**config/projects.ts**
- Purpose: Projects data storage
- Inputs: None
- Outputs: Typed PROJECTS array
- Responsibilities:
  - Type-safe project data
  - Project structure definition
  - Grid size configuration

**config/stack.ts**
- Purpose: Tech stack list
- Inputs: None
- Outputs: Exported STACK array
- Responsibilities:
  - Technology names
  - Icons mapping
  - Stack order

### Utility Files

**lib/utils.ts**
- Purpose: Utility functions
- Inputs: class names (strings)
- Outputs: Merged class string
- Responsibilities:
  - cn() function (clsx + tailwind-merge)
  - Type-safe class merging

**lib/animations.ts**
- Purpose: Framer Motion animation presets
- Inputs: None
- Outputs: Exported animation variants
- Responsibilities:
  - fadeInUp variant
  - staggerContainer variant
  - hoverGlow variant
  - Reusable animation configs

### Custom Hooks

**hooks/use-scroll-progress.ts**
- Purpose: Track scroll progress
- Inputs: None
- Outputs: scrollProgress (0-1)
- Responsibilities:
  - Calculate scroll percentage
  - Return reactive value

**hooks/use-mouse-position.ts**
- Purpose: Track mouse position
- Inputs: None
- Outputs: { x, y } coordinates
- Responsibilities:
  - Mouse position tracking
  - Throttled updates
  - Use for glow effects

## Key Architectural Decisions

### 1. Data-as-Code
- All data stored in `config/` as TypeScript files
- Type-safe with interfaces
- No API calls, no database
- Easy to update content

### 2. Component Strategy
- Atomic Design principles (Atoms → Organisms → Sections)
- Reusable UI components
- Business logic in sections
- Clear separation of concerns

### 3. Animation Orchestration
- Centralized animation presets in `lib/animations.ts`
- Consistent animation timing
- Reusable variants
- Performance optimized

### 4. Performance Optimization
- Static generation (Next.js)
- Image/video lazy loading
- Code splitting
- CSS optimization
- Minimal JavaScript

## Implementation Steps

1. **Setup** - Initialize Next.js project with TypeScript
2. **Base UI** - Configure Tailwind, create utility functions
3. **Hero Section** - Typewriter effect, terminal UI
4. **Bento Grid** - Grid layout, card components
5. **Stack Section** - Marquee animation
6. **Projects Section** - Video cards, hover effects
7. **Polishing** - Noise texture, animations, performance tuning

## Performance Targets

- Lighthouse Score: 100/100
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

## Visual Design Principles

- **Color Palette**: Black (#050505), accent gray, glow colors
- **Typography**: Geist Mono (terminal aesthetic)
- **Effects**: Noise texture, glow effects, smooth animations
- **Layout**: Bento Grid (asymmetric, interesting)
- **Motion**: Smooth, premium feel (Lenis)

