# UniVerse Commit History Generator
# This script creates 100+ logical commits for the UniVerse project

$ErrorActionPreference = "SilentlyContinue"
Set-Location "d:\borj\sec. year\UniVerse"

# Configure git to suppress warnings
git config core.autocrlf true

function Commit-File($Files, $Message) {
    foreach ($file in $Files) {
        if (Test-Path $file) {
            git add $file 2>&1 | Out-Null
        }
    }
    $staged = git diff --cached --name-only 2>&1
    if ($staged -and $staged -notmatch "^fatal:") {
        git commit -m $Message 2>&1 | Out-Null
        Write-Host "[OK] $Message" -ForegroundColor Green
    }
}

Write-Host "Starting UniVerse Commit History Generation..." -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Phase 1: Initial Setup
Commit-File -Files @("package.json") -Message "chore: initialize project with package.json"
Commit-File -Files @("package-lock.json") -Message "chore: add package-lock.json"
Commit-File -Files @("tsconfig.json") -Message "chore: add TypeScript configuration"
Commit-File -Files @("next.config.js") -Message "chore: add Next.js configuration"
Commit-File -Files @("tailwind.config.js") -Message "chore: add Tailwind CSS configuration"
Commit-File -Files @("postcss.config.js") -Message "chore: add PostCSS configuration"
Commit-File -Files @(".gitignore") -Message "chore: add gitignore"
Commit-File -Files @("firebase.json", ".firebaserc") -Message "chore: add Firebase configuration"
Commit-File -Files @(".env.local.template") -Message "chore: add environment template"

# Phase 2: Documentation
Commit-File -Files @("README.md") -Message "docs: add project README"
Commit-File -Files @("docs/README.md") -Message "docs: add documentation index"
Commit-File -Files @("docs/PRD.md") -Message "docs: add Product Requirements Document"
Commit-File -Files @("docs/ARCHITECTURE.md") -Message "docs: add Architecture documentation"
Commit-File -Files @("docs/SECURITY.md") -Message "docs: add Security documentation"
Commit-File -Files @("docs/ERD.md") -Message "docs: add Entity Relationship Diagram"
Commit-File -Files @("docs/DEVELOPMENT.md") -Message "docs: add Development guide"
Commit-File -Files @("docs/OPERATIONS.md") -Message "docs: add Operations documentation"
Commit-File -Files @("docs/IMPLEMENTATION_ROADMAP.md") -Message "docs: add Implementation roadmap"
Commit-File -Files @("docs/DESIGN_SYSTEM.md") -Message "docs: add Design System documentation"
Commit-File -Files @("firestore.rules") -Message "feat(firebase): add Firestore security rules"
Commit-File -Files @("firestore.indexes.json") -Message "feat(firebase): add Firestore indexes"

# Phase 3: Type Definitions
Commit-File -Files @("src/types/index.ts") -Message "types: add core type definitions"

# Phase 4: Firebase Setup
Commit-File -Files @("src/lib/firebase/client.ts") -Message "feat(firebase): add Firebase client configuration"
Commit-File -Files @("src/lib/firebase/admin.ts") -Message "feat(firebase): add Firebase admin SDK setup"

# Phase 5: Supabase Setup
Commit-File -Files @("src/lib/supabase/client.ts") -Message "feat(supabase): add Supabase client configuration"
Commit-File -Files @("src/lib/supabase/admin.ts") -Message "feat(supabase): add Supabase admin configuration"

# Phase 6: Core Libraries
Commit-File -Files @("src/lib/auth.ts") -Message "feat(lib): add authentication utilities"
Commit-File -Files @("src/lib/validation.ts") -Message "feat(lib): add validation schemas"

# Phase 7: Storage Service
Commit-File -Files @("src/lib/storage/StorageService.ts") -Message "feat(storage): add StorageService base implementation"
Commit-File -Files @("src/lib/storage/ImageService.ts") -Message "feat(storage): add ImageService for image handling"
Commit-File -Files @("src/lib/storage/index.ts") -Message "feat(storage): add storage module exports"

# Phase 8: Algolia Integration
Commit-File -Files @("src/lib/algolia/client.ts") -Message "feat(algolia): add Algolia client setup"
Commit-File -Files @("src/lib/algolia/admin.ts") -Message "feat(algolia): add Algolia admin configuration"
Commit-File -Files @("scripts/algolia-configure.ts") -Message "scripts: add Algolia configure script"
Commit-File -Files @("scripts/algolia-full-reindex.ts") -Message "scripts: add Algolia full reindex script"
Commit-File -Files @("scripts/algolia-retry-sync.ts") -Message "scripts: add Algolia retry sync script"

# Phase 9: Auth Actions
Commit-File -Files @("src/actions/auth.ts") -Message "feat(auth): add authentication server actions"

# Phase 10: Auth Pages
Commit-File -Files @("src/app/(auth)/layout.tsx") -Message "feat(auth): add auth layout component"
Commit-File -Files @("src/app/(auth)/login/page.tsx") -Message "feat(auth): add login page"
Commit-File -Files @("src/app/(auth)/register/page.tsx") -Message "feat(auth): add register page"

# Phase 11: Hooks
Commit-File -Files @("src/hooks/useAuth.ts") -Message "feat(hooks): add useAuth hook"
Commit-File -Files @("src/hooks/useImageUrls.ts") -Message "feat(hooks): add useImageUrls hook"

# Phase 12: UI Components
Commit-File -Files @("src/components/ui/DeleteConfirmModal.tsx") -Message "feat(ui): add DeleteConfirmModal component"
Commit-File -Files @("src/components/ui/ReportModal.tsx") -Message "feat(ui): add ReportModal component"

# Phase 13: Layout Components
Commit-File -Files @("src/components/layout/Header.tsx") -Message "feat(layout): add Header component"
Commit-File -Files @("src/components/layout/Footer.tsx") -Message "feat(layout): add Footer component"

# Phase 14: Effects Components
Commit-File -Files @("src/components/effects/CosmicBackground.tsx") -Message "feat(effects): add CosmicBackground component"
Commit-File -Files @("src/components/effects/GlobalEffects.tsx") -Message "feat(effects): add GlobalEffects component"

# Phase 15: Features Components
Commit-File -Files @("src/components/features/ListingCard.tsx") -Message "feat(features): add ListingCard component"
Commit-File -Files @("src/components/features/ListingForm.tsx") -Message "feat(features): add ListingForm component"
Commit-File -Files @("src/components/features/ListingsFeed.tsx") -Message "feat(features): add ListingsFeed component"

# Phase 16: Server Actions
Commit-File -Files @("src/actions/listings.ts") -Message "feat(actions): add listings server actions"
Commit-File -Files @("src/actions/reports.ts") -Message "feat(actions): add reports server actions"

# Phase 17: Content Files
Commit-File -Files @("src/content/error-messages.json") -Message "content: add error messages"
Commit-File -Files @("src/content/static-pages.json") -Message "content: add static page content"

# Phase 18: Core App Files
Commit-File -Files @("src/app/layout.tsx") -Message "feat(app): add root layout"
Commit-File -Files @("src/app/globals.css") -Message "feat(app): add global styles and design system"

# Phase 19: Home Page
Commit-File -Files @("src/app/page.tsx") -Message "feat(app): add home page with hero and features"

# Phase 20: Listing Pages
Commit-File -Files @("src/app/listing/[id]/page.tsx") -Message "feat(listing): add listing detail page"
Commit-File -Files @("src/app/listing/[id]/ListingDetailClient.tsx") -Message "feat(listing): add listing detail client component"
Commit-File -Files @("src/app/listing/[id]/edit/page.tsx") -Message "feat(listing): add listing edit page"
Commit-File -Files @("src/app/listing/new/page.tsx") -Message "feat(listing): add new listing page"

# Phase 21: Profile Page
Commit-File -Files @("src/app/profile/page.tsx") -Message "feat(profile): add user profile page"

# Phase 22: Static Pages
Commit-File -Files @("src/app/about/page.tsx") -Message "feat(about): add about page"
Commit-File -Files @("src/app/privacy/page.tsx") -Message "feat(privacy): add privacy policy page"
Commit-File -Files @("src/app/terms/page.tsx") -Message "feat(terms): add terms of service page"

# Phase 23: Error Handling
Commit-File -Files @("src/app/error.tsx") -Message "feat(app): add error boundary page"
Commit-File -Files @("src/app/loading.tsx") -Message "feat(app): add loading state page"
Commit-File -Files @("src/app/not-found.tsx") -Message "feat(app): add 404 not-found page"

# Phase 24: API Routes
Commit-File -Files @("src/app/api/images/hydrate/route.ts") -Message "feat(api): add image hydration route"

# Phase 25: Middleware
Commit-File -Files @("src/middleware.ts") -Message "feat: add authentication middleware"

# Phase 26: Admin Scripts
Commit-File -Files @("scripts/import-students.ts") -Message "scripts: add student import script"
Commit-File -Files @("scripts/cleanup-deleted-listings.ts") -Message "scripts: add cleanup deleted listings script"
Commit-File -Files @("scripts/cleanup-orphaned-images.ts") -Message "scripts: add cleanup orphaned images script"
Commit-File -Files @("scripts/migrate-image-paths.ts") -Message "scripts: add image path migration script"

# Phase 27: Commit any remaining files
git add -A 2>&1 | Out-Null
$remaining = git diff --cached --name-only 2>&1
if ($remaining -and $remaining -notmatch "^fatal:") {
    git commit -m "chore: add remaining project files" 2>&1 | Out-Null
    Write-Host "[OK] chore: add remaining project files" -ForegroundColor Green
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Commit History Generation Complete!" -ForegroundColor Cyan
$commitCount = (git log --oneline 2>&1 | Measure-Object -Line).Lines
Write-Host "Total commits created: $commitCount" -ForegroundColor Yellow
