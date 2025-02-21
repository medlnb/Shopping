"use client";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
import { ClipLoader } from "react-spinners";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

function AddReview({ id }: { id?: string }) {
  const t = useTranslations("product");
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState({
    comment: "",
    rating: 3,
  });

  const HandleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!review.comment) return toast.warning(t("emptyComment"));
    setLoading(true);
    const res = await fetch("/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        ...review,
        productId: id,
      }),
    });
    setLoading(false);
    if (!res.ok) toast.error(t("reviewSubmitError"));
    toast.success(t("reviewSubmitSuccess"));
    setReview({ comment: "", rating: 3 });
  };

  return (
    <form
      onSubmit={HandleSubmit}
      className="border-2 border-gray-4 shadow-3 text-sm rounded-2xl flex flex-col p-3 min-w-full md:min-w-[24%]"
    >
      <h1 className="text-4xl md:text-6xl">❝</h1>
      <textarea
        placeholder={t("commentPlaceholder")}
        className="focus:outline-none border border-gray-4 min-h-26 rounded-lg bg-gray-1 mx-5 p-2"
        value={review.comment}
        onChange={(e) =>
          setReview((prev) => ({ ...prev, comment: e.target.value }))
        }
      />
      <div className="flex flex-row gap-0.5 items-center my-3 ml-5">
        {Array.from({ length: review.rating }, (_, index) => (
          <FaStar
            key={index}
            size={20}
            className={`duration-150 hover:scale-75 cursor-pointer ${
              review.rating < 2
                ? "text-red"
                : review.rating < 4
                ? "text-yellow"
                : "text-blue"
            }`}
            onClick={() =>
              setReview((prev) => ({ ...prev, rating: index + 1 }))
            }
          />
        ))}
        {Array.from({ length: 5 - review.rating }, (_, index) => (
          <CiStar
            key={index}
            size={20}
            className="duration-150 hover:scale-125 cursor-pointer"
            onClick={() =>
              setReview((prev) => ({
                ...prev,
                rating: prev.rating + index + 1,
              }))
            }
          />
        ))}
      </div>
      <div className="h-12 flex flex-row items-center gap-3 w-full">
        <img
          className="h-8 w-8 cursor-pointer rounded-full object-contain"
          src={session?.user.image}
          alt="Review post"
        />
        <p>{session?.user.name}</p>
        <button
          type="submit"
          className="p-2 px-4 bg-blue-light rounded-md ml-auto text-white w-30 h-9"
        >
          {loading ? <ClipLoader size={17} color="white" /> : t("submit")}
        </button>
      </div>
    </form>
  );
}

export default AddReview;
