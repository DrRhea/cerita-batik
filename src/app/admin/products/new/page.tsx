'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FiUpload, FiX, FiSave, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

interface Artisan {
  id: string;
  profile?: {
    username?: string;
  }[];
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    story: '',
    price: '',
    stock: '',
    artisan_id: '',
    technique: '',
    material_description: '',
    motif_philosophy: ''
  });

  useEffect(() => {
    fetchArtisans();
  }, []);

  async function fetchArtisans() {
    const { data, error } = await supabase
      .from('artisans')
      .select('id, profile:profile_id(username)');

    if (!error && data) {
      setArtisans(data);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    setUploadedImages(prev => [...prev, ...uploadedUrls]);
    setUploading(false);
  }

  function removeImage(index: number) {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Insert product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          description: formData.description,
          story: formData.story,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          artisan_id: formData.artisan_id,
          technique: formData.technique,
          material_description: formData.material_description,
          motif_philosophy: formData.motif_philosophy,
          image_url: uploadedImages[0] || null
        })
        .select()
        .single();

      if (productError) {
        console.error('Error creating product:', productError);
        return;
      }

      // Insert product images if multiple images uploaded
      if (uploadedImages.length > 1 && product) {
        const imageData = uploadedImages.map((url, index) => ({
          product_id: product.id,
          file_path: url,
          file_name: `product-image-${index + 1}`,
          file_size: 0, // We'll get this from the actual file
          mime_type: 'image/jpeg',
          is_primary: index === 0,
          sort_order: index
        }));

        const { error: mediaError } = await supabase
          .from('media')
          .insert(imageData);

        if (mediaError) {
          console.error('Error creating media records:', mediaError);
        }
      }

      router.push('/admin/products');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button variant="outline" size="sm">
                <FiArrowLeft className="mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Tambah Produk Baru</h1>
              <p className="text-muted-foreground">Buat produk baru untuk marketplace</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Produk *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artisan">Artisan *</Label>
                  <Select
                    value={formData.artisan_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, artisan_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih artisan" />
                    </SelectTrigger>
                    <SelectContent>
                      {artisans.map((artisan) => (
                        <SelectItem key={artisan.id} value={artisan.id}>
                          {artisan.profile?.[0]?.username || 'Unknown'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Harga (Rp) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stok *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Singkat</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Storytelling */}
          <Card>
            <CardHeader>
              <CardTitle>Cerita & Filosofi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="story">Cerita Produk</Label>
                <Textarea
                  id="story"
                  value={formData.story}
                  onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
                  rows={4}
                  placeholder="Ceritakan kisah di balik produk ini..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="technique">Teknik Pembuatan</Label>
                  <Input
                    id="technique"
                    value={formData.technique}
                    onChange={(e) => setFormData(prev => ({ ...prev, technique: e.target.value }))}
                    placeholder="Contoh: Batik Tulis Halus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material">Deskripsi Bahan</Label>
                  <Input
                    id="material"
                    value={formData.material_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, material_description: e.target.value }))}
                    placeholder="Contoh: Kain katun primisima"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="philosophy">Filosofi Motif</Label>
                <Textarea
                  id="philosophy"
                  value={formData.motif_philosophy}
                  onChange={(e) => setFormData(prev => ({ ...prev, motif_philosophy: e.target.value }))}
                  rows={3}
                  placeholder="Jelaskan makna filosofis motif batik..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Gambar Produk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="images">Upload Gambar</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop gambar atau klik untuk memilih
                  </p>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('images')?.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Pilih Gambar'}
                  </Button>
                </div>
              </div>

              {/* Preview Images */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={url}
                        alt={`Product image ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link href="/admin/products">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              <FiSave className="mr-2" />
              {loading ? 'Menyimpan...' : 'Simpan Produk'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
} 