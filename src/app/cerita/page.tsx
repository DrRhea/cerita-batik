import { supabase } from '@/lib/supabase/client';
import React from 'react';
import ArtisanGrid from './ArtisanGrid';

export default async function CeritaPage() {
  const { data: artisans, error } = await supabase
    .from('artisans')
    .select(`*, profile:profiles(username, avatar_url)`)
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="text-red-500 text-center py-8">Error fetching artisans: {error.message}</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Cerita Pengrajin</h1>
        <p className="text-muted-foreground mt-2 text-lg">Kenali lebih dekat para maestro di balik setiap karya batik.</p>
      </div>
      <ArtisanGrid artisans={artisans || []} />
    </main>
  );
} 