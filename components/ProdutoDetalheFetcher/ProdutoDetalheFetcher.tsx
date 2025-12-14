// components/ProdutoDetalheFetcher/ProdutoDetalheFetcher.tsx
'use client';

import React from 'react';
import useSWR from 'swr';
import { Product } from '@/models/interfaces';
import { ProdutoDetalhe } from '@/components/ProdutoDetalhe/ProdutoDetalhe';
import { CartItem } from '@/app/shop/page'; // Importa a interface para tipagem

// --- LÓGICA DE MANIPULAÇÃO DO LOCAL STORAGE (REPLICADA) ---

const CART_STORAGE_KEY = 'deisiShopCart';

const getCartFromStorage = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
};

const saveCartToStorage = (cart: CartItem[]): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        // Dispara evento para que shop/page.tsx reaja
        window.dispatchEvent(new Event('storage')); 
    }
};

// Função de adição real usada no componente de Detalhes
const handleAddToCartReal = (product: Product) => {
    const currentCart = getCartFromStorage();
    const itemIndex = currentCart.findIndex(item => item.id === product.id);
    
    let newCart;
    if (itemIndex > -1) {
        newCart = [...currentCart];
        newCart[itemIndex].quantity += 1;
    } else {
        newCart = [...currentCart, { ...product, quantity: 1 }];
    }
    
    saveCartToStorage(newCart);
    alert(`"${product.title}" adicionado(s) ao carrinho!`);
};

// --- FIM DA LÓGICA DE MANIPULAÇÃO ---

const Spinner = () => (
// ... (código Spinner)
  <div className="spinner-box">
    <div className="spinner-loader"></div>
    <p className="spinner-text">A carregar detalhes...</p>
  </div>
);

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ao carregar produto');
  return res.json();
};

interface ProdutoDetalheFetcherProps {
  productId?: string;
}

export const ProdutoDetalheFetcher: React.FC<ProdutoDetalheFetcherProps> = ({ productId }) => {

  if (!productId) {
    return <div className="error-message-full">ID do produto inválido.</div>;
  }

  const API_URL = `/api/products/${productId}`;
  const { data: product, error, isLoading } = useSWR<Product>(API_URL, fetcher);

  if (error) {
    return <div className="error-message-full">Erro ao carregar o produto.</div>;
  }

  if (isLoading || !product) {
    return <Spinner />;
  }
  
  return (
    <ProdutoDetalhe
      product={product}
      onAddToCart={handleAddToCartReal} // Usamos a função REAL que manipula o localStorage
    />
  );
};