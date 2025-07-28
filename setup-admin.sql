-- Setup Admin User untuk Cerita Batik
-- Jalankan script ini di Supabase SQL Editor setelah menjalankan admin-schema.sql

-- 1. Buat user admin (ganti dengan email yang diinginkan)
-- Catatan: User harus sudah dibuat di Supabase Auth terlebih dahulu
-- Buka Supabase Dashboard > Authentication > Users > Add User

-- 2. Profile sudah ada, langsung buat admin user
-- User bening@gmail.com sudah memiliki profile, jadi skip insert profile

-- 3. Buat admin user dengan role super_admin
INSERT INTO admin_users (id, role_id) 
VALUES (
  'cbf8a91d-c6a1-4b8f-a0e3-ffbf9b689b6f', -- UUID untuk bening@gmail.com
  (SELECT id FROM admin_roles WHERE name = 'super_admin')
);

-- 4. Verifikasi setup
-- Query ini akan menampilkan admin user yang baru dibuat
SELECT 
  au.id,
  p.username,
  ar.name as role_name,
  ar.permissions
FROM admin_users au
JOIN profiles p ON au.id = p.id
JOIN admin_roles ar ON au.role_id = ar.id
WHERE au.id = 'cbf8a91d-c6a1-4b8f-a0e3-ffbf9b689b6f';

-- 5. Test query untuk memastikan RLS policies bekerja
-- Query ini seharusnya hanya mengembalikan data jika user adalah admin
SELECT * FROM admin_users WHERE id = auth.uid();

-- 6. Setup storage bucket permissions (jalankan di Supabase Dashboard > Storage)
-- Buat bucket 'product-images' dengan public access
-- Policy untuk bucket:
-- - Authenticated users can upload
-- - Anyone can view

-- 7. Test upload file (opsional)
-- Setelah setup selesai, coba upload file di halaman admin untuk memastikan storage bekerja

-- Catatan Penting:
-- 1. Ganti 'GANTI_DENGAN_UUID_USER_ADMIN' dengan UUID user yang sebenarnya
-- 2. Pastikan user sudah dibuat di Supabase Auth sebelum menjalankan script ini
-- 3. Pastikan admin-schema.sql sudah dijalankan terlebih dahulu
-- 4. Pastikan bucket 'product-images' sudah dibuat di Storage
-- 5. Test login di /admin/login dengan email dan password user 