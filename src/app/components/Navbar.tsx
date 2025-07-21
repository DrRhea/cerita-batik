"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FiLogIn, FiShoppingCart, FiHelpCircle, FiSettings, FiMenu, FiX, FiSearch } from "react-icons/fi";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/koleksi", label: "Koleksi" },
  { href: "/cerita", label: "Cerita" },
  { href: "/wawasan", label: "Wawasan" },
  { href: "/komunitas", label: "Komunitas" },
];

// Dummy auth state (replace with real auth logic)
const isLoggedIn = false;
const userAvatar = "https://randomuser.me/api/portraits/men/65.jpg";

export default function Navbar() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-background border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 gap-4">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl whitespace-nowrap">
          <Image src="/images/logo/cerita-batik-logo.png" alt="Cerita Batik Logo" width={32} height={32} className="rounded-full" />
          <span className="hidden sm:inline tracking-tight">Cerita Batik</span>
        </Link>

        {/* Desktop Search & Actions */}
        <div className="hidden lg:flex flex-1 items-center gap-4 whitespace-nowrap">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari cerita, pengrajin, atau produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full bg-muted border-none pl-12 py-3 text-base text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
            />
          </div>
          {isLoggedIn ? (
            <>
              <button className="p-3 rounded-full hover:bg-accent transition" aria-label="Keranjang Belanja">
                <FiShoppingCart size={22} />
              </button>
              <button className="p-3 rounded-full hover:bg-accent transition" aria-label="Bantuan"><FiHelpCircle size={22} /></button>
              <button className="p-3 rounded-full hover:bg-accent transition" aria-label="Pengaturan"><FiSettings size={22} /></button>
              <Avatar className="ml-2 w-9 h-9">
                <AvatarImage src={userAvatar} alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </>
          ) : (
            <Link href="/login" className="ml-2 px-6 py-2 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition flex items-center gap-2 text-base shadow">
              <FiLogIn size={20} /> Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden p-2 rounded-full hover:bg-accent transition"
          aria-label="Menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-background border-t px-4 pb-4 pt-2 animate-fade-in-down">
          <div className="flex flex-col gap-2 mb-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-base transition",
                  pathname === link.href
                    ? "bg-primary text-white shadow"
                    : "text-muted-foreground hover:bg-accent"
                )}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Input
            type="text"
            placeholder="Cari cerita, pengrajin, atau produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-muted border-none focus:ring-2 focus:ring-primary text-base text-foreground placeholder:text-muted-foreground mb-3"
          />
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full hover:bg-accent transition" aria-label="Keranjang Belanja">
                <FiShoppingCart size={22} />
              </button>
              <button className="p-2 rounded-full hover:bg-accent transition" aria-label="Bantuan"><FiHelpCircle size={22} /></button>
              <button className="p-2 rounded-full hover:bg-accent transition" aria-label="Pengaturan"><FiSettings size={22} /></button>
              <Avatar className="w-9 h-9">
                <AvatarImage src={userAvatar} alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <Link href="/login" className="w-full mt-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition flex items-center gap-2 text-base shadow justify-center">
              <FiLogIn size={20} /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
} 