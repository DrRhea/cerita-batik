"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FiBox, FiHome, FiLogIn, FiHelpCircle, FiSettings } from "react-icons/fi";

const navLinks = [
  { href: "/", label: "Beranda", icon: <FiHome size={18} /> },
  { href: "/produk", label: "Produk", icon: <FiBox size={18} /> },
  { href: "/login", label: "Login", icon: <FiLogIn size={18} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  return (
    <nav className="w-full bg-background border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="inline-block w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-bold">B</span>
          <span className="hidden sm:inline">Batik Market</span>
        </Link>

        {/* Navigation */}
        <div className="flex gap-2 bg-muted rounded-full px-2 py-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition",
                pathname === link.href
                  ? "bg-gradient-to-r from-black to-primary text-white shadow"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Search Anything..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 md:w-64 rounded-full bg-muted border-none focus:ring-2 focus:ring-primary"
          />
          <button className="p-2 rounded-full hover:bg-accent transition"><FiHelpCircle size={20} /></button>
          <button className="p-2 rounded-full hover:bg-accent transition"><FiSettings size={20} /></button>
          <Avatar className="ml-2 w-9 h-9">
            <AvatarImage src="https://randomuser.me/api/portraits/men/65.jpg" alt="User" />
            <AvatarFallback>N</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
} 