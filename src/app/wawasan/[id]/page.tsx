import { supabase } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import ArticleDetailClient from '../ArticleDetailClient';

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: article, error } = await supabase
    .from('articles')
    .select('*, author:author_profile_id(username, avatar_url)')
    .eq('id', id)
    .single();

  if (error || !article) {
    notFound();
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/wawasan" className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8">
        <FiArrowLeft />
        Kembali ke Wawasan
      </Link>
      <ArticleDetailClient article={article} />
    </main>
  );
} 