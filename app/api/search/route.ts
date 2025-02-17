import Product from "@models/product";
import { connectToDatabase } from "@utils/database";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const params = new URLSearchParams(url.searchParams);
    const p = Number(params.get("p") ?? 1);
    const q = params.get("q") ?? "";
    const perPage = 8;

    const count = await Product.countDocuments();
    const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const products = await Product.find({
      title: { $regex: escapedQ, $options: "i" },
    })
      .select("title images brand category variances updatedAt")
      .sort({ updatedAt: -1 })
      .skip((p - 1) * perPage)
      .limit(perPage);

    return new Response(
      JSON.stringify({
        count,
        products: products.map((product) => ({
          ...product._doc,
          price: product.variances[0].newPrice ?? product.variances[0].price,
          image: product.images[0],
        })),
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), {
      status: 500,
    });
  }
};
