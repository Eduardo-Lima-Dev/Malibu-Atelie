"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProdutos } from "@/lib/api";
import Paginacao from "@/components/Paginacao";

export default function CatalogoPage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [sort, setSort] = useState<string>("none");
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  useEffect(() => {
    async function fetchProdutos() {
      const data = await getProdutos();
      setProdutos(data);
    }
    fetchProdutos();
  }, []);

  let filteredProdutos = [...produtos];
  if (busca) {
    filteredProdutos = filteredProdutos.filter(p => p.name.toLowerCase().includes(busca.toLowerCase()));
  }
  if (sort === "asc") {
    filteredProdutos.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    filteredProdutos.sort((a, b) => b.price - a.price);
  }

  const totalItens = filteredProdutos.length;
  const startIdx = (paginaAtual - 1) * itensPorPagina;
  const endIdx = startIdx + itensPorPagina;
  const produtosPaginados = filteredProdutos.slice(startIdx, endIdx);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, sort]);

  return (
    <div className="min-h-screen font-poppins" style={{ background: "#F4EDE4" }}>
      <Header />
      <main className="px-4 py-8 md:px-8">
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">

          <a
            href="/"
            className="text-marrom px-4 py-2 rounded-full font-semibold hover:bg-[#A0522D] transition w-max md:static md:order-1"
          >
            ← Voltar
          </a>

          <h1
            className="
              font-poppins text-3xl font-bold text-marrom
              text-center
              md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
              md:w-max md:order-2
            "
            style={{ minWidth: 180 }}
          >
            Catálogo
          </h1>
          <select
            className="border border-marrom rounded-full px-3 py-2 text-marrom bg-[#F4EDE4] font-semibold w-full md:w-auto md:order-3"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="none">Ordenar por</option>
            <option value="asc">Menor preço</option>
            <option value="desc">Maior preço</option>
          </select>
        </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar produto pelo nome..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full border border-marrom rounded-full px-4 py-2 text-marrom bg-[#F4EDE4] font-semibold focus:outline-none focus:ring-2 focus:ring-marrom"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {produtosPaginados.map((produto: any) => (
            <div key={produto.id} className="bg-white rounded-xl p-4 flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative w-full aspect-square mb-4">
                <img
                  src={produto.images && produto.images.length > 0 ? produto.images[0].url : "/placeholder.jpg"}
                  alt={produto.name}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
              <div className="w-full text-center">
                <h3 className="font-playfair text-marrom text-lg font-bold mb-2">{produto.name}</h3>
                <p className="text-marrom text-sm mb-3 line-clamp-3">{produto.description}</p>
                <div className="text-marrom text-lg font-semibold mb-3">R$ {Number(produto.price).toFixed(2)}</div>
                <a 
                  href={`https://wa.me/558994664958?text=Olá, gostaria de encomendar ${encodeURIComponent(produto.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#8B4513] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#A0522D] transition text-center inline-block w-full"
                >
                  Encomendar
                </a>
              </div>
            </div>
          ))}
        </div>
        {filteredProdutos.length === 0 && (
          <div className="text-center text-marrom text-lg font-semibold mt-8">Produto não existe</div>
        )}

        {totalItens > itensPorPagina && (
          <div className="flex justify-center mt-8">
            <Paginacao
              paginaAtual={paginaAtual}
              totalItens={totalItens}
              itensPorPagina={itensPorPagina}
              onChange={setPaginaAtual}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 