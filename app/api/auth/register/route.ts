import Member from "@models/member";
import { connectToDatabase } from "@utils/database";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const { phoneNumber, password, name } = await req.json();
    const user = await Member.findOne({ phoneNumber }).select("verified");

    if (user)
      return new Response(
        JSON.stringify({ err: "Phone Number already registered" }),
        {
          status: 400,
        }
      );

    const firstLetter = name[0].toUpperCase();
    const defaultImage = `https://dummyimage.com/100x100/000/fff&text=${firstLetter}`;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await Member.create({
      phoneNumber,
      password: hashedPassword,
      name,
      image: defaultImage,
    });

    if (!newUser) {
      return new Response(JSON.stringify({ err: "Could not create user" }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ userId: newUser._id }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ err }), {
      status: 500,
    });
  }
};
