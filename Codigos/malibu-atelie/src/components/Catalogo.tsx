import Image from "next/image";

type CatalogoProps = {
  produtos: any[];
};

export default function Catalogo({ produtos }: CatalogoProps) {
  return (
    <section className="px-8 py-8">
      <h2 className="font-poppins text-2xl font-bold text-marrom mb-8 text-center">Catalogo</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {produtos.map((produto: any, idx: number) => (
          <div key={produto.id} className="bg-caramelo rounded-xl p-6 flex flex-col items-center shadow">
            <Image
              src={produto.images && produto.images.length > 0 ? produto.images[0].url : "/placeholder.jpg"}
              alt={produto.name}
              width={250}
              height={250}
              className="rounded-lg object-cover"
            />
            <div className="mt-4 font-playfair text-marrom text-lg text-center font-bold">{produto.name}</div>
            <div className="text-marrom text-center text-sm mb-2">{produto.description}</div>
            {idx === 0 && (
              <div className="text-marrom text-center text-xs">blusa e saia, com acabamento impecável e franjas douradas</div>
            )}
            {idx === 1 && (
              <div className="text-marrom text-center text-xs">cor e alegria pra usar nos bloquinhos de carnaval na praia</div>
            )}
            {idx === 2 && (
              <div className="text-marrom text-center text-xs">acabamento premium, confortável e estiloso</div>
            )}
            <button className="mt-4 text-marrom font-semibold underline underline-offset-4">Explorar →</button>
          </div>
        ))}
      </div>
    </section>
  );
} 