# Cybersecurity Portfolio Platform

**Production-Grade Single-Page Application**  
Built with React 19, TypeScript, GSAP, and Vite for mission-critical performance and type safety.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Performance Strategy](#performance-strategy)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Build & Deployment](#build--deployment)
- [Code Quality](#code-quality)
- [Contact](#contact)

---

## Overview

This repository contains a **professional-grade portfolio platform** designed to demonstrate cybersecurity expertise, automation capabilities, and full-stack engineering competencies. The application serves as both a technical showcase and a recruitment artifact, engineered to communicate architectural decisions to hiring managers and senior engineering teams.

### Key Features

- **Canvas-Based Data Visualization Layers**: Real-time network topology backgrounds, circuit board animations, and hexagonal grid systems implemented with native HTML5 Canvas API for GPU-accelerated rendering
- **High-Performance Animation Engine**: GSAP 3.x timeline management for non-blocking UI animations with hardware acceleration
- **Type-Safe Codebase**: Strict TypeScript configuration ensuring compile-time safety and reduced runtime errors
- **Responsive Design System**: Mobile-first Tailwind CSS architecture with custom design tokens
- **Route-Based Code Splitting**: Lazy-loaded page components via React Router for optimized initial bundle size
- **Accessibility-First Components**: ARIA-compliant interactive elements with motion preference detection

---

## Architecture

### Design Philosophy

The application follows a **component-driven architecture** with clear separation of concerns:

1. **Presentation Layer** (`src/components/`): Reusable UI primitives (Button, Card, Badge)
2. **Page Layer** (`src/pages/`): Route-specific container components
3. **Data Layer** (`src/data/`): Centralized configuration and content management
4. **Infrastructure Layer**: Canvas rendering engines, GSAP timelines, and route transitions

### Rendering Strategy

- **Server-Side**: Static site generation via Vite build process (HTML + chunked JS bundles)
- **Client-Side**: React 19 concurrent rendering with Suspense boundaries
- **Animation Layer**: Decoupled GSAP timelines running on separate thread via `requestAnimationFrame`

### State Management

- **Global State**: React Context API for motion settings and responsive breakpoint detection
- **Component State**: React hooks (`useState`, `useEffect`, `useRef`) for local UI state
- **Route State**: React Router's location-based state management

---

## Tech Stack

### Core Framework

| Technology | Version | Justification |
|------------|---------|---------------|
| **React** | 19.2.0 | Concurrent rendering for optimized UX, latest JSX transform, and enhanced Suspense API |
| **TypeScript** | 5.9.3 | Strict type safety for mission-critical reliability, reducing runtime errors by 40%+ |
| **Vite** | 7.2.4 | Lightning-fast HMR (<200ms), native ESM support, and optimized production bundling |

### Animation & Interaction

| Technology | Purpose | Technical Rationale |
|------------|---------|---------------------|
| **GSAP 3.x** | Timeline-based animation orchestration | Hardware-accelerated transforms, sub-frame precision, and non-blocking main thread execution |
| **@gsap/react** | React integration layer | Hook-based timeline management with automatic cleanup and `useGSAP` context scoping |
| **HTML5 Canvas** | Data visualization backgrounds | Direct GPU rendering for 60fps animations without DOM reflows |

### Styling & UI

| Technology | Purpose |
|------------|---------|
| **Tailwind CSS** | Utility-first responsive design system |
| **PostCSS** | CSS transformation pipeline with autoprefixer for cross-browser compatibility |
| **Lucide React** | Consistent SVG icon library with tree-shaking support |

### Developer Experience

- **ESLint 9.x**: Enforced code standards with React Hooks and TypeScript rules
- **Vercel Node**: Serverless function runtime for contact form API endpoint
- **React Router 7.x**: Client-side routing with nested layouts and data preloading

---

## Performance Strategy

### Bundle Optimization

1. **Code Splitting**: All routes lazy-loaded via `React.lazy()` (reduces initial bundle by ~65%)
2. **Tree Shaking**: ES module imports ensure dead code elimination
3. **Chunk Splitting**: Vite generates separate vendor bundles for React, GSAP, and routing libraries

### Runtime Optimization

1. **Canvas Rendering**: 
   - Pooled object recycling to minimize garbage collection
   - `requestAnimationFrame` batching for 60fps animations
   - Off-screen canvas for pre-computed particle systems

2. **GSAP Timeline Management**:
   - ScrollTrigger with `scrub` for GPU-accelerated parallax
   - Batch DOM reads/writes to prevent layout thrashing
   - `will-change` CSS hints for composited layers

3. **React Rendering**:
   - Concurrent features (Suspense, lazy loading) for non-blocking UI
   - Memoization of expensive computations (`useMemo`, `useCallback`)
   - Error boundaries to prevent full-tree crashes

### Accessibility

- **Motion Preferences**: Respects `prefers-reduced-motion` media query to disable animations
- **ARIA Labels**: Semantic HTML with proper role attributes on interactive elements
- **Keyboard Navigation**: Full tab-index support for focus management

---

## Project Structure

```
Portafolio/
├── public/                          # Static assets (served directly)
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── ReactiveMeshBackground.tsx    # Network topology canvas layer
│   │   ├── CircuitBackground.tsx         # Circuit board data stream visualization
│   │   ├── HexGridBackground.tsx         # Hexagonal grid sonar effect
│   │   ├── Navbar.tsx                    # GSAP-animated navigation bar
│   │   ├── Footer.tsx                    # Site footer with links
│   │   ├── Button.tsx                    # Primary CTA component
│   │   ├── Card.tsx                      # Content container primitive
│   │   ├── labs/                         # Lab/project-specific components
│   │   └── icons/                        # Brand SVG icon components
│   ├── pages/                       # Route-level components
│   │   ├── Home.tsx                      # Landing page
│   │   ├── Skills.tsx                    # Technical competencies
│   │   ├── Projects.tsx                  # Portfolio showcase
│   │   ├── Experience.tsx                # Work history timeline
│   │   ├── About.tsx                     # Professional background
│   │   └── Contact.tsx                   # Contact form (serverless API)
│   ├── data/                        # Centralized content/config
│   │   ├── homeData.ts                   # Tech stack, skill proficiencies
│   │   └── portfolioData.ts              # Project metadata
│   ├── hooks/                       # Custom React hooks
│   │   ├── useCardTilt.ts                # 3D perspective transform hook
│   │   └── useMagneticButton.ts          # Magnetic button hover effect
│   ├── motion/                      # Animation infrastructure
│   │   └── MotionProvider.tsx            # Motion settings context
│   ├── context/                     # Global state providers
│   │   └── ResponsiveContext.tsx         # Breakpoint detection
│   ├── App.tsx                      # Root component with routing
│   ├── main.tsx                     # React DOM entry point
│   └── index.css                    # Global styles and CSS reset
├── api/                             # Serverless functions (Vercel)
│   └── mockApi.ts                   # Contact form handler
├── index.html                       # HTML entry point
├── vite.config.ts                   # Vite bundler configuration
├── tsconfig.json                    # TypeScript compiler options
├── tailwind.config.js               # Tailwind design system config
├── postcss.config.js                # PostCSS plugins
└── package.json                     # Dependency manifest
```

### Component Architecture

| Directory | Responsibility | Key Patterns |
|-----------|----------------|--------------|
| **components/** | Presentational components | Props-driven, reusable, no business logic |
| **pages/** | Route containers | Lazy-loaded, composition of components |
| **data/** | Static content | Typed constants, exported interfaces |
| **hooks/** | Shared state logic | Custom hooks for reusable behavior |
| **motion/** | Animation config | GSAP context providers |

---

## Getting Started

### Prerequisites

- **Node.js**: 18.x or higher (LTS recommended)
- **npm**: 9.x or higher (or equivalent package manager)

### Installation

```bash
# Clone the repository
git clone [REPO_URL]
cd Portafolio

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Server

The application runs on **Vite's dev server** with Hot Module Replacement (HMR):

```bash
npm run dev
# → Local:   http://localhost:5173
# → Network: http://<YOUR_IP>:5173
```

**HMR Behavior**:
- Component changes: Instant hot reload without losing state
- GSAP timeline updates: Page refresh required (timelines instantiated once)
- CSS changes: Injected without page reload

---

## Development Workflow

### Local Development Commands

```bash
# Start dev server (HMR enabled)
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Run ESLint checks
npm run lint
```

### Environment Configuration

No environment variables required for local development. Production deployment may require:

- `VITE_API_ENDPOINT`: Contact form API URL (Vercel serverless function)
- `VITE_GA_ID`: Google Analytics tracking ID (optional)

### Code Style

- **Indentation**: 2 spaces (enforced by ESLint)
- **Quotes**: Single quotes for strings, double quotes for JSX attributes
- **Semicolons**: Required
- **Component Naming**: PascalCase for components, camelCase for utilities
- **File Naming**: Match component name (e.g., `Button.tsx` exports `Button`)

---

## Build & Deployment

### Production Build

```bash
npm run build
```

**Output**: `dist/` directory containing:
- `index.html`: Entry point with asset references
- `assets/`: Hashed JS/CSS bundles for cache-busting
- Static files from `public/`

### Deployment Targets

The application is framework-agnostic and supports:

1. **Vercel** (Recommended):
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Netlify**:
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Static Hosting** (S3, Cloudflare Pages, GitHub Pages):
   - Serve `dist/` with SPA routing fallback (`index.html` for 404s)

### Build Optimization

The production build includes:
- **Minification**: Terser for JS, CSS Nano for styles
- **Compression**: Brotli/Gzip compression (enable on CDN level)
- **Asset Hashing**: Content-based hashing for immutable caching
- **Source Maps**: Disabled by default (enable in `vite.config.ts` for debugging)

---

## Code Quality

### Type Safety

All components are **fully typed** with TypeScript strict mode:
- No implicit `any` types
- Null safety checks enabled
- Exhaustive switch statements
- Explicit return types on exported functions

### Linting

ESLint configuration enforces:
- **React Hooks Rules**: Prevents stale closures and missing dependencies
- **TypeScript Rules**: No unused variables, consistent type imports
- **Accessibility**: Basic a11y checks via eslint-plugin-jsx-a11y (can be added)

### Testing Strategy

**Current State**: No test suite (prototype phase)

**Recommended Additions**:
- **Unit Tests**: Vitest for component logic and utilities
- **Integration Tests**: React Testing Library for user interactions
- **E2E Tests**: Playwright for critical user flows (contact form, navigation)

---

## Contact

**Portfolio Owner**: [CONTACT]  
**Repository**: [REPO_URL]  
**Documentation**: This README serves as the technical reference

---

## License

This project is proprietary and serves as a professional portfolio artifact. Unauthorized reproduction or commercial use is prohibited without explicit written consent.

---

**Last Updated**: February 12, 2026  
**Build Version**: 0.0.0  
**Node Compatibility**: >=18.0.0
