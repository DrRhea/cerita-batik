'use client';
import ShareButton from '@/app/components/ShareButton';

export default function ProductShareHeader({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <h1 className="text-2xl font-bold flex-1">{name}</h1>
      <ShareButton title={name} />
    </div>
  );
} 