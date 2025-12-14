// components/ProdutoCard/ProdutoCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/models/interfaces'; 

// 📌 DEFINIR BASE AQUI
const IMAGE_BASE_URL = 'https://deisishop.pythonanywhere.com';

// FUNÇÃO PARA GARANTIR URL ABSOLUTA (CORREÇÃO DO ERRO 400)
// É mais robusta do que a simples concatenação
const ensureAbsoluteUrl = (path: string) => {
    if (path.startsWith('http')) {
        return path;
    }
    // Concatena a base, removendo a barra inicial se existir no path da API
    return `${IMAGE_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
};

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export const ProdutoCardPuro: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    const router = useRouter(); 
    
    const imageUrl = ensureAbsoluteUrl(product.image); 
    
    // Formatação de Preço
    const formattedPrice = parseFloat(product.price).toFixed(2);
    
    // Função para navegar
    const navigateToDetails = () => {
        router.push(`/shop/${product.id}`); 
    };

    return (
        <div 
            className="card-container"
            onClick={navigateToDetails}
            style={{ cursor: 'pointer' }}
        >
            <div className="card-image-wrapper">
                <Image
                    loading="eager" // Otimização LCP
                    src={imageUrl}
                    alt={product.title}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="card-image"
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
                className="card-actions"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    className="btn-add-cart"
                    onClick={() => onAddToCart(product)}
                >
                    Adicionar ao Cart
                </button>
                
                <Link href={`/shop/${product.id}`} className="btn-info">
                    +info
                </Link>
            </div>
        </div>
    );
};