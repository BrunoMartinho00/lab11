// components/ProdutoDetalhe/ProdutoDetalhe.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/models/interfaces'; 
import { useRouter } from 'next/navigation'; 

const IMAGE_BASE_URL = 'https://deisishop.pythonanywhere.com';

// Função concisa para garantir URL absoluta (essencial para Next/Image)
const ensureAbsoluteUrl = (path: string) => 
    path.startsWith('http') 
        ? path 
        : `${IMAGE_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;


interface ProdutoDetalheProps {
    product: Product;
    onAddToCart: (product: Product) => void; 
}

export const ProdutoDetalhe: React.FC<ProdutoDetalheProps> = ({ product, onAddToCart }) => {
    const router = useRouter();
    
    const imageUrl = ensureAbsoluteUrl(product.image); 
    const formattedPrice = parseFloat(product.price).toFixed(2);
    const ratingStars = '⭐'.repeat(Math.round(product.rating.rate));

    return (
        <div className="detalhe-container">
            
            <button 
                className="btn-voltar"
                onClick={() => router.back()}
            >
                ← Voltar à Lista de Produtos
            </button>
            
            <h1 className="detalhe-title">{product.title}</h1>
            
            <div className="detalhe-content-layout"> 
                
                {/* Estilos inline são usados para a correção de tamanho (limita o 'fill') */}
                <div 
                    className="detalhe-image-column"
                    style={{ position: 'relative', width: '300px', height: '300px' }}
                >
                    <Image
                        loading="eager"
                        src={imageUrl}
                        alt={product.title}
                        fill
                        style={{ objectFit: 'contain' }}
                        sizes="50vw"
                        className="detalhe-image" 
                    />
                </div>
                
                <div className="detalhe-info-column">
                    <p className="detalhe-price">{formattedPrice} €</p>
                    
                    <div className="detalhe-rating">
                        {ratingStars} ({product.rating.count} avaliações)
                    </div>

                    <p className="detalhe-description">{product.description}</p>

                    <div className="detalhe-category">
                        Categoria: <span>{product.category}</span>
                    </div>

                    <button 
                        className="btn-add-cart-large"
                        onClick={() => onAddToCart(product)}
                    >
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    );
};