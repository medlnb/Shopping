"use client";
import { utils, writeFile } from "xlsx";
import { FaDownload } from "react-icons/fa6";
import { useState } from "react";
import AlgerianCities from "@data/AlgerianCities";
import { ClipLoader } from "react-spinners";

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

const ExportToExcel = ({ fileName }: { fileName: string }) => {
  const [loading, setLoading] = useState(false);
  const handleDownload = async () => {
    setLoading(true);
    const res = await fetch(`/api/order?limit=10000`);
    if (!res.ok) return;
    const { orders } = await res.json();
    const data = orders.map((order: Order) => ({
      ...order,
      client: order.costumer?.name ?? order.name,
      phoneNumber: order.costumer?.phoneNumber ?? order.phoneNumber,
      city: AlgerianCities[order.address.state - 1][order.address.city].name,
      state: AlgerianCities[order.address.state - 1][0].name,
      homeAddress: order.address.homeAddress,
      product: order.product.title,
      variance: `${order.variance.quantity} ${order.variance.unit} ${
        order.variance.info ? `( ${order.variance.info} )` : ""
      }`,
      createdAt: new Date(order.createdAt).toLocaleString(),
    }));
    setLoading(false);
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sheet1");
    writeFile(wb, `${fileName}.xlsx`);
  };

  return loading ? (
    <ClipLoader size={20} />
  ) : (
    <FaDownload
      onClick={handleDownload}
      className="cursor-pointer hover:scale-110 duration-150 text-dark"
      size={20}
    />
  );
};

export default ExportToExcel;
