# UniVerse - Operations Guide

**Version:** 3.0  
**Last Updated:** January 20, 2026

---

## 1. Admin Access Strategy

> لا يوجد Admin Panel كامل في MVP. الإدارة تتم عبر الأدوات التالية.

### 1.1 Access Methods

| Task | Tool | Access |
|------|------|--------|
| مراجعة الإعلانات المُبلَّغ عنها | Firebase Console → Firestore | Project Owner |
| حل البلاغات | Firebase Console → Firestore | Project Owner |
| تحديث بيانات الطلاب | Firebase Console → Firestore | Project Owner |
| إعادة Algolia Sync | CLI Script | Developer |
| تصدير البيانات | Firebase Console → Export | Project Owner |

### 1.2 Access Control

| Role | People | Permissions |
|------|--------|-------------|
| **Project Owner** | مطور المشروع الأساسي | Full Firebase Console access |
| **Developer** | فريق التطوير | CLI scripts, Vercel logs |
| **No Public Admin** | - | لا توجد واجهة admin عامة في MVP |

---

## 2. Admin Queries

### 2.1 Firestore Console Queries

```javascript
// Flagged listings
db.collection('listings').where('isFlagged', '==', true)

// Pending reports
db.collection('reports').where('status', '==', 'pending')

// Listings needing Algolia sync
db.collection('listings').where('needsAlgoliaSync', '==', true)

// Deleted listings (for cleanup)
db.collection('listings').where('isDeleted', '==', true)
```

---

## 3. Admin Scripts

### 3.1 Algolia Retry Sync

**File:** `scripts/algolia-retry-sync.ts`

```bash
# Run manually
npx ts-node scripts/algolia-retry-sync.ts
```

### 3.2 Students Import

**File:** `scripts/import-students.ts`

```bash
# Import students from CSV (idempotent - safe to re-run)
npx ts-node scripts/import-students.ts students.csv

# Validate CSV without importing
npx ts-node scripts/import-students.ts students.csv --dry-run
```

> **Algorithm:** Reads CSV, validates format (academicId: 4-10 digits, fullName: non-empty), creates documents in `students` collection. Skips existing records.

### 3.3 Cleanup Deleted Listings

**File:** `scripts/cleanup-deleted-listings.ts`

> **Source of Truth:** Firestore is the source of truth. Script queries Firestore for deleted listings, then removes corresponding Storage images.

```bash
# Dry run first (shows what would be deleted)
npx ts-node scripts/cleanup-deleted-listings.ts --dry-run

# Actual cleanup (30 days retention)
npx ts-node scripts/cleanup-deleted-listings.ts

# Custom retention
npx ts-node scripts/cleanup-deleted-listings.ts --days=60
```

**Algorithm:**
1. Query Firestore: `listings` where `isDeleted == true` AND `deletedAt < (now - 30 days)`
2. For each listing:
   - Delete all images from Storage path `listings/{userId}/{listingId}/*`
   - Hard delete Firestore document
3. Log results

### 3.4 Storage Cleanup (Orphaned Images)

**File:** `scripts/cleanup-orphaned-images.ts`

```bash
# Dry run first
npx ts-node scripts/cleanup-orphaned-images.ts --dry-run

# Actual cleanup
npx ts-node scripts/cleanup-orphaned-images.ts
```

> **Note:** This handles orphaned images (e.g., user uploaded but didn't submit). Uses Firestore as source of truth - compares active `listings.imagePaths[]` against Storage files.

### 3.5 Migrate Image Paths (One-time)

**File:** `scripts/migrate-image-paths.ts`

> **Purpose:** For existing listings created before the `imagePaths` field was introduced. Extracts storage paths from signed URLs and populates the `imagePaths` field.

```bash
# Preview changes (safe)
npx ts-node scripts/migrate-image-paths.ts --dry-run

# Apply migration
npx ts-node scripts/migrate-image-paths.ts
```

---

## 4. Storage Management

### 4.1 Data Lifecycle

| Phase | Duration | Behavior |
|-------|----------|----------|
| Active | Indefinite | Listing visible + images accessible |
| Soft Delete | 30 days (configurable) | `isDeleted: true`, hidden from search, images remain |
| Hard Delete | After retention | Cleanup script deletes document + images |

```bash
# Run hard delete cleanup with custom retention
npx ts-node scripts/cleanup-deleted-listings.ts --days=30
```

### 4.2 Monitoring

| Threshold | Action |
|-----------|--------|
| 800MB used | Run cleanup script |
| 1GB reached | Upgrade plan or aggressive cleanup |

---

## 5. Backup Strategy

### 5.1 Limitations

> **Warning:** Firebase Spark (Free) Plan does not support automated backups.

### 5.2 Manual Export

**Option A: Firebase Console**
```
Firestore → ⋮ → Export documents
```

**Option B: gcloud CLI**
```bash
gcloud firestore export gs://[BUCKET_NAME]/backups/$(date +%Y-%m-%d)
```

### 5.3 Schedule

| Frequency | Responsible | Location |
|-----------|-------------|----------|
| Weekly | Project Owner | Google Cloud Storage |
| Before major deployment | Developer | Local export |

### 5.4 Recovery Procedure

1. إيقاف التطبيق مؤقتاً (Vercel → Pause)
2. استيراد من آخر backup
3. التحقق من data integrity
4. إعادة Algolia sync (full re-index)
5. Resume application

---

## 6. Observability

### 6.1 Included (Free)

| Tool | Purpose | Access |
|------|---------|--------|
| Vercel Analytics | Page views, performance | Vercel Dashboard |
| Vercel Logs | Server Action errors | Vercel Dashboard |
| Firebase Console | Auth failures, Firestore usage | Firebase Console |
| Algolia Dashboard | Search queries, index health | Algolia Dashboard |

### 6.2 Logging Strategy (MVP)

| What | Where | Retention |
|------|-------|-----------|
| Server Action errors | Vercel Logs | 1 hour (Hobby) / 3 days (Pro) |
| Auth failures | Firebase Console → Authentication | 30 days |
| Firestore read/write | Firebase Console → Usage | Real-time |
| Search queries | Algolia Dashboard → Analytics | 30 days |

**Server Action Logging Pattern:**

```typescript
// In Server Actions (example)
export async function createListing(data: ListingInput) {
  try {
    // ... business logic
  } catch (error) {
    // Log to Vercel (automatically captured by console)
    console.error('[createListing] Error:', {
      userId: session?.uid,
      listingData: { title: data.title, type: data.type },
      error: error instanceof Error ? error.message : error,
      timestamp: new Date().toISOString(),
    });
    return { success: false, code: 'NET_002', message: '...' };
  }
}
```

> **MVP Approach:** Use platform built-in logging (Vercel + Firebase Console). No custom logging infrastructure. Upgrade to Sentry/LogRocket in Phase 2 if needed.

### 6.3 Not Included (Phase 2)

| Tool | Purpose |
|------|---------|
| Sentry | Error tracking with stack traces |
| Google Analytics 4 | User behavior analytics |
| Custom logging service | Business metrics, audit trail |

---

## 7. Monitoring Thresholds

### 7.1 Critical Alerts (Manual Check)

| Metric | Threshold | Check Frequency |
|--------|-----------|-----------------|
| Algolia searches | 8,000/month | Weekly |
| Supabase Storage | 800MB | Weekly |
| Firestore reads | 40,000/day | Daily |
| Auth failures | Spike | Weekly |

### 7.2 Checklist

**Weekly**
- [ ] Check Algolia usage
- [ ] Check Storage usage
- [ ] Review flagged listings
- [ ] Review pending reports

**Monthly**
- [ ] Export backup
- [ ] Review security rules
- [ ] Check free tier limits

---

## 8. Incident Response

### 8.1 Data Loss

1. Stop application (Vercel → Pause)
2. Assess damage scope
3. Import from latest backup
4. Verify data integrity
5. Re-sync Algolia
6. Resume and monitor

### 8.2 Free Tier Exceeded

1. Identify which limit was exceeded
2. Implement immediate mitigation (caching, pagination)
3. Consider upgrading to paid tier
4. Document for Phase 2 planning

### 8.3 Spam Outbreak

1. Review flagged listings
2. Identify patterns (same user, content)
3. Manually flag additional listings
4. Consider temporary registration pause
5. Plan rate limiting for Phase 2

---

## Related Documents

- [PRD.md](./PRD.md) - Product requirements
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [SECURITY.md](./SECURITY.md) - Security rules & policies
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Dev setup & testing
