export default function Footer() {
  return (
    <footer className="bg-creme py-8 flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <a href="#"><img src="/icon-instagram.svg" alt="Instagram" width={24} /></a>
        <a href="#"><img src="/icon-facebook.svg" alt="Facebook" width={24} /></a>
        <a href="#"><img src="/icon-twitter.svg" alt="Twitter" width={24} /></a>
      </div>
      <span className="text-marrom text-sm">© Malibu Ateliê - Handmade Crochê</span>
    </footer>
  );
} 