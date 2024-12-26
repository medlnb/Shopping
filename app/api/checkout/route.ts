import { NextRequest } from "next/server";
import { connectToDatabase } from "@utils/database";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import Member from "@models/member";
import "@models/product";
import Product from "@models/product";
import Order from "@models/order";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const session = await getServerSession(options);
    if (!session)
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });

    const user = await Member.findOne({
      phoneNumber: session.user.phoneNumber,
    }).select("cart");

    if (!user)
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });

    const cart = user.cart;
    // if (!cart.length)
    //   return new Response(JSON.stringify({ message: "Cart is empty" }), {
    //     status: 400,
    //   });

    const notEnough: string[] = [];
    const isDone: {
      costumer: string;
      product: string;
      quantity: number;
      variance: string;
      price: number;
    }[] = [];

    await Promise.all(
      cart.map(
        async (cartItem: {
          _id: string;
          product: string;
          quantity: number;
          varianceId: string;
          price: number;
        }) => {
          const productDoc = await Product.findById(cartItem.product).select(
            "variances"
          );
          const variance = productDoc.variances.find(
            (v: { _id: string }) => v._id.toString() === cartItem.varianceId
          );
          if (variance.quantity < cartItem.quantity)
            notEnough.push(cartItem._id);
          else {
            variance.quantity -= cartItem.quantity;
            isDone.push({
              costumer: user._id,
              product: cartItem.product,
              quantity: cartItem.quantity,
              variance: cartItem.varianceId,
              price: cartItem.price,
            });
          }
        }
      )
    );

    user.cart = user.cart.filter((product: { _id: string }) =>
      notEnough.includes(product._id.toString())
    );
    await user.save();
    await Order.create(isDone);

    return new Response(JSON.stringify({ notEnough }), {
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), { status: 501 });
  }
};
