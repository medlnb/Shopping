"use client";
import LoadImageClient from "@components/LoadImageClient";
import { useState } from "react";

function Images({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  return (
    <div>
      <LoadImageClient
        Url={selectedImage}
        Css="p-8 h-96 w-full object-contain bg-gray-100 rounded-lg"
      />
      <div className="flex gap-2 mt-2 overflow-auto styles-scrollbar pb-2">
        {images.map((img) => (
          <div key={img} onClick={() => setSelectedImage(img)}>
            <LoadImageClient
              Url={img}
              Css={`md:h-20 md:min-w-24 h-12 min-w-16 rounded-md object-contain cursor-pointer ${
                img === selectedImage
                  ? "border-2 border-blue-500"
                  : "hover:border-blue-200"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Images;
