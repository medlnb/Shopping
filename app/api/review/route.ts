import { getServerSession } from "next-auth";
import Review from "@models/review";
import Member from "@models/member";
import Product from "@models/product";
import { options } from "../auth/[...nextauth]/options";
import { connectToDatabase } from "@utils/database";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const session = await getServerSession(options);
    if (!session || !session.user)
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });

    const user = await Member.findOne({
      phoneNumber: session.user.phoneNumber,
    }).select("_id");

    if (!user)
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });

    const { productId, rating, comment } = await req.json();

    const product = await Product.findById(productId).select(
      "overallRating numberOfReviews"
    );

    if (!product)
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });

    const newReview = await Review.create({
      user: user._id,
      product: productId,
      rating,
      comment,
    });

    const averageRating = await Review.aggregate([
      {
        $match: { product: new mongoose.Types.ObjectId(productId) },
      },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
        },
      },
    ]);
    const newAvg = averageRating[0].avgRating;

    product.overallRating = newAvg;
    product.numberOfReviews = product.numberOfReviews + 1;
    await product.save();

    return new Response(
      JSON.stringify({
        message: "Review submitted successfully!",
        review: newReview,
      }),
      {
        status: 201,
      }
    );
  } catch (err) {
    console.error("Error submitting review:", err);
    return new Response(JSON.stringify(err), { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const params = new URLSearchParams(url.searchParams);
    const productId = params.get("id");

    if (!productId)
      return new Response(
        JSON.stringify({ message: "Product ID is required" }),
        {
          status: 400,
        }
      );

    const reviews = await Review.find({ product: productId }).populate(
      "user",
      "name image"
    );

    return new Response(
      JSON.stringify({
        message: "Reviews retrieved successfully!",
        reviews,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return new Response(JSON.stringify(err), { status: 500 });
  }
};
