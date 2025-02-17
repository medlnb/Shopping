"use client";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { debounce } from "lodash";
import EmptyState from "@components/EmptyState";

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
}

function Search() {
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
    }
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
          <input
            type="text"
            className="border border-gray-5 rounded-md focus:outline-none p-2 px-4 bg-gray-1 w-full mb-4"
            placeholder="search for products..."
            onChange={(e) => setQuery(e.target.value)}
          />
          <div>
            {data ? (
              !!data.length ? (
                data.map((product) => (
                  <div className="flex mb-1 gap-2" key={product._id}>
                    <img
                      src={"/api/image/" + product.image}
                      alt={product.title}
                      className="w-16 h-16 rounded-md object-contain"
                    />
                    <div className="flex-1 flex justify-between bg-gray-2 rounded-lg p-1">
                      <div>
                        <p className="text-sm font-bold">{product.title}</p>
                        <p>{product.brand}</p>
                      </div>
                      <p className="px-2 text-xs my-auto font-semibold">
                        {product.price} Dzd
                      </p>
                    </div>
                  </div>
                ))
              ) : query.length ? (
                <EmptyState label="No products found" />
              ) : (
                <p className="text-center font-bold text-gray-7 text-lg pt-8">
                  Whats are you looking for my friend?
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
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={HandleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <div
        className="flex justtify-center items-center gap-8 border rounded-md p-1 px-4 bg-gray-100 cursor-pointer hover:bg-gray-2 duration-150 w-full md:w-auto"
        onClick={() => setDialog(true)}
      >
        <p className="text-gray-400 flex-1">i am shopping for...</p>
        <CiSearch className="text-gray-600" />
      </div>
    </>
  );
}

export default Search;
