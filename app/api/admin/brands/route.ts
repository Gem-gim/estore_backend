import { dbConnect } from "@/lib/dbConnect";
import { slugString } from "@/lib/utils";
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

export async function POST(req: Request) {
  await dbConnect();

  const body = await req.json();
  let { slug, name, link, image } = body;
  try {
    // check duplicate
    const check = await Brand.findOne({
      $or: [{ name: name }, { slug: slug }, { link: link }],
    });
    if (check) {
      return Response.json(
        { message: "This brand already exist. change the name" },
        { status: 200 }
      );
    }

    //set slug if null check
    let slugCat = slugString(name);
    if (slug === "") {
      slug = slugCat;
    }

    if (link === "") {
      link = slugCat;
    }

    // Save to db
    await new Brand({ name, slug, link, image }).save();

    return NextResponse.json({ message: "brand created!" }, { status: 200 });
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
    const check = await Brand.findOne({
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
      const brand = await Brand.findByIdAndUpdate(_id, body);

      return NextResponse.json(
        { brand: brand, message: "brand update" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "this brand already exist change values" },
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
    await Brand.findByIdAndDelete(body.id);

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
