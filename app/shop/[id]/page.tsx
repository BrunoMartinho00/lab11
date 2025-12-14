// app/shop/[id]/page.tsx

import { notFound } from 'next/navigation';
import { ProdutoDetalheFetcher } from '@/components/ProdutoDetalheFetcher/ProdutoDetalheFetcher';

interface ProductDetailPageProps {
  params: Promise<{
    id?: string;
  }>;
}

export default async function ProdutoDetalhePage({ params }: ProductDetailPageProps) {
  
  // ✅ OBRIGATÓRIO: await params
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
    <div className="main-container">
      <ProdutoDetalheFetcher productId={id} />
    </div>
  );
}
