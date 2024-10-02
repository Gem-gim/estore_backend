import { dbConnect } from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET() {
  await dbConnect();

  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "postBy",
        model: User,
        select: { _id: 1, name: 1 },
      })
      .lean();

    return NextResponse.json({ data: blogs }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
