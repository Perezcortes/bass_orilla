'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartItem = {
  cartId: string; // ID único para el carrito (producto + variantes)
  productId: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  manivela?: string;
  size?: string;
  resistencia?: string;
};

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartId'>) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cargar carrito guardado al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('bassorilla_cart');
    if (savedCart) setItems(JSON.parse(savedCart));
  }, []);

  // Guardar en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('bassorilla_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: Omit<CartItem, 'cartId'>) => {
    // Creamos un ID único combinando el producto y las variantes elegidas
    const cartId = `${newItem.productId}-${newItem.color || ''}-${newItem.manivela || ''}-${newItem.size || ''}-${newItem.resistencia || ''}`;
    
    setItems(current => {
      const existingItem = current.find(item => item.cartId === cartId);
      if (existingItem) {
        return current.map(item =>
          item.cartId === cartId ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      return [...current, { ...newItem, cartId }];
    });

    // Abrimos el carrito automáticamente al agregar algo
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    setItems(current => current.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(current => current.map(item => item.cartId === cartId ? { ...item, quantity } : item));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider');
  return context;
};