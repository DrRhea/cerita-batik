import HeroCarousel from "@/app/components/HeroCarousel";
import { supabase } from "@/lib/supabase/client";
import { FiHeart, FiShoppingCart, FiShield, FiGift, FiUsers } from "react-icons/fi";
import Image from 'next/image';

// Updated interface to match Supabase's nested relationship structure
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
  artisan?: {
    profile?: {
      username?: string;
    }[];
  }[];
}

export default async function Home() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, price, stock, image_url, artisan:artisan_id(profile:profile_id(username))")
    .limit(4);

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full flex justify-center bg-gray-50 pt-8 mb-8">
        <HeroCarousel />
      </section>

      {/* Feature Section */}
      <section className="max-w-7xl w-full px-4 py-12 mt-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Kenapa Pilih Cerita Batik?</h2>
          <p className="text-muted-foreground mt-2">Pengalaman belanja batik yang otentik dan bermakna.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center p-6 border rounded-2xl bg-white">
            <FiShield size={40} className="mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">Transaksi Aman</h3>
            <p className="text-muted-foreground">Pembayaran terjamin dan data Anda terlindungi.</p>
          </div>
          <div className="flex flex-col items-center p-6 border rounded-2xl bg-white">
            <FiGift size={40} className="mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">Produk Otentik</h3>
            <p className="text-muted-foreground">Setiap karya adalah hasil tangan pengrajin lokal asli.</p>
          </div>
          <div className="flex flex-col items-center p-6 border rounded-2xl bg-white">
            <FiUsers size={40} className="mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">Dukung Komunitas</h3>
            <p className="text-muted-foreground">Turut serta dalam memberdayakan ekonomi pengrajin.</p>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="max-w-7xl w-full px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Koleksi Pilihan</h2>
          <p className="text-muted-foreground mt-2">Temukan cerita di setiap motif pilihan kami.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product: Product) => (
            <div key={product.id} className="rounded-2xl border bg-card p-4 flex flex-col gap-3 h-full">
              <div className="relative w-full aspect-square bg-muted rounded-xl mb-2 border overflow-hidden">
                <button className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm border border-muted rounded-full p-2 text-primary hover:bg-white transition" aria-label="Tambah ke Wishlist">
                  <FiHeart size={20} />
                </button>
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground">Tidak ada gambar</span>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="font-semibold text-base leading-tight">{product.name}</div>
                    <div className="text-muted-foreground text-sm leading-tight">
                      {product.artisan?.[0]?.profile?.[0]?.username || 'Artisan'}
                    </div>
                  </div>
                  <div className="font-bold text-lg text-primary whitespace-nowrap">Rp{product.price.toLocaleString('id-ID')}</div>
                </div>
                {product.stock === 0 ? (
                  <div className="flex items-center mt-3">
                    <div className="flex-1">
                      <div className="flex items-center bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-yellow-700 font-medium text-sm gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
                        Sold Out
                      </div>
                    </div>
                    <button className="ml-2 flex items-center justify-center w-8 h-8 rounded-xl border border-muted bg-background text-xl text-muted-foreground hover:bg-muted transition">
                      <span className="sr-only">Menu</span>
                      &#8230;
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 mt-4 items-center">
                    <a
                      href={`/produk/${product.id}`}
                      className="flex-1 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold text-center hover:bg-primary/90 transition"
                    >
                      Lihat Detail
                    </a>
                    <button
                      className="flex-shrink-0 p-3 rounded-full text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition"
                      disabled={product.stock === 0}
                      aria-label="Tambah ke Keranjang"
                    >
                      <FiShoppingCart size={22} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href="/koleksi"
            className="inline-block px-8 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition shadow"
          >
            Lihat Semua Koleksi
          </a>
        </div>
      </section>
    </main>
  );
}