# UniVerse - Project File Tree

```
UniVerse/
├── 📁 src/                              # Source Code
│   ├── 📁 app/                          # Next.js App Router (Pages)
│   │   ├── 📁 (auth)/                   # Auth Route Group
│   │   │   ├── layout.tsx               # Shared layout for auth pages
│   │   │   ├── 📁 login/
│   │   │   │   └── page.tsx             # Login page (Google OAuth)
│   │   │   └── 📁 register/
│   │   │       └── page.tsx             # Registration (Academic ID verification)
│   │   │
│   │   ├── 📁 listing/                  # Listings CRUD
│   │   │   ├── 📁 new/
│   │   │   │   └── page.tsx             # Create new listing form
│   │   │   └── 📁 [id]/
│   │   │       ├── page.tsx             # View listing details
│   │   │       ├── ListingDetailClient.tsx  # Client component for listing
│   │   │       └── 📁 edit/
│   │   │           └── page.tsx         # Edit listing form
│   │   │
│   │   ├── 📁 profile/
│   │   │   └── page.tsx                 # User profile & my listings
│   │   │
│   │   ├── 📁 about/
│   │   │   └── page.tsx                 # About page
│   │   ├── 📁 privacy/
│   │   │   └── page.tsx                 # Privacy policy
│   │   ├── 📁 terms/
│   │   │   └── page.tsx                 # Terms of service
│   │   │
│   │   ├── 📁 api/                      # API Routes
│   │   │   └── 📁 images/hydrate/
│   │   │       └── route.ts             # Convert image paths → signed URLs
│   │   │
│   │   ├── layout.tsx                   # Root layout (Header, Footer, Fonts)
│   │   ├── page.tsx                     # Home (Landing / Feed / CompleteReg)
│   │   ├── globals.css                  # Global styles + Design System
│   │   ├── loading.tsx                  # Global loading skeleton
│   │   ├── error.tsx                    # Global error boundary
│   │   └── not-found.tsx                # 404 page
│   │
│   ├── 📁 actions/                      # Server Actions (Backend Logic)
│   │   ├── auth.ts                      # Login, Register, Logout, Session
│   │   ├── listings.ts                  # CRUD for listings + Algolia sync
│   │   └── reports.ts                   # Report listing + auto-flag
│   │
│   ├── 📁 components/                   # React Components
│   │   ├── 📁 layout/
│   │   │   ├── Header.tsx               # Navigation bar + user menu
│   │   │   └── Footer.tsx               # Site footer
│   │   │
│   │   ├── 📁 features/
│   │   │   ├── ListingCard.tsx          # Listing preview card
│   │   │   ├── ListingForm.tsx          # Create/Edit listing form
│   │   │   └── ListingsFeed.tsx         # Search + filter + infinite scroll
│   │   │
│   │   ├── 📁 ui/
│   │   │   ├── DeleteConfirmModal.tsx   # Delete confirmation dialog
│   │   │   └── ReportModal.tsx          # Report listing dialog
│   │   │
│   │   └── 📁 effects/
│   │       ├── CosmicBackground.tsx     # Animated stars/meteors background
│   │       └── GlobalEffects.tsx        # Wrapper for global visual effects
│   │
│   ├── 📁 lib/                          # Utilities & Configs
│   │   ├── 📁 firebase/
│   │   │   ├── client.ts                # Firebase Client SDK (Auth, Firestore)
│   │   │   └── admin.ts                 # Firebase Admin SDK (Server-side)
│   │   │
│   │   ├── 📁 supabase/
│   │   │   ├── client.ts                # Supabase Client (read-only)
│   │   │   └── admin.ts                 # Supabase Admin (uploads/deletes)
│   │   │
│   │   ├── 📁 storage/
│   │   │   ├── index.ts                 # Storage module exports
│   │   │   ├── StorageService.ts        # Low-level upload/delete + URL cache
│   │   │   └── ImageService.ts          # High-level image operations
│   │   │
│   │   ├── 📁 algolia/
│   │   │   ├── client.ts                # Algolia Search Client (frontend)
│   │   │   └── admin.ts                 # Algolia Admin Client (sync)
│   │   │
│   │   ├── auth.ts                      # Session management (getServerSession)
│   │   └── validation.ts                # Zod schemas + XSS sanitization
│   │
│   ├── 📁 hooks/                        # React Hooks
│   │   ├── useAuth.ts                   # [Placeholder] Auth state hook
│   │   └── useImageUrls.ts              # Hydrate image paths → URLs
│   │
│   ├── 📁 types/
│   │   └── index.ts                     # TypeScript type definitions
│   │
│   └── middleware.ts                    # Route protection + session renewal
│
├── 📁 scripts/                          # Admin Scripts
│   ├── import-students.ts               # Import students from CSV
│   ├── algolia-configure.ts             # Configure Algolia index settings
│   ├── algolia-full-reindex.ts          # Full reindex Firestore → Algolia
│   ├── algolia-retry-sync.ts            # Retry failed Algolia syncs
│   ├── cleanup-deleted-listings.ts      # Hard delete old soft-deleted listings
│   ├── cleanup-orphaned-images.ts       # Delete orphaned images from storage
│   └── migrate-image-paths.ts           # Migration script for image format
│
├── 📁 docs/                             # Documentation
│   ├── PRD.md                           # Product Requirements
│   ├── ARCHITECTURE.md                  # Technical Architecture
│   ├── ERD.md                           # Database Schema
│   ├── SECURITY.md                      # Security policies & rules
│   ├── OPERATIONS.md                    # Admin operations guide
│   ├── DEVELOPMENT.md                   # Dev setup guide
│   ├── DESIGN_SYSTEM.md                 # UI/UX design tokens
│   └── 📁 diagrams/                     # Architecture diagrams
│
├── 📁 presentation/                     # Project Presentation
│   └── index.html                       # Reveal.js slides
│
├── firestore.rules                      # Firestore security rules
├── firestore.indexes.json               # Firestore composite indexes
├── firebase.json                        # Firebase project config
├── next.config.js                       # Next.js configuration
├── tailwind.config.js                   # Tailwind CSS configuration
├── tsconfig.json                        # TypeScript configuration
├── package.json                         # Dependencies
└── .env.local.template                  # Environment variables template
```

## Quick Reference

| Layer | Purpose |
|-------|---------|
| `app/` | Pages (UI) |
| `actions/` | Backend logic (Server Actions) |
| `components/` | Reusable UI |
| `lib/` | SDK configs & utilities |
| `hooks/` | React state hooks |
| `scripts/` | Admin maintenance |
| `docs/` | Documentation |
