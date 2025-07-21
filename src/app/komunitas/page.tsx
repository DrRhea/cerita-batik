import { supabase } from '@/lib/supabase/client';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { FiMessageCircle } from 'react-icons/fi';

interface Thread {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author?: { username?: string; avatar_url?: string }[];
  comments?: { count: number }[];
}

export default async function KomunitasPage() {
  // Fetch threads beserta profile penulis dan jumlah komentar
  const { data: threads, error } = await supabase
    .from('threads')
    .select('id, title, content, created_at, author:author_profile_id(username, avatar_url), comments(count)')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="text-red-500 text-center py-12">Gagal memuat data: {error.message}</div>;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Komunitas Cerita Batik</h1>
        <p className="text-muted-foreground text-lg">Diskusi, tanya jawab, dan berbagi seputar batik & kerajinan lokal.</p>
      </div>
      {(!threads || threads.length === 0) ? (
        <div className="text-center text-muted-foreground py-16">Belum ada diskusi.</div>
      ) : (
        <div className="flex flex-col gap-6">
          {threads.map((thread: Thread) => {
            const author = thread.author && thread.author[0];
            return (
              <Card key={thread.id} className="hover:shadow-md transition">
                <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={author?.avatar_url} alt={author?.username} />
                    <AvatarFallback>{author?.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Link href={`/komunitas/${thread.id}`} className="font-semibold text-lg hover:underline">
                      {thread.title}
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      oleh {author?.username || 'Anonim'}
                      <span className="mx-2">•</span>
                      {thread.created_at ? new Date(thread.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <FiMessageCircle />
                    <span className="text-sm">{thread.comments && thread.comments[0]?.count ? thread.comments[0].count : 0}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-base text-muted-foreground line-clamp-2">{thread.content}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
} 