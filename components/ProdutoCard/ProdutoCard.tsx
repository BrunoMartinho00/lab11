// components/ProdutoCard/ProdutoCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // <-- 1. Importar useRouter
import { Product } from '@/models/interfaces'; 

// Importa a interface CartItem para a prop onAddToCart
import { CartItem } from '@/app/shop/page'; 

// SOLUÇÃO PARA AS IMAGENS (Necessário para o componente Image)
const imageLoader = ({ src }: { src: string }) => src; 

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export const ProdutoCardPuro: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    const router = useRouter(); // <-- 2. Inicializar router
    
    const IMAGE_BASE_URL = 'https://deisishop.pythonanywhere.com';
    const imageUrl = `${IMAGE_BASE_URL}${product.image}`;
    
    // Formatação de Preço para 2 casas decimais
    const formattedPrice = parseFloat(product.price).toFixed(2);
    
    // 3. Função para navegar para a página de detalhes
    const navigateToDetails = () => {
        // Usa o caminho dinâmico: /shop/[id]
        router.push(`/shop/${product.id}`); 
    };

    return (
        <div 
            className="card-container flex flex-col items-center"
            onClick={navigateToDetails} // <-- AÇÃO: Clicar no container navega
            style={{ cursor: 'pointer' }} // <-- Boa prática de UX
        >
            <div className="card-image-wrapper w-full relative">
                <Image
                    loader={imageLoader} 
                    src={imageUrl}
                    alt={product.title}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="rounded-t-lg"
                />
            </div>

            <h3 className="card-title">{product.title}</h3>
            <p className="price-text">
                {formattedPrice} €
            </p>
            <div className="rating-info">
                Rating: {product.rating.rate} ({product.rating.count} avaliações)
            </div>

            <div 
                className="card-actions flex justify-between w-full"
                onClick={(e) => e.stopPropagation()} // <-- AÇÃO CRÍTICA: Impede que o clique nos botões ative a navegação do card
            >
                <button 
                    className="btn-add-cart"
                    onClick={() => onAddToCart(product)}
                >
                    Adicionar ao Cart
                </button>
                
                {/* O botão +info já usa o caminho /shop/[id] */}
                <Link href={`/shop/${product.id}`} className="btn-info">
                    +info
                </Link>
            </div>
        </div>
    );
};