# UniVerse - Entity Relationship Diagram (ERD)

## Mermaid ERD

```mermaid
erDiagram
    STUDENTS {
        string academicId PK "Academic ID (variable length)"
        string fullName "Full name in Arabic"
        boolean isRegistered "Default: false"
        timestamp registeredAt "null until registered"
    }
    
    USERS {
        string googleUid PK "Google Auth UID"
        string academicId FK "refs Students"
        string fullName "Copied after verification"
        string email "from Google"
        string photoURL "from Google (nullable)"
        string phoneNumber "Added on first listing"
        timestamp createdAt
        boolean isVerified "Always true"
    }
    
    LISTINGS {
        string listingId PK "Auto-generated"
        string userId FK "refs Users"
        enum type "product | service"
        string title "max 60 chars"
        string description "max 500 chars"
        number price "nullable"
        array images "max 5 image URLs"
        array imagePaths "Supabase storage paths for deletion"
        enum contactMethod "whatsapp | call"
        string phoneNumber "from User"
        boolean isDeleted "soft delete"
        timestamp deletedAt "nullable"
        boolean isFlagged "auto after 3 reports"
        timestamp flaggedAt "nullable"
        boolean needsAlgoliaSync "for retry logic"
        timestamp lastAlgoliaSyncAt "nullable"
        string algoliaSyncError "nullable"
        timestamp createdAt
        timestamp updatedAt
    }
    
    REPORTS {
        string reportId PK "Auto-generated"
        string listingId FK "refs Listings"
        string listingTitle "Cached for admin review"
        string listingOwnerId FK "refs Users (listing owner)"
        string reporterId FK "refs Users (reporter)"
        enum reason "inappropriate_content | fraud | spam | other"
        string details "Optional text (max 500 chars)"
        enum status "pending | reviewed | resolved"
        timestamp createdAt
        timestamp resolvedAt "nullable"
        string resolvedBy "nullable - admin who resolved"
        string resolution "nullable - admin notes"
    }

    STUDENTS ||--o| USERS : "verified_as"
    USERS ||--o{ LISTINGS : "creates"
    USERS ||--o{ REPORTS : "submits"
    LISTINGS ||--o{ REPORTS : "receives"
```

---

## Relationships

| From | To | Cardinality | Description |
|------|-----|-------------|-------------|
| Students | Users | 1:0..1 | كل طالب ممكن يسجل حساب واحد فقط |
| Users | Listings | 1:N | كل مستخدم ينشر عدة إعلانات |
| Users | Reports | 1:N | كل مستخدم يبلّغ عن عدة إعلانات |
| Listings | Reports | 1:N | كل إعلان ممكن يجمع عدة بلاغات |

---

## Visual Diagram

```
┌─────────────┐         ┌─────────────┐
│   STUDENTS  │         │    USERS    │
│─────────────│  1:0..1 │─────────────│
│ academicId  │◄───────►│ googleUid   │
│ fullName    │         │ academicId  │
│ isRegistered│         │ fullName    │
│ registeredAt│         │ email       │
└─────────────┘         │ phoneNumber │
                        │ createdAt   │
                        └──────┬──────┘
                               │ 1:N
                    ┌──────────┴──────────┐
                    │                     │
              ┌─────▼─────┐         ┌─────▼─────┐
              │ LISTINGS  │         │  REPORTS  │
              │───────────│         │───────────│
              │ listingId │◄───────►│ reportId  │
              │ userId    │   1:N   │ listingId │
              │ type      │         │ reporterId│
              │ title     │         │ reason    │
              │ price     │         │ status    │
              │ images    │         │ createdAt │
              │ isDeleted │         └───────────┘
              │ isFlagged │
              └───────────┘
```

---

## Notes

1. **Students → Users**: One-way verification (student data is source of truth)
2. **Soft Delete Lifecycle**: 
   - Listings use `isDeleted` flag (immediate soft delete)
   - After 30 days: cleanup script performs hard delete + removes images
   - Configurable via `--days=N` parameter
3. **Auto-Flag**: When `reports.count >= 3`, set `listing.isFlagged = true`
4. **Phone Number**: Stored in Users, copied to Listings on creation (immutable snapshot)
5. **Data Writes**: All listing mutations via Server Actions (Admin SDK) - no client-side writes

