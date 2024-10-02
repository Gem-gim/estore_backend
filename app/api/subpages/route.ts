import { dbConnect } from "@/lib/dbConnect";
import SubPage from "@/models/SubPage";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const subpages = await SubPage.find().lean();

    return NextResponse.json({ data: subpages }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
