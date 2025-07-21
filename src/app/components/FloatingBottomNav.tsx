"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FiHome, FiBookOpen, FiUsers, FiHelpCircle } from "react-icons/fi";
import { TbShirt } from "react-icons/tb";

const navLinks = [
  { href: "/", label: "Beranda", icon: <FiHome size={20} /> },
  { href: "/koleksi", label: "Koleksi", icon: <TbShirt size={20} /> },
  { href: "/cerita", label: "Cerita", icon: <FiBookOpen size={20} /> },
  { href: "/wawasan", label: "Wawasan", icon: <FiHelpCircle size={20} /> },
  { href: "/komunitas", label: "Komunitas", icon: <FiUsers size={20} /> },
];

export default function FloatingBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex gap-1 bg-muted/80 backdrop-blur-sm border rounded-full p-2 shadow-lg">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-full font-medium text-base transition whitespace-nowrap",
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
    </nav>
  );
} 