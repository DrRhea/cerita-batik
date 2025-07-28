-- Check and Create Admin User for bening@gmail.com
-- Jalankan query ini di Supabase SQL Editor

-- 1. Cek apakah admin user sudah ada
SELECT 
  au.id,
  p.username,
  ar.name as role_name,
  ar.permissions
FROM admin_users au
JOIN profiles p ON au.id = p.id
JOIN admin_roles ar ON au.role_id = ar.id
WHERE au.id = 'cbf8a91d-c6a1-4b8f-a0e3-ffbf9b689b6f';

-- 2. Jika tidak ada hasil, buat admin user
-- Jalankan query ini jika query di atas tidak mengembalikan data
INSERT INTO admin_users (id, role_id) 
VALUES (
  'cbf8a91d-c6a1-4b8f-a0e3-ffbf9b689b6f',
  'b1ecd8ed-d23b-4273-9783-b86d69465b05' -- super_admin role ID
)
ON CONFLICT (id) DO NOTHING;

-- 3. Verifikasi setelah insert
SELECT 
  au.id,
  p.username,
  ar.name as role_name,
  ar.permissions
FROM admin_users au
JOIN profiles p ON au.id = p.id
JOIN admin_roles ar ON au.role_id = ar.id
WHERE au.id = 'cbf8a91d-c6a1-4b8f-a0e3-ffbf9b689b6f';

-- 4. Test RLS policy
-- Query ini seharusnya mengembalikan data jika user login sebagai admin
SELECT * FROM admin_users WHERE id = 'cbf8a91d-c6a1-4b8f-a0e3-ffbf9b689b6f'; 