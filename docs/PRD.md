# UniVerse - Product Requirements Document

**Version:** 3.0  
**Last Updated:** January 20, 2026  
**Status:** 📋 Specification - Ready for Implementation

---

## 1. Executive Summary

**UniVerse** هي منصة مغلقة لطلاب جامعة واحدة لعرض وبيع المنتجات والخدمات المستعملة.

| Item | Details |
|------|---------|
| **Model** | Listing-only platform (مثل OLX) - لا معاملات مالية |
| **Auth** | Google OAuth + التحقق من الرقم الأكاديمي |
| **Contact** | واتساب أو مكالمة مباشرة فقط |
| **Cost** | Zero-cost (Firebase Free Tier) |

---

## 2. Problem Statement

- الاعتماد على جروبات فيسبوك/واتساب غير منظمة
- صعوبة التحقق من هوية البائع
- إعلانات قديمة وغير مرتبة
- غياب مساحة موثوقة داخل الجامعة

---

## 3. MVP Goals

- ✅ إطلاق في جامعة واحدة
- ✅ نشر إعلانات فوري بدون مراجعة
- ✅ بحث وفلترة بسيطة
- ✅ توثيق بالاسم والرقم الأكاديمي
- ✅ تكلفة صفرية (Firebase Free Tier)

---

## 4. Target Audience

**طلاب الجامعة فقط** - جميع الكليات والسنوات الدراسية.

❌ لا يُسمح لغير الطلاب بالتسجيل.

---

## 5. Scope

### 5.1 In-Scope (MVP)

#### Registration & Authentication
- Google OAuth للتسجيل والدخول
- التحقق من الرقم الأكاديمي والاسم
- كل رقم أكاديمي ← حساب Google واحد فقط
- رقم الهاتف يُطلب عند نشر أول إعلان فقط

#### Listings
- نوع: منتج / خدمة
- العنوان: required, max 60 حرف
- الوصف: required, max 500 حرف
- السعر: optional (EGP)
- الصور: optional, max 5, max 2MB each
- طريقة التواصل: واتساب / مكالمة
- النشر فوري بدون مراجعة
- لا يوجد حد لعدد الإعلانات
- لا يوجد تاريخ انتهاء

#### Listing Management
- عرض إعلاناتي في صفحة البروفايل
- تعديل الإعلان (جميع الحقول)
- حذف الإعلان (soft delete)
- حالتان: Published / Deleted

#### Browse & Search
- الصفحة الرئيسية: آخر الإعلانات (infinite scroll)
- شريط بحث نصي (Algolia Search)
- فلتر: الكل / منتجات / خدمات
- ترتيب: الأحدث أولاً
- Typo-tolerant search

#### Contact
- زر "تواصل على واتساب" → `wa.me/{phone}`
- زر "اتصال مباشر" → `tel:{phone}`
- عرض اسم الناشر
- عرض الرقم الأكاديمي جزئياً (مثال: `20**0001`)

#### Reporting
- زر "إبلاغ عن الإعلان"
- أسباب: محتوى غير لائق / احتيال / spam / أخرى
- Auto-flag بعد 3 بلاغات

#### Static Pages
- سياسة الخصوصية
- شروط الاستخدام + إخلاء المسؤولية
- عن المنصة (About)

### 5.2 Out-of-Scope (Phase 2)

- دفع داخلي أو وساطة مالية
- شات داخلي
- تقييمات ومراجعات
- دعم جامعات متعددة
- إشعارات Push
- حفظ الإعلانات المفضلة
- نظام Admin panel متقدم
- Rate limiting / CAPTCHA
- حد الإعلانات للمستخدم
- تاريخ انتهاء الإعلانات

---

## 6. Functional Requirements

### FR1-FR3: Registration
- **FR1:** صفحة تسجيل بزر "التسجيل عبر Google" + حقول الرقم الأكاديمي والاسم
- **FR2:** Validation: الرقم الأكاديمي `^\d{4,10}$`, رقم الهاتف `^01[0125][0-9]{8}$`, unique
- **FR3:** الحساب يُفعّل فورًا بعد التحقق

### FR4: Login
- **FR4:** صفحة دخول بزر "الدخول عبر Google" + رسالة إذا غير مسجل

### FR5: Logout
- **FR5:** زر "تسجيل خروج" يمسح الـ session cookie + يعمل signOut من Firebase + redirect للصفحة الرئيسية

### FR6-FR9: Create Listing
- **FR6:** واجهة نشر: type, title, description, price, images, phone, contact method
- **FR7:** عند أول إعلان: رقم الهاتف required + يُحفظ في users
- **FR8:** النشر فوري
- **FR9:** Image: max 2MB, convert to WebP, thumbnails 300x300

### FR10-FR12: Manage Listings
- **FR10:** صفحة "إعلاناتي"
- **FR11:** أزرار تعديل وحذف (soft delete)
- **FR12:** الإعلانات المحذوفة لا تظهر في التصفح

### FR13-FR15: Edit Listing
- **FR13:** صفحة تعديل الإعلان `/listing/[id]/edit` تعرض البيانات الحالية
- **FR14:** المستخدم يمكنه تعديل: العنوان، الوصف، السعر، طريقة التواصل، الصور (إضافة/حذف)
- **FR15:** `type` (منتج/خدمة) و `phoneNumber` غير قابلين للتعديل

### FR16-FR20: Search & Filter
- **FR16:** شريط بحث في Header
- **FR17:** Algolia Search على العنوان والوصف مع typo-tolerance
- **FR18:** فلتر Chips: الكل / منتجات / خدمات
- **FR19:** ترتيب: الأحدث أولاً
- **FR20:** Infinite scroll (20 items)

### FR21-FR22: Listing Details
- **FR21:** عرض: صور, العنوان, الوصف, السعر, معلومات الناشر, تاريخ النشر, أزرار التواصل
- **FR22:** زر "إبلاغ عن الإعلان"

### FR23-FR25: Reporting
- **FR23:** Modal: radio للسبب + حقل تفاصيل optional
- **FR24:** البلاغ يُخزن في reports collection
- **FR25:** 3 بلاغات → auto-flag

### FR26-FR28: Static Pages
- **FR26:** Privacy Policy
- **FR27:** Terms & Disclaimer
- **FR28:** About

---

## 7. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | تحميل < 2 ثانية, Lazy loading |
| **Security** | Google OAuth, Firestore Rules |
| **Capacity** | 5000 إعلان, 1000 مستخدم شهرياً |
| **Compatibility** | Mobile-first, Chrome/Safari/Firefox |
| **Scalability** | Architecture قابل لإضافة features |

---

## 8. User Flows

### 8.1 Registration
```
1. زيارة /register
2. Click "التسجيل عبر Google"
3. Google OAuth popup → اختيار الحساب
4. Redirect → إدخال الرقم الأكاديمي والاسم الكامل
5. Submit → Server Action verifyAndRegisterStudent
6. Success → Redirect to Home
7. Error → عرض رسالة الخطأ
```

### 8.2 Login
```
1. زيارة /login
2. Click "الدخول عبر Google"
3. Google OAuth
4. Check: هل الـ UID موجود في users collection؟
   - نعم → Redirect to Home
   - لا → "هذا الحساب غير مسجل" + رابط للتسجيل
```

### 8.2.1 Logout
```
1. Click "تسجيل خروج" (في Navigation أو dropdown)
2. Client يستدعي signOut(auth) من Firebase SDK
3. Client يستدعي Server Action logoutUser()
4. Server Action يمسح session cookie
5. Redirect للصفحة الرئيسية /
6. Middleware يمنع الوصول للصفحات المحمية
```

### 8.3 Create Listing
```
1. Click "انشر إعلان"
2. إذا غير مسجل → Redirect to login
3. ملء الحقول
4. إذا أول إعلان: عرض حقل رقم الهاتف (required)
5. رفع الصور (optional)
6. Submit → حفظ في listings
7. Redirect to listing details
```

### 8.3.1 Edit Listing
```
1. زيارة /listing/[id]/edit أو click "تعديل" من صفحة إعلاناتي
2. Check: هل المستخدم صاحب الإعلان؟
   - نعم → تحميل الفورم بالبيانات الحالية
   - لا → Redirect لصفحة الإعلان + error toast
3. Pre-fill: العنوان، الوصف، السعر، طريقة التواصل
4. عرض الصور الحالية مع زر (X) للحذف
5. إمكانية إضافة صور جديدة (حد أقصى 5 إجمالي)
6. Submit → Server Action updateListing
   - التحقق من الملكية
   - تحديث Firestore
   - حذف الصور المحذوفة من Supabase Storage
   - مزامنة Algolia
7. Success → Toast "تم تحديث الإعلان" + Redirect لصفحة الإعلان
8. Error → عرض رسائل الخطأ
```

### 8.4 Search
```
1. كتابة في شريط البحث
2. Algolia Search على العنوان والوصف (typo-tolerant)
3. عرض النتائج
4. اختيار فلتر → Algolia facet filter
```

---

## 9. UI States

### 9.1 Loading States

| State | UI |
|-------|-----|
| Page loading | Skeleton loader |
| Button action | Spinner + disabled |
| Image upload | Progress bar |
| Search | Skeleton cards |

### 9.2 Empty States

| State | Message |
|-------|---------|
| No listings | لا توجد إعلانات بعد |
| No search results | لا توجد نتائج لـ "{query}" |
| No user listings | لم تنشر أي إعلانات بعد |

---

## 10. Acceptance Criteria

### Must-Have للإطلاق:

- ✅ التسجيل عبر Google OAuth يعمل
- ✅ التحقق من الرقم الأكاديمي يعمل
- ✅ نشر إعلان يظهر فورًا
- ✅ رفع الصور يعمل
- ✅ البحث والفلترة يعمل
- ✅ صفحة التفاصيل تعرض كل المعلومات
- ✅ أزرار التواصل تعمل
- ✅ الإبلاغ يعمل
- ✅ تعديل/حذف الإعلان يعمل
- ✅ Firestore Rules تحمي البيانات
- ✅ الصفحات الثابتة موجودة

---

## 11. Timeline (6-8 Weeks)

| Phase | Duration | Tasks |
|-------|----------|-------|
| **Pre-Dev** | 1 day | إعداد students CSV |
| **Week 1-2** | Setup & Auth | Firebase setup, students import, OAuth, verification |
| **Week 3-4** | Listings | نشر + رفع الصور, صفحة التفاصيل, إدارة الإعلانات |
| **Week 5-6** | Search & Polish | البحث والفلترة, Infinite scroll, الإبلاغ, UI |
| **Week 7-8** | Testing & Launch | Beta testing, الصفحات الثابتة, Security review, Deployment |

---

## 12. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Spam | متوسط | متوسط | Auto-flag + مراقبة |
| حسابات مزيفة | منخفض | عالي | التحقق من students DB |
| تجاوز Free Tier | منخفض | متوسط | Caching + Pagination |

---

## 13. Data Requirements

### 13.1 Students CSV Format

**File:** `students.csv`

```csv
academicId,fullName
20210001,أحمد محمد علي السيد
20210002,فاطمة حسن عبدالله
```

**Requirements:**
- UTF-8 encoding
- academicId: 4-10 أرقام بدون مسافات
- fullName: الاسم الكامل بالعربي

### 13.2 Data Source & Refresh

| Item | Value |
|------|-------|
| **Provider** | شؤون الطلاب (Student Affairs) |
| **Format** | CSV export from university SIS |
| **Initial Load** | Pre-launch (before Week 1) |
| **Refresh Frequency** | بداية كل فصل دراسي (semester start) |
| **New Students** | Re-import full CSV (idempotent script) |
| **Graduated Students** | Remain in DB (can still login, cannot re-register) |
| **Transfer Students** | Added in next refresh cycle |

> **Note:** The `import-students.ts` script is idempotent—re-running with updated CSV adds new students without affecting existing records.

---

## Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture & code examples
- [ERD.md](./ERD.md) - Database schema
- [SECURITY.md](./SECURITY.md) - Security rules & policies
- [OPERATIONS.md](./OPERATIONS.md) - Admin, backup, monitoring
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Dev setup & testing
