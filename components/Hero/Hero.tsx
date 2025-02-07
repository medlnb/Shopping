import React from "react";
import HeroCarousel from "./HeroCarousel";
import Image from "next/image";
import heroBg from "@public/hero/hero-bg.png";
import Link from "next/link";
import LoadImage from "@components/LoadImage";

interface Product {
  _id: string;
  tilte: string;
  image: string;
  description: string;
  price: number;
  newPrice: number;
  dicount: number;
}

const Hero = async () => {
  const res = await fetch(`${process.env.URL}/api/products/promotions`, {
    cache: "no-cache",
  });
  if (!res.ok) return <p className="text-red-700">Error Fetching Data...</p>;
  const { products }: { products: Product[] } = await res.json();
  return (
    <>
      <div className="xl:max-w-[757px] w-full">
        <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
          <Image
            src={heroBg}
            alt="hero bg shapes"
            className="absolute right-0 bottom-0 -z-1"
            width={534}
            height={520}
          />
          <HeroCarousel products={products.slice(0, 2)} />
        </div>
      </div>
      <div className="xl:max-w-[393px] w-full">
        <div className="flex flex-col sm:flex-row xl:flex-col h-full gap-5">
          {products.slice(2, 4).map((product) => (
            <div
              key={product._id}
              className="w-full relative rounded-[10px] bg-white p-4 sm:p-7 flex-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="max-w-[153px] font-semibold text-dark text-xl mb-13">
                    <Link href={"product?id=" + product._id}>
                      {product.tilte}
                    </Link>
                  </div>

                  <div>
                    <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                      limited time offer
                    </p>
                    <span className="whitespace-nowrap">
                      <p className="ml-2 font-medium text-xl text-dark-4 line-through">
                        {product.price} Dzd
                      </p>
                      <p className="font-medium text-heading-5 text-red">
                        {product.newPrice} Dzd
                      </p>
                    </span>
                  </div>
                </div>

                <LoadImage
                  Url={product.image}
                  Css="h-32 w-40 object-contain rounded-lg mx-auto "
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;
