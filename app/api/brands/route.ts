import { dbConnect } from "@/lib/dbConnect";
import Brand from "@/models/Brand";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const brands = await Brand.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ data: brands }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
