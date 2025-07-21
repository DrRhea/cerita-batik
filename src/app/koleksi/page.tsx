"use client";
import { supabase } from '@/lib/supabase/client';
import React, { useState, useEffect, useMemo } from 'react';
import { FiShoppingCart, FiHeart, FiSearch } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

export default function KoleksiPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('created_at-desc');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`*, artisan:artisan_id(profile:profile_id(username))`);

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [sortBy, sortOrder] = sortOption.split('-');
    if (sortBy === 'price') {
      filtered.sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price));
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return filtered;
  }, [products, searchTerm, sortOption]);

  type Product = {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    stock: number;
    created_at: string;
    artisan?: { profile?: { username?: string } };
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Koleksi Batik Kami</h1>
        <p className="text-muted-foreground mt-2">Temukan karya batik terbaik dari para pengrajin lokal Cirebon.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari berdasarkan nama batik..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 py-3 rounded-xl border-2"
          />
        </div>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-full md:w-[200px] py-3 rounded-xl border-2">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at-desc">Terbaru</SelectItem>
            <SelectItem value="price-asc">Harga Terendah</SelectItem>
            <SelectItem value="price-desc">Harga Tertinggi</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {loading ? (
        <div className="text-center py-16">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredAndSortedProducts.map((product: Product) => (
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
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                    <div className="text-muted-foreground text-sm leading-tight">{product.artisan?.profile?.username || 'Artisan'}</div>
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
                      &#8230;
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 mt-4 items-center">
                    <a href={`/produk/${product.id}`} className="flex-1 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold text-center hover:bg-primary/90 transition">
                      Lihat Detail
                    </a>
                    <button className="flex-shrink-0 p-3 rounded-full text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition" aria-label="Tambah ke Keranjang">
                      <FiShoppingCart size={22} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
} 