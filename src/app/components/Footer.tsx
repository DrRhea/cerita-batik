"use client";
import React from "react";

const highlights = [
  "100% Pengrajin Lokal",
  "Motif Batik Asli Cirebon",
  "Cerita di Balik Setiap Karya",
  "Transaksi Aman & Mudah",
  "Dukungan Komunitas Batik",
  "Edukasi & Wawasan Budaya",
  "Koleksi Eksklusif & Terbatas",
];

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t mt-16">
      {/* Marquee */}
      <div className="overflow-hidden bg-muted border-b">
        <div className="relative w-full h-10 flex items-center">
          <div className="absolute top-0 left-0 flex flex-row items-center gap-x-16 h-10 animate-marquee-loop" style={{ minWidth: 'fit-content' }}>
            {[...highlights, ...highlights].map((text, idx) => (
              <span key={idx} className="text-primary font-medium text-base min-w-max flex items-center h-10">
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Footer content */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground text-sm">
        <div>
          &copy; {new Date().getFullYear()} Cerita Batik. All rights reserved.
        </div>
        <div className="flex gap-4">
          <a href="/wawasan" className="hover:underline">Wawasan</a>
          <a href="/komunitas" className="hover:underline">Komunitas</a>
          <a href="/tentang" className="hover:underline">Tentang Kami</a>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee-loop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-loop {
          animation: marquee-loop 30s linear infinite;
        }
      `}</style>
    </footer>
  );
} 