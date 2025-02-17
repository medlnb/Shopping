"use client";
import { CartContext } from "@contexts/CartContext";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface Variance {
  _id: string;
  price: number;
  newPrice?: number;
  quantity: number;
  unit: string;
  isOutOfStock: boolean;
  info?: string;
}

const selectVariance = (variances: Variance[]) => {
  return variances.find((variance) => !variance.isOutOfStock);
};

function Buy({
  title,
  mainImage,
  productId,
  variances,
}: {
  title: string;
  mainImage: string;
  productId: string;
  variances: Variance[];
}) {
  const { cart, setCart } = useContext(CartContext);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [buy, setBuy] = useState({
    variance: selectVariance(variances),
    quantity: 0,
  });

  useEffect(() => {
    if (cart && buy.variance?._id === selectVariance(variances)?._id)
      setBuy({
        variance: selectVariance(variances),
        quantity:
          cart.find(
            (item) =>
              item.product._id === productId &&
              item.varianceId === selectVariance(variances)?._id
          )?.quantity ?? 0,
      });
  }, [cart]);

  const addToCart = async () => {
    if (!setCart || !buy.quantity || !buy.variance) return;

    if (session?.user) {
      setLoading(false);
      const res = await fetch(`/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: productId,
          price: buy.variance.price,
          varianceId: buy.variance._id,
          quantity: buy.quantity,
        }),
      });
      setLoading(false);
      if (!res.ok) return;
    }

    setCart((prev) => {
      if (!prev) return undefined;

      const updatedCart = [...prev];
      const existingItemIndex = updatedCart.findIndex(
        (item) =>
          item.product._id === productId &&
          item.varianceId === buy.variance!._id
      );

      if (existingItemIndex !== -1)
        updatedCart[existingItemIndex].quantity = buy.quantity;
      else
        updatedCart.push({
          _id: uuidv4(),
          product: {
            _id: productId,
            title,
            images: [mainImage],
            variances: variances.map((variance) => ({
              _id: variance._id,
              quantity: variance.quantity,
              unit: variance.unit,
              info: variance.info,
            })),
          },
          price: buy.variance!.price,
          varianceId: buy.variance!._id,
          quantity: buy.quantity,
        });
      if (!session?.user)
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
    toast.success("Item added to cart");
  };

  return (
    <div>
      <div className="md:max-h-56 overflow-y-auto overflow-x-visible styles-scrollbar pr-4 mt-2">
        {variances.map((variance) => (
          <div
            key={variance._id}
            className={`border  duration-150 rounded-md p-1 px-2 mt-2 relative 
              ${variance.isOutOfStock ? "opacity-50" : ""}
              ${
                (buy.variance?._id ?? "") === variance._id
                  ? "bg-blue-1  border-blue-6"
                  : "border-gray-4 bg-gray-1"
              }
              ${
                variance.isOutOfStock
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-2 hover:border-gray-6   "
              }
              `}
            onClick={() => {
              if (variance.isOutOfStock) return;
              const item = cart?.find(
                (item) =>
                  item.product._id === productId &&
                  item.varianceId === variance._id
              );
              if (item) setBuy({ variance, quantity: item.quantity });
              else setBuy({ variance, quantity: 0 });
            }}
          >
            {variance.isOutOfStock && (
              <p
                className={`absolute -top-2 -right-2 rounded-full p-0.5 text-white flex items-center justify-center text-sm px-2 bg-red`}
              >
                Out of stock
              </p>
            )}
            <p className="text-lg font-semibold text-gray-6">
              {variance.quantity} {variance.unit} -
              <b className="text-[#1c274c]"> {variance.price} Dzd</b>
            </p>
            <p className="text-gray-5">{variance.info}</p>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <button
          className="border border-gray-3 p-3 rounded-l-md px-4 hover:bg-gray-2 duration-150"
          onClick={() => {
            if (buy.quantity === 1) return;
            setBuy((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
          }}
        >
          -
        </button>
        <p className="border border-gray-3 p-3 w-16 text-center">
          {buy.quantity}
        </p>
        <button
          className="border border-gray-3 p-3  rounded-r-md px-4 hover:bg-gray-2 duration-150"
          onClick={() =>
            setBuy((prev) => ({ ...prev, quantity: prev.quantity + 1 }))
          }
        >
          +
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-4  bg-[#1c274c] hover:bg-[#374a88] duration-150 text-white p-3 rounded-md ml-4"
          onClick={addToCart}
        >
          {loading ? <MoonLoader size={15} color="#fff" /> : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default Buy;
