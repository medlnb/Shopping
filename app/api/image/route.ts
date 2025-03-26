import { connectToDatabase } from "@utils/database";
import { NextRequest } from "next/server";
import Image from "@models/image";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    // Get the form data from the request
    const formData = await req.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile)
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
      });

    // Read the file data
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imageDb = await Image.create({
      image: buffer,
      mimeType: imageFile.type,
    });
    return new Response(JSON.stringify({ imageId: imageDb._id }), {
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), { status: 501 });
  }
};
