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
import { FiUpload, FiX, FiSave, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description?: string;
  story?: string;
  price: number;
  stock: number;
  image_url?: string;
  technique?: string;
  material_description?: string;
  motif_philosophy?: string;
  artisan_id: string;
}

interface Artisan {
  id: string;
  profile?: {
    username?: string;
  }[];
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

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
    async function init() {
      const { id } = await params;
      fetchProduct(id);
      fetchArtisans();
    }
    init();
  }, [params]);

  async function fetchProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      router.push('/admin/products');
      return;
    }

    setProduct(data);
    setFormData({
      name: data.name,
      description: data.description || '',
      story: data.story || '',
      price: data.price.toString(),
      stock: data.stock.toString(),
      artisan_id: data.artisan_id,
      technique: data.technique || '',
      material_description: data.material_description || '',
      motif_philosophy: data.motif_philosophy || ''
    });

    if (data.image_url) {
      setUploadedImages([data.image_url]);
    }

    setLoading(false);
  }

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
    setUploadError('');
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`File ${file.name} terlalu besar (maksimal 5MB)`);
        continue;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError(`File ${file.name} bukan gambar yang valid`);
        continue;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      try {
        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true // Allow overwrite
          });

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          setUploadError(`Gagal upload ${file.name}: ${uploadError.message}`);
          continue;
        }

        if (data) {
          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          // Test if the URL is accessible
          try {
            const response = await fetch(publicUrl, { method: 'HEAD' });
            if (response.ok) {
              uploadedUrls.push(publicUrl);
              console.log('Successfully uploaded:', file.name, 'to', publicUrl);
            } else {
              console.error('URL not accessible:', publicUrl);
              setUploadError(`URL tidak dapat diakses: ${file.name}`);
            }
          } catch (urlError) {
            console.error('Error testing URL:', urlError);
            setUploadError(`Error testing URL: ${file.name}`);
          }
        }
      } catch (error) {
        console.error('Exception during upload:', error);
        setUploadError(`Error upload ${file.name}: ${error}`);
        continue;
      }
    }

    setUploadedImages(prev => [...prev, ...uploadedUrls]);
    setUploading(false);
  }

  function removeImage(index: number) {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      // Gunakan gambar yang baru diupload, atau gambar yang sudah ada
      const finalImageUrl = uploadedImages.length > 0 ? uploadedImages[0] : product?.image_url;
      
      console.log('Updating product with image_url:', finalImageUrl);
      console.log('Uploaded images:', uploadedImages);
      console.log('Current product image:', product?.image_url);

      const { data, error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          story: formData.story,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          artisan_id: formData.artisan_id,
          technique: formData.technique,
          material_description: formData.material_description,
          motif_philosophy: formData.motif_philosophy,
          image_url: finalImageUrl
        })
        .eq('id', product?.id)
        .select();

      if (error) {
        console.error('Error updating product:', error);
        return;
      }

      console.log('Product updated successfully:', data);
      router.push('/admin/products');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Produk tidak ditemukan.</p>
          <Link href="/admin/products">
            <Button className="mt-4">Kembali ke Daftar Produk</Button>
          </Link>
        </div>
      </div>
    );
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
              <h1 className="text-2xl font-bold">Edit Produk</h1>
              <p className="text-muted-foreground">Update informasi produk</p>
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
                
                {uploadError && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{uploadError}</p>
                  </div>
                )}
              </div>

              {/* Current Product Image */}
              {product?.image_url && uploadedImages.length === 0 && (
                <div className="space-y-2">
                  <Label>Gambar Saat Ini</Label>
                  <div className="relative group">
                    <Image
                      src={product.image_url}
                      alt="Current product image"
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <p className="text-white text-sm">Gambar saat ini</p>
                    </div>
                  </div>
                </div>
              )}

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
            <Button type="submit" disabled={saving}>
              <FiSave className="mr-2" />
              {saving ? 'Menyimpan...' : 'Update Produk'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
} 