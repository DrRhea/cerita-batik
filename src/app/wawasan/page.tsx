import { supabase } from '@/lib/supabase/client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FiArrowRight } from 'react-icons/fi';
import Image from 'next/image';

export default async function WawasanPage() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select(`*, author:author_profile_id(username, avatar_url)`)
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="text-red-500 text-center py-8">Error fetching articles: {error.message}</div>;
  }

  type Article = {
    id: string;
    title: string;
    content?: string;
    image_url?: string;
    author?: {
      username?: string;
      avatar_url?: string;
    };
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Wawasan Batik</h1>
        <p className="text-muted-foreground mt-2 text-lg">Perluas pengetahuan Anda tentang dunia batik, dari filosofi hingga teknik pembuatan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles?.map((article: Article) => (
          <Card key={article.id} className="flex flex-col">
            <div className="relative w-full h-48 bg-muted rounded-t-xl overflow-hidden">
              {article.image_url && (
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <CardHeader className="p-0">
                <CardTitle className="mb-2 text-xl">{article.title}</CardTitle>
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={article.author?.avatar_url} alt={article.author?.username} />
                    <AvatarFallback>{article.author?.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">oleh {article.author?.username || 'Kontributor'}</span>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <p className="text-muted-foreground line-clamp-3">{article.content}</p>
              </CardContent>
              <div className="mt-4">
                <Link href={`/wawasan/${article.id}`} className="flex items-center gap-2 text-primary font-semibold hover:underline">
                  Baca Selengkapnya <FiArrowRight />
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
} 