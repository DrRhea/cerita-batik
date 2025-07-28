-- Temporary Fix: Disable RLS for Admin Testing
-- Jalankan script ini untuk sementara agar admin bisa login

-- 1. Disable RLS on admin_users table
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- 2. Verify admin user exists
SELECT 
  au.id,
  p.username,
  ar.name as role_name,
  ar.permissions
FROM admin_users au
JOIN profiles p ON au.id = p.id
JOIN admin_roles ar ON au.role_id = ar.id
WHERE au.id = 'cbf8a91d-c6a1-4b8f-a0e3-ffbf9b689b6f';

-- 3. Test query without RLS
SELECT * FROM admin_users WHERE id = 'cbf8a91d-c6a1-4b8f-a0e3-ffbf9b689b6f';

-- Note: Setelah admin bisa login dan test fitur, jalankan script berikut untuk re-enable RLS:
-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY; 