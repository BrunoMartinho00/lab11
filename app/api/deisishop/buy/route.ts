// app/api/deisishop/buy/route.ts

const DEISI_API_BASE = 'https://deisishop.pythonanywhere.com';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        const response = await fetch(`${DEISI_API_BASE}/buy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            return new Response(JSON.stringify(errorData), { status: response.status, headers: { 'Content-Type': 'application/json' } });
        }

        const data = await response.json();
        
        // Se o problema persistir, este log é a chave.
        console.log("RESPOSTA DA API DE COMPRA DA DEISI SHOP (PARA DEBUG):", data); 
        
        return Response.json(data);

    } catch (error) {
        console.error('Erro no Route Handler POST:', error);
        return new Response('Erro interno do servidor ao processar a compra.', { status: 500 });
    }
}