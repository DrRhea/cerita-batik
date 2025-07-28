-- Fix Storage Setup for Image Upload
-- Jalankan script ini di Supabase SQL Editor

-- 1. Buat bucket product-images jika belum ada
-- Note: Ini harus dilakukan di Supabase Dashboard > Storage
-- 1. Buka Supabase Dashboard
-- 2. Pilih project Anda
-- 3. Klik "Storage" di sidebar
-- 4. Klik "New bucket"
-- 5. Nama bucket: "product-images"
-- 6. Set "Public bucket" = true
-- 7. Klik "Create bucket"

-- 2. Set bucket policies untuk upload
-- Jalankan di Supabase Dashboard > Storage > product-images > Policies

-- Policy 1: Allow authenticated users to upload
-- Name: "Allow authenticated uploads"
-- Target roles: authenticated
-- Policy definition: true
-- Operation: INSERT

-- Policy 2: Allow public to view
-- Name: "Allow public viewing"
-- Target roles: public
-- Policy definition: true
-- Operation: SELECT

-- Policy 3: Allow authenticated users to update their uploads
-- Name: "Allow authenticated updates"
-- Target roles: authenticated
-- Policy definition: true
-- Operation: UPDATE

-- Policy 4: Allow authenticated users to delete their uploads
-- Name: "Allow authenticated deletes"
-- Target roles: authenticated
-- Policy definition: true
-- Operation: DELETE

-- 3. Test upload dengan query ini
-- Setelah bucket dibuat, test upload file kecil untuk memastikan permissions benar 