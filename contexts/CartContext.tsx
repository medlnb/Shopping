"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface Cart {
  _id: string;
  product: {
    _id: string;
    title: string;
    images: string[];
    variances: {
      _id: string;
      quantity: number;
      unit: string;
      info?: string;
    }[];
  };
  price: number;
  varianceId: string;
  quantity: number;
}

export const CartContext = createContext<{
  cart?: Cart[];
  setCart?: Dispatch<SetStateAction<Cart[] | undefined>>;
}>({});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart[]>();
  useEffect(() => {
    const getCart = async () => {
      const res = await fetch(`/api/cart`, {
        cache: "no-cache",
      });
      if (!res.ok) return;
      const { cart }: { cart: Cart[] } = await res.json();
      setCart(cart);
    };
    getCart();
  }, []);
  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
