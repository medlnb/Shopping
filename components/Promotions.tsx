import Link from "next/link";
import LoadImage from "./LoadImage";
import PromotionSwiper from "./PromotionSwiper";

interface Product {
  _id: string;
  tilte: string;
  image: string;
  description: string;
  price: number;
  newPrice: number;
  dicount: number;
}

async function Promotions() {
  const res = await fetch(`${process.env.URL}/api/products/promotions`, {
    cache: "no-cache",
  });
  if (!res.ok) return <p className="text-red-700">Error Fetching Data...</p>;
  const { products }: { products: Product[] } = await res.json();
  return (
    <div className="flex flex-col lg:grid  lg:grid-cols-6 gap-4 gap-y-2 max-w-[73rem] mx-auto">
      <section className="row-span-2 col-span-4 p-4 md:p-8 md:py-16 py-6 bg-white rounded-lg relative">
        <PromotionSwiper products={products.slice(0, 2)} />
        <div className="custom-pagination absolute bottom-[-30px] left-0 right-0 flex justify-center"></div>
      </section>

      {products.slice(2).map((product) => (
        <section
          className="bg-white rounded-lg col-span-2 flex p-4 items-center"
          key={product._id}
        >
          <div className="flex-1 h-full flex flex-col items-start justify-between">
            <Link
              href={`/product?id=${product._id}`}
              className="text-lg font-semibold text-[#1c274c] hover:text-blue-700 duration-150"
            >
              {product.tilte}
            </Link>
            <div>
              <p className="text-gray-600 mb-4 text-sm">limited time offer</p>
              <p>
                <b className="font-bold text-red-700">{product.newPrice} Dzd</b>{" "}
                <b className="text-gray-600 line-through">
                  {product.newPrice} Dzd
                </b>
              </p>
            </div>
          </div>
          <div className="flex-1">
            <LoadImage
              Url={product.image}
              Css="h-42 object-contain rounded-lg mx-auto"
            />
          </div>
        </section>
      ))}
    </div>
  );
}

export default Promotions;
