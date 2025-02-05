"use client";
import { CartContext } from "@contexts/CartContext";
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
  stock: number;
  info?: string;
}

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
  const [loading, setLoading] = useState(false);
  const [buy, setBuy] = useState({
    variance: variances[0],
    quantity: 0,
  });

  useEffect(() => {
    if (cart && buy.variance._id === variances[0]._id)
      setBuy({
        variance: variances[0],
        quantity:
          cart.find(
            (item) =>
              item.product._id === productId &&
              item.varianceId === variances[0]._id
          )?.quantity ?? 0,
      });
  }, [cart]);

  const addToCart = async () => {
    if (!setCart || !buy.quantity) return;
    setLoading(true);
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

    setCart((prev) => {
      if (!prev) return undefined;

      const updatedCart = [...prev];
      const existingItemIndex = updatedCart.findIndex(
        (item) =>
          item.product._id === productId && item.varianceId === buy.variance._id
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
          price: buy.variance.price,
          varianceId: buy.variance._id,
          quantity: buy.quantity,
        });

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
            className={`border cursor-pointer duration-150 rounded-md p-1 px-2 mt-2 relative ${
              buy.variance._id === variance._id
                ? "bg-blue-100  border-blue-600"
                : "hover:bg-gray-200 hover:border-gray-600 border-gray-400 bg-gray-100"
            }`}
            onClick={() => {
              if (!variance.stock) return;
              const item = cart?.find(
                (item) =>
                  item.product._id === productId &&
                  item.varianceId === variance._id
              );
              if (item) setBuy({ variance, quantity: item.quantity });
              else setBuy({ variance, quantity: 0 });
            }}
          >
            <p
              className={`absolute -top-2 -right-2 rounded-full p-0.5 text-white flex items-center justify-center text-sm px-2 ${
                variance.stock ? "bg-blue-600" : "bg-red-500"
              }`}
            >
              {variance.stock ? variance.stock + " left" : "Out of stock"}
            </p>
            <p className="text-lg font-semibold text-gray-600">
              {variance.quantity} {variance.unit} -
              <b className="text-[#1c274c]"> {variance.price} Dzd</b>
            </p>
            <p className="text-gray-500">{variance.info}</p>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <button
          className="border border-gray-300 p-3 rounded-l-md px-4 hover:bg-gray-200 duration-150"
          onClick={() => {
            if (buy.quantity === 1) return;
            setBuy((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
          }}
        >
          -
        </button>
        <p className="border border-gray-300 p-3 w-16 text-center">
          {buy.quantity}
        </p>
        <button
          className="border border-gray-300 p-3  rounded-r-md px-4 hover:bg-gray-200 duration-150"
          onClick={() => {
            if (buy.quantity >= buy.variance.stock) return;
            setBuy((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
          }}
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
