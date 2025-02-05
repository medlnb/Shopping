import makeup from "../public/Catigories/makeup.png";
import skincare from "../public/Catigories/skincare.png";
import haircare from "../public/Catigories/haircare.png";
import bodycare from "../public/Catigories/bodycare.png";
import fragrances from "../public/Catigories/Fragrances.png";
import nailcare from "../public/Catigories/nailcare.png";
import MensGrooming from "../public/Catigories/MensGrooming.png";
import BabyandKids from "../public/Catigories/BabyandKids.png";
import tools from "../public/Catigories/tools.png";

const data = [
  {
    aisle: "Makeup",
    img: makeup,
    subcategories: [
      {
        title: "Face",
        items: [
          "Foundation",
          "Concealer",
          "Powder",
          "Blush",
          "Bronzer",
          "Highlighter",
          "Primers",
        ],
      },
      {
        title: "Eyes",
        items: [
          "Eyeshadow",
          "Eyeliner",
          "Mascara",
          "Eyebrow products",
          "False lashes",
        ],
      },
      {
        title: "Lips",
        items: ["Lipstick", "Lip gloss", "Lip liner", "Lip balm"],
      },
      {
        title: "Tools",
        items: ["Brushes", "Sponges", "Eyelash curlers", "Makeup removers"],
      },
    ],
  },
  {
    aisle: "Skincare",
    img: skincare,
    subcategories: [
      {
        title: "Cleansers",
        items: ["Face wash", "Micellar water", "Makeup remover"],
      },
      {
        title: "Toners",
        items: [],
      },
      {
        title: "Moisturizers",
        items: ["Creams", "Gels", "Serums", "Oils"],
      },
      {
        title: "Exfoliators",
        items: ["Scrubs", "Peels"],
      },
      {
        title: "Masks",
        items: ["Sheet masks", "Clay masks", "Peel-off masks"],
      },
      {
        title: "Eye Care",
        items: ["Eye creams", "Eye masks"],
      },
      {
        title: "Sun Protection",
        items: ["Sunscreen", "After-sun care"],
      },
    ],
  },
  {
    aisle: "Hair Care",
    img: haircare,
    subcategories: [
      {
        title: "Shampoo",
        items: [],
      },
      {
        title: "Conditioner",
        items: [],
      },
      {
        title: "Hair Treatments",
        items: ["Masks", "Serums", "Oils"],
      },
      {
        title: "Styling",
        items: ["Gels", "Mousses", "Hairsprays", "Heat protectants"],
      },
      {
        title: "Hair Color",
        items: ["Dyes", "Root touch-ups"],
      },
    ],
  },
  {
    aisle: "Body Care",
    img: bodycare,
    subcategories: [
      {
        title: "Cleansers",
        items: ["Body wash", "Soap"],
      },
      {
        title: "Exfoliators",
        items: ["Body scrubs"],
      },
      {
        title: "Moisturizers",
        items: ["Lotions", "Creams", "Oils"],
      },
      {
        title: "Deodorants",
        items: ["Roll-ons", "Sprays"],
      },
      {
        title: "Treatments",
        items: ["Cellulite creams", "Stretch mark products"],
      },
    ],
  },
  {
    aisle: "Fragrances",
    img: fragrances,
    subcategories: [
      {
        title: "Perfumes",
        items: [],
      },
      {
        title: "Body sprays",
        items: [],
      },
      {
        title: "Roll-on oils",
        items: [],
      },
      {
        title: "Home scents",
        items: ["Candles", "Diffusers"],
      },
    ],
  },
  {
    aisle: "Nail Care",
    img: nailcare,
    subcategories: [
      {
        title: "Nail polish",
        items: [],
      },
      {
        title: "Nail care products",
        items: ["Cuticle oil", "Strengtheners"],
      },
      {
        title: "Nail tools",
        items: ["Files", "Buffers"],
      },
    ],
  },
  {
    aisle: "Men's Grooming",
    img: MensGrooming,
    subcategories: [
      {
        title: "Beard care",
        items: ["Oils", "Balms", "Shampoos"],
      },
      {
        title: "Shaving products",
        items: ["Razors", "Creams", "Aftershaves"],
      },
      {
        title: "Skincare for men",
        items: ["Moisturizers", "Cleansers"],
      },
    ],
  },
  {
    aisle: "Baby and Kids",
    img: BabyandKids,
    subcategories: [
      {
        title: "Baby lotion",
        items: [],
      },
      {
        title: "Baby oil",
        items: [],
      },
      {
        title: "Baby shampoo",
        items: [],
      },
      {
        title: "Sunscreen for kids",
        items: [],
      },
    ],
  },
  {
    aisle: "Beauty Accessories",
    img: tools,
    subcategories: [
      {
        title: "Makeup bags",
        items: [],
      },
      {
        title: "Mirrors",
        items: [],
      },
      {
        title: "Tweezers",
        items: [],
      },
      {
        title: "Reusable cotton pads",
        items: [],
      },
    ],
  },
];

export default data;
