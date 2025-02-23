import { connectToDatabase } from "@utils/database";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import Member from "@models/member";
import "@models/product";
import Product from "@models/product";
import Order from "@models/order";
import { NextRequest } from "next/server";

interface OrderType {
  costumer?: string;
  name?: string;
  phoneNumber?: string;
  address: {
    state: number;
    city: number;
    homeAddress: string;
  };
  product: string;
  quantity: number;
  variance: string;
  price: number;
}

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
      isOutOfStock: boolean;
      info?: string;
    }[];
  };
  price: number;
  varianceId: string;
  quantity: number;
}

const createOrders = async ({
  cart,
  address,
  name,
  phoneNumber,
  costumer,
}: {
  cart: Cart[];
  address: OrderType["address"];
  name?: string;
  phoneNumber?: string;
  costumer?: string;
}) => {
  let missingItems = false;
  await Promise.all(
    cart.map(async (cartItem: Cart) => {
      const productDoc = await Product.findById(cartItem.product).select(
        "variances"
      );
      const variance = productDoc.variances.find(
        (v: {
          _id: string;
          isOutOfStock: boolean;
          price: number;
          newPrice?: number;
        }) => v._id.toString() === cartItem.varianceId
      );

      if (!variance.isOutOfStock)
        await Order.create({
          costumer,
          address,
          name,
          phoneNumber,
          product: cartItem.product,
          quantity: cartItem.quantity,
          variance: cartItem.varianceId,
          price: variance.newPrice || variance.price,
        });
      else missingItems = true;
    })
  );
  return missingItems;
};

export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const session = await getServerSession(options);
    const { cart, address, name, phoneNumber } = await req.json();

    if (!session || !session.user) {
      const missingItems = await createOrders({
        cart,
        address,
        name,
        phoneNumber,
      });

      return new Response(
        JSON.stringify({ message: "Order placed", missingItems }),
        {
          status: 201,
        }
      );
    }
    const user = await Member.findById(session?.user._id).select("cart");

    if (!user)
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 401,
      });

    const missingItems = await createOrders({
      cart: user.cart,
      address,
      costumer: user._id,
    });
    user.cart = [];
    await user.save();
    return new Response(
      JSON.stringify({ message: "Order placed", missingItems }),
      {
        status: 201,
      }
    );
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), { status: 501 });
  }
};
