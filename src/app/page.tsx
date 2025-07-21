import { supabase } from '@/lib/supabase/client';
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';

export default async function HomePage() {
  // Fetch first 6 products with artisan and profile info
  const { data: products, error } = await supabase
    .from('products')
    .select(`id, name, price, image_url, artisan:artisan_id(id, bio, profile:profile_id(username, avatar_url))`)
    .limit(6)
    .returns<Product[]>();

  if (error) {
    return <div className="text-red-500 text-center py-8">Error fetching products: {error.message}</div>;
  }

  type Product = {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    artisan?: {
      id: string;
      bio?: string;
      profile?: {
        username?: string;
        avatar_url?: string;
      };
    };
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-primary/10 to-secondary/10 py-16 mb-12 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Temukan Cerita di Balik Setiap Karya Batik Cirebon
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Jelajahi marketplace batik, temukan produk unik, dan kenali para pengrajin di balik setiap karya.
        </p>
      </section>

      {/* Product Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Produk Pilihan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products?.map((product: Product) => (
            <Card key={product.id}>
              <CardHeader className="flex flex-col items-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted flex items-center justify-center rounded-lg mb-4 text-muted-foreground">
                    Tidak ada gambar
                  </div>
                )}
                <CardTitle className="text-lg text-center w-full">{product.name}</CardTitle>
                <CardDescription className="text-center w-full">
                  by {product.artisan?.profile?.username || 'Artisan'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-primary font-semibold text-xl mb-2">Rp{product.price.toLocaleString('id-ID')}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
