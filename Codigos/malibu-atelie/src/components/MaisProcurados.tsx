import Image from "next/image";

type MaisProcuradosProps = {
  produtos: any[];
};

export default function MaisProcurados({ produtos }: MaisProcuradosProps) {
  return (
    <section className="flex flex-col md:flex-row gap-8 px-8 py-8">
      <div className="flex-1 flex flex-col gap-4">
        <h2 className="font-poppins text-2xl font-bold text-marrom">Mais Procurados</h2>
        <p className="text-marrom">Escolha seus favoritos entre os mais desejados da temporada.</p>
        <button className="bg-caramelo text-marrom px-6 py-2 rounded-full w-max font-semibold mt-2 hover:bg-terracota transition">Ver mais →</button>
      </div>
      <div className="flex-[2] flex gap-6">
        {produtos.map((produto: any) => (
          <div key={produto.id} className="bg-white rounded-xl p-4 flex-1 flex flex-col items-center shadow">
            <Image
              src={produto.images && produto.images.length > 0 ? produto.images[0].url : "/placeholder.jpg"}
              alt={produto.name}
              width={200}
              height={200}
              className="rounded-lg object-cover"
            />
            <div className="mt-2 font-poppins text-marrom text-center">{produto.name}</div>
            <div className="text-marrom text-center">R$ {Number(produto.price).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </section>
  );
} 