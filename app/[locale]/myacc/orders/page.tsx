"use client";
import { Dialog, DialogTitle } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsTelephone } from "react-icons/bs";
import { GoHome } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { PiCityDuotone } from "react-icons/pi";
import AlgerianCities from "@data/AlgerianCities";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import Pagin from "@components/Pagin";
import ExportToExcel from "./ExportToExcel";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

const toPriceForm = (price?: number) =>
  price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") ?? 0;

interface Details {
  orderId: string;
  status: "pending" | "completed" | "canceled";
  name: string;
  phoneNumber: string;
  image: string;
  address: {
    state: number;
    city: number;
    homeAddress: string;
  };
  loading?: string;
}

interface Order {
  _id: string;
  costumer?: {
    name: string;
    phoneNumber: string;
    image: string;
  };
  name: string;
  phoneNumber: string;
  address: {
    state: number;
    city: number;
    homeAddress: string;
  };
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

function Page({ searchParams: { p } }: { searchParams: { p?: string } }) {
  const t = useTranslations("myacc");
  const { data: session } = useSession();

  const [orders, setOrders] = useState<Order[]>();
  const [count, setCount] = useState(0);
  const [details, setDetails] = useState<Details>();

  useEffect(() => {
    const getOrders = async () => {
      setOrders(undefined);
      const res = await fetch(`/api/order?p=${p ?? 1}`);
      if (!res.ok) return;
      const { orders, count: countPages } = await res.json();
      setOrders(orders);
      setCount(countPages);
    };
    getOrders();
  }, [p]);

  const HandleChangeState = async (
    stat: "pending" | "completed" | "canceled"
  ) => {
    if (!details) return;
    setDetails((prev) => ({ ...prev!, loading: stat }));
    const res = await fetch(`/api/order`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stat, order: details.orderId }),
    });
    if (!res.ok) return;
    setOrders((prev) =>
      prev!.map((order) =>
        order._id === details.orderId ? { ...order, stat } : order
      )
    );
    toast.success(t("orderSuccess"));
    setDetails(undefined);
  };

  return (
    <section className="h-full flex-1 pb-10 relative">
      <table className="rounded-lg pb-2 bg-white w-full text-xs md:text-base">
        <thead>
          <tr className="border-b">
            <th className="p-4 font-semibold text-center">{t("product")}</th>
            <th className="p-4 font-semibold hidden md:table-cell">
              {t("variance")}
            </th>
            <th className="p-4 font-semibold text-center">{t("price")}</th>
            <th className="p-4 font-semibold text-center">{t("status")}</th>
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
                  {t("emptyState")}
                  <Link href="/products" className="underline font-semibold">
                    products
                  </Link>
                </span>
              </td>
            </tr>
          )}
          {orders?.map((order) => (
            <tr
              className={`text-center border-t border-gray-3 relative duration-150 cursor-pointer ${
                session?.user.isAdmin ? "hover:bg-gray-2" : ""
              }`}
              onClick={() => {
                if (session?.user.isAdmin)
                  setDetails({
                    name: order.costumer?.name ?? order.name,
                    phoneNumber:
                      order.costumer?.phoneNumber ?? order.phoneNumber,
                    image:
                      order.costumer?.image ??
                      `https://dummyimage.com/100x100/000/fff&text=${order.name[0].toUpperCase()}`,
                    address: order.address,
                    orderId: order._id,
                    status: order.stat,
                  });
              }}
              key={order._id}
            >
              <td className="p-1 py-4">
                <b>{order.product.title}</b>
              </td>
              <td>
                <div className="text-sm">
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
                <span
                  className={`text-sm p-1 px-3 rounded-md mx-auto text-white font-semibold ${
                    order.stat === "pending"
                      ? "bg-yellow"
                      : order.stat === "canceled"
                      ? "bg-red "
                      : "bg-green"
                  }`}
                >
                  {t(order.stat)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="absolute right-6 bottom-2 flex items-center gap-2">
        <Pagin
          page={Number(p ?? 1)}
          count={count}
          perpage={6}
          href="myacc/orders"
        />
        {session?.user?.isAdmin && <ExportToExcel fileName="my-orders" />}
      </div>
      <Dialog open={!!details} onClose={() => setDetails(undefined)}>
        <DialogTitle>{t("title")}</DialogTitle>
        <div className="p-5 w-[30rem] max-w-full">
          <Image
            height={100}
            width={100}
            src={details?.image ?? ""}
            alt={details?.name ?? ""}
            className="w-20 h-20 rounded-full object-contain mx-auto mb-4"
          />

          <div className="w-full">
            <div className="flex items-center gap-4 mb-2 bg-gray rounded-lg p-2">
              <CiUser size={20} />
              <p className="font-semibold">{details?.name}</p>
            </div>
            <div className="flex items-center gap-4 mb-2 bg-gray rounded-lg p-2">
              <BsTelephone size={20} />
              <a
                href={`tel:${details?.phoneNumber}`}
                className="text-gray-9 font-bold underline"
              >
                0{details?.phoneNumber}
              </a>
            </div>
            <div className="flex items-center gap-4 mb-2 bg-gray rounded-lg p-2">
              <GoHome size={20} />
              <p>{details?.address.homeAddress}</p>
            </div>

            <div className="flex items-center gap-4 mb-2 bg-gray rounded-lg p-2">
              <PiCityDuotone size={20} />
              {details && (
                <p className="text-gray-500">
                  {AlgerianCities[details.address.state - 1][0].name},{" "}
                  {
                    AlgerianCities[details.address.state - 1][
                      details.address.city
                    ].name
                  }
                </p>
              )}
            </div>
          </div>
          <div className="flex mt-4">
            {(
              ["pending", "completed", "canceled"] as (
                | "pending"
                | "completed"
                | "canceled"
              )[]
            ).map((status) => (
              <button
                key={status}
                className={`flex items-center justify-center flex-1 rounded-lg p-2 mx-1 ${
                  status === details?.status
                    ? "bg-blue text-white"
                    : "bg-gray-2 hover:bg-gray-5 duration-150"
                }`}
                onClick={() => HandleChangeState(status)}
                disabled={details?.status === status || !session?.user.isAdmin}
              >
                {details?.loading === status ? (
                  <ClipLoader size={23} color="white" />
                ) : (
                  t(status)
                )}
              </button>
            ))}
          </div>
        </div>
      </Dialog>
    </section>
  );
}

export default Page;
