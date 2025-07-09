"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProdutos } from "@/lib/api";

export default function CatalogoPage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [sort, setSort] = useState<string>("none");

  useEffect(() => {
    async function fetchProdutos() {
      const data = await getProdutos();
      setProdutos(data);
    }
    fetchProdutos();
  }, []);

  const sortedProdutos = [...produtos];
  if (sort === "asc") {
    sortedProdutos.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    sortedProdutos.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="min-h-screen font-poppins" style={{ background: "#F4EDE4" }}>
      <Header />
      <main className="px-4 py-8 md:px-8">
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          {/* Botão Voltar */}
          <a
            href="/"
            className="text-marrom px-4 py-2 rounded-full font-semibold hover:bg-[#A0522D] transition w-max md:static md:order-1"
          >
            ← Voltar
          </a>
          {/* Título centralizado */}
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
          {/* Filtro */}
          <select
            className="border border-marrom rounded px-3 py-2 text-marrom bg-white font-semibold w-full md:w-auto md:order-3"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="none">Ordenar por</option>
            <option value="asc">Menor preço</option>
            <option value="desc">Maior preço</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {sortedProdutos.map((produto: any) => (
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
                  href={`https://wa.me/8994664958?text=Olá, gostaria de encomendar ${encodeURIComponent(produto.name)}`}
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
      </main>
      <Footer />
    </div>
  );
} 