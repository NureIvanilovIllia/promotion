import { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem } from './useLocalStorage';

const CART_STORAGE_KEY = 'cart';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Инициализируем корзину из LocalStorage сразу
  const [cart, setCart] = useState(() => {
    const savedCart = getItem(CART_STORAGE_KEY);
    return savedCart && Array.isArray(savedCart) ? savedCart : [];
  });

  // Сохраняем корзину в LocalStorage при каждом изменении
  useEffect(() => {
    setItem(CART_STORAGE_KEY, cart);
  }, [cart]);

  // Добавить товар в корзину
  const addItem = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      
      if (existingItem) {
        // Если товар уже есть, увеличиваем количество
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
            : cartItem
        );
      } else {
        // Если товара нет, добавляем новый
        return [...prevCart, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  // Удалить товар из корзины
  const removeItem = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  // Обновить количество товара
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Очистить корзину
  const clearCart = () => {
    setCart([]);
  };

  // Вычислить общую стоимость
  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const value = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
