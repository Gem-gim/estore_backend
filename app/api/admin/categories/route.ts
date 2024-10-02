import { dbConnect } from "@/lib/dbConnect";
import Category from "@/models/Category";
import { ICategory } from "@/types";
import { NextResponse } from "next/server";
import { slugString } from "@/lib/utils";
import SubCategory from "@/models/SubCategory";

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");

    if (id) {
      const data = await Category.findById(id);
      return Response.json({ data }, { status: 200 });
    }

    if (slug) {
      const data = await Category.findOne({ slug });
      return Response.json({ data }, { status: 200 });
    }

    const categories = await Category.find()
      .populate({
        path: "submenu",
        model: SubCategory,
        select: { _id: 1, name: 1, link: 1 },
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ data: categories }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  const body = await req.json();
  let { slug, name, link, image } = body;
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
    const pageCheck = await Category.findOne({
      $or: [{ name: name }, { slug: slug }, { link: link }],
    });
    if (pageCheck) {
      return Response.json(
        { message: "This category already exist. change the name or the url" },
        { status: 200 }
      );
    }

    // Save to db
    const category = await new Category({ name, slug, link, image }).save();

    return NextResponse.json(
      { category: category, message: "New category created" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();

  const body = await req.json();
  let { _id, slug, name, link, image } = body;
  try {
    //set slug if null
    let slugCat = slugString(name);
    if (slug === "") {
      slug = slugCat;
    }

    // check duplicate
    const check = await Category.findOne({
      $and: [
        {
          $or: [{ name: name }, { slug: slug }, { link: link }],
        },
        {
          _id: { $ne: _id },
        },
      ],
    });

    if (!check) {
      const category = await Category.findByIdAndUpdate(_id, body);

      return NextResponse.json(
        { category: category, message: "category update" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "this category already exist change values" },
        { status: 200 }
      );
    }
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();

  const body = await req.json();
  try {
    await Category.findByIdAndDelete(body.id);

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
