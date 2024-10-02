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

export async function POST(req: Request) {
  await dbConnect();

  const body = (await req.json()) as Pick<IPage, "link" | "name" | "slug">;
  let { slug, name, link } = body;
  try {
    if (!name || !link) {
      return Response.json({ message: "Missing info" }, { status: 200 });
    }
    //set slug if null
    let slugCat = slugString(name);
    if (slug === "") {
      slug = slugCat;
    }

    // check duplicate
    const pageCheck = await Page.findOne({
      $or: [{ name: name }, { slug: slug }, { link: link }],
    });
    if (pageCheck) {
      return Response.json(
        { message: "This page already exist. change the name or the url" },
        { status: 200 }
      );
    }

    // Save to db
    const page = await new Page({ name, slug, link }).save();

    return NextResponse.json({ page: page }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();

  const body = await req.json();
  try {

    const pageCheck = await Page.findOne({
      $or: [{ name: body.name }, { slug: body.slug }, { link: body.link }],
    }, { _id: body._id });

    await Page.findByIdAndUpdate(body._id, body);

    return NextResponse.json({ message: "Page updated!" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();

  // const body = await req.json();
  try {
    // await Page.findByIdAndDelete(body._id);

    return NextResponse.json(
      { message: "No way Project in production!" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
