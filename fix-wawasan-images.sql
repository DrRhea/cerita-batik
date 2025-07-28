-- Fix Gambar Artikel Wawasan Batik
-- Jalankan script ini di Supabase SQL Editor

-- 1. Cek data artikel yang ada
SELECT 
  id,
  title,
  image_url,
  created_at
FROM articles
ORDER BY created_at DESC;

-- 2. Update semua artikel dengan gambar yang sesuai
-- Artikel tentang cara membedakan batik (gambar proses canting)
UPDATE articles 
SET image_url = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80'
WHERE title LIKE '%Batik Tulis%' OR title LIKE '%Cap%' OR title LIKE '%Printing%';

-- Artikel tentang filosofi motif (gambar pattern batik)
UPDATE articles 
SET image_url = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
WHERE title LIKE '%Mega Mendung%' OR title LIKE '%Filosofi%' OR title LIKE '%Motif%';

-- 3. Update berdasarkan ID jika judul tidak cocok
-- Ganti dengan ID artikel yang sebenarnya
-- UPDATE articles 
-- SET image_url = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80'
-- WHERE id = 'ID_ARTIKEL_PERTAMA';

-- UPDATE articles 
-- SET image_url = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
-- WHERE id = 'ID_ARTIKEL_KEDUA';

-- 4. Verifikasi update
SELECT 
  id,
  title,
  image_url,
  created_at
FROM articles
ORDER BY created_at DESC;

-- 5. Jika masih belum berubah, coba update manual berdasarkan ID
-- Jalankan query ini dan copy ID artikel, lalu update manual:
-- SELECT id, title FROM articles ORDER BY created_at DESC LIMIT 2; 