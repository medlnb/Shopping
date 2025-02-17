"use client";
import { CartContext } from "@contexts/CartContext";
import Link from "next/link";
import { useContext } from "react";
import { CiShoppingCart } from "react-icons/ci";

function Cart() {
  const { cart } = useContext(CartContext);
  const toPriceForm = (price?: number) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") ?? 0;
  };
  return (
    <Link href="/cart" className="flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <CiShoppingCart size={20} />
        {cart && (
          <p className="absolute -top-1.5 -right-1.5 bg-blue-dark text-white rounded-full w-4 h-4 flex justify-center items-center text-xs font-semibold">
            {cart.length}
          </p>
        )}
      </div>
      <div>
        <p className="text-xs text-gray-400">Cart</p>
        {cart ? (
          <p className="text-sm font-semibold">
            {toPriceForm(
              cart.reduce(
                (acc: number, cur: { price: number; quantity: number }) =>
                  acc + cur.price * cur.quantity,
                0
              )
            )}{" "}
            Dzd
          </p>
        ) : (
          <div className="w-18 h-3 loading--background rounded-lg" />
        )}
      </div>
    </Link>
  );
}

export default Cart;
