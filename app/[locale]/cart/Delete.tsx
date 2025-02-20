import { Dispatch, SetStateAction, useState } from "react";
import { FiTrash } from "react-icons/fi";
import { MoonLoader } from "react-spinners";

interface Cart {
  _id: string;
  product: {
    _id: string;
    title: string;
    images: string[];
    variances: {
      _id: string;
      quantity: number;
      unit: string;
      info?: string;
    }[];
  };
  price: number;
  varianceId: string;
  quantity: number;
}

const Delete = ({
  setCart,
  productId,
  varianceId,
}: {
  setCart: Dispatch<SetStateAction<Cart[] | undefined>> | undefined;
  productId: string;
  varianceId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const removeProduct = async () => {
    if (!setCart) return;
    setLoading(true);
    const res = await fetch(`/api/cart`, {
      method: "DELETE",
      body: JSON.stringify({ productId, varianceId }),
    });
    setLoading(false);
    if (!res.ok) return;
    setCart((prev) =>
      prev!.filter(
        (product) =>
          !(
            product.product._id === productId &&
            product.varianceId === varianceId
          )
      )
    );
  };

  return (
    <div className="flex justify-center">
      {loading ? (
        <MoonLoader size={15} color="black" />
      ) : (
        <FiTrash
          className="border mx-auto cursor-pointer p-0.5 md:p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 duration-150 text-lg md:text-3xl"
          onClick={removeProduct}
        />
      )}
    </div>
  );
};

export default Delete;
