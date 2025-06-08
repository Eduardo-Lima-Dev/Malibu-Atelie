import Image from "next/image";

type HeroProps = {
  produtos: any[];
};

export default function Hero({ produtos }: HeroProps) {
  return (
    <section className="flex justify-center items-center py-10 bg-[#F4EDE4]">
      <div className="flex rounded-2xl overflow-hidden w-[1100px] h-[400px] bg-[#D59C7E]">
        <div className="flex-1 flex items-center justify-center p-10">
          <h1 className="text-6xl font-bold font-serif text-black leading-tight">
            Crochê Único e<br />Feito à Mão
          </h1>
        </div>
        <div className="flex flex-1 h-full w-full">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative w-1/3 h-full">
              <Image
                src={produtos[i]?.image || `/img${i + 1}.jpg`}
                alt={`Modelo ${i + 1}`}
                fill
                className="object-cover h-full w-full"
                sizes="(max-width: 1100px) 33vw, 363px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 