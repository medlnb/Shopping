import { cookies } from "next/headers";
import Delete from "./Delete";
import Pagin from "@components/Pagin";
import { AiTwotoneEdit } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

async function Table({ page }: { page: number }) {
  const res = await fetch(`${process.env.URL}/api/admin/product?p=${page}`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  if (!res.ok) return <p className="text-red-500"> Error fetching data</p>;
  const t = await getTranslations("manageProducts");
  const { count, products } = await res.json();

  return (
    <div className="max-w-[73rem] mx-auto">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl font-bold text-center">
          {t("manageProducts")}
        </h1>
        <Pagin page={page} count={count} perpage={8} href="manageproducts" />
      </div>
      <table className="bg-white shadow-md rounded-lg w-full text-sm md:text-base">
        <thead>
          <tr className="border-b">
            <th className="p-4 font-semibold"></th>
            <th className="p-4 font-semibold text-center">{t("product")}</th>
            <th className="p-4 hidden md:table-cell font-semibold text-center">
              {t("brand")}
            </th>
            <th className="p-4 font-semibold text-center">{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {products.map(
            (product: {
              _id: string;
              title: string;
              brand: string;
              image: string;
              stock: number;
            }) => (
              <tr key={product._id} className="text-center border-t relative">
                <td>
                  <Image
                    src={`https://shopping-hamma.vercel.app/api/image/${product.image}`}
                    alt={product.title}
                    width={80}
                    height={80}
                    className="p-2 ml-4 md:ml-10 object-contain rounded-lg"
                  />
                </td>
                <td>
                  <div className="flex items-center justify-evenly gap-2">
                    <p className="text-center">{product.title}</p>
                  </div>
                </td>
                <td className="hidden md:table-cell">{product.brand}</td>
                <td>
                  <div className="flex justify-center items-center gap-3">
                    <Delete productId={product._id} />
                    <Link href={`/manageproducts/product?id=${product._id}`}>
                      <AiTwotoneEdit
                        className="border p-1 rounded-full cursor-pointer hover:bg-gray-200 duration-150"
                        size={25}
                      />
                    </Link>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
