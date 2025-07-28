-- Update Gambar Artikel Wawasan Batik
-- Jalankan script ini di Supabase SQL Editor

-- 1. Cek artikel yang ada
SELECT 
  id,
  title,
  image_url,
  created_at
FROM articles
ORDER BY created_at DESC;

-- 2. Update gambar artikel pertama (Mega Mendung pattern)
UPDATE articles 
SET image_url = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
WHERE id = (
  SELECT id FROM articles 
  ORDER BY created_at DESC 
  LIMIT 1
);

-- 3. Update gambar artikel kedua (Batik Canting Process)
UPDATE articles 
SET image_url = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80'
WHERE id = (
  SELECT id FROM articles 
  ORDER BY created_at DESC 
  LIMIT 1 OFFSET 1
);

-- 4. Verifikasi update
SELECT 
  id,
  title,
  image_url,
  created_at
FROM articles
ORDER BY created_at DESC;

-- Catatan:
-- Pastikan file gambar sudah diupload ke folder public/images/wawasan/
-- - mega-mendung-pattern.png (gambar pattern Mega Mendung)
-- - batik-canting-process.png (gambar proses canting) 