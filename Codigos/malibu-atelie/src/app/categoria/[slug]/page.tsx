import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoriaPage({ params }: PageProps) {
  const { slug } = await params;
  
  const categoria = await prisma.category.findFirst({
    where: { name: slug },
    include: {
      products: {
        include: {
          images: true,
        },
      },
    },
  });

  if (!categoria) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-creme py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-playfair font-bold text-marrom text-center mb-8">
          {categoria.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoria.products.map((produto) => (
            <div key={produto.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image
                src={produto.images && produto.images.length > 0 ? produto.images[0].url : "/placeholder.jpg"}
                alt={produto.name}
                width={1080}
                height={1350}
                className="rounded-lg object-cover w-full h-auto"
              />
              <div className="p-4">
                <h3 className="font-playfair text-marrom text-lg font-bold">{produto.name}</h3>
                <p className="font-poppins text-marrom font-semibold mt-2">
                  R$ {produto.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 