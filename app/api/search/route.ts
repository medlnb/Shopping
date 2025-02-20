import Product from "@models/product";
import { connectToDatabase } from "@utils/database";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const params = new URLSearchParams(url.searchParams);
    const page = Number(params.get("p") ?? 1);
    const query = params.get("q") ?? "";
    const perPage = 8;

    const searchQuery = {
      $text: { $search: query },
    };

    const count = await Product.countDocuments(searchQuery);

    const products = await Product.find(searchQuery)
      .select("title images brand category variances updatedAt")
      .sort({ score: { $meta: "textScore" }, updatedAt: -1 })
      .skip((page - 1) * perPage)
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
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ err }), { status: 500 });
  }
};
