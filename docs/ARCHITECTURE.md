# UniVerse - Technical Architecture

**Version:** 3.0  
**Last Updated:** January 20, 2026

---

## 1. Overview

| Item | Value |
|------|-------|
| **Project** | UniVerse - University Marketplace |
| **Pattern** | Feature-Based Architecture |
| **Stack** | Next.js 15 + Firebase + Algolia + Vercel |
| **Timeline** | 6 weeks |
| **Target** | 1,000 users/month, 5,000 listings |
| **Cost** | $0 (Free Tier Only) |

---

## 2. Tech Stack

### 2.1 Core Services

| Component | Technology | Free Tier Limits |
|-----------|------------|------------------|
| **Hosting & Compute** | Vercel | 100GB Bandwidth, Serverless Functions |
| **Database** | Firebase Firestore | 50K reads/day, 1GB storage |
| **Auth** | Firebase Auth | 50K MAUs |
| **File Storage** | Supabase Storage | 1GB storage, 2GB bandwidth |
| **Search** | Algolia | 10K searches/month, 10K records |
| **CI/CD** | GitHub + Vercel | Unlimited |

### 2.2 Frontend Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | Framework (App Router) |
| Tailwind CSS | Styling |
| React Context | State Management |
| React Hook Form + Zod | Forms & Validation |
| Firebase SDK | Backend Integration |
| Algolia InstantSearch | Search UI |
| browser-image-compression | Client-side image processing |

---

## 3. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Free Tier)                       │
├─────────────────────────────────────────────────────────────┤
│  Next.js 15 (App Router)                                    │
│  ├── React Server Components (SSR)                          │
│  └── Server Actions (Backend Logic)                         │
│      ├── verifyAndRegisterStudent                           │
│      ├── createListing / updateListing                      │
│      ├── deleteListing / submitReport                       │
│      └── syncToAlgolia (internal)                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Firebase (Spark Plan - FREE)                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Auth        │  │ Firestore   │  │ Storage             │  │
│  │ (OAuth)     │  │ (Database)  │  │ (Images)            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Algolia (Free Tier)                      │
│                    Full-text Search                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Data Flow

1. **User** accesses app via **Vercel** (Next.js App Router)
2. **Auth** handled by **Firebase Auth** (Client-side) + Session Cookies (Server-side)
3. **Data Writes** (Create/Update/Report) go through **Server Actions**:
   - Verify Auth → Write to Firestore → Sync to Algolia
4. **Data Reads** handled per operation (see matrix below)
5. **Images** uploaded via **Server Actions** to **Supabase Storage**

### 4.1 Data Access Matrix

| Operation | SDK | Reason |
|-----------|-----|--------|
| **Create User** | Admin SDK (Server Action) | Atomic batch with students collection |
| **Read User (profile)** | Client SDK | Simple read, rules allow |
| **Update User (profile fields)** | Client SDK | Field-level protection in rules |
| **Create Listing** | Admin SDK (Server Action) | Algolia sync + validation |
| **Update Listing** | Admin SDK (Server Action) | Ownership check + Algolia sync |
| **Delete Listing** | Admin SDK (Server Action) | Soft delete logic |
| **Read Listings (Home Feed)** | **Algolia** | Pre-filtered, fast, no rule issues |
| **Read Single Listing** | Client SDK | With filters: `isDeleted==false && isFlagged==false` |
| **Read My Listings** | Client SDK | Owner can see all their listings |
| **Search Listings** | Algolia | Full-text search |
| **Create Report** | Admin SDK (Server Action) | Auto-flag logic + duplicate check |
| **Upload Images** | Server Action → Supabase | Firebase Auth + service_role key |
| **Delete Images** | Server Action → Supabase | Ownership verified server-side |

> **Important:** The **Home Feed** uses **Algolia** as the data source (not Firestore) to avoid rule complications with mixed visibility states. All listings in Algolia are pre-filtered (`isDeleted: false, isFlagged: false`).



## 5. Project Structure

```
UniVerse/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group (URLs: /login, /register)
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── page.tsx                  # Home (3 states: Landing/Feed/CompleteReg)
│   │   ├── layout.tsx                # Root layout with Header
│   │   ├── globals.css
│   │   ├── profile/page.tsx
│   │   ├── listing/new/page.tsx
│   │   ├── about/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── actions/                      # Server Actions
│   │   ├── auth.ts
│   │   ├── listings.ts
│   │   └── reports.ts
│   │
│   ├── components/
│   │   ├── ui/                       # Atomic components
│   │   ├── features/                 # Feature-specific
│   │   └── layout/
│   │       └── Header.tsx            # Global header with auth state
│   │
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── client.ts             # Firebase Client SDK
│   │   │   └── admin.ts              # Firebase Admin SDK
│   │   ├── algolia/
│   │   │   ├── client.ts             # Algolia Search Client
│   │   │   └── admin.ts              # Algolia Admin Client
│   │   ├── storage/                  # OOP Storage Module
│   │   │   ├── index.ts              # Public exports
│   │   │   ├── StorageService.ts     # Low-level storage ops + URL cache
│   │   │   └── ImageService.ts       # High-level image ops + hydration
│   │   ├── supabase/
│   │   │   ├── client.ts             # Supabase Client (read-only)
│   │   │   └── admin.ts              # Supabase Admin (legacy, being phased out)
│   │   ├── auth.ts                   # Session management
│   │   ├── validation.ts             # Zod schemas + XSS sanitization
│   │   └── utils.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useListings.ts
│   │   └── useInfiniteScroll.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── content/
│       ├── static-pages.json
│       └── error-messages.json
│
├── scripts/
│   ├── algolia-retry-sync.ts
│   ├── cleanup-deleted-listings.ts
│   ├── import-students.ts
│   └── cleanup-orphaned-images.ts
│
├── docs/
├── public/
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
└── .env.local.template
```

---

## 6. Server Actions

> نستخدم Next.js Server Actions بدلاً من Cloud Functions للبقاء في Free Tier.

### 6.1 Auth: verifyAndRegisterStudent

**Path:** `src/actions/auth.ts`

```typescript
'use server'

import { db } from '@/lib/firebase-admin';
import { getServerSession } from '@/lib/auth';
import { FieldValue } from 'firebase-admin/firestore';

export async function verifyAndRegisterStudent(data: {
  academicId: string;
  fullName: string;
}) {
  const session = await getServerSession();
  if (!session) throw new Error('يجب تسجيل الدخول أولاً');

  const { academicId, fullName } = data;

  // Check for existing user with this academicId
  const existingUser = await db
    .collection('users')
    .where('academicId', '==', academicId)
    .get();
  if (!existingUser.empty) throw new Error('هذا الرقم الأكاديمي مسجل بالفعل');

  // Verify against students collection
  const studentDoc = await db.collection('students').doc(academicId).get();
  if (!studentDoc.exists) throw new Error('الرقم الأكاديمي غير موجود');

  const studentData = studentDoc.data()!;
  
  // Verify name match
  const normalizedInput = fullName.trim().replace(/\s+/g, ' ');
  const normalizedDB = studentData.fullName.trim().replace(/\s+/g, ' ');
  if (normalizedInput !== normalizedDB) throw new Error('الاسم غير مطابق');

  if (studentData.isRegistered) throw new Error('هذا الرقم مسجل بالفعل');

  // Atomic batch write
  const batch = db.batch();

  batch.set(db.collection('users').doc(session.uid), {
    fullName,
    academicId,
    email: session.email,
    photoURL: session.photoURL || null,
    phoneNumber: null,
    createdAt: FieldValue.serverTimestamp(),
    isVerified: true
  });

  batch.update(db.collection('students').doc(academicId), {
    isRegistered: true,
    registeredAt: FieldValue.serverTimestamp()
  });

  await batch.commit();
  return { success: true };
}
```

### 6.3 Auth: logoutUser

**Path:** `src/actions/auth.ts`

```typescript
'use server'

import { cookies } from 'next/headers';

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  return { success: true };
}
```

### 6.2 Reports: submitReport with Auto-flag

**Path:** `src/actions/reports.ts`

```typescript
'use server'

import { db } from '@/lib/firebase-admin';
import { algoliaAdminIndex } from '@/lib/algolia-admin';
import { getServerSession } from '@/lib/auth';
import { FieldValue } from 'firebase-admin/firestore';

export async function submitReport(
  listingId: string,
  reason: string,
  details?: string
) {
  const session = await getServerSession();
  if (!session) throw new Error('يجب تسجيل الدخول أولاً');

  // Idempotent: Composite document ID prevents race condition duplicates
  const reportId = `${listingId}_${session.uid}`;
  const reportRef = db.collection('reports').doc(reportId);

  // Check if report already exists
  const existingReport = await reportRef.get();
  if (existingReport.exists) {
    throw new Error('سبق لك الإبلاغ عن هذا الإعلان');
  }

  // Save report with deterministic ID (idempotent write)
  await reportRef.set({
    listingId,
    reportedBy: session.uid,
    reason,
    details: details || '',
    status: 'pending',
    createdAt: FieldValue.serverTimestamp()
  });

  // Count pending reports
  const reportsSnapshot = await db
    .collection('reports')
    .where('listingId', '==', listingId)
    .where('status', '==', 'pending')
    .get();

  // Auto-flag if 3+ reports
  if (reportsSnapshot.size >= 3) {
    await db.doc(`listings/${listingId}`).update({
      isFlagged: true,
      flaggedAt: FieldValue.serverTimestamp()
    });
    await algoliaAdminIndex.deleteObject(listingId);
  }

  return { success: true };
}
```

### 6.4 Listings: updateListing

**Path:** `src/actions/listings.ts`

```typescript
'use server'

import { db } from '@/lib/firebase-admin';
import { algoliaAdminIndex } from '@/lib/algolia-admin';
import { getServerSession } from '@/lib/auth';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

const updateListingSchema = z.object({
  title: z.string().min(1).max(60).transform(s => s.trim()),
  description: z.string().min(1).max(500).transform(s => s.trim()),
  price: z.number().positive().optional(),
  contactMethod: z.enum(['whatsapp', 'call']),
  images: z.array(z.string().url()).max(5),
});

export async function updateListing(
  listingId: string,
  data: z.infer<typeof updateListingSchema>
) {
  const session = await getServerSession();
  if (!session) throw new Error('يجب تسجيل الدخول أولاً');

  // Verify ownership
  const listingDoc = await db.doc(`listings/${listingId}`).get();
  if (!listingDoc.exists) throw new Error('الإعلان غير موجود');
  if (listingDoc.data()!.userId !== session.uid) {
    throw new Error('لا يمكنك تعديل هذا الإعلان');
  }

  // Validate input
  const validated = updateListingSchema.parse(data);

  // Update Firestore
  await db.doc(`listings/${listingId}`).update({
    ...validated,
    updatedAt: FieldValue.serverTimestamp(),
    needsAlgoliaSync: true,
  });

  // Sync to Algolia
  try {
    await algoliaAdminIndex.partialUpdateObject({
      objectID: listingId,
      title: validated.title,
      description: validated.description,
      updatedAt: Date.now(),
    });
    await db.doc(`listings/${listingId}`).update({
      needsAlgoliaSync: false,
      lastAlgoliaSyncAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Algolia sync failed:', error);
    // Listing is saved, sync will be retried
  }

  return { success: true };
}
```

---

## 7. Session Management

### 7.1 Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| Type | HTTP-only Cookie | XSS protection |
| Duration | 5 days (sliding) | UX/Security balance |
| Renewal | Extend on activity | Session renewed on each authenticated request |
| Secure | true (production) | HTTPS only |
| SameSite | Lax | CSRF protection |

> **Sliding Session:** Session cookie is renewed on each authenticated request. Users stay logged in as long as they remain active.

### 7.2 Session Renewal Implementation

**Path:** `src/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Note: We use a lightweight verification API route instead of 
// calling Firebase Admin directly in middleware (Edge runtime limitation)

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  
  if (!session) {
    // Redirect to login for protected routes
    if (request.nextUrl.pathname.startsWith('/profile') ||
        request.nextUrl.pathname.startsWith('/listing/new') ||
        request.nextUrl.pathname.startsWith('/listing/') && 
        request.nextUrl.pathname.endsWith('/edit')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // For protected routes, verify session is still valid
  // This happens server-side in the actual page/action, not in middleware
  // Middleware only handles cookie renewal for valid-looking sessions

  // Renew session cookie on each request (sliding session)
  const response = NextResponse.next();
  response.cookies.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 5, // 5 days
    path: '/',
  });

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

> **Security Note:** Session token verification (`auth.verifySessionCookie(session, true)`) happens in `getServerSession()` which is called by Server Actions and protected pages. Middleware cannot call Firebase Admin SDK directly due to Edge runtime limitations. If verification fails in `getServerSession()`, the session cookie is cleared and user is redirected to login.

### 7.3 getServerSession

**Path:** `src/lib/auth.ts`

```typescript
import 'server-only';
import { cookies } from 'next/headers';
import { auth } from './firebase-admin';

export interface Session {
  uid: string;
  email: string;
  photoURL?: string;
}

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) return null;

  try {
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      photoURL: decodedToken.picture || undefined
    };
  } catch {
    return null;
  }
}
```

---

## 8. Algolia Integration

### 8.1 Sync Strategy: "Save First, Sync Later"

| Scenario | Behavior |
|----------|----------|
| Sync success | الإعلان متاح في البحث فوراً |
| Sync failure | الإعلان محفوظ في Firestore + `needsAlgoliaSync: true` |
| Retry | Admin يشغل `scripts/algolia-retry-sync.ts` |

### 8.2 Index Settings

```javascript
const indexSettings = {
  searchableAttributes: ['title', 'description'],
  attributesForFaceting: [
    'filterOnly(isDeleted)',
    'filterOnly(isFlagged)',
    'type'
  ],
  ranking: ['desc(createdAt)', 'typo', 'words', 'proximity', 'attribute', 'exact'],
  typoTolerance: true
};
```

### 8.3 Frontend Search

```typescript
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

export async function searchListings(query: string, type?: 'product' | 'service') {
  const filters = ['isDeleted:false', 'isFlagged:false', type ? `type:${type}` : '']
    .filter(Boolean).join(' AND ');

  return searchClient.initIndex('listings').search(query, {
    filters,
    hitsPerPage: 20
  });
}
```

---

## 9. Image Processing

> Client-side processing (no server processing in Free Tier)

**Library:** `browser-image-compression`

> **Note:** Thumbnails (300x300) are deferred to Phase 2. Currently, only compressed full-size images are stored.

```typescript
import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp'
  });
}

export async function createThumbnail(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 300,
    useWebWorker: true,
    fileType: 'image/webp'
  });
}
```

---

## 10. Environment Variables

```bash
# .env.local

# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (Server-Only)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
ALGOLIA_ADMIN_KEY=

# Session
SESSION_SECRET=
```

---

## 11. Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "firebase": "^10.x",
    "firebase-admin": "^12.x",
    "algoliasearch": "^4.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "browser-image-compression": "^2.0.0"
  }
}
```

---

## Related Documents

- [PRD.md](./PRD.md) - Product requirements
- [ERD.md](./ERD.md) - Database schema
- [SECURITY.md](./SECURITY.md) - Security rules & policies
- [OPERATIONS.md](./OPERATIONS.md) - Admin, backup, monitoring
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Dev setup & testing
