// app/shop/page.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useSWR from 'swr';
import { Product } from '@/models/interfaces'; 
import { ProdutoCardPuro } from '@/components/ProdutoCard/ProdutoCard'; 
import { CarrinhoPuro } from '@/components/Carrinho/Carrinho'; 

// === INTERFACE E DADOS CENTRAIS ===
export interface CartItem extends Product {
    quantity: number;
}
const API_URL = '/api/products';
const BUY_API_URL = '/api/deisishop/buy'; 
const fetcher = (url: string) => fetch(url).then(res => res.json());

// Componente Spinner (Mantido no topo)
const Spinner = () => (
    <div className="spinner-box">
        <div className="spinner-loader"></div>
        <p className="spinner-text">A carregar produtos...</p>
    </div>
);


// --- LÓGICA DE MANIPULAÇÃO DO LOCAL STORAGE ---
const CART_STORAGE_KEY = 'deisiShopCart';

const getCart = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
};

const saveCart = (cart: CartItem[]): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        window.dispatchEvent(new Event('storage')); 
    }
};

// ------------------------------------------------
// Componente Principal: ShopPage
// ------------------------------------------------

export default function ShopPage() {
    
    // 1. GESTÃO DE DADOS (SWR)
    const { data: products, error, isLoading } = useSWR<Product[]>(API_URL, fetcher);
    
    // 2. ESTADOS DO FILTRO E ORDENAÇÃO (filteredData removido)
    const [search, setSearch] = useState('');
    const [ordenacao, setOrdenacao] = useState('nome_asc');
    
    // 3. ESTADOS DO CARRINHO
    const [cart, setCart] = useState<CartItem[]>([]);
    const [purchaseStatus, setPurchaseStatus] = useState<string>('Resposta da Compra');

    // --- LÓGICA DE SINCRONIZAÇÃO E MANIPULAÇÃO DO CARRINHO ---
    
    useEffect(() => {
        setCart(getCart());
        const handleStorageChange = () => setCart(getCart());
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleAddToCart = useCallback((product: Product) => { 
        setCart(currentCart => {
            const itemIndex = currentCart.findIndex(item => item.id === product.id);
            let newCart;
            if (itemIndex > -1) {
                newCart = [...currentCart];
                newCart[itemIndex].quantity += 1;
            } else {
                newCart = [...currentCart, { ...product, quantity: 1 }];
            }
            saveCart(newCart); 
            return newCart;
        });
    }, []);

    const handleRemoveFromCart = useCallback((id: number) => { 
        setCart(currentCart => {
            const newCart = currentCart.map(item => 
                item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            ).filter(item => item.quantity > 0);
            saveCart(newCart); 
            return newCart;
        });
    }, []);
    
    const handlePurchase = useCallback(async (student: boolean, coupon: string) => { 
        if (cart.length === 0) return setPurchaseStatus("Carrinho vazio.");
        
        setPurchaseStatus('A processar...');
        
        const productsIds = cart.map(product => product.id);
        
        try {
            const response = await fetch(BUY_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    products: productsIds,
                    name: "Utilizador Web",
                    student: student,
                    coupon: coupon,
                }),
            });

            if (!response.ok) {
                const errorData = response.status === 400 ? await response.json() : { message: response.statusText };
                throw new Error(errorData.message || "Falha ao processar a compra.");
            }

            const responseData = await response.json();

            const purchaseId = responseData.id || responseData.orderId || responseData.reference || 'N/A';

            setCart([]);
            saveCart([]); 
            
            setPurchaseStatus(`Compra efetuada! ID: ${purchaseId}`); 

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Erro desconhecido.";
            setPurchaseStatus(`ERRO: ${errorMessage}`);
        }
        
        setTimeout(() => setPurchaseStatus('Resposta da Compra'), 5000);

    }, [cart]);


    // ✅ Lógica de Filtro e Ordenação Simplificada (UseMemo único)
    const orderedData = useMemo(() => { 
        if (!products) return [];

        let dados = products.filter(product =>
            product.title.toLowerCase().includes(search.toLowerCase())
        );

        // Lógica de Ordenação completa
        dados.sort((a, b) => {
            if (ordenacao === 'nome_asc') return a.title.localeCompare(b.title);
            if (ordenacao === 'nome_desc') return b.title.localeCompare(a.title);
            if (ordenacao === 'preco_asc') return parseFloat(a.price) - parseFloat(b.price);
            if (ordenacao === 'preco_desc') return parseFloat(b.price) - parseFloat(a.price);
            return 0;
        });
        
        return dados;
    }, [products, search, ordenacao]);


    // --- RENDERIZAÇÃO E TRATAMENTO DE ERROS ---
    if (isLoading || !products) return <Spinner />;
    if (error || products.length === 0) return <div className="error-message-full">Erro ao carregar produtos.</div>;


    return (
        <div className="main-container">
            <h1 className="title-page">DEISI Shop</h1>

            {/* ✅ SIMPLIFICAÇÃO: Usando apenas classes CSS semânticas */}
            <div className="content-layout"> 
                
                <div className="products-column">
                    <div className="controls-bar">
                        
                        <input
                            type="text"
                            placeholder="Pesquisar produtos pelo nome..."
                            className="search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            className="sort-select"
                            value={ordenacao}
                            onChange={(e) => setOrdenacao(e.target.value)}
                        >
                            <option value="nome_asc">Nome (A-Z)</option>
                            <option value="nome_desc">Nome (Z-A)</option>
                            <option value="preco_asc">Preço (Crescente)</option>
                            <option value="preco_desc">Preço (Decrescente)</option>
                        </select>
                    </div>

                    {orderedData.length === 0 && search && (
                        <p className="filter-no-results">Nenhum produto encontrado com o termo: "{search}"</p>
                    )}

                    <div className="product-grid">
                        {orderedData.map((produto) => (
                            <ProdutoCardPuro 
                                key={produto.id} 
                                product={produto}
                                onAddToCart={handleAddToCart} 
                            />
                        ))}
                    </div>
                </div>

                <div className="cart-column">
                    <CarrinhoPuro 
                        cart={cart}
                        onRemoveFromCart={handleRemoveFromCart}
                        onPurchase={handlePurchase} 
                        purchaseStatus={purchaseStatus}
                    />
                </div>
            </div>
        </div>
    );
}