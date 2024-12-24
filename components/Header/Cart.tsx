"use client";
import { CartContext } from "@contexts/CartContext";
import { useContext } from "react";
import { CiShoppingCart } from "react-icons/ci";

function Cart() {
  const { cart } = useContext(CartContext);
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <CiShoppingCart size={20} />
        <p className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white rounded-full w-4 h-4 flex justify-center items-center text-xs font-semibold">
          {cart?.length}
        </p>
      </div>
      <div>
        <p className="text-xs text-gray-400">Cart</p>
        <p className="text-sm font-semibold">
          {cart?.reduce(
            (acc: number, cur: { price: number; quantity: number }) =>
              acc + cur.price * cur.quantity,
            0
          )}
          $
        </p>
      </div>
    </div>
  );
}

export default Cart;
