import { NextRequest } from "next/server";
import { connectToDatabase } from "@utils/database";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import Member from "@models/member";

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
    }).select("cart");

    if (!user)
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });

    return new Response(JSON.stringify({ cart: user.cart }), {
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), { status: 501 });
  }
};

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

    const { _id, price, varianceId, quantity } = await req.json();
    const cart = user.cart;

    const existingItemIndex = cart.findIndex(
      (item: { _id: string; varianceId: string }) =>
        item._id === _id && item.varianceId === varianceId
    );

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity = quantity;
    } else {
      cart.push({ _id, price, varianceId, quantity });
    }

    user.cart = cart;
    await user.save();

    return new Response(JSON.stringify({ cart: user.cart }), {
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), { status: 501 });
  }
};
