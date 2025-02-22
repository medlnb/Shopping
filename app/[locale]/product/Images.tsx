"use client";
import Image from "next/image";
import { useState } from "react";

function Images({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  return (
    <div>
      <Image
        alt="product image"
        width={400}
        height={400}
        src={`https://shopping-hamma.vercel.app/api/image/${selectedImage}`}
        className="p-8 h-96 w-full object-contain loading--background rounded-lg"
        onLoad={(e) => {
          const image = e.target as HTMLImageElement;
          image.classList.remove("loading--background");
        }}
      />
      <div className="flex gap-2 mt-2 overflow-auto styles-scrollbar py-2">
        {images.map((img) => (
          <div key={img} onClick={() => setSelectedImage(img)}>
            <Image
              alt="product image"
              height={100}
              width={100}
              src={`https://shopping-hamma.vercel.app/api/image/${img}`}
              className={`md:h-20 md:min-w-24 h-16 min-w-16 rounded-md object-contain cursor-pointer border-2  ${
                img === selectedImage
                  ? "border-blue-light"
                  : "hover:border-blue-light-4"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Images;
