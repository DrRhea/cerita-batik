'use client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ShareButton from '@/app/components/ShareButton';
import React from 'react';
import Image from 'next/image';

interface ArticleDetailClientProps {
  article: {
    title: string;
    author?: {
      username?: string;
      avatar_url?: string;
    };
    image_url?: string;
    created_at?: string;
    content?: string;
  };
}

export default function ArticleDetailClient({ article }: ArticleDetailClientProps) {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold flex-1">{article.title}</h1>
          <ShareButton title={article.title} />
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Avatar className="w-8 h-8">
            <AvatarImage src={article.author?.avatar_url} alt={article.author?.username} />
            <AvatarFallback>{article.author?.username?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{article.author?.username || 'Kontributor'}</span>
          <span className="mx-2">•</span>
          <span>{article.created_at ? new Date(article.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
        </div>
      </div>
      {article.image_url && (
        <div className="relative w-full h-64 rounded-xl overflow-hidden mb-8 bg-muted">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
      <article className="prose prose-lg max-w-none text-foreground">
        {article.content?.split('\n').map((para: string, idx: number) => (
          <p key={idx}>{para}</p>
        ))}
      </article>
    </div>
  );
} 