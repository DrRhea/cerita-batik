'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiPackage, FiUsers, FiImage, FiFileText, FiLogOut, FiSettings, FiPlus } from 'react-icons/fi';
import Link from 'next/link';

interface AdminUser {
  id: string;
  role: {
    name: string;
    permissions: string[];
  };
}

export default function AdminDashboard() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/admin/login');
      return;
    }

    // Check if user is admin
    const { data: adminData, error } = await supabase
      .from('admin_users')
      .select(`
        id,
        role:admin_roles(name, permissions)
      `)
      .eq('id', user.id)
      .single();

    console.log('Admin check result:', { adminData, error, userId: user.id });

    if (error || !adminData) {
      // Temporary bypass for testing - remove this in production
      if (user.email === 'bening@gmail.com') {
        console.log('Temporary admin access granted for bening@gmail.com');
        const adminUserData: AdminUser = {
          id: user.id,
          role: {
            name: 'super_admin',
            permissions: ['manage_users', 'manage_products', 'manage_artisans', 'manage_media', 'manage_content', 'view_analytics']
          }
        };
        setUser(user);
        setAdminUser(adminUserData);
        setLoading(false);
        return;
      }
      
      router.push('/admin/login');
      return;
    }

    // Fix the nested relationship structure from Supabase
    const adminUserData: AdminUser = {
      id: adminData.id,
      role: {
        name: adminData.role?.[0]?.name || '',
        permissions: adminData.role?.[0]?.permissions || []
      }
    };

    setUser(user);
    setAdminUser(adminUserData);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
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

  const stats = [
    {
      title: 'Total Produk',
      value: '12',
      icon: FiPackage,
      href: '/admin/products'
    },
    {
      title: 'Total Artisan',
      value: '8',
      icon: FiUsers,
      href: '/admin/artisans'
    },
    {
      title: 'Media Files',
      value: '45',
      icon: FiImage,
      href: '/admin/media'
    },
    {
      title: 'Artikel',
      value: '6',
      icon: FiFileText,
      href: '/admin/articles'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Selamat datang, {user?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Role: {adminUser?.role?.name}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              <FiLogOut className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/products/new">
                <Button className="w-full justify-start">
                  <FiPlus className="mr-2" />
                  Tambah Produk Baru
                </Button>
              </Link>
              <Link href="/admin/artisans/new">
                <Button className="w-full justify-start" variant="outline">
                  <FiPlus className="mr-2" />
                  Tambah Artisan Baru
                </Button>
              </Link>
              <Link href="/admin/media/upload">
                <Button className="w-full justify-start" variant="outline">
                  <FiImage className="mr-2" />
                  Upload Media
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Produk baru ditambahkan</p>
                    <p className="text-xs text-muted-foreground">Batik Mega Mendung - 2 jam yang lalu</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Media diupload</p>
                    <p className="text-xs text-muted-foreground">5 gambar produk - 4 jam yang lalu</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Artisan profile diupdate</p>
                    <p className="text-xs text-muted-foreground">Batik Queen - 1 hari yang lalu</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 