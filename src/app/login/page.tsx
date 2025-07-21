'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-lg border">
        <h1 className="text-2xl font-bold mb-6 text-center">Login ke Marketplace</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          magicLink
          theme="light"
        />
      </div>
    </main>
  );
} 