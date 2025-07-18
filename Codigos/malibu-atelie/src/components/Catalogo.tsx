"use client";

import Image from "next/image";

type CatalogoProps = {
  produtos: any[];
};

export default function Catalogo({ produtos }: CatalogoProps) {
  return (
    <section className="px-4 py-8">
      <h2 className="font-poppins text-2xl font-bold text-marrom mb-8 text-center">Catalogo</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        {produtos.slice(0, 4).map((produto: any, idx: number) => (
          <div key={produto.id} className="bg-caramelo rounded-xl p-4 flex flex-col items-center shadow">
            <Image
              src={produto.images && produto.images.length > 0 ? produto.images[0].url : "/placeholder.jpg"}
              alt={produto.name}
              width={400}
              height={500}
              className="rounded-lg object-cover w-full h-auto max-h-80"
            />
            <div className="mt-4 font-playfair text-marrom text-lg text-center font-bold">{produto.name}</div>
            <div className="text-marrom text-center text-sm mb-2">{produto.description}</div>
            <a href="/catalogo" className="mt-4 text-marrom font-semibold underline underline-offset-4 w-full md:w-auto inline-block text-center">Explorar →</a>
          </div>
        ))}
      </div>
    </section>
  );
} 