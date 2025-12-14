// app/shop/[id]/page.tsx

import { notFound } from 'next/navigation';
import { ProdutoDetalheFetcher } from '@/components/ProdutoDetalheFetcher/ProdutoDetalheFetcher';
import type { Metadata } from 'next';

interface ProductDetailPageProps {
  params: Promise<{
    id?: string;
  }>;
}

export default async function ProdutoDetalhePage({ params }: ProductDetailPageProps) {
  
  // Await é crucial para resolver o ID passado pelo App Router
  const { id } = await params;

  if (!id) {
    // Redireciona para 404 se o ID estiver ausente
    notFound();
  }

  return (
    // Utiliza apenas a classe CSS semântica
    <div className="main-container">
      <ProdutoDetalheFetcher productId={id} />
    </div>
  );
}