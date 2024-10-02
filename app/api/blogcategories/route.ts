import { dbConnect } from "@/lib/dbConnect";
import BlogCategory from "@/models/BlogCategory";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const blogcategories = await BlogCategory.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ data: blogcategories }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
