import { dbConnect } from "@/lib/dbConnect";
import SubPage from "@/models/SubPage";
import { ISubPage } from "@/types";
import { NextResponse } from "next/server";
import { slugString } from "@/lib/utils";

export async function GET() {
  await dbConnect();

  try {
    const subpages = await SubPage.find().lean();

    return NextResponse.json({ data: subpages }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  const body = (await req.json()) as Pick<
    ISubPage,
    "link" | "name" | "slug" | "parent"
  >;
  let { slug, name, link, parent } = body;
  try {
    // check duplicate
    const pageCheck = await SubPage.findOne({ slug });
    if (pageCheck) {
      return Response.json(
        { message: "This subpage already exist. change the name" },
        { status: 200 }
      );
    }

    //set slug if null
    let slugCat = slugString(name);
    if (slug === "") {
      slug = slugCat;
    }

    // Save to db
    const subpage = await new SubPage({ name, slug, link, parent }).save();

    return NextResponse.json({ data: subpage }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
