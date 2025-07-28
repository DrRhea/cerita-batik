-- Check Data Artikel Wawasan
-- Jalankan script ini di Supabase SQL Editor

-- 1. Cek semua artikel yang ada
SELECT 
  id,
  title,
  image_url,
  created_at
FROM articles
ORDER BY created_at DESC;

-- 2. Cek artikel spesifik berdasarkan judul
SELECT 
  id,
  title,
  image_url,
  created_at
FROM articles
WHERE title LIKE '%Batik Tulis%' OR title LIKE '%Mega Mendung%'
ORDER BY created_at DESC;

-- 3. Update artikel pertama (Cara Membedakan Batik Tulis, Cap, dan Printing)
UPDATE articles 
SET image_url = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
WHERE title = 'Cara Membedakan Batik Tulis, Cap, dan Printing';

-- 4. Update artikel kedua (Filosofi di Balik Motif Mega Mendung)
UPDATE articles 
SET image_url = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80'
WHERE title = 'Filosofi di Balik Motif Mega Mendung';

-- 5. Verifikasi update
SELECT 
  id,
  title,
  image_url,
  created_at
FROM articles
ORDER BY created_at DESC; 