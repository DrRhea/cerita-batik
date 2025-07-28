-- Debug Admin Access Issues
-- Jalankan query ini di Supabase SQL Editor untuk memeriksa setup admin

-- 1. Cek apakah admin user ada
SELECT 
  au.id,
  p.username,
  ar.name as role_name
FROM admin_users au
JOIN profiles p ON au.id = p.id
JOIN admin_roles ar ON au.role_id = ar.id
WHERE au.id = 'cbf8a91d-c6a1-4b8f-a0e3-ffbf9b689b6f';

-- 2. Cek RLS policies untuk admin_users
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'admin_users';

-- 3. Test query dengan auth.uid() (akan kosong jika tidak login)
SELECT auth.uid() as current_user_id;

-- 4. Cek apakah user ada di auth.users
SELECT 
  id,
  email,
  created_at
FROM auth.users 
WHERE id = 'cbf8a91d-c6a1-4b8f-a0e3-ffbf9b689b6f';

-- 5. Cek profile user
SELECT 
  id,
  username,
  avatar_url,
  created_at
FROM profiles 
WHERE id = 'cbf8a91d-c6a1-4b8f-a0e3-ffbf9b689b6f';

-- 6. Cek admin_roles
SELECT 
  id,
  name,
  permissions
FROM admin_roles; 