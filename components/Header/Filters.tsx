"use client";
import { useState, useEffect, useRef } from "react";
import categories from "@data/categories";
// import { CiHeart } from "react-icons/ci";
import Link from "next/link";
import { useLocale } from "next-intl";

function Filters({ toggle }: { toggle: boolean }) {
  const locale = useLocale();
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
      className={` border-gray-5 px-4 duration-300 overflow-hidden ${
        toggle ? `border-b ${StickyMenu ? "py-2" : "py-4"}` : "h-0 py-0"
      }`}
    >
      <div
        ref={containerRef}
        className="max-w-[73rem] mx-auto flex items-center gap-2 gap-y-4 md:gap-4 flex-wrap font-semibold text-sm text-gray-7 relative"
      >
        {/* <CiHeart size={15} /> */}
        {categories.slice(0, locale === "en" ? 4 : 3).map((cat) => (
          <Link
            href={`/products?category=${cat.aisle}`}
            key={cat.aisle}
            className="cursor-pointer relative underlined"
          >
            {locale === "en" ? cat.aisle : cat.aislefr}
          </Link>
        ))}

        {categories.slice(locale === "en" ? 4 : 3).map((cat) => (
          <Link
            href={`/products?category=${cat.aisle}`}
            key={cat.aisle}
            className="md:block cursor-pointer relative underlined"
          >
            {locale === "en" ? cat.aisle : cat.aislefr}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Filters;
