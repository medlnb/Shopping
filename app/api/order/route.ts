import { connectToDatabase } from "@utils/database";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import Member from "@models/member";
import "@models/product";
import Order from "@models/order";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const params = new URLSearchParams(url.searchParams);
    const p = Number(params.get("p") ?? 1);

    const session = await getServerSession(options);
    if (!session)
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });

    const user = await Member.findOne({
      phoneNumber: session.user.phoneNumber,
    });

    if (!user)
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    const query = user.admin ? {} : { costumer: user._id.toString() };
    const limit = 6;
    const count = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate("product", "title variances")
      .populate("costumer", "name phoneNumber image address")
      .sort({ createdAt: -1 })
      .skip((p - 1) * limit)
      .limit(limit);

    const formedOrders = orders.map((order) => ({
      ...order._doc,
      variance: (() => {
        const variance = order.product.variances.find(
          (v: { _id: string }) => v._id.toString() === order.variance.toString()
        );
        return {
          _id: variance._id,
          quantity: variance.quantity,
          unit: variance.unit,
          info: variance.info,
        };
      })(),
      product: {
        id: order.product._id,
        title: order.product.title,
      },
    }));

    return new Response(JSON.stringify({ orders: formedOrders, count }), {
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), { status: 501 });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const session = await getServerSession(options);
    if (!session)
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });

    const user = await Member.findOne({
      phoneNumber: session.user.phoneNumber,
    });

    if (!user || !user.admin)
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });

    const { stat, order } = await req.json();
    const selectedOrder = await Order.findById(order);
    if (!selectedOrder)
      return new Response(JSON.stringify({ message: "Order not found" }), {
        status: 404,
      });

    selectedOrder.stat = stat;
    await selectedOrder.save();

    return new Response(JSON.stringify({ msg: "Status changed" }), {
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), { status: 501 });
  }
};
