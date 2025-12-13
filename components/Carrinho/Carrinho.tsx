// components/CarrinhoPuro.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { CartItem } from '@/app/shop/page'; // Importa a interface do carrinho

interface CarrinhoProps {
    cart: CartItem[];
    onRemoveFromCart: (id: number) => void;
    onPurchase: () => void;
    purchaseStatus: string;
}

// Item individual no Carrinho
const CartItemComponent: React.FC<{ item: CartItem, onRemove: (id: number) => void }> = ({ item, onRemove }) => (
    <div className="flex justify-between items-center cart-item-line">
        <div className="flex-grow">
            <p className="cart-item-title">{item.title} (x{item.quantity})</p>
            <p className="cart-item-details">Preço: {parseFloat(item.price).toFixed(2)} €</p>
        </div>
        <button
            className="btn-remove-item"
            onClick={() => onRemove(item.id)}
        >
            Remover
        </button>
    </div>
);


export const CarrinhoPuro: React.FC<CarrinhoProps> = ({ cart, onRemoveFromCart, onPurchase, purchaseStatus }) => {
    const [isDeisiStudent, setIsDeisiStudent] = useState(false);
    const [coupon, setCoupon] = useState('');

    // --- Lógica de cálculo de totais e descontos (useMemo) ---
    const { totalCusto, totalComDesconto } = useMemo(() => {
        const totalNumerico = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
        let desconto = 0;
        
        if (isDeisiStudent) desconto += totalNumerico * 0.10;
        if (coupon.toLowerCase() === 'deisi20') desconto += totalNumerico * 0.20;

        return { 
            totalCusto: totalNumerico.toFixed(2), 
            totalComDesconto: (totalNumerico - desconto).toFixed(2) 
        };
    }, [cart, isDeisiStudent, coupon]);

    return (
        <div className="cart-box relative">
            <h2 className="cart-header">Seu Carrinho ({cart.reduce((count, item) => count + item.quantity, 0)} Produtos)</h2>

            <div className="cart-item-list">
                {cart.length === 0 ? (
                    <p className="cart-empty-message">O carrinho está vazio.</p>
                ) : (
                    cart.map(item => <CartItemComponent key={item.id} item={item} onRemove={onRemoveFromCart} />)
                )}
            </div>

            <div className="cart-summary">
                
                <div className="cart-subtotal-line flex justify-between">
                    <span>Subtotal:</span>
                    <span>{totalCusto} €</span>
                </div>
                {totalComDesconto !== totalCusto && (
                    <div className="cart-discount-applied flex justify-between">
                        <span>Desconto Aplicado:</span>
                        <span>-{(parseFloat(totalCusto) - parseFloat(totalComDesconto)).toFixed(2)} €</span>
                    </div>
                )}
                <div className="cart-total-line flex justify-between">
                    <span>Total Final:</span>
                    <span className="cart-total-price">{totalComDesconto} €</span>
                </div>

                <div className="cart-discount-options">
                    <label className="discount-label flex items-center">
                        <input type="checkbox" className="discount-checkbox" checked={isDeisiStudent} onChange={(e) => setIsDeisiStudent(e.target.checked)} />
                        Estudante DEISI (10% Desconto)
                    </label>
                    <input type="text" placeholder="Cupão de Desconto (ex: DEISI20)" className="control-input" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                </div>

                <button
                    className={`buy-button ${cart.length === 0 || purchaseStatus === 'A comprar...' ? 'buy-disabled' : ''}`}
                    disabled={cart.length === 0 || purchaseStatus === 'A comprar...'}
                    onClick={onPurchase}
                >
                    {purchaseStatus === 'A comprar...' ? 'A Processar...' : 'Comprar'}
                </button>
                <p className="purchase-status">{purchaseStatus}</p>
            </div>
        </div>
    );
}