'use client';
import React, { useState } from 'react';
import { FiShare2, FiCheck } from 'react-icons/fi';

interface ShareButtonProps {
  title: string;
  url?: string;
  className?: string;
}

export default function ShareButton({ title, url, className }: ShareButtonProps) {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title,
        url: shareUrl,
      });
    } else {
      setShowShare(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={className}>
      <button
        onClick={handleShare}
        className="p-2 rounded-full hover:bg-muted transition"
        aria-label="Bagikan"
        type="button"
      >
        <FiShare2 size={20} />
      </button>
      {showShare && (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="border rounded-lg px-3 py-1 text-sm w-full bg-muted"
          />
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
            type="button"
          >
            {copied ? <FiCheck /> : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
} 