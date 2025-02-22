import React from "react";
import Image from "next/image";
import icons1 from "@public/icons/icon-01.svg";
import icons2 from "@public/icons/icon-02.svg";
import icons3 from "@public/icons/icon-03.svg";
import icons4 from "@public/icons/icon-04.svg";
import { getLocale } from "next-intl/server";

const featureDataEN = [
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

const featureDataFR = [
  {
    img: icons1,
    title: "Livraison gratuite",
    description: "Pour toutes les commandes de 200 $",
  },
  {
    img: icons2,
    title: "Retours sous 1 jour",
    description: "Annulation après 1 jour",
  },
  {
    img: icons3,
    title: "Paiements 100 % sécurisés",
    description: "Garantie de paiements sécurisés",
  },
  {
    img: icons4,
    title: "Support dédié 24/7",
    description: "Partout et à tout moment",
  },
];

const HeroFeature = async () => {
  const locale = await getLocale();
  return (
    <div className="flex flex-wrap justify-center items-center gap-7.5 xl:gap-12.5 mt-10">
      {(locale === "en" ? featureDataEN : featureDataFR).map((item, key) => (
        <div className="flex items-center gap-4" key={key}>
          <Image src={item.img} alt="icons" width={40} height={41} />

          <div>
            <h3 className="font-medium text-lg text-dark">{item.title}</h3>
            <p className="text-sm">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroFeature;
