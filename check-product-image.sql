-- Check Product Image URL
-- Jalankan query ini di Supabase SQL Editor untuk mengecek image_url produk

-- 1. Cek semua produk dan image_url mereka
SELECT 
  id,
  name,
  image_url,
  created_at
FROM products 
ORDER BY created_at DESC;

-- 2. Cek produk spesifik yang baru diupload
SELECT 
  id,
  name,
  image_url,
  created_at
FROM products 
WHERE id = '11f2deea-efa3-4835-aa42-b2b51e4ff396';

-- 3. Update image_url manual jika belum terupdate
-- Ganti URL dengan URL yang benar dari storage
UPDATE products 
SET image_url = 'https://cmkuvvlmtkqyppjbnuqg.supabase.co/storage/v1/object/public/product-images/1753715151608-0.45361146255979456.png'
WHERE id = '11f2deea-efa3-4835-aa42-b2b51e4ff396';

-- 4. Verifikasi update
SELECT 
  id,
  name,
  image_url,
  created_at
FROM products 
WHERE id = '11f2deea-efa3-4835-aa42-b2b51e4ff396'; 