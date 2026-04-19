# Ceyfur Halı Yıkama

Next.js 16 + Supabase ile geliştirilmiş profesyonel halı yıkama işletmesi web sitesi ve admin paneli.

## Kurulum

```bash
npm install
```

`.env.local` dosyasını oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_SECRET=guclu-bir-parola-buraya
```

## Supabase Migration

Supabase Dashboard → SQL Editor'da sırasıyla çalıştırın:

1. `supabase/migrations/000_initial_schema.sql` — Temel tablolar (site_configs, leads, leads_archive)
2. `supabase/migrations/001_auth_and_audit.sql` — Auth güçlendirme (admin_sessions, login_attempts, admin_audit_logs)

## Geliştirme

```bash
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Mimari

### API Endpoint'leri

**Public:**
- `POST /api/leads` — Müşteri talebi oluştur

**Auth:**
- `POST /api/auth/login` — Admin girişi
- `POST /api/auth/logout` — Admin çıkışı

**Admin (session cookie gerekli):**
- `GET /api/content/get` — İçerik oku (fallback durumu dahil)
- `POST /api/content` — Tüm içeriği güncelle
- `GET /api/admin/content/[section]` — Bölüm oku
- `PATCH /api/admin/content/[section]` — Bölüm güncelle (partial update)
- `GET /api/admin/leads` — Aktif talepler
- `GET /api/admin/leads?type=archive` — Arşiv
- `PATCH /api/admin/leads/[id]` — Talep durumu güncelle
- `GET /api/admin/audit-logs` — İşlem geçmişi

### Desteklenen İçerik Bölümleri

`brand`, `seo`, `hero`, `about`, `services`, `pricing`, `campaigns`, `stats`, `testimonials`, `contact`, `navigation`, `footer`

### Sayfalar

- `/` — Ana sayfa (ISR)
- `/hizmetler` — Hizmetler listesi (ISR, 1 saat)
- `/hizmetler/[slug]` — Hizmet detay (ISR, 1 saat)
- `/bolgeler` — Bölgeler listesi (ISR, 1 saat)
- `/bolgeler/[slug]` — Bölge detay (ISR, 1 saat)
- `/admin` — Admin paneli (dynamic, auth korumalı)
- `/auth/login` — Admin girişi
- `/sitemap.xml` — Otomatik sitemap (ISR, 1 saat)
- `/robots.txt` — Robots

### Güvenlik

- Session token'ları DB'de saklanır (rotation, revoke, expiry desteği)
- Brute force koruması: 15 dakikada 5 başarısız deneme → kilit
- Timing-safe parola karşılaştırması
- Tüm admin işlemleri audit log'a yazılır
- `server-only` ile client-side secret exposure önlenir
- RLS ile Supabase row-level security

### Admin Panel Özellikleri

- **Section-based save**: Her bölüm bağımsız kaydedilir, tüm site overwrite olmaz
- **Fallback banner**: Canlı veri okunamazsa admin'e görünür uyarı
- **Save-verify**: Kayıt sonrası DB'den tekrar okuyarak doğrulama
- **Audit log**: Kim ne zaman ne değiştirdi
- **Dirty tracking**: Kaydedilmemiş değişiklikler tab'larda gösterilir
- **ISR revalidation**: Admin kaydetince public sayfalar otomatik güncellenir
