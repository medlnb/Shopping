"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import Link from "next/link";
import LoadImageClient from "./LoadImageClient";

interface Product {
  _id: string;
  tilte: string;
  image: string;
  description: string;
  price: number;
  newPrice: number;
  dicount: number;
}

function PromotionSwiper({ products }: { products: Product[] }) {
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={30}
      autoplay={{
        delay: 3000,
      }}
      pagination={{
        clickable: true,
        el: ".custom-pagination",
      }}
      modules={[Autoplay, Pagination]}
    >
      {products.map((product) => (
        <SwiperSlide key={product._id} className="my-auto">
          <div className="flex flex-col-reverse md:items-center md:flex-row gap-2">
            <div className="flex-1 h-full flex flex-col items-start justify-between pb-2 gap-4">
              <p className="text-gray-700">
                <b className="text-5xl font-bold text-blue-600">
                  {product.dicount}%
                </b>
                {" Off"}
              </p>
              <div>
                <p className="text-2xl font-semibold"> {product.tilte}</p>
                <p className=" text-gray-600">{product.description}</p>
              </div>
              <Link
                href={`/product?id=${product._id}`}
                className="bg-[#1c274c] hover:bg-[#33447c] duration-150 px-4 py-2 rounded-md text-white"
              >
                Shop Now
              </Link>
            </div>
            <div className="flex-1">
              <LoadImageClient
                Url={product.image}
                Css="h-72 rounded-lg mx-auto object-contain"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default PromotionSwiper;
