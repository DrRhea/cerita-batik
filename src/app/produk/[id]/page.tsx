import { supabase } from '@/lib/supabase/client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import React from 'react';

interface ProductDetailPageProps {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = params;

  // Fetch product by ID
  const { data: product, error } = await supabase
    .from('products')
    .select(`id, name, price, image_url, story, artisan:artisan_id(id, bio, profile:profile_id(username, avatar_url))`)
    .eq('id', id)
    .single<{ id: string; name: string; price: number; image_url?: string; story?: string; artisan?: { id: string; bio?: string; profile?: { username?: string; avatar_url?: string; } | null; } | null }>();

  if (error || !product) {
    return <div className="text-center text-red-500 py-16">Produk tidak ditemukan.</div>;
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <Card className="overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-96 bg-muted flex items-center justify-center rounded-xl text-muted-foreground">
                Tidak ada gambar
              </div>
            )}
          </Card>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl mb-2">{product.name}</CardTitle>
              <CardDescription>
                by {product.artisan?.profile?.username || 'Artisan'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-primary font-bold text-2xl mb-4">Rp{product.price.toLocaleString('id-ID')}</div>
            </CardContent>
          </Card>

          {/* Product Story */}
          <Card>
            <CardHeader>
              <CardTitle>Cerita Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-base whitespace-pre-line text-muted-foreground">
                {product.story || 'Belum ada cerita untuk produk ini.'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
} 