import Image from "next/image";

type MaisProcuradosProps = {
  produtos: any[];
};

export default function MaisProcurados({ produtos }: MaisProcuradosProps) {
  return (
    <section className="flex flex-col gap-6 px-4 py-8 md:flex-row md:gap-8 md:px-8">
      <div className="flex-1 flex flex-col gap-4 items-center md:items-start">
        <h2 className="font-poppins text-2xl font-bold text-marrom text-center md:text-left">Mais Procurados</h2>
        <p className="text-marrom text-center md:text-left">Escolha seus favoritos entre os mais desejados da temporada.</p>
        <button className="bg-caramelo text-marrom px-6 py-2 rounded-full w-full md:w-max font-semibold mt-2 hover:bg-terracota transition">Ver mais →</button>
      </div>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {produtos.map((produto: any) => (
          <div key={produto.id} className="bg-white rounded-xl p-3 flex flex-col items-center shadow">
            <Image
              src={produto.images && produto.images.length > 0 ? produto.images[0].url : "/placeholder.jpg"}
              alt={produto.name}
              width={400}
              height={500}
              className="rounded-lg object-cover w-full h-auto max-h-80"
            />
            <div className="mt-2 font-poppins text-marrom text-center text-base md:text-lg">{produto.name}</div>
            <div className="text-marrom text-center text-sm">R$ {Number(produto.price).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </section>
  );
} 