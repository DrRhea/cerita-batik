-- Fix Storage Path Issues
-- Jalankan query ini di Supabase SQL Editor

-- 1. Cek file yang ada di storage bucket
-- Buka Supabase Dashboard > Storage > product-images
-- Lihat apakah file 1753715151608-0.45361146255979456.png ada

-- 2. Jika file tidak ada, coba upload ulang atau gunakan file yang ada
-- Cek file lain yang mungkin sudah terupload dengan benar

-- 3. Update image_url dengan file yang benar
-- Ganti dengan URL file yang benar-benar ada di storage
UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
WHERE id = '11f2deea-efa3-4835-aa42-b2b51e4ff396';

-- 4. Atau set image_url ke null jika tidak ada gambar
-- UPDATE products 
-- SET image_url = NULL
-- WHERE id = '11f2deea-efa3-4835-aa42-b2b51e4ff396';

-- 5. Verifikasi update
SELECT 
  id,
  name,
  image_url,
  created_at
FROM products 
WHERE id = '11f2deea-efa3-4835-aa42-b2b51e4ff396'; 