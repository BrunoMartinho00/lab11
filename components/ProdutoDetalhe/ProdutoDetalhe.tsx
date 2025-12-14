// components/ProdutoDetalhe/ProdutoDetalhe.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/models/interfaces'; 
import { useRouter } from 'next/navigation'; 

interface ProdutoDetalheProps {
    product: Product;
    onAddToCart: (product: Product) => void; 
}

export const ProdutoDetalhe: React.FC<ProdutoDetalheProps> = ({ product, onAddToCart }) => {
    const router = useRouter();
    
    // ⚠️ CORREÇÃO DA IMAGEM: Removemos a concatenação desnecessária.
    // O valor de product.image é usado diretamente, assumindo que a API retorna a URL completa (ex: https://deisishop.pythonanywhere.com/media/...)
    const imageUrl = product.image; 
    
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
            
            <div className="detalhe-content-layout flex">
                
                <div className="detalhe-image-column relative">
                    <Image
                        // loader prop não é necessária se o next.config.js estiver configurado
                        src={imageUrl}
                        alt={product.title}
                        fill
                        style={{ objectFit: 'contain' }}
                        sizes="50vw"
                        className="rounded-lg"
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
                        onClick={() => {
                            onAddToCart(product); // Chama a função real
                        }}
                    >
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    );
};