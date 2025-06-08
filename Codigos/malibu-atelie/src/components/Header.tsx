import Image from "next/image";

export default function Header() {
  return (
    <header
      className="flex justify-between items-center px-8 py-4 border-b-4 border-marrom"
      style={{ background: "#F4EDE4" }}
    >
      <div className="flex flex-col items-start">
        <Image src="/assets/logo-maliibu.svg" alt="Malibu Ateliê" width={220} height={48} priority />
      </div>
      <nav className="flex gap-8 text-marrom font-poppins text-base font-normal opacity-70">
        <a href="#">Home</a>
        <a href="#">Pronta entrega</a>
        <a href="#">Encomendar</a>
      </nav>
      <div className="flex items-center gap-4 text-marrom">
        <button aria-label="Carrinho">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 6h13l-1.5 9h-10z"/><circle cx="9" cy="19" r="1"/><circle cx="17" cy="19" r="1"/></svg>
        </button>
        <button aria-label="Usuário">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="8" r="4"/><path d="M3 20c0-4 8-4 8-4s8 0 8 4"/></svg>
        </button>
        <span className="mx-2 text-marrom/40">|</span>
        <button aria-label="Menu">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 7h14M4 12h14M4 17h14"/></svg>
        </button>
      </div>
    </header>
  );
} 