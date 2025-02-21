import Product from "@models/product";
import { connectToDatabase } from "@utils/database";

export const GET = async () => {
  try {
    await connectToDatabase();

    const productsWithPromotion = await Product.find()
      .select(
        "title description variances images overallRating numberOfReviews"
      )
      .sort({ updatedAt: -1 })
      .limit(8);

    const products = productsWithPromotion.map((p) => {
      return {
        _id: p._id,
        tilte: p.title,
        image: p.images[0],
        description: p.description,
        price: p.variances[0].price,
        overallRating: p.overallRating,
        numberOfReviews: p.numberOfReviews,
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
