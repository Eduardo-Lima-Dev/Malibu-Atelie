import { getProdutos } from "@/lib/api";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Catalogo from "@/components/Catalogo";
import Footer from "@/components/Footer";
import MaisProcurados from "@/components/MaisProcurados";

export default async function Home() {
  const produtos = await getProdutos();
  const maisProcurados = produtos.slice(0, 3);
  const catalogo = produtos.slice(3, 6);

  return (
    <div className="bg-white min-h-screen font-poppins">
      <Header />
      <Hero produtos={maisProcurados} />
      <MaisProcurados produtos={maisProcurados} />
      <Catalogo produtos={catalogo} />
      <Footer />
    </div>
  );
}
