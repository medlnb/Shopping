"use client";
import { ReactNode, useState, useTransition } from "react";
import { IoIosArrowDown } from "react-icons/io";
import categories from "@data/categories";
import { useRouter } from "next/navigation";
import { Slider } from "@mui/joy";
import { BarLoader } from "react-spinners";
import { useLocale, useTranslations } from "next-intl";

interface QueriesProps {
  p?: string;
  min?: number;
  max?: number;
  category?: string;
}

function Filters({ queries }: { queries: QueriesProps }) {
  const t = useTranslations("products");
  const locale = useLocale();

  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedPrice, setSelectedPrice] = useState({
    from: queries.min || 0,
    to: queries.max || 10000,
  });

  const updateQuery = (newQuery: Partial<QueriesProps>) => {
    const updatedQueries = {
      ...queries,
      ...newQuery,
      p: undefined,
    };

    const queryString = Object.entries(updatedQueries)
      .filter(
        (value) =>
          value[1] !== undefined &&
          value[1] !== null &&
          value[1] !== 0 &&
          value[1] !== 10000
      )
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    startTransition(() => replace(`/products?${queryString}`));
  };

  return (
    <aside className="sticky top-32 w-full md:w-72 pt-2">
      <section
        className={`bg-white shadow-md ${
          isPending ? "rounded-b-md" : "rounded-md"
        }`}
      >
        <BarLoader
          loading={isPending}
          cssOverride={{
            width: "100%",
            height: "2px",
            margin: "0 auto",
          }}
        />
        <div className="flex justify-between items-center p-4 py-2">
          <p className="text-gray-6">{t("filters")}:</p>
          <button
            className="text-sm text-blue disabled:text-blue-light"
            onClick={() => startTransition(() => replace("/products"))}
            disabled={isPending}
          >
            {t("clear")}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-0">
        <Filter
          title="Category"
          activated={!!queries.category}
          isLoading={isPending}
        >
          {categories.map((category) => (
            <div key={category.aisle} className="my-1 flex items-center gap-2">
              <input
                type="checkbox"
                id={category.aisle}
                name="category.aisle"
                value={category.aisle}
                checked={queries.category === category.aisle}
                disabled={isPending}
                onChange={(e) =>
                  updateQuery({
                    category: e.target.checked ? category.aisle : undefined,
                  })
                }
              />
              <label
                htmlFor={category.aisle}
                className={`text-sm font-medium hover:text-blue duration-200 cursor-pointer ${
                  queries.category === category.aisle
                    ? "text-blue"
                    : "text-gray-5"
                }`}
              >
                {locale === "en" ? category.aisle : category.aislefr}
              </label>
            </div>
          ))}
        </Filter>
        <Filter
          title={t("price")}
          activated={!!queries.category}
          isLoading={isPending}
        >
          <div className="px-3 mb-1">
            <Slider
              disabled={isPending}
              sx={{
                "--Slider-trackSize": "1px",
                "--Slider-thumbSize": "1rem",
                "& .MuiSlider-markLabel": {
                  fontSize: "1rem",
                },
              }}
              step={100}
              min={0}
              max={10000}
              value={[selectedPrice.from, selectedPrice.to]}
              onChange={(event: Event, newValue: number | number[]) => {
                if (typeof newValue === "number" || !event) return;
                setSelectedPrice({
                  from: Math.floor(newValue[0]),
                  to: Math.ceil(newValue[1]),
                });
              }}
              marks={[
                {
                  value: 0,
                  label: "0",
                },
                {
                  value: 10000,
                  label: "10 000",
                },
              ]}
            />
          </div>
          <div className="flex justify-between items-center gap-0.5 text-gray-7 mt-4 flex-wrap">
            <div className="flex items-center justify-between border border-gray-4 rounded-[4px] px-1">
              <p className="border-r border-gray-4 p-1 px-0.5">Dzd</p>
              <p className="px-0.5">{selectedPrice.from}</p>
            </div>
            <div className="flex items-center justify-between border border-gray-4 rounded-[4px] px-1">
              <p className="border-r border-gray-4 p-1 px-0.5">Dzd</p>
              <p className="px-0.5">{selectedPrice.to}</p>
            </div>
          </div>
          <button
            onClick={() =>
              updateQuery({
                min: selectedPrice.from,
                max: selectedPrice.to,
              })
            }
            disabled={isPending}
            className="w-full bg-blue hover:bg-blue-light duration-150 disabled:bg-blue-light text-white py-1 mt-2 rounded-md relative"
          >
            {t("filter")}
          </button>
          <button
            onClick={() => {
              updateQuery({
                min: 0,
                max: 10000,
              });
              setSelectedPrice({
                from: 0,
                to: 10000,
              });
            }}
            disabled={isPending}
            className="w-full bg-gray-3 hover:bg-gray-5 duration-150 disabled:bg-gray-5 py-1 mt-2 rounded-md relative"
          >
            {t("reset")}
          </button>
        </Filter>
      </div>
    </aside>
  );
}

export default Filters;

const Filter = ({
  title,
  activated,
  children,
  isLoading,
}: {
  title: string;
  activated: boolean;
  children: ReactNode;
  isLoading: boolean;
}) => {
  const [toggle, setToggle] = useState(false);

  return (
    <section className={isLoading ? "opacity-70 pointer-events-none" : ""}>
      <div
        className={`bg-white p-3 py-2 shadow-md flex justify-between items-center mt-3 border-b border-gray-4 cursor-pointer ${
          toggle ? "rounded-t-md" : "rounded-md"
        } ${activated ? "border border-gray-3" : ""}`}
        onClick={() => setToggle(!toggle)}
      >
        <p className="text-gray-7">{title}</p>
        <IoIosArrowDown
          className={`text-blue-7 ${toggle ? "rotate-180" : ""} duration-200`}
        ></IoIosArrowDown>
      </div>
      {toggle && (
        <div className="bg-white p-4 py-2 shadow-md rounded-b-md">
          {children}
        </div>
      )}
    </section>
  );
};
