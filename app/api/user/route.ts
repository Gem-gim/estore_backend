import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");
  const email = searchParams.get("email");

  try {
    if (user_id) {
      const data = await User.findById(user_id).lean();
      return Response.json({ data, message: "get success" }, { status: 200 });
    }

    if (email) {
      const data = await User.findOne({ email }).lean();
      return Response.json({ data }, { status: 200 });
    }

    const data = await User.findById(user_id).lean();
    return Response.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
