import { dbConnect } from "@/lib/dbConnect";
import Page from "@/models/Page";
import { IPage } from "@/types";
import { NextResponse } from "next/server";
import { slugString } from "@/lib/utils";
import SubPage from "@/models/SubPage";

export async function GET() {
  await dbConnect();

  try {
    const pages = await Page.find()
      .populate({
        path: "subpage",
        model: SubPage,
        select: { _id: 1, name: 1, link: 1 },
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ data: pages }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

