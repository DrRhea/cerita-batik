-- Fix RLS Policies for Admin Access
-- Jalankan script ini jika admin masih tidak bisa akses

-- 1. Drop existing policies
DROP POLICY IF EXISTS "Admin users can view own profile" ON admin_users;
DROP POLICY IF EXISTS "Super admins can manage all admin users" ON admin_users;

-- 2. Create simpler policies
-- Allow admin users to view their own record
CREATE POLICY "Admin users can view own profile" ON admin_users
  FOR SELECT USING (auth.uid() = id);

-- Allow admin users to manage their own record
CREATE POLICY "Admin users can manage own profile" ON admin_users
  FOR ALL USING (auth.uid() = id);

-- 3. Test the policies
-- Query ini seharusnya mengembalikan data jika user login
SELECT * FROM admin_users WHERE id = 'cbf8a91d-c6a1-4b8f-a0e3-ffbf9b689b6f';

-- 4. Alternative: Temporarily disable RLS for testing
-- UNCOMMENT LINE BELOW IF STILL HAVING ISSUES
-- ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- 5. Re-enable RLS after testing
-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY; 