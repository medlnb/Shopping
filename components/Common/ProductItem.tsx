import React from "react";
import Image from "next/image";
import Link from "next/link";
import starIcon from "@public/icons/icon-star.svg";

interface Product {
  _id: string;
  tilte: string;
  image: string;
  description: string;
  price: number;
  numberOfReviews: number;
  overallRating: number;
}

const ProductItem = ({ item }: { item: Product }) => {
  return (
    <Link
      href={`product?id=${item._id}`}
      className="group h-full flex flex-col justify-between p-4 sm:p-7.5 bg-white rounded-[10px] ease-out duration-200 hover:shadow-3"
    >
      <div className="relative overflow-hidden flex items-center justify-center rounded-lg min-h-[270px] mb-4">
        <Image
          src={`https://shopping-hamma.vercel.app/api/image/${item.image}`}
          alt={item.tilte}
          width={256}
          height={256}
          className="object-contain"
        />
      </div>
      <div>
        <div
          className={`flex items-center gap-2.5 mb-2 ${
            item.numberOfReviews ? "" : "invisible"
          }`}
        >
          <div className="flex items-center gap-1">
            {Array(Math.ceil(item.overallRating))
              .fill(null)
              .map((_, index) => (
                <Image
                  key={index}
                  src={starIcon}
                  alt="star icon"
                  width={14}
                  height={14}
                />
              ))}
          </div>

          <p className="text-custom-sm">( {item.overallRating.toFixed(1)} )</p>
        </div>

        <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5">
          {item.tilte}
        </h3>

        <span className="flex items-center gap-2 font-medium text-lg">
          <span className="text-dark">{item.price} Dzd</span>
        </span>
      </div>
    </Link>
  );
};

export default ProductItem;
