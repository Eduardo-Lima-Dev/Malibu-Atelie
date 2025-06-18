"use client"

import Image from "next/image";
import { useState } from "react";
import SidebarMenu from "@/components/SidebarMenu";
import { SidebarMenuItem } from "@/types/sidebar";

const menuItems: SidebarMenuItem[] = [
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
    ),
    label: "Home",
    href: "#"
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="M8 11h6M11 8v6" /></svg>
    ),
    label: "Encomendar",
    href: "#"
  }
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className="flex justify-between items-center px-4 md:px-8 py-4 border-b-4 border-marrom"
      style={{ background: "#F4EDE4" }}
    >
      <div className="flex flex-col items-start">
        <Image src="/assets/logo-maliibu.svg" alt="Malibu Ateliê" width={220} height={48} priority />
      </div>
      <nav className="hidden md:flex gap-8 text-marrom font-poppins text-base font-normal opacity-70">
        <a href="#">Home</a>
        <a href="#">Encomendar</a>
      </nav>
      <div className="flex items-center gap-4 text-marrom">
        <a
          href="https://wa.me/8994664958?text=Olá, gostaria de fazer um orçamento"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <Image src="/assets/social.png" alt="WhatsApp" width={22} height={22} />
        </a>
        <span className="inline md:hidden mx-2 text-marrom/40">|</span>
        <button className="md:hidden" aria-label="Menu" onClick={() => setIsMenuOpen(true)}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 7h14M4 12h14M4 17h14" />
          </svg>
        </button>
      </div>
      <SidebarMenu open={isMenuOpen} onClose={() => setIsMenuOpen(false)} logoSrc="/assets/logo-maliibu.svg" items={menuItems} />
    </header>
  );
} 