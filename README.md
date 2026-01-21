# UniVerse 🎓

> منصة مغلقة لطلاب الجامعة لعرض وبيع المنتجات والخدمات

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 📋 About

**UniVerse** هي منصة Listing-only (مثل OLX) مصممة خصيصاً لطلاب الجامعة. تتيح للطلاب:
- نشر إعلانات للمنتجات والخدمات
- البحث عن ما يحتاجونه
- التواصل مباشرة عبر واتساب أو مكالمة

### 🔐 الأمان
- تسجيل عبر **Google OAuth** فقط
- التحقق من هوية الطالب عبر **الرقم الأكاديمي**
- لا يمكن لغير الطلاب التسجيل

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15 (App Router) |
| **Styling** | Tailwind CSS |
| **Auth** | Firebase Authentication |
| **Database** | Cloud Firestore |
| **Storage** | Firebase Storage |
| **Search** | Algolia |
| **Hosting** | Vercel |
| **CI/CD** | GitHub Actions |

---

## 📁 Project Structure

```
src/
├── app/           # Pages (Next.js App Router)
├── components/    # UI Components
├── lib/           # Firebase, Algolia, Utils
├── hooks/         # Custom React Hooks
├── types/         # TypeScript Types
└── content/       # Dynamic JSON Content
```

📄 See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for full details.

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/oabdelghanydev-eng/universe-app.git
cd universe-app

# 2. Install
npm install

# 3. Setup environment
cp .env.local.template .env.local
# Fill in Firebase + Algolia keys

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📖 Documentation

> **Note:** This project is in the **specification phase**. Documentation describes the target architecture for implementation.

| Document | Description |
|----------|-------------|
| [PRD](docs/PRD.md) | Product Requirements |
| [Architecture](docs/ARCHITECTURE.md) | Technical Architecture & Code Examples |
| [ERD](docs/ERD.md) | Database Schema |
| [Security](docs/SECURITY.md) | Security Rules & Policies |
| [Operations](docs/OPERATIONS.md) | Admin, Backup, Monitoring |
| [Development](docs/DEVELOPMENT.md) | Dev Setup & Testing |

---

## ✨ Features

- ✅ Google OAuth Authentication
- ✅ Student Verification (Academic ID)
- ✅ Create/Edit/Delete Listings
- ✅ Image Upload (max 5 images)
- ✅ Algolia Full-text Search
- ✅ Report System (auto-flag)
- ✅ Mobile-first Responsive Design

---

## 🔧 Environment Variables

```bash
# ============================================
# Firebase Client Configuration (Public)
# ============================================
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# ============================================
# Firebase Admin SDK (Server-Only - SECRET)
# ============================================
GOOGLE_APPLICATION_CREDENTIALS=

# ============================================
# Algolia Search Configuration
# ============================================
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
ALGOLIA_ADMIN_KEY=

# ============================================
# Session Configuration
# ============================================
SESSION_SECRET=

# ============================================
# Supabase Storage Configuration
# ============================================
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# ============================================
# Environment
# ============================================
NODE_ENV=development
```

---

## 📜 License

This project is for educational purposes.

---

## 👨‍💻 Author

**Omar Abdelghany**  
IT Student

---

**Built with ❤️ for University Students**
