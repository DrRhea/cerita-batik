'use client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 bg-card rounded-2xl border relative">
        <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition">
          <FiArrowLeft />
          Kembali ke Beranda
        </Link>
        <h1 className="text-2xl font-bold mb-4 text-center pt-4">Login ke Cerita Batik</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(222.2 47.4% 11.2%)',
                  brandAccent: 'hsl(222.2 47.4% 20%)',
                },
                radii: {
                  borderRadiusButton: '12px',
                  buttonBorderRadius: '12px',
                  inputBorderRadius: '12px',
                },
              },
            },
          }}
          providers={[]}
          magicLink
        />
      </div>
    </main>
  );
} 