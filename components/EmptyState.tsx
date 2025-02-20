import empty from "@public/undraw_empty.svg";
import Image from "next/image";

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-4 items-center py-4">
      <Image
        height={400}
        width={400}
        src={empty.src}
        alt="empty"
        className="w-1/2"
      />
      <p className="text-gray-700 font-semibold">{label}</p>
    </div>
  );
}

export default EmptyState;
