import { NextRequest } from "next/server";
import { connectToDatabase } from "@utils/database";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import Member from "@models/member";
import "@models/product";

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
    })
      .select("cart")
      .populate("cart.product", "title _id images variances");

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

    const { product, price, varianceId, quantity } = await req.json();
    const cart = user.cart;

    const existingItemIndex = cart.findIndex(
      (item: { product: string; varianceId: string }) =>
        item.product.toString() === product && item.varianceId === varianceId
    );

    if (existingItemIndex !== -1) cart[existingItemIndex].quantity = quantity;
    else cart.push({ product, price, varianceId, quantity });

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

export const DELETE = async (req: NextRequest) => {
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

    const { productId: product, varianceId } = await req.json();
    const cart = user.cart;

    user.cart = cart.filter(
      (item: { product: string; varianceId: string }) =>
        !(item.product.toString() === product && item.varianceId === varianceId)
    );
    await user.save();

    return new Response(JSON.stringify({ cart: user.cart }), {
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), { status: 501 });
  }
};
