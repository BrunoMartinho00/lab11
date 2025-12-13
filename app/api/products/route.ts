// app/api/products/route.ts

export async function GET() {
  try {
    const res = await fetch('https://deisishop.pythonanywhere.com/products');
    // Verifica se a resposta HTTP é 2xx
    if (!res.ok) {
      // Retorna uma resposta de erro com o status correto
      return new Response('Erro ao buscar dados', { status: res.status });
    }
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    // Captura erros de rede ou exceções inesperadas
    return new Response(`Erro na API: ${error}` , { status: 500 });
  }
}