# Setup Sistem Admin Cerita Batik

## 1. Database Setup

### Jalankan SQL Schema di Supabase
Buka file `admin-schema.sql` dan jalankan semua query di Supabase SQL Editor untuk membuat:
- Tabel `admin_roles` - Role-based access control
- Tabel `admin_users` - User admin yang terhubung ke profiles
- Tabel `media` - Manajemen file upload
- Tabel `product_images` - Multiple images per produk
- RLS Policies untuk keamanan

### Setup Storage Buckets
Di Supabase Dashboard > Storage, buat bucket berikut:
- `product-images` - Untuk gambar produk
- `profile-avatars` - Untuk avatar user/artisan
- `article-images` - Untuk gambar artikel

## 2. Setup Admin User

### Langkah 1: Buat User di Supabase Auth
1. Buka Supabase Dashboard > Authentication > Users
2. Klik "Add User" atau gunakan signup biasa
3. Catat UUID user yang dibuat

### Langkah 2: Buat Profile
```sql
INSERT INTO profiles (id, username, avatar_url) 
VALUES ('UUID_USER_YANG_DIBUAT', 'admin', 'https://randomuser.me/api/portraits/men/1.jpg');
```

### Langkah 3: Buat Admin User
```sql
INSERT INTO admin_users (id, role_id) 
VALUES (
  'UUID_USER_YANG_DIBUAT',
  (SELECT id FROM admin_roles WHERE name = 'super_admin')
);
```

## 3. Fitur Admin yang Tersedia

### Dashboard (`/admin`)
- Overview statistik produk, artisan, media
- Quick actions untuk tambah data
- Recent activity log

### Manajemen Produk (`/admin/products`)
- Daftar semua produk dengan search & filter
- Tambah produk baru dengan upload gambar
- Edit & hapus produk
- Multiple image upload

### Login Admin (`/admin/login`)
- Form login email/password
- Validasi role admin
- Redirect ke dashboard jika berhasil

## 4. Upload Media

### Product Images
- Upload multiple images per produk
- Drag & drop interface
- Preview sebelum save
- Otomatis upload ke Supabase Storage

### File Management
- Semua file disimpan di Supabase Storage
- Public URL otomatis generated
- Metadata disimpan di tabel `media`

## 5. Role-Based Access

### Super Admin
- Akses penuh ke semua fitur
- Manage users, products, artisans, media
- View analytics

### Content Manager
- Manage products, media, content
- Tidak bisa manage users

### Product Manager
- Manage products & media saja
- Akses terbatas

## 6. Keamanan

### Row Level Security (RLS)
- Admin hanya bisa akses data sesuai role
- Media hanya bisa diupload oleh admin
- Product images hanya bisa diakses admin

### Authentication
- Login dengan email/password
- Validasi role sebelum akses
- Auto logout jika bukan admin

## 7. Cara Penggunaan

### Login sebagai Admin
1. Buka `/admin/login`
2. Masukkan email dan password
3. Jika berhasil, redirect ke `/admin`

### Tambah Produk Baru
1. Dari dashboard, klik "Tambah Produk Baru"
2. Isi form informasi dasar
3. Upload gambar produk
4. Isi cerita & filosofi
5. Klik "Simpan Produk"

### Manage Media
1. Upload gambar melalui form produk
2. Atau gunakan halaman media management
3. Semua file tersimpan di Supabase Storage

## 8. Troubleshooting

### Error "Akses ditolak"
- Pastikan user sudah ditambahkan ke tabel `admin_users`
- Cek role_id sudah benar
- Pastikan RLS policies sudah aktif

### Upload gambar gagal
- Cek bucket `product-images` sudah dibuat
- Pastikan storage permissions sudah benar
- Cek file size tidak terlalu besar

### Data tidak muncul
- Refresh halaman
- Cek network tab untuk error
- Pastikan query Supabase benar

## 9. Next Steps

### Fitur yang bisa ditambahkan:
- [ ] Edit produk existing
- [ ] Manajemen artisan
- [ ] Manajemen artikel
- [ ] Analytics dashboard
- [ ] Bulk upload products
- [ ] Image optimization
- [ ] Backup & restore data

### Integrasi tambahan:
- [ ] Email notifications
- [ ] Audit log
- [ ] Advanced search
- [ ] Export data
- [ ] API endpoints 