"use client";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { debounce } from "lodash";
import EmptyState from "@components/EmptyState";
import { ImCancelCircle } from "react-icons/im";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaStar } from "react-icons/fa6";

interface Product {
  _id: number;
  title: string;
  price: number;
  image: string;
  brand: string;
  category: {
    aisle: string;
    subcategory: string;
  };
  numberOfReviews: number;
  overallRating: number;
}

function Search() {
  const t = useTranslations("Header");
  const inputRef = useRef<HTMLInputElement>(null);
  const [dialog, setDialog] = useState(false);
  const [data, setData] = useState<Product[] | undefined>([]);
  const [query, setQuery] = useState("");

  const HandleClose = () => {
    setDialog(false);
    setQuery("");
    setData([]);
  };

  const debouncedFetch = debounce((searchQuery: string) => {
    if (searchQuery.length > 0) {
      setData(undefined);
      fetch(`/api/search?q=${searchQuery}`)
        .then((res) => res.json())
        .then((d) => setData(d.products));
    } else setData([]);
  }, 300);

  useEffect(() => {
    debouncedFetch(query);
    return () => {
      debouncedFetch.cancel();
    };
  }, [query]);

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={false}
        open={dialog}
        onClose={HandleClose}
      >
        <DialogContent>
          <div className="relative mb-4">
            <input
              ref={inputRef}
              type="text"
              className="border border-gray-5 rounded-md focus:outline-none p-2 px-4 bg-gray-1 w-full"
              placeholder={t("searchPlaceholder")}
              onChange={(e) => setQuery(e.target.value)}
            />
            {!!query.length && (
              <ImCancelCircle
                className="absolute top-1/2 -translate-y-1/2 right-3 animate-pulse text-gray-5 cursor-pointer"
                size={20}
                onClick={() => {
                  setQuery("");
                  setData([]);
                }}
              />
            )}
          </div>

          {data ? (
            !!data.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2">
                {data.map((product) => (
                  <Link
                    href={`/product?id=${product._id}`}
                    onClick={HandleClose}
                    className="flex mb-1 gap-2 p-1"
                    key={product._id}
                  >
                    <Image
                      height={100}
                      width={100}
                      src={"/api/image/" + product.image}
                      alt={product.title}
                      className="w-16 h-16 rounded-md object-contain"
                    />
                    <div className="flex-1 flex justify-between bg-gray-2 hover:bg-gray-3 rounded-lg p-1 duration-150">
                      <div>
                        <p className="text-sm font-bold">{product.title}</p>
                        <div className="flex flex-row gap-0.5 items-center">
                          {Array.from(
                            { length: Math.ceil(product.overallRating) },
                            (_, index) => (
                              <FaStar
                                key={index}
                                size={15}
                                className="text-blue-light"
                              />
                            )
                          )}
                        </div>
                        <p>{product.brand}</p>
                      </div>
                      <p className="px-2 text-xs my-auto font-semibold">
                        {product.price} Dzd
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.length ? (
              <EmptyState label={t("emptyState")} />
            ) : (
              <p className="text-center font-bold text-gray-7 text-lg pt-8">
                {t("searchDescription")}
              </p>
            )
          ) : (
            [...Array(5)].map((_, i) => (
              <div className="flex mb-1 gap-2" key={i}>
                <div className="w-16 h-16 rounded-md loading--background" />
                <div className="flex-1 flex justify-between bg-gray-2 rounded-lg p-1">
                  <div>
                    <div className="loading--background w-40 mt-1 h-4 rounded-md" />
                    <div className="loading--background w-20 mt-1 h-3 rounded-md"></div>
                  </div>
                  <div className="mx-2 my-auto loading--background w-20 h-4 rounded-md"></div>
                </div>
              </div>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={HandleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <div
        className="flex justtify-center items-center gap-8 border rounded-md p-1 px-4 bg-gray-100 cursor-pointer hover:bg-gray-2 duration-150 w-full md:w-auto"
        onClick={async () => {
          setDialog(true);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 200);
        }}
      >
        <p className="text-gray-400 flex-1">{t("seachTitle")}</p>
        <CiSearch className="text-gray-600" />
      </div>
    </>
  );
}

export default Search;
