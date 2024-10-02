import { dbConnect } from "@/lib/dbConnect";
import SubCategory from "@/models/SubCategory";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const subcategories = await SubCategory.find().lean();
    return NextResponse.json({ data: subcategories }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
