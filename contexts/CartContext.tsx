"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

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
      if (!res.ok) {
        if (res.status === 401) {
          const cart = localStorage.getItem("cart");
          setCart(cart ? JSON.parse(cart) : []);
        }
        return;
      }
      const { cart, changed }: { cart: Cart[]; changed: boolean } =
        await res.json();
      if (changed)
        toast.warning(
          "Some items were removed from your cart, because they are out of stock"
        );
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
