"use client";
import { useState, useEffect, useRef } from "react";
import categories from "@data/categories";
import { CiHeart } from "react-icons/ci";
import { IoIosMore } from "react-icons/io";
import Link from "next/link";

function Filters() {
  const [showMore, setShowMore] = useState(false);
  const [StickyMenu, setStickyMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleStickyMenu = () => {
      if (window.scrollY >= 80) setStickyMenu(true);
      else setStickyMenu(false);
    };
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  return (
    <section
      className={`border-b px-4 duration-300 ${StickyMenu ? "py-2" : "py-4"}`}
    >
      <div
        ref={containerRef}
        className="max-w-[73rem] mx-auto flex items-center gap-2 md:gap-4 flex-wrap font-semibold text-sm md:text-base text-gray-600 relative"
      >
        <IoIosMore
          className={`md:hidden text-xl duration-150 ${
            showMore ? "rotate-90 " : ""
          }`}
          onClick={() => setShowMore((prev) => !prev)}
        />
        <CiHeart size={15} />
        {categories.slice(0, 4).map((cat) => (
          <Link
            href={`/products?category=${cat.aisle}`}
            key={cat.aisle}
            className="cursor-pointer relative underlined"
          >
            {cat.aisle}
          </Link>
        ))}

        {categories.slice(4).map((cat) => (
          <Link
            href={`/products?category=${cat.aisle}`}
            key={cat.aisle}
            className={`${
              showMore ? "" : "hidden"
            } md:block cursor-pointer relative underlined `}
          >
            {cat.aisle}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Filters;
