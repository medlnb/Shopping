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
  const res = await fetch(`${process.env.URL}/api/product/promotions`, {
    cache: "no-cache",
  });
  if (!res.ok) return <p className="text-red-700">Error Fetching Data...</p>;
  const { products }: { products: Product[] } = await res.json();
  console.log(products.length);
  return (
    <div className="flex flex-col md:grid  md:grid-cols-6  gap-4 gap-y-2 bg-[#e5eaf4] md:p-10 p-2">
      <section className="row-span-2 col-span-4 p-4 md:p-16 py-6 bg-white rounded-lg relative">
        <PromotionSwiper products={products.slice(0, 2)} />
        <div className="custom-pagination absolute bottom-[-30px] left-0 right-0 flex justify-center"></div>
      </section>

      {products.slice(2).map((product) => (
        <section className="bg-white rounded-lg col-span-2 flex p-4 items-center">
          <div className="flex-1 h-full flex flex-col items-start justify-between">
            <Link
              href={`/product/${product._id}`}
              className="text-lg font-semibold text-[#1c274c] hover:text-blue-700 duration-150"
            >
              {product.tilte}
            </Link>
            <p>
              <b className="font-bold text-red-700">{product.newPrice} Dzd</b>{" "}
              <b className="text-sm text-gray-600 line-through">
                {product.newPrice} Dzd
              </b>
            </p>
          </div>
          <div className="flex-1">
            <LoadImage Url={product.image} Css="h-20 rounded-lg mx-auto" />
          </div>
        </section>
      ))}
    </div>
  );
}

export default Promotions;
