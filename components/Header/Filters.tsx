"use client";
import { useState, useEffect, useRef, Fragment } from "react";
import categories from "@data/categories";
import { CiHeart } from "react-icons/ci";
import { IoIosMore } from "react-icons/io";

function Filters() {
  const [selected, setSelected] = useState<number>();
  const [showMore, setShowMore] = useState(false);
  const [StickyMenu, setStickyMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      )
        setSelected(0);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) setStickyMenu(true);
    else setStickyMenu(false);
  };

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
        {categories.slice(0, 4).map((cat, index) => (
          <p
            key={cat.aisle}
            className={`cursor-pointer relative underlined ${
              selected === index + 1 ? " after:w-full" : ""
            }`}
            onClick={() => setSelected(index + 1)}
          >
            {cat.aisle}
          </p>
        ))}

        {categories.slice(4).map((cat, index) => (
          <p
            key={cat.aisle}
            className={`${
              showMore ? "" : "hidden"
            } md:block cursor-pointer relative underlined ${
              selected === index + 1 ? "after:w-full" : ""
            }`}
            onClick={() => setSelected(index + 1)}
          >
            {cat.aisle}
          </p>
        ))}

        {!!selected && (
          <div className="absolute w-full p-3 md:top-[2.4rem] top-16 bg-white shadow-lg rounded-md duration-150 flex gap-4 flex-wrap">
            {categories[selected - 1].subcategories.map((subcat, index) => (
              <Fragment key={subcat.title}>
                {!!index && (
                  <div className="h-10 my-auto w-[0.5px] bg-gray-200" />
                )}
                <div>
                  <p className="cursor-pointer hover:text-black">
                    {subcat.title}
                  </p>
                  <div>
                    {subcat.items.map((item) => (
                      <p
                        className="text-gray-400 mt-1 cursor-pointer hover:text-black"
                        key={item}
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Filters;
