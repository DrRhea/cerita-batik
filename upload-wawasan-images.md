# Upload Gambar Wawasan Batik

## Langkah-langkah Upload Gambar:

### 1. Upload ke Supabase Storage
1. Buka Supabase Dashboard > Storage
2. Buat bucket baru bernama `wawasan-images` (jika belum ada)
3. Upload 2 gambar:
   - `mega-mendung-pattern.png` (gambar pattern Mega Mendung)
   - `batik-canting-process.png` (gambar proses canting)

### 2. Set Permissions
Set bucket permissions:
- **Public**: Anyone can view
- **Authenticated**: Can upload, update, delete

### 3. Update Database
Setelah upload, jalankan script SQL untuk update URL:

```sql
-- Update dengan URL dari Supabase Storage
UPDATE articles 
SET image_url = 'https://cmkuvvlmtkqyppjbnuqg.supabase.co/storage/v1/object/public/wawasan-images/mega-mendung-pattern.png'
WHERE id = (
  SELECT id FROM articles 
  ORDER BY created_at DESC 
  LIMIT 1
);

UPDATE articles 
SET image_url = 'https://cmkuvvlmtkqyppjbnuqg.supabase.co/storage/v1/object/public/wawasan-images/batik-canting-process.png'
WHERE id = (
  SELECT id FROM articles 
  ORDER BY created_at DESC 
  LIMIT 1 OFFSET 1
);
```

### 4. Alternatif: Upload ke Public Folder
Jika ingin menggunakan public folder:
1. Copy gambar ke `public/images/wawasan/`
2. Update database dengan path lokal:
   - `/images/wawasan/mega-mendung-pattern.png`
   - `/images/wawasan/batik-canting-process.png`

## Deskripsi Gambar:
1. **Mega Mendung Pattern**: Pattern tradisional dengan motif awan, outline emas, background biru tua
2. **Batik Canting Process**: Proses canting dengan tangan pengrajin dan tetesan lilin 