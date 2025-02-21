import React from "react";
import AddReview from "./AddReview";
import { FaStar } from "react-icons/fa6";

interface Review {
  _id: string;
  user: {
    image: string;
    name: string;
  };
  comment: string;
  rating: number;
}

async function Reviews({
  id,
  t,
  avrRating,
  ratingCounts,
}: {
  id?: string;
  t: any;
  avrRating?: number;
  ratingCounts?: number;
}) {
  const res = await fetch(`${process.env.URL}/api/review?id=${id}`);
  if (!res.ok) return;
  const { reviews }: { reviews: Review[] } = await res.json();

  return (
    <div className="border-t border-gray-4 py-8">
      <section className="max-w-[72rem] mx-auto p-2">
        <h1 className="md:text-4xl text-2xl font-bold text-[#1c274c] mb-4">
          {t("reviews")}{" "}
          <span className="text-gray-7 font-semibold text-xl">
            {avrRating} {ratingCounts ? `( ${ratingCounts} )` : ""}
          </span>
        </h1>
        <div className="flex gap-2 mb-2 overflow-x-auto hidden-scrollbar">
          {reviews.map((review) => {
            return (
              <div
                key={review._id}
                className="border-2 border-gray-4 shadow-3 rounded-2xl flex flex-col p-3 min-w-full md:min-w-[30%]"
              >
                <h1 className="text-4xl md:text-6xl ">❝</h1>
                <p className="text-gray-6 font-semibold mx-5 text-sm">
                  {review.comment}
                </p>
                <div className="flex flex-row gap-0.5 items-center my-1 mb-2 ml-5">
                  {Array.from({ length: review.rating }, (_, index) => (
                    <FaStar key={index} size={15} />
                  ))}
                </div>
                <div className="h-12 flex flex-row items-center gap-3 w-full">
                  <img
                    className="h-8 w-8 cursor-pointer rounded-full object-contain"
                    src={review.user.image}
                    alt="Review post"
                  />
                  <p className="text-xs">{review.user.name}</p>
                </div>
              </div>
            );
          })}
        </div>
        <AddReview id={id} />
      </section>
    </div>
  );
}

export default Reviews;
