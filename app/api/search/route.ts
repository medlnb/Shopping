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

    const result = await Product.aggregate([
      {
        $search: {
          index: "search",
          text: {
            query: query,
            path: {
              wildcard: "*",
            },
          },
        },
      },
      {
        $facet: {
          products: [
            {
              $sort: { createdAt: -1 },
            },
            {
              $skip: (page - 1) * perPage,
            },
            {
              $limit: perPage,
            },
            {
              $project: {
                title: 1,
                images: 1,
                brand: 1,
                category: 1,
                variances: 1,
                updatedAt: 1,
                overallRating: 1,
                numberOfReviews: 1,
              },
            },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    const products = result[0].products;
    const count = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;

    return new Response(
      JSON.stringify({
        count,
        products: products.map(
          (product: {
            variances: { newPrice?: number; price: number }[];
            images: string[];
          }) => ({
            ...product,
            price: product.variances[0].newPrice ?? product.variances[0].price,
            image: product.images[0],
          })
        ),
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ err }), { status: 500 });
  }
};
