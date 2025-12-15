// app/api/products/route.ts

export async function GET() {
  /*
  const newProduct = {
    id: 9999, // ID alto para evitar conflitos
    title: "Caneca Mágica DEISI (Edição Especial)",
    price: "19.50",
    description: "Caneca que muda de cor quando aquecida, perfeita para cafés de madrugada a programar.",
    category: "stationery",
    image: "/media/produtos/caneca_magica_deisi.png", // Use um caminho de imagem simulado
    rating: { rate: 4.9, count: 150 }
  };
  */
  try {
    const res = await fetch('https://deisishop.pythonanywhere.com/products');
    // Verifica se a resposta HTTP é 2xx
    if (!res.ok) {
      // Retorna uma resposta de erro com o status correto
      return new Response('Erro ao buscar dados', { status: res.status });
    }
    const data = await res.json();
    
    //const finalData = [newProduct, ...data];
    return Response.json(data);
    //return Response.json(finalData);
  } catch (error) {
    // Captura erros de rede ou exceções inesperadas
    return new Response(`Erro na API: ${error}` , { status: 500 });
  }
}