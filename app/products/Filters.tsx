"use client";
import { ReactNode, useState, useTransition } from "react";
import { IoIosArrowDown } from "react-icons/io";
import categories from "@data/categories.json";
import { useRouter } from "next/navigation";
import { Slider } from "@mui/joy";
import { BarLoader } from "react-spinners";

interface QueriesProps {
  p?: string;
  min?: number;
  max?: number;
  category?: string;
}

function Filters({ queries }: { queries: QueriesProps }) {
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
    <aside className="sticky top-32 w-full md:w-48 pt-2">
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
          <p className="text-xs text-gray-600">Filters:</p>
          <button
            className="text-xs text-blue-700 disabled:text-blue-400"
            onClick={() => startTransition(() => replace("/products"))}
            disabled={isPending}
          >
            Clear All
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
            <div key={category.aisle} className="my-1 flex items-center gap-1">
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
                className="text-xs font-medium text-gray-500 hover:text-blue-700 duration-200 cursor-pointer"
              >
                {category.aisle}
              </label>
            </div>
          ))}
        </Filter>
        <Filter
          title="Price"
          activated={!!queries.category}
          isLoading={isPending}
        >
          <div className="px-2 mb-1">
            <Slider
              disabled={isPending}
              sx={{
                "--Slider-trackSize": "0.5px",
                "--Slider-thumbSize": "0.8rem",
                "& .MuiSlider-markLabel": {
                  fontSize: "0.7rem",
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
          <div className="flex justify-between items-center gap-0.5 text-xs text-gray-700">
            <div className="flex items-center justify-between border border-gray-400 rounded-[4px] px-1">
              <p className="border-r border-gray-400 p-1 px-0.5">Dzd</p>
              <p className="px-0.5">{selectedPrice.from}</p>
            </div>
            <div className="flex items-center justify-between border border-gray-400 rounded-[4px] px-1">
              <p className="border-r border-gray-400 p-1 px-0.5">Dzd</p>
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
            className="w-full bg-blue-700 hover:bg-blue-600 disabled:bg-blue-400 text-white text-xs py-1 mt-2 rounded-md relative"
          >
            Filter
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
  const [toggle, setToggle] = useState(true);

  return (
    <section className={isLoading ? "opacity-70 pointer-events-none" : ""}>
      <div
        className={`bg-white p-3 py-2 shadow-md flex justify-between items-center mt-3 border-b cursor-pointer ${
          toggle ? "rounded-t-md" : "rounded-md"
        } ${activated ? "border border-gray-300" : ""}`}
        onClick={() => setToggle(!toggle)}
      >
        <p className="text-xs text-gray-800">{title}</p>
        <IoIosArrowDown
          className={`text-xs text-blue-700 ${
            toggle ? "rotate-180" : ""
          } duration-200`}
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
