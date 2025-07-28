'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiPackage } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
  created_at: string;
  artisan?: {
    profile?: {
      username?: string;
    }[];
  }[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, name, price, stock, image_url, created_at,
        artisan:artisan_id(profile:profile_id(username))
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      console.log('Fetched products:', data);
      setProducts(data || []);
    }
    setLoading(false);
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
    } else {
      fetchProducts();
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Manajemen Produk</h1>
            <p className="text-muted-foreground">Kelola semua produk di marketplace</p>
          </div>
          <Link href="/admin/products/new">
            <Button>
              <FiPlus className="mr-2" />
              Tambah Produk
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Stats */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Card className="md:w-48">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FiPackage className="text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Produk</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Gambar</th>
                    <th className="text-left p-4">Nama Produk</th>
                    <th className="text-left p-4">Artisan</th>
                    <th className="text-left p-4">Harga</th>
                    <th className="text-left p-4">Stok</th>
                    <th className="text-left p-4">Tanggal</th>
                    <th className="text-left p-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback jika gambar tidak bisa diakses
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center text-muted-foreground ${product.image_url ? 'hidden' : ''}`}>
                            <FiPackage size={24} />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {product.id.slice(0, 8)}...</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">
                          {product.artisan?.[0]?.profile?.[0]?.username || 'Unknown'}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">Rp{product.price.toLocaleString('id-ID')}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock > 0 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {product.stock > 0 ? `${product.stock} tersedia` : 'Habis'}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-muted-foreground">
                          {new Date(product.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button size="sm" variant="outline">
                              <FiEdit size={16} />
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <FiPackage className="mx-auto text-muted-foreground mb-4" size={48} />
                <p className="text-muted-foreground">
                  {searchTerm ? 'Tidak ada produk yang cocok dengan pencarian.' : 'Belum ada produk.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 