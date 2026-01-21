# UniVerse Documentation

**Version:** 3.0  
**Last Updated:** January 20, 2026

---

## Quick Navigation

| Document | Purpose | Audience |
|----------|---------|----------|
| [**PRD.md**](./PRD.md) | Product requirements (WHAT to build) | Product, Design, Dev |
| [**ARCHITECTURE.md**](./ARCHITECTURE.md) | Technical architecture (HOW to build) | Developers |
| [**ERD.md**](./ERD.md) | Database schema | Developers |
| [**SECURITY.md**](./SECURITY.md) | Security rules & policies | Developers, Security |
| [**OPERATIONS.md**](./OPERATIONS.md) | Admin, backup, monitoring | DevOps, Admin |
| [**DEVELOPMENT.md**](./DEVELOPMENT.md) | Dev setup, testing, deployment | Developers |

---

## Document Hierarchy

```
docs/
├── README.md           ← You are here
├── PRD.md              ← Start here for product context
├── ARCHITECTURE.md     ← Technical implementation
├── ERD.md              ← Data model
├── SECURITY.md         ← Security details
├── OPERATIONS.md       ← Admin & ops procedures
└── DEVELOPMENT.md      ← Dev setup & testing
```

---

## Document Responsibilities

### PRD.md (Product Requirements)
- Executive summary
- Problem & goals
- Scope (in/out)
- Functional requirements (FR1-FR24)
- Non-functional requirements
- User flows
- UI states
- Acceptance criteria
- Timeline & risks

### ARCHITECTURE.md (Technical)
- Tech stack
- Architecture diagram
- Project structure
- Server Actions code
- Session management
- Algolia integration
- Image processing
- Environment variables

### ERD.md (Data Model)
- Firestore collections schema
- Entity relationships
- Data types & constraints

### SECURITY.md (Security)
- Authentication flow
- Firestore security rules
- Supabase Storage security (RLS)
- Privacy policies
- API key management
- Accepted risks & mitigations

### OPERATIONS.md (Operations)
- Admin access strategy
- Admin queries
- Utility scripts
- Storage management
- Backup strategy
- Monitoring & alerts
- Incident response

### DEVELOPMENT.md (Development)
- Local setup
- Environment variables
- Scripts
- Error codes
- Validation patterns
- Testing strategy
- Content files
- Deployment

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 3.2 | 2026-01-21 | Added Header component, conditional home page |
| 3.1 | 2026-01-20 | Migrated storage to Supabase (zero-cost) |
| 3.0 | 2026-01-20 | Split into 6 focused documents |
| 2.2 | 2026-01-20 | Added admin, backup, security sections |
| 2.1 | 2026-01-19 | Migrated to Server Actions, Vercel |
| 2.0 | 2026-01-18 | Initial Firebase architecture |
| 1.0 | 2026-01-14 | Initial draft |

---

## Getting Started

1. **Product Context:** Start with [PRD.md](./PRD.md)
2. **Technical Setup:** Follow [DEVELOPMENT.md](./DEVELOPMENT.md)
3. **Architecture:** Reference [ARCHITECTURE.md](./ARCHITECTURE.md)
4. **Database:** Check [ERD.md](./ERD.md)
5. **Security:** Review [SECURITY.md](./SECURITY.md)
6. **Operations:** Understand [OPERATIONS.md](./OPERATIONS.md)
