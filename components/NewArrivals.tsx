import Link from "next/link";

interface Product {
  _id: string;
  tilte: string;
  image: string;
  description: string;
  price: number;
  newPrice: number;
  dicount: number;
}

async function NewArrivals() {
  const res = await fetch(`${process.env.URL}/api/products/promotions`, {
    cache: "no-cache",
  });
  if (!res.ok) return <p className="text-red-700">Error Fetching Data...</p>;
  const { products }: { products: Product[] } = await res.json();
  console.log(products);
  return (
    <section className="max-w-[73rem] mx-auto my-8">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-[#2c3659]">{"This Week's"}</p>
          <b className="text-2xl text-[#1c274c]">New Arrivals</b>
        </div>
        <button className="bg-gray-100 px-4 p-2 rounded-md hover:bg-gray-200 transition-all duration-300 ">
          View All
        </button>
      </div>
      <div>
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md p-4 max-w-[15rem] w-full"
          >
            <Link href={`/product/${product._id}`}>
              <img
                src={`https://shopping-hamma.vercel.app/api/image/${product.image}`}
                alt={product.tilte}
                className="h-40 w-full object-cover rounded-lg"
              />
              <p className="text-[#1c274c] text-lg mt-2">{product.tilte}</p>
              <p className="text-[#1c274c] text-lg mt-2">{product.price}</p>
              <p className="text-[#1c274c] text-lg mt-2">{product.newPrice}</p>
              <p className="text-[#1c274c] text-lg mt-2">{product.dicount}</p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default NewArrivals;
