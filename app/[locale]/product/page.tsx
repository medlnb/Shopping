import { getTranslations } from "next-intl/server";
import Buy from "./Buy";
import Images from "./Images";
import Reviews from "./Reviews";

interface Product {
  _id: string;
  title: string;
  variances: {
    _id: string;
    price: number;
    newPrice?: number;
    quantity: number;
    unit: string;
    isOutOfStock: boolean;
    info?: string;
  }[];
  images: string[];
  brand: string;
  category: {
    aisle: string;
    subcategories: string;
    item?: string;
  };
  description: string;
  ingedients: string[];
  numberOfReviews?: number;
  overallRating?: number;
}

async function Page({
  searchParams: { id },
}: {
  searchParams: { id?: string };
}) {
  const res = await fetch(`${process.env.URL}/api/product?id=${id}`, {
    cache: "no-cache",
  });
  if (!res.ok) return <p className="text-red-600">Error fetching Product...</p>;
  const t = await getTranslations("product");
  const { product }: { product: Product } = await res.json();
  console.log(product);
  return (
    <main>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 p-2 py-10 max-w-[72rem] mx-auto">
        <div className="flex-1">
          <Images images={product.images} />
        </div>
        <div className="flex-1">
          <h1 className="md:text-4xl text-2xl font-bold text-[#1c274c]">
            {product.title}
          </h1>
          <h2 className="text-xl font-semibold text-[#384059] mt-3">
            {product.brand}
          </h2>
          <h3 className="text-lg font-semibold text-gray-600">
            {product.category.aisle} /{" "}
            <span className="text-base text-gray-500">
              {product.category.subcategories}
            </span>
          </h3>
          {(() => {
            const prices = product.variances.map(
              (variance) => variance.newPrice ?? variance.price
            );
            const maxPrice = Math.max(...prices);
            const minPrice = Math.min(...prices);
            return (
              <b className="text-xl font-bold mt-8 text-gray-8">
                {t("prices")}: {minPrice} Dzd - {maxPrice} Dzd
              </b>
            );
          })()}
          <Buy
            productId={product._id}
            variances={product.variances}
            mainImage={product.images[0]}
            title={product.title}
          />
        </div>
      </section>

      <section className="bg-gray-100 p-2 py-8">
        <div className="max-w-[72rem] mx-auto">
          {product.description && (
            <>
              <h1 className="md:text-4xl text-2xl font-bold text-[#1c274c] my-4">
                {t("description")}
              </h1>
              <p className="ml-2">{product.description}</p>
            </>
          )}

          {product.ingedients && (
            <>
              <h1 className="md:text-4xl text-2xl font-bold text-[#1c274c] my-4">
                {t("ingredients")}
              </h1>
              <div className="ml-2">
                {product.ingedients.map((ingedient) => (
                  <p key={ingedient}>• {ingedient} </p>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <Reviews
        id={id}
        avrRating={product.overallRating}
        ratingCounts={product.numberOfReviews}
      />
    </main>
  );
}

export default Page;
