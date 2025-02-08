import { verifySignature } from "@chargily/chargily-pay";
import Course from "@models/course";
import Member from "@models/member";
import { Schema } from "mongoose";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const headersList = headers();
  const signature = headersList.get("signature");
  if (!signature) {
    return new Response(JSON.stringify({ message: "no signature" }), {
      status: 400,
    });
  }
  const rawBody = await req.text();
  try {
    const buffer = Buffer.from(rawBody, "utf8");
    if (!verifySignature(buffer, signature, process.env.CHARGILY_SECRET_KEY!)) {
      console.log("Signature is invalid");
      return new Response(
        JSON.stringify({
          message: "Signature is invalid",
        }),
        {
          status: 405,
        }
      );
    }
  } catch (error) {
    console.log(
      "Something happened while trying to process the request to the webhook"
    );
    return new Response(
      JSON.stringify({
        message:
          "Something happened while trying to process the request to the webhook",
      }),
      {
        status: 405,
      }
    );
  }

  const payload = JSON.parse(rawBody);

  if (payload.data.status === "paid") {
    const { courseId, userId } = payload.data.metadata;
    const today = new Date();
    const deadLine = new Date(today).setDate(today.getDate() + 31);

    const user = await Member.findById(userId);
    const SelectedCourse = user.courses.find(
      (course: { courseId: Schema.Types.ObjectId }) =>
        course.courseId.toString() === courseId
    );
    SelectedCourse.deadLine = deadLine;

    const course = await Course.findById(courseId).select("students");

    const SelectedCourseInCourse = course.students.find(
      (course: { studetnID: Schema.Types.ObjectId }) =>
        course.studetnID.toString() === userId.toString()
    );

    if (SelectedCourseInCourse) SelectedCourseInCourse.deadLine = deadLine;
    else course.students.push({ studetnID: userId, deadLine });

    await user.save();
    await course.save();
  }
  return new Response(
    JSON.stringify({ message: "Webhook processed successfully" }),
    {
      status: 200,
    }
  );
};
