import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProdutoPage({ params }: PageProps) {
  const { id } = await params;
  
  const produto = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: {
      images: true,
      category: true,
    },
  });

  if (!produto) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-creme py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Image
              src={produto.images && produto.images.length > 0 ? produto.images[0].url : "/placeholder.jpg"}
              alt={produto.name}
              width={1080}
              height={1350}
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-playfair font-bold text-marrom">{produto.name}</h1>
            <p className="text-2xl font-poppins text-marrom font-semibold">
              R$ {produto.price.toFixed(2)}
            </p>
            <p className="text-gray-600 leading-relaxed">{produto.description}</p>
            {produto.category && (
              <p className="text-sm text-gray-500">
                Categoria: {produto.category.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 