import EmptyState from "@components/EmptyState";
import Pagin from "@components/Pagin";
import Image from "next/image";
import Link from "next/link";
import starIcon from "@public/icons/icon-star.svg";

interface QueriesProps {
  p?: string;
  min?: number;
  max?: number;
  category?: string;
}

interface Product {
  _id: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  createdAt: string;
  overallRating: number;
  numberOfReviews: number;
}

async function ProductsTable({ queries }: { queries: QueriesProps }) {
  const res = await fetch(`${process.env.URL}/api/products`, {
    cache: "no-cache",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...queries }),
  });
  if (!res.ok)
    return <p className="text-red-400">Error Fetching Products...</p>;

  const { count, products }: { count: number; products: Product[] } =
    await res.json();

  return (
    <section className="w-full">
      <div className="py-1 flex justify-end">
        <Pagin
          page={Number(queries.p) || 1}
          count={count}
          perpage={6}
          href="products"
        />
      </div>

      {products.length ? (
        <div className="flex-1 pt-0.5 grid grid-cols-2 md:grid-cols-3 gap-1">
          {products.map((product) => (
            <Link key={product._id} href={`/product?id=${product._id}`}>
              <section className="bg-white p-2 rounded-lg hover:shadow-md duration-150 ">
                <Image
                  height={400}
                  width={400}
                  src={`https://shopping-hamma.vercel.app/api/image/${product.image}`}
                  alt={product.title}
                  className="h-40 w-full object-contain rounded-md mx-auto"
                />
              </section>
              <div
                className={`flex items-center gap-2.5 mb-2 ${
                  product.numberOfReviews ? "" : "invisible"
                }`}
              >
                <div className="flex items-center gap-1">
                  {Array(Math.ceil(product.overallRating))
                    .fill(null)
                    .map((_, index) => (
                      <Image
                        key={index}
                        src={starIcon}
                        alt="star icon"
                        width={14}
                        height={14}
                      />
                    ))}
                </div>

                <p className="text-custom-sm">
                  ( {product.overallRating.toFixed(1)} )
                </p>
              </div>
              <h1 className="my-1 text-gray-700 font-semibold">
                {product.title}
              </h1>
              <h1 className="my-1 text-gray-700 font-semibold">
                {product.price.toFixed(2)} <b>Dzd</b>
              </h1>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-20">
          <EmptyState label="Nothing found, Maybe try to change the filter" />
        </div>
      )}
    </section>
  );
}

export default ProductsTable;
