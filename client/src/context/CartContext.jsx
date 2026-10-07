import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('dhango_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('dhango_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Cart storage error:', e);
    }
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems(prev => {
      const id = item.id || `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      // Check if identical item already in cart
      const existingIndex = prev.findIndex(
        i => i.productId === item.productId &&
             i.size === item.size &&
             i.color === item.color &&
             i.mockupUrl === item.mockupUrl
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += (item.quantity || 1);
        return next;
      }

      return [
        ...prev,
        {
          ...item,
          id,
          unitPrice: 1500, // Rs. 1,500 promotional offer
          originalPrice: 2000,
          quantity: item.quantity || 1
        }
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const originalTotal = cartItems.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
  const totalSavings = originalTotal - subtotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalQuantity,
        subtotal,
        originalTotal,
        totalSavings
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
