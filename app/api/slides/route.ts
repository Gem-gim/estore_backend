import { dbConnect } from "@/lib/dbConnect";
import Slide from "@/models/Slide";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const slides = await Slide.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ data: slides }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
