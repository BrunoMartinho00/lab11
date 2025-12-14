// app/api/products/[id]/route.ts
// Nota: O Next.js trata este ficheiro como Server-Side logic.

const DEISI_API_BASE = 'https://deisishop.pythonanywhere.com';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id?: string }> }
) {
  // ✅ CORREÇÃO FINAL: Usamos await para resolver a Promise 'params'
  const { id } = await params;

  if (!id || id === 'undefined') {
    return new Response('ID do produto inválido.', { status: 400 });
  }

  const externalApiUrl = `${DEISI_API_BASE}/products/${id}`;

  try {
    // Usamos cache: 'no-store' para garantir que obtemos o estado mais recente
    const res = await fetch(externalApiUrl, { cache: 'no-store' });

    if (!res.ok) {
      return new Response('Produto não encontrado.', { status: res.status });
    }

    const productData = await res.json();
    return Response.json(productData);

  } catch (error) {
    console.error(`Erro ao buscar produto ${id}:`, error);
    return new Response('Erro interno do servidor.', { status: 500 });
  }
}