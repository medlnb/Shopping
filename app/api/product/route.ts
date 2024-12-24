import Product from "@models/product";
import { connectToDatabase } from "@utils/database";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const params = new URLSearchParams(url.searchParams);
    const id = params.get("id");

    if (id && !ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ message: "Invalid Product ID" }), {
        status: 400,
      });
    }
    const product = await Product.findById(id);

    return new Response(JSON.stringify({ product }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), {
      status: 500,
    });
  }
};
