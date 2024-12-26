"use client";
import LoadImageClient from "@components/LoadImageClient";
import { CartContext } from "@contexts/CartContext";
import Link from "next/link";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { FiTrash } from "react-icons/fi";
import { MoonLoader } from "react-spinners";
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

interface Order {
  _id: string;
  costumer: string;
  variance: {
    _id: string;
    quantity: number;
    unit: string;
    info?: string;
  };
  quantity: number;
  product: {
    title: string;
    _id: string;
  };
  price: number;
  stat: "pending" | "completed" | "canceled";
  createdAt: Date;
}

function Page() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>();
  const { cart, setCart } = useContext(CartContext);
  const toPriceForm = (price?: number) =>
    price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") ?? 0;

  useEffect(() => {
    const getOrders = async () => {
      const res = await fetch("/api/order");
      if (!res.ok) return;
      const { orders } = await res.json();
      setOrders(orders);
    };
    getOrders();
  }, [cart]);

  const HandleCheckout = async () => {
    if (!setCart || !cart) return;
    if (!cart.length) return toast.error("Your cart is empty");

    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
    });
    setLoading(false);
    if (!res.ok) return;
    const { notEnough } = await res.json();
    if (notEnough.length) toast.error("Some products are out of stock");
    setCart((prev) =>
      prev!.filter((product) => notEnough.includes(product._id))
    );
  };

  return (
    <main className="bg-gray-100 py-6">
      <div className="mx-auto max-w-[72rem] p-2">
        <section className="bg-white flex-1 shadow-md rounded-lg ml-auto pb-4 mb-4 md:mb-0">
          <h1 className="p-4 md:p-6 border-b text-lg text-[#2e385a] font-semibold">
            My Cart
          </h1>
          <table className="w-full text-xs md:text-base">
            <thead>
              <tr className="border-b">
                <th></th>
                <th className="p-4 font-semibold text-center">Product</th>
                <th className="p-4 font-semibold hidden md:table-cell">
                  price
                </th>
                <th className="p-4 font-semibold text-center">variance</th>
                <th className="p-4 font-semibold text-center">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {!cart && (
                <tr className="text-center border-t relative">
                  <td>
                    <div className="flex justify-center">
                      <MoonLoader size={15} color="black" />
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-14 h-14 md:w-20 m-2 loading--background rounded-md" />
                      <div className="h-4 w-20 md:w-36 rounded-md loading--background" />
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    <div className="h-4 w-32 rounded-md mx-auto loading--background" />
                  </td>
                  <td>
                    <div className="h-4 w-14 md:w-24 rounded-md mx-auto loading--background" />
                  </td>
                </tr>
              )}
              {cart?.length === 0 && (
                <tr className="text-center border-t relative">
                  <td colSpan={5} className=" p-6">
                    <span>
                      Your cart is empty, maybe check our{" "}
                      <Link
                        href="/products"
                        className="underline font-semibold"
                      >
                        products
                      </Link>
                    </span>
                  </td>
                </tr>
              )}
              {cart?.map((product) => (
                <tr key={product._id} className="text-center border-t relative">
                  <td className="px-2">
                    <Delete
                      setCart={setCart}
                      productId={product.product._id}
                      varianceId={product.varianceId}
                    />
                  </td>
                  <td>
                    <Link
                      href={`/product?id=${product.product._id}`}
                      className="flex items-center justify-center gap-0.5 md:gap-2"
                    >
                      <LoadImageClient
                        Css="w-12 h-12 md:w-20 md:h-20 p-0.5 md:p-2 object-contain"
                        Url={product.product.images[0]}
                      />
                      <p className="text-center">{product.product.title}</p>
                    </Link>
                  </td>
                  <td className="hidden md:table-cell">
                    <b>
                      {product.quantity} x {toPriceForm(product.price)}
                    </b>{" "}
                    Dzd
                  </td>
                  <td>
                    {(() => {
                      const item = product.product.variances.find(
                        (variance: { _id: string }) =>
                          variance._id === product.varianceId
                      );
                      return (
                        <div>
                          <p>
                            {item?.quantity} {item?.unit}
                          </p>
                          <p className="text-xs">{item?.info}</p>
                        </div>
                      );
                    })()}
                  </td>
                  <td>
                    <b>{toPriceForm(product.price * product.quantity)}</b> Dzd
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <div className="mt-4 md:flex block gap-4">
          <section className="bg-white flex-1 shadow-md rounded-lg ml-auto pb-4 mb-4 md:mb-0">
            <h1 className="p-4 md:p-6 border-b text-lg text-[#2e385a] font-semibold">
              My Orders
            </h1>
            <table className="w-full text-xs md:text-base">
              <thead>
                <tr className="border-b">
                  <th className="p-4 font-semibold text-center">Product</th>
                  <th className="p-4 font-semibold hidden md:table-cell">
                    variance
                  </th>
                  <th className="p-4 font-semibold text-center">price</th>
                  <th className="p-4 font-semibold text-center">stat</th>
                </tr>
              </thead>
              <tbody>
                {!orders && (
                  <tr className="text-center border-t relative p-6">
                    <td>
                      <div className="h-4 w-20 md:w-36 rounded-md mx-auto loading--background my-6" />
                    </td>
                    <td>
                      <div className="h-4 w-20 md:w-36 rounded-md mx-auto loading--background" />
                    </td>
                    <td className="hidden md:table-cell">
                      <div className="h-4 w-32 rounded-md mx-auto loading--background" />
                    </td>
                    <td>
                      <div className="h-4 w-14 md:w-24 rounded-md mx-auto loading--background" />
                    </td>
                  </tr>
                )}
                {orders?.length === 0 && (
                  <tr className="text-center relative">
                    <td colSpan={5} className=" p-6">
                      <span>
                        Your no orders bro, maybe check our{" "}
                        <Link
                          href="/products"
                          className="underline font-semibold"
                        >
                          products
                        </Link>
                      </span>
                    </td>
                  </tr>
                )}
                {orders?.map((order) => (
                  <tr className="text-center border-t relative" key={order._id}>
                    <td>
                      <b>{order.product.title}</b>
                    </td>
                    <td>
                      <div>
                        <p>
                          {order.variance.quantity} {order.variance.unit}
                        </p>
                        <p className="text-gray-500">{order.variance.info}</p>
                      </div>
                    </td>
                    <td className="hidden md:table-cell">
                      <p>
                        {order.quantity} x <b>{toPriceForm(order.price)} Dzd</b>
                      </p>
                    </td>
                    <td>
                      <p
                        className={`${
                          order.stat === "pending"
                            ? "text-yellow-600"
                            : order.stat === "canceled"
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        {order.stat}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section className="bg-white w-full md:w-96 shadow-md rounded-lg ml-auto ">
            <h1 className="p-4 md:p-6 border-b text-lg text-[#2e385a] font-semibold">
              Order Summary
            </h1>
            <div>
              <div className="p-6 border-b">
                <p className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    <b>
                      {toPriceForm(
                        cart?.reduce(
                          (acc, product) =>
                            acc + product.price * product.quantity,
                          0
                        )
                      )}{" "}
                    </b>
                    Dzd
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    <b>Free</b>
                  </span>
                </p>
              </div>
              <div className="p-6 border-b">
                <p className="flex justify-between">
                  <span>Total</span>
                  <span>
                    <b>
                      {toPriceForm(
                        cart?.reduce(
                          (acc, product) =>
                            acc + product.price * product.quantity,
                          0
                        )
                      )}{" "}
                    </b>
                    Dzd
                  </span>
                </p>
              </div>
              <div className="p-6">
                <button
                  className="w-full bg-[#1c274c] hover:bg-[#36467a] duration-200 text-white p-2 rounded-lg flex gap-2 justify-center items-center"
                  onClick={HandleCheckout}
                >
                  {loading ? (
                    <MoonLoader size={19} color="white " />
                  ) : (
                    "Checkout"
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Page;

const Delete = ({
  setCart,
  productId,
  varianceId,
}: {
  setCart: Dispatch<SetStateAction<Cart[] | undefined>> | undefined;
  productId: string;
  varianceId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const removeProduct = async () => {
    if (!setCart) return;
    setLoading(true);
    const res = await fetch(`/api/cart`, {
      method: "DELETE",
      body: JSON.stringify({ productId, varianceId }),
    });
    setLoading(false);
    if (!res.ok) return;
    setCart((prev) =>
      prev!.filter(
        (product) =>
          !(
            product.product._id === productId &&
            product.varianceId === varianceId
          )
      )
    );
  };

  return (
    <div className="flex justify-center">
      {loading ? (
        <MoonLoader size={15} color="black" />
      ) : (
        <FiTrash
          className="border mx-auto cursor-pointer p-0.5 md:p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 duration-150 text-lg md:text-3xl"
          onClick={removeProduct}
        />
      )}
    </div>
  );
};
