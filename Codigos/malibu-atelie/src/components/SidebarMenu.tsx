import Image from "next/image";
import React from "react";
import { SidebarMenuItem, SidebarMenuProps } from "@/types/sidebar";

export default function SidebarMenu({ open, onClose, logoSrc, items }: SidebarMenuProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="flex-1 bg-black/60"
        onClick={onClose}
        aria-label="Fechar menu"
      />
      {/* Sidebar */}
      <aside className="w-72 bg-[#F4EDE4] h-full flex flex-col items-center py-6 shadow-2xl">
        {logoSrc && (
          <Image src={logoSrc} alt="Logo" width={120} height={120} className="mb-8" />
        )}
        <nav className="flex flex-col gap-4 w-full px-6">
          {items.map((item, idx) => (
            item.href ? (
              <a
                key={idx}
                href={item.href}
                className="flex items-center gap-3 text-marrom py-2 hover:bg-caramelo rounded transition"
                onClick={onClose}
              >
                {item.icon}
                {item.label}
              </a>
            ) : (
              <button
                key={idx}
                className="flex items-center gap-3 text-marrom py-2 hover:bg-caramelo rounded transition text-left w-full"
                onClick={() => {
                  item.onClick?.();
                  onClose();
                }}
              >
                {item.icon}
                {item.label}
              </button>
            )
          ))}
        </nav>
      </aside>
    </div>
  );
} 