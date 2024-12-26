import { connectToDatabase } from "@utils/database";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import Member from "@models/member";
import "@models/product";
import Order from "@models/order";

export const GET = async () => {
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

    if (!user)
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });

    const orders = await Order.find({ costumer: user._id.toString() })
      .populate("product", "title variances")
      .sort({ createdAt: -1 });

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

    return new Response(JSON.stringify({ orders: formedOrders }), {
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), { status: 501 });
  }
};
