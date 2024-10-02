import { dbConnect } from "@/lib/dbConnect";
import BlogCategory from "@/models/BlogCategory";
import { IBlogCategory } from "@/types";
import { NextResponse } from "next/server";
import { slugString } from "@/lib/utils";

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

export async function POST(req: Request) {
  await dbConnect();

  const body = (await req.json()) as Pick<
    IBlogCategory,
    "link" | "name" | "slug"
  >;
  let { slug, name, link } = body;
  try {
    // check duplicate
    const categoryCheck = await BlogCategory.findOne({ slug });
    if (categoryCheck) {
      return Response.json(
        { message: "This categoryBlog already exist. change the name" },
        { status: 200 }
      );
    }

    //set slug if null
    let slugCat = slugString(name);
    if (slug === "") {
      slug = slugCat;
    }

    if (link === "") {
      link = "/blog/categories/" + slugCat + "/posts";
    }

    // Save to db
    const categoryBlog = await new BlogCategory({ name, slug, link }).save();

    return NextResponse.json({ data: categoryBlog }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
