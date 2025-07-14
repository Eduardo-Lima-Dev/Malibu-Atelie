export default function Footer() {
  return (
    <footer className="bg-creme py-8 flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <a 
          href="https://www.instagram.com/malibuatelie__/" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <img src="/assets/icon-instagram.svg" alt="Instagram" width={24} />
        </a>
        <a 
          href="https://wa.me/8994664958?text=Olá, gostaria de fazer um orçamento" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <img src="/assets/icon-whatsapp.svg" alt="WhatsApp" width={24} />
        </a>
      </div>
      <span className="text-marrom text-sm">© Malibu Ateliê - Handmade Crochê</span>
      <span className="text-marrom text-xs opacity-70 mt-2">
        Desenvolvido por <a href="https://eduardo-dev-ten.vercel.app/pt" target="_blank" rel="noopener noreferrer" className="underline hover:text-marrom font-semibold">Eduardo.Dev</a>
        {' | '}
        <a href="https://www.instagram.com/eduard0.dev/" target="_blank" rel="noopener noreferrer" className="underline hover:text-marrom">@eduard0.dev</a>
      </span>
    </footer>
  );
} 