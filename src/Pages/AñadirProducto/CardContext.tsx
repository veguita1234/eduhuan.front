import React, { createContext, useContext, useState } from 'react';

// Define the type of the cart item
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number; // Add cartCount to the context type
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: CartItem) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Calculate the cart count
  const cartCount = cart.length;

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
