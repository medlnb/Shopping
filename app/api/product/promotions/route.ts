import Product from "@models/product";
import { connectToDatabase } from "@utils/database";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const productsWithPromotion = await Product.find({
      "variances.newPrice": { $exists: true },
    })
      .select("title description variances images")
      .sort({ updatedAt: -1 })
      .limit(4);

    const products = productsWithPromotion.map((p) => {
      const variance = p.variances.filter(
        (v: { newPrice?: number }) => v.newPrice
      )[0];
      const dicount = ((1 - variance.newPrice / variance.price) * 100).toFixed(
        0
      );
      return {
        _id: p._id,
        tilte: p.title,
        image: p.images[0],
        description: p.description,
        price: variance.price,
        newPrice: variance.newPrice,
        dicount,
      };
    });

    return new Response(
      JSON.stringify({
        products,
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
