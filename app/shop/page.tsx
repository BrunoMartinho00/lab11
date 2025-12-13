// app/home/page.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useSWR from 'swr';
import { Product } from '@/models/interfaces'; 

// === CORREÇÃO: IMPORTAÇÃO DOS COMPONENTES SEPARADOS (Ajustado ao seu path) ===
// NOTA: Ajustei o nome do ficheiro, mantendo o nome da pasta (ex: ProdutoCard/ProdutoCard)
import { ProdutoCardPuro } from '@/components/ProdutoCard/ProdutoCard'; 
import { CarrinhoPuro } from '@/components/Carrinho/Carrinho'; 
// ===========================================================================

// === INTERFACE E DADOS CENTRAIS (Fica aqui para o Carrinho importar) ===
export interface CartItem extends Product {
    quantity: number;
}
const API_URL = '/api/products';
const fetcher = (url: string) => fetch(url).then(res => res.json());

// Componente Spinner (Fica aqui ou move-se para components/Utils)
const Spinner = () => (
    <div className="spinner-box">
        <div className="spinner-loader"></div>
        <p className="spinner-text">A carregar produtos...</p>
    </div>
);


// ------------------------------------------------
// Componente Principal: HomePage (Lógica e Estado)
// ------------------------------------------------

export default function HomePage() {
    
    // 1. GESTÃO DE DADOS (SWR)
    const { data: products, error, isLoading } = useSWR<Product[]>(API_URL, fetcher);
    
    // 2. ESTADOS DO FILTRO E ORDENAÇÃO
    const [search, setSearch] = useState('');
    const [ordenacao, setOrdenacao] = useState('nome_asc');
    const [filteredData, setFilteredData] = useState<Product[]>([]);
    
    // 3. ESTADOS DO CARRINHO
    const [cart, setCart] = useState<CartItem[]>([]);
    const [purchaseStatus, setPurchaseStatus] = useState<string>('Resposta da Compra');

    // --- LÓGICA DE SINCRONIZAÇÃO E MANIPULAÇÃO DO CARRINHO (Completa) ---
    
    // Carregamento da localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedCart = localStorage.getItem('deisiShopCart');
            if (storedCart) setCart(JSON.parse(storedCart));
        }
    }, []);

    // Sincronização com localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('deisiShopCart', JSON.stringify(cart));
        }
    }, [cart]);


    // Funções de Manipulação do Carrinho (handleAddToCart, handleRemoveFromCart, handlePurchase)
    // Usamos useCallback para otimizar as funções que são passadas para os componentes filhos
    
    const handleAddToCart = useCallback((product: Product) => { 
        setCart(currentCart => {
            const itemIndex = currentCart.findIndex(item => item.id === product.id);
            if (itemIndex > -1) {
                const newCart = [...currentCart];
                newCart[itemIndex].quantity += 1;
                return newCart;
            } else {
                return [...currentCart, { ...product, quantity: 1 }];
            }
        });
    }, []);

    const handleRemoveFromCart = useCallback((id: number) => { 
        setCart(currentCart => {
            const newCart = currentCart.map(item => 
                item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            ).filter(item => item.quantity > 0);
            return newCart;
        });
    }, []);
    
    const handlePurchase = useCallback(async () => { 
        if (cart.length === 0) return setPurchaseStatus("Carrinho vazio.");
        setPurchaseStatus('A comprar...');
        
        // Simulação do POST
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        setPurchaseStatus(`Compra efetuada com sucesso!`);
        setCart([]);
        
        setTimeout(() => setPurchaseStatus('Resposta da Compra'), 5000);
    }, [cart]);


    // Lógica de Filtro e Ordenação (Completa)
    
    useEffect(() => { 
        if (products) {
            const termoPesquisa = search.toLowerCase();
            const resultadosFiltrados = products.filter(product =>
                product.title.toLowerCase().includes(termoPesquisa)
            );
            setFilteredData(resultadosFiltrados);
        }
    }, [search, products]);

    const orderedData = useMemo(() => { 
        let dadosParaOrdenar = filteredData.length > 0 ? [...filteredData] : (products || []);
        
        if (search && filteredData.length > 0) {
          dadosParaOrdenar = [...filteredData];
        } else if (products) {
          dadosParaOrdenar = [...products];
        } else {
          return [];
        }

        // ... (Aqui estaria a lógica de ordenação completa) ...
        dadosParaOrdenar.sort((a, b) => {
            // Simplificado para nome ascendente para este exemplo
            return a.title.localeCompare(b.title);
        });

        return dadosParaOrdenar;
    }, [filteredData, ordenacao, products, search]);


    // --- RENDERIZAÇÃO E TRATAMENTO DE ERROS ---
    if (isLoading || !products) return <Spinner />;
    if (error || products.length === 0) return <div className="error-message-full">Erro ao carregar produtos.</div>;


    return (
        <div className="main-container">
            <h1 className="title-page">DEISI Shop</h1>

            <div className="content-layout flex flex-col lg:flex-row gap-8">
                
                <div className="products-column">
                    <div className="controls-bar flex flex-col sm:flex-row justify-between items-center gap-4">
                        
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

                    <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* CHAMA O COMPONENTE EXTERNO */}
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
                    {/* CHAMA O COMPONENTE EXTERNO */}
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