import Image from "next/image";

type HeroProps = {
  produtos: any[];
};

export default function Hero({ produtos }: HeroProps) {
  return (
    <section className="flex justify-center items-center py-6 sm:py-10 bg-[#F4EDE4]">
      <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden w-full max-w-[1100px] h-auto md:h-[400px] bg-[#D59C7E]">
        <div className="flex-1 flex items-center justify-center p-6 md:p-10">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold font-serif text-black leading-tight text-center md:text-left">
            Crochê Único e<br />Feito à Mão
          </h1>
        </div>
        <div className="hidden md:flex flex-1 h-full">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative w-1/3 h-full">
              <Image
                src={produtos[i]?.images && produtos[i].images.length > 0 ? produtos[i].images[0].url : `/img${i + 1}.jpg`}
                alt={`Modelo ${i + 1}`}
                fill
                className="object-cover h-full w-full"
                sizes="(max-width: 1100px) 33vw, 363px"
              />
            </div>
          ))}
        </div>
        <div className="flex w-full h-40 gap-2 px-2 pb-4 md:hidden">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative flex-1 h-full">
              <Image
                src={produtos[i]?.images && produtos[i].images.length > 0 ? produtos[i].images[0].url : `/img${i + 1}.jpg`}
                alt={`Modelo ${i + 1}`}
                fill
                className="object-cover h-full w-full rounded-lg"
                sizes="33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 