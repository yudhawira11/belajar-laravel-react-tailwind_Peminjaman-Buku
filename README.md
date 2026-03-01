# Program Peminjaman Buku

Aplikasi manajemen peminjaman buku berbasis **Laravel 12 (API)** + **React 19 (SPA)** + **Tailwind CSS 4** yang dibundel dengan **Vite**. Autentikasi menggunakan **Laravel Sanctum**.

**Fitur Utama**
- Manajemen data buku.
- Proses peminjaman dan pengembalian.
- Autentikasi pengguna (Sanctum) untuk akses API.

**Teknologi**
- PHP 8.2+
- Laravel 12
- Laravel Sanctum
- React 19
- Vite 7
- Tailwind CSS 4
- MySQL

**Prasyarat**
- PHP 8.2+ dan ekstensi standar Laravel
- Composer
- Node.js + npm
- Database (MySQL)

**Instalasi Cepat (Recommended)**
1. Clone repository:
   ```bash
   git clone <URL_GITHUB>
   cd <folder yg sudah kmu clone>
   ```
2. Jalankan setup otomatis:
   ```bash
   composer run setup
   ```
3. Jalankan server pengembangan:
   ```bash
   composer run dev
   ```
4. Buka aplikasi di `http://127.0.0.1:8000` (backend) dan `http://127.0.0.1:5173` (frontend Vite).

**Instalasi Manual**
1. Clone repository:
   ```bash
   git clone <URL_GITHUB>
   cd <folder yg sudah kmu clone>
   ```
2. Salin file environment:
   ```bash
   cp .env.example .env
   ```
3. Atur database pada `.env`.
   Jika pakai MySQL, set `DB_CONNECTION=mysql`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` sesuai server Anda.
4. Install dependensi backend:
   ```bash
   composer install
   ```
5. Generate APP key:
   ```bash
   php artisan key:generate
   ```
6. Migrasi database:
   ```bash
   php artisan migrate
   ```
7. (Opsional) Seed data:
   ```bash
   php artisan db:seed
   ```
8. Install dependensi frontend:
   ```bash
   npm install
   ```
9. Jalankan frontend:
   ```bash
   npm run dev
   ```
10. Jalankan backend:
   ```bash
   php artisan serve
   ```

**Konfigurasi Frontend**
- `VITE_API_BASE_URL` di `.env` default `/api` (relative ke domain backend).
- Jika frontend dipisah domain, pastikan `SANCTUM_STATEFUL_DOMAINS` dan `CORS_ALLOWED_ORIGINS` sesuai domain frontend.

**Perintah Berguna**
- Build produksi:
  ```bash
  npm run build
  ```
- Menjalankan test:
  ```bash
  composer run test
  ```

**Akun Seed (Opsional)**
Jika menjalankan `php artisan db:seed`, tersedia user contoh:
- Email: `test@example.com`
- Password: `password`

**Lisensi**
Proyek ini menggunakan lisensi MIT.

**Web Developer by Yudha Wira Dharma**
