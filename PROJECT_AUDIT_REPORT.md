# UniVerse Project Audit Report
**Date:** 2026-01-23
**Auditor:** Antigravity (AI Agent)

## 📊 Executive Summary
The project codebase demonstrates a **High** level of code quality, utilizing modern Next.js 15 patterns (Server Actions, App Router), robust type safety (Zod), and secure authentication practices (Session Cookies, Middleware).

However, there is a **Critical Architectural Contradiction** regarding the Storage backend (Firebase vs. Supabase) and a **Logic Bug** in the custom image hydration hook that could lead to missing images in production.

---

## 🚨 Critical Issues (Must Fix)

### 1. Storage Backend Contradiction (Schizophrenic Architecture)
- **The Issue:** The project implementation is split between **Supabase Storage** and **Firebase Storage**.
- **Evidence:**
  - `src/lib/storage/StorageService.ts` explicitly imports and uses `@supabase/supabase-js`.
  - `docs/ARCHITECTURE.md` (Table 2.1) lists **Supabase Storage**.
  - `docs/ARCHITECTURE.md` (Diagram 3) lists **Firebase Storage**.
  - `src/lib/firebase/client.ts` expects `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`.
  - User context explicitly stated: *"continuing to use Firebase for... storage"*.
- **Risk:** High. You might be paying for two services, or relying on keys (`SUPABASE_SERVICE_ROLE_KEY`) that may not be configured in your environment vars if you think you are using Firebase.
- **Recommendation:** Decide on **ONE** provider. If sticking to the User's plan (Firebase), `src/lib/storage` needs to be rewritten to use `firebase-admin` for storage.

### 2. Race Condition in `useImageUrls` Hook
- **The Issue:** The batching logic in `src/hooks/useImageUrls.ts` is flawed.
- **Details:** `executeBatch` is async. If a second batch is queued while the first is fetching, the global `batchCallbacks` array might be cleared or mixed, causing the second batch's subscribers to never receive their data or receive wrong data.
- **Risk:** Medium/High. Images may randomly fail to load on the Listings Feed during rapid scrolling or concurrent mounting.
- **Recommendation:** Refactor `executeBatch` to scope callbacks to the specific batch promise, rather than using a global array that gets cleared arbitrarily.

---

## 🏗️ Architecture & Code Quality Review

### `src/middleware.ts`
- **Status:** ⚠️ Warning
- **Issue:** The middleware checks for the *existence* of a `session` cookie but does not verify its signature (due to Edge limitations).
- **Risk:** A user can spoof a cookie to bypass middleware redirects. Use `getServerSession` in all Server Actions/Pages (which you currently do) is the correct mitigation.
- **Loop Risk:** If `getServerSession` returns null (invalid sig) but the cookie exists, the page redirects to Login. If Login middleware sees the cookie and redirects to Home, you get an **Infinite Redirect Loop**.
- **Fix:** The Login page's `useEffect` or Server Action dealing with auth failure **MUST** explicitly delete the invalid cookie.

### `src/lib/validation.ts`
- **Status:** ✅ Pass
- **Notes:** Solid use of Zod and `DOMPurify`.
- **Nit:** `phoneNumber` is optional in schema, but business logic often requires it. Ensure `superRefine` is used if specific listings require it.

### `src/actions/listings.ts`
- **Status:** ✅ Pass (Excellent)
- **Notes:**
  - Good use of `server-only`.
  - Implements **Rate Limiting** (Fail-Closed).
  - Handles Atomic writes (Batching).
  - **Correction Needed:** The `where('createdAt', '>', oneDayAgo)` query likely requires a composite index in Firestore. Ensure `firestore.indexes.json` is deployed.

### `src/components/features/ListingsFeed.tsx`
- **Status:** ✅ Pass
- **Notes:** Good use of `IntersectionObserver` for infinite scroll.
- **Observation:** Relies on `ListingCard` to fetch image URLs. This works because of the (flawed) batching hook, but strictly speaking, hydration at the Feed level would be more performant than Client-side hydration.

### `scripts/import-students.ts`
- **Status:** ⚠️ Warning
- **Issue:** **N+1 Performance Problem**. The script performs a sequential `await docRef.get()` for every student record inside the batch loop.
- **Impact:** Extremely slow execution for large datasets.
- **Fix:** Use `db.getAll(...refs)` to fetch 500 docs in parallel before processing.

---

## ⚡ "Vibe Checks" & Minor Items
1.  **Frontend Timezone:** `src/app/page.tsx` uses server time (`new Date().getHours()`) for "Good Morning". on Vercel (UTC), this will be wrong for Egyptian users. Use Client-side time or hardcode "Welcome".
2.  **Hardcoded Routes:** `PROTECTED_ROUTES` in middleware. Use a centralized config.
3.  **Dead Code:** Check if `src/lib/supabase` or `src/lib/firebase/admin.ts` (storage part) is the one to keep.
4.  **Metadata:** `viewport` export seems missing in `layout.tsx` (Next.js 14+ requirement for viewport meta).

## 📝 Final Verdict
**Grade: A-**
The codebase is professional and production-oriented. Fixing the **Storage Contradiction** and **Hook Race Condition** will bring it to an A+.
