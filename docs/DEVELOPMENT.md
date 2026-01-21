# UniVerse - Development Guide

**Version:** 3.0  
**Last Updated:** January 20, 2026

---

## 1. Local Development Setup

### 1.1 Prerequisites

- Node.js 18+
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- Git

### 1.2 Quick Start

```bash
# 1. Clone
git clone https://github.com/oabdelghanydev-eng/universe-app.git
cd universe-app

# 2. Install
npm install

# 3. Environment
cp .env.local.template .env.local
# Fill in Firebase + Algolia keys

# 4. Run
npm run dev
```

### 1.3 Firebase Emulator (Optional)

```bash
firebase emulators:start
```

---

## 2. Environment Variables

See `.env.local.template` for full list.

| Variable | Type | Required |
|----------|------|----------|
| `NEXT_PUBLIC_FIREBASE_*` | Public | Yes |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Secret | Yes (for Server Actions) |
| `NEXT_PUBLIC_ALGOLIA_*` | Public | Yes |
| `ALGOLIA_ADMIN_KEY` | Secret | Yes (for indexing) |
| `SESSION_SECRET` | Secret | Yes (for cookies) |

---

## 3. Scripts

### 3.1 Development

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Lint code
npm run type-check   # TypeScript check
```

### 3.2 Firebase

```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules,firestore:indexes

# Emulator
firebase emulators:start
```

> **Note:** Storage is handled by Supabase (see Supabase Dashboard for configuration).

### 3.3 Admin Scripts

```bash
# Retry failed Algolia syncs
npx ts-node scripts/algolia-retry-sync.ts

# Cleanup orphaned images (dry-run)
npx ts-node scripts/cleanup-orphaned-images.ts --dry-run

# Cleanup orphaned images (actual)
npx ts-node scripts/cleanup-orphaned-images.ts

# Import students from CSV
npx ts-node scripts/import-students.ts students.csv

# Cleanup deleted listings (30 days retention)
npx ts-node scripts/cleanup-deleted-listings.ts --dry-run
npx ts-node scripts/cleanup-deleted-listings.ts
```

---

## 3.4 Firestore Indexes

Composite indexes are required for complex queries. See `firestore.indexes.json`.

| Index | Fields | Purpose |
|-------|--------|---------|
| listings#1 | `isDeleted`, `isFlagged`, `createdAt DESC` | Home feed query |
| listings#2 | `isDeleted`, `isFlagged`, `type`, `createdAt DESC` | Filtered feed (products/services) |
| listings#3 | `userId`, `createdAt DESC` | My listings |
| listings#4 | `needsAlgoliaSync`, `createdAt` | Algolia retry sync |
| listings#5 | `isDeleted`, `deletedAt` | Cleanup script |
| reports#1 | `listingId`, `status` | Pending reports count |
| reports#2 | `listingId`, `reportedBy` | Duplicate report check |

**Deploy indexes:**
```bash
firebase deploy --only firestore:indexes
```

> **Note:** Indexes can take several minutes to build. Check status in Firebase Console → Firestore → Indexes.

---

## 4. Error Codes

| Code | Message (Arabic) | When |
|------|------------------|------|
| `AUTH_001` | يجب تسجيل الدخول أولاً | Not authenticated |
| `AUTH_002` | الرقم الأكاديمي غير موجود | academicId not in students |
| `AUTH_003` | الاسم غير مطابق | Name mismatch |
| `AUTH_004` | هذا الرقم مسجل بالفعل | Duplicate academicId |
| `LIST_001` | العنوان مطلوب | Empty title |
| `LIST_002` | الوصف مطلوب | Empty description |
| `LIST_003` | حجم الصورة يتجاوز 2MB | Image too large |
| `LIST_004` | نوع الملف غير مدعوم | Invalid file type |
| `LIST_005` | رقم الهاتف مطلوب | Phone required on first listing |
| `REPORT_001` | سبق لك الإبلاغ عن هذا الإعلان | Duplicate report |
| `SYNC_001` | سيتم مزامنة البحث قريباً | Algolia sync pending |
| `NET_001` | لا يوجد اتصال بالإنترنت | Network error |
| `NET_002` | حدث خطأ، حاول مرة أخرى | Generic error |

### 4.1 Error Handling Pattern

Server Actions return a structured response for consistent error handling:

```typescript
// types/index.ts
export type ActionResult<T = void> = 
  | { success: true; data?: T }
  | { success: false; code: string; message: string };

// Example Server Action
export async function createListing(data: ListingInput): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, code: 'AUTH_001', message: 'يجب تسجيل الدخول أولاً' };
    }
    
    // ... business logic
    
    return { success: true, data: { id: listingId } };
  } catch (error) {
    console.error('createListing error:', error);
    return { success: false, code: 'NET_002', message: 'حدث خطأ، حاول مرة أخرى' };
  }
}
```

### 4.2 Client-Side Error Handling

```typescript
// Component usage
const result = await createListing(formData);

if (!result.success) {
  // Show toast with error
  showError(result.code, result.message);
  
  // Optional: Handle specific error codes
  if (result.code === 'AUTH_001') {
    router.push('/login');
  }
  return;
}

// Success path
router.push(`/listing/${result.data.id}`);
```

### 4.3 Form Validation Display

```typescript
// Toast for action errors
showError(code: string, message: string);

// Form validation inline (Zod + React Hook Form)
<Input error={errors.title?.message} />
```

---

## 5. Validation Patterns

```typescript
// Academic ID: 4-10 digits
const academicIdPattern = /^\d{4,10}$/;

// Egyptian mobile
const phonePattern = /^01[0125][0-9]{8}$/;

// Listing limits
const titleMaxLength = 60;
const descriptionMaxLength = 500;
const maxImages = 5;
const maxImageSizeMB = 2;
```

---

## 6. Testing Strategy

### 6.1 Unit Tests

| Component | Tests |
|-----------|-------|
| `verifyAndRegisterStudent` | Valid/invalid academicId, name mismatch, duplicate |
| `submitReport` | 0,1,2,3+ reports, auto-flag |
| Form validations | Required fields, max length, regex |

### 6.2 Integration Tests

| Flow | Tests |
|------|-------|
| Registration | OAuth → Verify → Create user |
| Listing Creation | Auth → Form → Upload → Save |
| Search | Query → Algolia → Display |

### 6.3 E2E Tests (Manual for MVP)

- [ ] Complete registration flow
- [ ] Create listing with images
- [ ] Search and filter listings
- [ ] Report listing
- [ ] Edit/Delete own listing
- [ ] Contact buttons work

---

## 7. Content Files

### 7.1 Static Pages

**File:** `src/content/static-pages.json`

```json
{
  "about": {
    "title": "عن المنصة",
    "content": "UniVerse منصة مغلقة لطلاب الجامعة...",
    "lastUpdated": "2026-01-20"
  },
  "privacy": {
    "title": "سياسة الخصوصية",
    "sections": [
      { "heading": "جمع البيانات", "text": "..." }
    ]
  },
  "terms": {
    "title": "شروط الاستخدام",
    "sections": [...]
  }
}
```

### 7.2 Error Messages

**File:** `src/content/error-messages.json`

```json
{
  "auth": {
    "invalid-academic-id": "الرقم الأكاديمي غير موجود",
    "name-mismatch": "الاسم غير مطابق للرقم الأكاديمي",
    "already-registered": "هذا الرقم مسجل بالفعل"
  },
  "listing": {
    "title-required": "العنوان مطلوب",
    "image-too-large": "حجم الصورة يتجاوز 2MB"
  }
}
```

---

## 8. Deployment

### 8.1 Vercel (Primary)

- Automatic deploys on push to `main`
- Preview deployments for PRs
- Environment variables in Vercel Dashboard

### 8.2 Firebase (Rules Only)

```bash
# Deploy Firestore rules & indexes
firebase deploy --only firestore:rules,firestore:indexes
```

> **Note:** Storage rules are managed in Supabase Dashboard (RLS policies).

### 8.3 Pre-Deployment Checklist

- [ ] All tests pass
- [ ] Environment variables configured in Vercel
- [ ] Firebase Firestore rules deployed
- [ ] Supabase Storage bucket + RLS policies configured
- [ ] Algolia index settings configured
- [ ] students.csv imported

---

## 9. Troubleshooting

### 9.1 Common Issues

| Issue | Solution |
|-------|----------|
| "يجب تسجيل الدخول أولاً" | Session expired, re-login |
| Listing not in search | Check `needsAlgoliaSync`, run retry script |
| Image upload fails | Check size (<2MB) and type (image/*) |
| Registration fails | Verify students.csv imported correctly |

### 9.2 Debug Mode

```typescript
// Enable Firebase debug logging
firebase.setLogLevel('debug');

// Check Algolia sync status
db.collection('listings')
  .where('needsAlgoliaSync', '==', true)
  .get();
```

---

## Related Documents

- [PRD.md](./PRD.md) - Product requirements
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [SECURITY.md](./SECURITY.md) - Security rules & policies
- [OPERATIONS.md](./OPERATIONS.md) - Admin & backup procedures
