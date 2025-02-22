import Image, { StaticImageData } from "next/image";
import Link from "next/link";

const SingleItem = ({
  img,
  aisle,
}: {
  img: StaticImageData;
  aisle: string;
}) => {
  return (
    <Link
      href={`/products?category=${aisle}`}
      className="group flex flex-col items-center"
    >
      <div className="max-w-[130px] w-full bg-[#F2F3F8] h-32.5 rounded-full flex items-center justify-center mb-4">
        <Image src={img} alt="Category" width={82} height={62} />
      </div>

      <div className="flex justify-center">
        <h3 className="inline-block font-medium text-center text-dark bg-gradient-to-r from-blue to-blue bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-blue">
          {aisle}
        </h3>
      </div>
    </Link>
  );
};

export default SingleItem;
