import { supabase } from '@/lib/supabase/client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import ProductShareHeader from './ProductShareHeader';
import Image from 'next/image';

export const revalidate = 0;

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id, name, price, image_url, story,
      material_description, technique, motif_philosophy,
      artisan:artisan_id(id, bio, profile:profile_id(username, avatar_url)),
      product_videos(id, video_url, title, description)
    `)
    .eq('id', id)
    .single<{
      id: string;
      name: string;
      price: number;
      image_url?: string;
      story?: string;
      material_description?: string;
      technique?: string;
      motif_philosophy?: string;
      artisan?: {
        id: string;
        bio?: string;
        profile?: {
          username?: string;
          avatar_url?: string;
        } | null;
      } | null;
      product_videos: {
        id: string;
        video_url: string;
        title: string;
        description?: string | null;
      }[];
    }>();

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
              <div className="relative w-full h-96">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover rounded-xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
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
              <ProductShareHeader name={product.name} />
              <CardDescription>
                by {product.artisan?.profile?.username || 'Artisan'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-primary font-bold text-2xl mb-4">
                Rp{product.price.toLocaleString('id-ID')}
              </div>
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

          {/* Storytelling Details */}
          {(product.material_description || product.technique || product.motif_philosophy) && (
            <Card>
              <CardHeader>
                <CardTitle>Detail & Filosofi</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {product.technique && (
                  <div>
                    <h3 className="font-semibold text-base mb-1">Teknik Pembuatan</h3>
                    <p className="text-muted-foreground">{product.technique}</p>
                  </div>
                )}
                {product.material_description && (
                  <div>
                    <h3 className="font-semibold text-base mb-1">Deskripsi Material</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {product.material_description}
                    </p>
                  </div>
                )}
                {product.motif_philosophy && (
                  <div>
                    <h3 className="font-semibold text-base mb-1">Filosofi Motif</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {product.motif_philosophy}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Educational Videos */}
          {product.product_videos && product.product_videos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Video Edukasi</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                {product.product_videos.map(video => {
                  const getEmbedUrl = (url: string) => {
                    if (url.includes('youtube.com/watch?v=')) {
                      const videoId = url.split('v=')[1].split('&')[0];
                      return `https://www.youtube.com/embed/${videoId}`;
                    }
                    return url;
                  };

                  return (
                    <div key={video.id}>
                      <div className="aspect-video w-full rounded-lg overflow-hidden mb-2 border">
                        <iframe
                          src={getEmbedUrl(video.video_url)}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      </div>
                      <h3 className="font-semibold">{video.title}</h3>
                      {video.description && (
                        <p className="text-sm text-muted-foreground">{video.description}</p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
} 