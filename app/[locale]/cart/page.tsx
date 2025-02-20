"use client";
import { CartContext } from "@contexts/CartContext";
import Link from "next/link";
import { useContext } from "react";
import { MoonLoader } from "react-spinners";
import OrderSummary from "./OrderSummary";
import Delete from "./Delete";
import Image from "next/image";
import { useTranslations } from "next-intl";

const toPriceForm = (price?: number) =>
  price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") ?? "0";

function Page() {
  const t = useTranslations("cart");
  const { cart, setCart } = useContext(CartContext);
  return (
    <main className="bg-gray-100 py-2 md:py-0">
      <div className="mx-auto max-w-[72rem] p-2">
        <h1 className="p-4 border-b text-lg text-[#2e385a] font-semibold">
          {t("title")}
        </h1>
        <section className="bg-white flex-1 shadow-md rounded-lg ml-auto pb-2">
          <table className="w-full text-xs md:text-base">
            <thead>
              <tr className="border-b">
                <th></th>
                <th className="p-4 font-semibold text-center">
                  {t("product")}
                </th>
                <th className="p-4 font-semibold hidden md:table-cell">
                  {t("price")}
                </th>
                <th className="p-4 font-semibold text-center">
                  {t("variance")}
                </th>
                <th className="p-4 font-semibold text-center">
                  {t("subTotal")}
                </th>
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
                      {t("emptyCart")}
                      <Link
                        href="/products"
                        className="underline font-semibold"
                      >
                        {t("products")}
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
                      <Image
                        height={50}
                        width={50}
                        src={`https://shopping-hamma.vercel.app/api/image/${product.product.images[0]}`}
                        alt={product.product.title}
                        className="w-12 h-12 md:w-20 md:h-20 p-0.5 md:p-2 object-contain"
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
        <div className="h-0.5 w-full rounded-full bg-gray-200 mt-8" />
        <OrderSummary />
      </div>
    </main>
  );
}

export default Page;
