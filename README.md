# Flysha – Booking Tiket Pesawat

Stack: **Next.js 16 · React 19 · Prisma 7 (adapter-pg) · Better Auth · PostgreSQL · Supabase Storage · Midtrans**

## Cara menjalankan

```bash
# 1. Install
npm install

# 2. Buat file .env dari contoh, lalu isi DATABASE_URL, DIRECT_URL, BETTER_AUTH_SECRET, dst.
cp .env.example .env

# 3. Buat tabel (database lama akan di-reset, semua data lama hilang)
npx prisma migrate reset --force
npx prisma migrate dev --name init

# 4. Buat akun admin
npx prisma db seed

# 5. Jalankan
npm run dev
```

## Akun

| Peran | Login di | Email | Password |
|---|---|---|---|
| Admin | `/dashboard/signin` | admin@mail.com | admin123 |
| Customer | `/sign-up` lalu `/sign-in` | daftar sendiri | min. 4 karakter |

## Perubahan dari versi lama

- **Lucia → Better Auth.** Konfigurasi di `src/lib/auth.ts`, endpoint di `src/app/api/auth/[...all]`.
  `getUser()` tetap ada dengan bentuk return yang sama, jadi halaman lain tidak berubah cara pakainya.
- **Password** tidak lagi di tabel `user`. Better Auth menyimpannya (hash scrypt) di tabel `account`.
- **Prisma 7.** Client di-generate ke `src/generated/prisma`. Import client server: `@/lib/prisma`.
  Import tipe: `@/generated/prisma/browser`. Koneksi diatur di `prisma.config.ts`.
- **Next 16 / React 19.** `params` sekarang `Promise`, `useFormState` diganti `useActionState`
  (lewat hook `src/hooks/useFormAction.ts` supaya isi form tidak hilang saat validasi gagal).
- **Keamanan.** `customerId` transaksi diambil dari sesi di server, bukan dari body request.
  Token sesi tidak lagi dikirim ke komponen client.

## Perintah berguna

```bash
npm run db:studio    # buka Prisma Studio
npm run db:seed      # isi ulang admin (aman diulang)
```
