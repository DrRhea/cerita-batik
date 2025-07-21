'use client';
import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FiMapPin } from 'react-icons/fi';

type Artisan = {
  id: string;
  bio?: string;
  workshop_location?: string;
  profile?: {
    username?: string;
    avatar_url?: string;
  };
};

interface ArtisanGridProps {
  artisans: Artisan[];
}

export default function ArtisanGrid({ artisans }: ArtisanGridProps) {
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);

  return (
    <Dialog>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artisans.map((artisan) => (
          <Card key={artisan.id} className="flex flex-col items-center text-center p-6 h-full">
            <Avatar className="w-20 h-20 mb-3 border-2 border-primary/10">
              <AvatarImage src={artisan.profile?.avatar_url} alt={artisan.profile?.username} className="object-cover" />
              <AvatarFallback className="text-2xl">{artisan.profile?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{artisan.profile?.username}</h2>
            {artisan.workshop_location && (
              <p className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                <FiMapPin size={14} />
                {artisan.workshop_location}
              </p>
            )}
            <p className="text-muted-foreground mt-2 text-sm line-clamp-3 flex-grow">{artisan.bio}</p>
            <DialogTrigger asChild>
              <button
                onClick={() => setSelectedArtisan(artisan)}
                className="mt-4 text-sm font-semibold text-primary hover:underline"
              >
                Lihat Selengkapnya
              </button>
            </DialogTrigger>
          </Card>
        ))}
      </div>
      {selectedArtisan && (
        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4 border-2">
                <AvatarImage src={selectedArtisan.profile?.avatar_url} alt={selectedArtisan.profile?.username} className="object-cover" />
                <AvatarFallback className="text-3xl">{selectedArtisan.profile?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <DialogTitle className="text-2xl">{selectedArtisan.profile?.username}</DialogTitle>
              {selectedArtisan.workshop_location && (
                <p className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                  <FiMapPin size={14} />
                  {selectedArtisan.workshop_location}
                </p>
              )}
            </div>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground text-center">{selectedArtisan.bio}</p>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
} 