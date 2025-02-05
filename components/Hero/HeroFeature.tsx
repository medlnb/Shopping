import React from "react";
import Image from "next/image";
import icons1 from "@public/icons/icon-01.svg";
import icons2 from "@public/icons/icon-02.svg";
import icons3 from "@public/icons/icon-03.svg";
import icons4 from "@public/icons/icon-04.svg";

const featureData = [
  {
    img: icons1,
    title: "Free Shipping",
    description: "For all orders $200",
  },
  {
    img: icons2,
    title: "1 & 1 Returns",
    description: "Cancellation after 1 day",
  },
  {
    img: icons3,
    title: "100% Secure Payments",
    description: "Gurantee secure payments",
  },
  {
    img: icons4,
    title: "24/7 Dedicated Support",
    description: "Anywhere & anytime",
  },
];

const HeroFeature = () => {
  return (
    <div className="max-w-[1060px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      <div className="flex flex-wrap items-center gap-7.5 xl:gap-12.5 mt-10">
        {featureData.map((item, key) => (
          <div className="flex items-center gap-4" key={key}>
            <Image src={item.img} alt="icons" width={40} height={41} />

            <div>
              <h3 className="font-medium text-lg text-dark">{item.title}</h3>
              <p className="text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeature;
