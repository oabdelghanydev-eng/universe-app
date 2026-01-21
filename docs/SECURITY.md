# UniVerse - Security Documentation

**Version:** 3.0  
**Last Updated:** January 20, 2026

---

## 1. Authentication

### 1.1 Flow

```
1. User clicks "Sign in with Google"
2. Firebase Auth handles OAuth popup
3. Firebase returns ID Token (JWT)
4. Client sends token to Server Action
5. Server verifies token via Firebase Admin SDK
6. HTTP-only session cookie created
```

### 1.2 Session Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| Type | HTTP-only Cookie | XSS protection |
| Duration | 5 days (sliding) | UX/Security balance |
| Renewal | Extend on activity | Sliding session - renewed on each request |
| Secure | true (production) | HTTPS only |
| SameSite | Lax | CSRF protection |

> **Sliding Session:** Session cookie is renewed on each authenticated request. Users stay logged in as long as they remain active.

### 1.3 Session Verification Gap (Accepted Risk)

> [!WARNING]
> **MVP Limitation:** Middleware renews session cookies without re-verifying the token with Firebase Admin SDK (Edge runtime limitation).

| Risk | Impact | Mitigation |
|------|--------|------------|
| Revoked sessions continue renewing | Medium | Token verified in `getServerSession()` on all protected pages/actions |
| Stale token window | Up to one request | Verification failure clears cookie + redirects to login |

**Phase 2 Plan:** Implement `/api/verify-session` route callable from middleware, or use `unstable_after` for background verification.

---

## 2. Firestore Security Rules

> Synced with `firestore.rules` file.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Students - Protected (Server Actions via Admin SDK only)
    match /students/{academicId} {
      allow read, write: if false;
    }
    
    // Users - Field-level protection
    // Clients can update profile fields but NOT security-critical fields
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if false; // Server Action via Admin SDK only
      allow update: if request.auth.uid == userId
                    && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['isVerified', 'academicId', 'createdAt']);
      allow delete: if false;
    }
    
    // Listings - Server Actions via Admin SDK ONLY
    // All mutations go through Server Actions for centralized logic
    match /listings/{listingId} {
      // Read: Active listings for all + Owner sees everything
      allow read: if request.auth != null 
                  && (
                    (resource.data.isDeleted == false && resource.data.isFlagged == false)
                    || resource.data.userId == request.auth.uid
                  );
      
      // Create/Update/Delete: Server Actions via Admin SDK only
      allow create: if false;
      allow update: if false;
      allow delete: if false;
    }
    
    // Reports - Server Actions via Admin SDK ONLY
    // Decision: Reports use Server Actions for auto-flag logic
    // NOTE: All report operations (read, create) use Admin SDK via Server Actions.
    // Client SDK cannot query this collection - this is intentional.
    match /reports/{reportId} {
      allow read: if false;
      allow create: if false; // Server Action handles duplicate check + auto-flag
      allow update, delete: if false;
    }
  }
}
```

> **Important:** The `reports` collection is accessed exclusively via **Admin SDK** (Server Actions). Client SDK cannot read or write to this collection. The `submitReport` Server Action handles duplicate checking and auto-flag logic server-side.


---

## 3. Storage Security (Supabase)

> **Note:** Using Supabase Storage instead of Firebase Storage (requires no Blaze plan).

### 3.1 Architecture Decision: Server-Side Uploads

Since we use **Firebase Auth** (not Supabase Auth), the Supabase RLS `auth.uid()` function doesn't work with our users. Instead, we use a **server-side approach**:

```
Client → Server Action (validates Firebase session) → Supabase Admin SDK (service_role)
```

This provides:
- ✅ Firebase Auth verification
- ✅ Server-side ownership validation
- ✅ Bypasses RLS via `service_role` key

### 3.2 Bucket Configuration

| Setting | Value |
|---------|-------|
| **Bucket Name** | `listings` |
| **Public** | No |
| **Max File Size** | 2 MB |
| **Allowed MIME Types** | image/jpeg, image/png, image/webp, image/gif |

### 3.3 RLS Policies (Fallback)

RLS policies are set but bypassed by `service_role`. They serve as defense-in-depth:

```sql
-- Allow authenticated Supabase users to read (fallback)
CREATE POLICY "Allow authenticated read" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'listings');

-- Allow authenticated users to upload to their folder (fallback)
CREATE POLICY "Allow authenticated upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'listings' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow owner to delete their images (fallback)
CREATE POLICY "Allow owner delete" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'listings' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### 3.4 Path Structure

```
listings/{userId}/{listingId}/{randomUUID}.webp
```

### 3.5 Security Layers

| Layer | Protection | Implementation |
|-------|------------|----------------|
| 1 | Firebase Auth | `getServerSession()` in Server Action |
| 2 | Ownership check | `session.uid === userId` in Server Action |
| 3 | File validation | Server-side size/type check |
| 4 | RLS (fallback) | Supabase policies for defense-in-depth |

> **Note:** Direct client-side uploads to Supabase are NOT supported due to Firebase/Supabase auth mismatch.

---

## 4. Privacy Policies

### 4.1 Academic ID Display

| Display | Format | Purpose |
|---------|--------|---------|
| Partial | `20**0001` | Hide enrollment year, show uniqueness |

### 4.2 Phone Number Access

| Field | Access |
|-------|--------|
| `users.phoneNumber` | All authenticated users (Firestore Rules) |
| `listings.phoneNumber` | All authenticated users |

> **Accepted Risk:** Any authenticated user can query users collection directly.  
> **Justification:** Phone numbers are displayed in listings anyway.

### 4.3 Phone Number Policy

| Decision | Immutable Copy |
|----------|----------------|
| `listings.phoneNumber` | Snapshot at listing creation time |
| Update behavior | User must edit listing to change |
| UI message | "سيتم استخدام الرقم الجديد للإعلانات المستقبلية" |

---

## 5. API Keys Management

| Key Type | Storage | Access |
|----------|---------|--------|
| `NEXT_PUBLIC_*` | Vercel Environment | Public (client-side) |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Vercel Environment | Secret (server-only) |
| `ALGOLIA_ADMIN_KEY` | Vercel Environment | Secret (server-only) |
| `SESSION_SECRET` | Vercel Environment | Secret (server-only) |

---

## 6. Input Sanitization

### 6.1 Policy: Plain Text Only

| Field | Policy | Implementation |
|-------|--------|----------------|
| `listing.title` | Plain text only | React default escaping |
| `listing.description` | Plain text only | React default escaping |
| `report.details` | Plain text only | React default escaping |

> **No HTML/Markdown:** User input fields are rendered as plain text using React's default JSX escaping. No HTML parsing or markdown rendering is applied.

### 6.2 Server-Side Validation

```typescript
// Server Action validation (Zod + DOMPurify)
import DOMPurify from 'isomorphic-dompurify';

function sanitize(s: string): string {
  return DOMPurify.sanitize(s.trim(), { ALLOWED_TAGS: [] });
}

const listingSchema = z.object({
  title: z.string()
    .min(1)
    .max(60)
    .transform(sanitize),  // XSS protection
  description: z.string()
    .min(1)
    .max(500)
    .transform(sanitize),  // XSS protection
});
```

### 6.3 XSS Prevention

| Layer | Protection |
|-------|------------|
| **Input** | DOMPurify sanitization (strips all HTML) |
| **Storage** | Only safe image types (jpeg, png, webp, gif) - no SVG |
| **Display** | React JSX auto-escaping |
| **Session** | HTTP-only cookies (no localStorage) |

---

## 7. Accepted Technical Risks

### 7.1 Accepted for MVP

| Risk | Probability | Impact | Decision | Phase 2 Plan |
|------|-------------|--------|----------|--------------|
| ~~No Rate Limiting~~ | ~~Medium~~ | ~~High~~ | ✅ **Implemented** | 10 listings/24h per user |
| Report Flooding | Medium | Medium | ✅ Accept | Admin manual review |
| Algolia Limit (10K/month) | Low | Medium | ✅ Accept | Monitor + fallback |
| Storage Orphans | Low | Low | ✅ Accept | Cleanup script |
| No CAPTCHA | Medium | Medium | ✅ Accept | hCaptcha |

### 7.2 Mitigations in Place

| Risk | Current Protection |
|------|-------------------|
| Spam Listings | Auto-flag after 3 reports |
| Fake Accounts | Verification against students collection |
| Unauthorized Access | Firestore Security Rules |
| Data Loss | Manual backup strategy |

---

## 8. Security Checklist

### Before Launch

- [ ] Firestore rules deployed and tested
- [ ] Storage rules deployed and tested
- [ ] All API keys in Vercel environment
- [ ] HTTPS enforced
- [ ] Session cookies configured correctly
- [ ] No secrets in client-side code
- [ ] Admin SDK credentials secured

### Ongoing

- [ ] Weekly review of flagged content
- [ ] Weekly Algolia usage check
- [ ] Monthly security rules review

---

## Related Documents

- [PRD.md](./PRD.md) - Product requirements
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [OPERATIONS.md](./OPERATIONS.md) - Admin & backup procedures
