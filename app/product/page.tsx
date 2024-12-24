import Buy from "./Buy";
import Images from "./Images";

interface Product {
  _id: string;
  title: string;
  description: string;
  variances: {
    _id: string;
    price: number;
    newPrice?: number;
    quantity: number;
    unit: string;
    stock: number;
    info?: string;
  }[];
  brand: string;
  category: {
    aisle: string;
    subcategories: string;
    item?: string;
  };
  ingedients: string[];
  images: string[];
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
  const { product }: { product: Product } = await res.json();

  return (
    <main className="py-10 max-w-[72rem] mx-auto p-1">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
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
              <b className="text-xl font-bold mt-8 text-gray-800">
                Prices: {minPrice} Dzd - {maxPrice} Dzd
              </b>
            );
          })()}
          <Buy productId={product._id} variances={product.variances} />
        </div>
      </section>
    </main>
  );
}

export default Page;
