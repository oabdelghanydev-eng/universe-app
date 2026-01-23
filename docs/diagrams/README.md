# UniVerse Architecture Diagrams

## 📁 Files

| File | Description |
|------|-------------|
| `universe-architecture.drawio` | Main architecture and flow diagrams |

## 🎨 How to Open

### Option 1: diagrams.net (draw.io) Web
1. Go to [app.diagrams.net](https://app.diagrams.net/)
2. Click **File → Open from → Device**
3. Select `universe-architecture.drawio`

### Option 2: VS Code Extension
1. Install "Draw.io Integration" extension
2. Open the `.drawio` file directly in VS Code

### Option 3: Desktop App
1. Download from [diagrams.net](https://www.diagrams.net/)
2. Open the file

---

## 📊 Diagram Contents

### Page 1: System Architecture
High-level overview showing:
- **User/Browser** → Client-side React
- **Vercel** → Next.js 15 (App Router, RSC, Server Actions)
- **Firebase** → Auth, Firestore (Database)
- **Supabase** → Storage (Images)
- **Algolia** → Full-text Search

### Page 2: Request Flow
Detailed step-by-step flows for:

#### 📝 Create Listing Flow
```
User → Form → Compress Images → Server Action → Verify Session → Upload to Supabase → Write to Firestore → Sync to Algolia → Success
```

#### 🔐 Authentication Flow
```
User → Google Login → Firebase Auth → Get ID Token → POST /api/auth → Verify Token → Create Session Cookie → Redirect
```

#### 🔍 Search Flow
```
User types query → Algolia Client SDK → Direct API to CDN → Pre-filtered results → Render ListingCards
```

#### 🚨 Report Flow (Auto-Flag)
```
User reports → Server Action → Check duplicate → Save report → Count reports → If ≥3: Flag + Remove from Algolia
```

---

## 🎨 Color Legend

| Color | Meaning |
|-------|---------|
| 🟨 Yellow | Browser/Forms/Firestore |
| 🟩 Green | Server Actions |
| 🟥 Red | Firebase Auth/Security Checks |
| 🟦 Blue | Algolia |
| 🟢 Mint | Supabase Storage |
| 🟣 Purple | UI/Render Components |
| 🟠 Orange | Middleware |

---

## 📐 Architecture Decisions Visualized

### Why Algolia for Home Feed?
```
Problem: Firestore rules can't filter on mixed visibility states efficiently
Solution: Use Algolia (pre-filtered data: isDeleted=false, isFlagged=false)
```

### Why Server Actions instead of Cloud Functions?
```
Reason: Stay within FREE TIER ($0 cost)
- Vercel Serverless = Free
- Firebase Cloud Functions = Requires Blaze Plan ($$$)
```

### Security Flow
```
1. Client authenticates with Firebase Auth (Google OAuth)
2. ID Token sent to server (/api/auth)
3. Server creates HTTP-only session cookie (5 days, sliding)
4. All mutations go through Server Actions with session verification
5. Session renewed on every authenticated request (sliding window)
```
