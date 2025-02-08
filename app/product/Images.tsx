"use client";
import { useState } from "react";

function Images({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  return (
    <div>
      <img
        src={`/api/image/${selectedImage}`}
        className="p-8 h-96 w-full object-contain bg-gray-100 rounded-lg"
      />
      <div className="flex gap-2 mt-2 overflow-auto styles-scrollbar py-2">
        {images.map((img) => (
          <div key={img} onClick={() => setSelectedImage(img)}>
            <img
              src={`/api/image/${img}`}
              className={`md:h-20 md:min-w-24 h-16 min-w-16 rounded-md object-contain cursor-pointer ${
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
