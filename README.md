# cyberkesa Portfolio

Premium Frontend Portfolio built with Next.js 15, TypeScript, and Tailwind CSS. Designed for perfect performance (100/100 Lighthouse) and luxury aesthetics.

## Tech Stack

- **Next.js 15** (App Router) - React framework
- **TypeScript** (Strict Mode) - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations with magnetic physics
- **React Three Fiber** - WebGL 3D background with shaders
- **Lenis** - Smooth scroll
- **next-intl** - Internationalization (12 languages)
- **Geist Mono** - Terminal aesthetic font
- **Lucide React** - Icons

## Architecture

This project follows **Feature-Sliced Design (light version)** adapted for Next.js App Router:

```
src/
├── app/              # Next.js App Router (routing)
│   └── [locale]/     # Internationalized routes
├── components/       # UI Components
│   ├── ui/          # Atomic components
│   ├── layout/      # Layout components
│   ├── sections/    # Page sections
│   └── visuals/     # R3F 3D components
├── config/          # Configuration & data
├── lib/             # Utilities & shaders
│   └── shaders/     # GLSL shader code
├── hooks/           # Custom React hooks
└── messages/        # i18n translations (12 languages)
```

## Key Features

- ✅ **100/100 Lighthouse Score** - Optimized for performance
- ✅ **12 Languages** - Full internationalization support
- ✅ **RTL Support** - Arabic & Hebrew
- ✅ **WebGL Background** - Liquid shader effects with mouse interaction
- ✅ **Magnetic Buttons** - Spring physics for tactile feel
- ✅ **Smooth Scroll** - Lenis integration
- ✅ **Command Palette** - Language switcher (Ctrl+K)
- ✅ **Type-Safe** - Full TypeScript strict mode

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

**Note:** If you encounter peer dependency issues with React Three Fiber and React 19, use:
```bash
npm install --legacy-peer-deps
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Visual Layers Architecture

The site uses a layered approach for optimal performance:

- **Background Layer (Z-0)**: R3F Canvas with liquid shaders
- **Grain/Overlay (Z-10)**: SVG noise filter
- **Content Layer (Z-20)**: HTML/DOM elements

The 3D background doesn't re-render on navigation, ensuring smooth transitions.

## Internationalization

The site supports 12 languages organized by region:

- **AMER**: EN, ES, PT
- **EMEA**: DE, FR, IT, RU
- **APAC**: ZH, JA, KO
- **MENA**: AR, HE (RTL)

Access language switcher via:
- Globe button (bottom right)
- Keyboard shortcut: `Ctrl+K` / `Cmd+K`

## Customization

### Adding Projects

Edit `config/projects.ts` to add or modify projects.

### Modifying Shaders

Edit `lib/shaders/fluid.ts` to customize the WebGL background effect.

### Adjusting Magnetic Physics

Edit `components/ui/magnetic-button.tsx` and modify the `springConfig`:
```typescript
const springConfig = { damping: 15, stiffness: 150, mass: 0.5 }
```

- Lower `damping` = more "jelly" effect
- Higher `stiffness` = faster response
- Higher `mass` = heavier feel

## Performance Optimization

- Static generation (no API calls)
- Image/video lazy loading
- Code splitting
- CSS optimization
- WebGL optimization (60 FPS target)
- Minimal JavaScript bundle

## License

MIT
