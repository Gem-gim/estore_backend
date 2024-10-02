import { dbConnect } from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { IBlog } from "@/types";
import { NextResponse } from "next/server";
import { slugString } from "@/lib/utils";
import User from "@/models/User";

export async function GET() {
  await dbConnect();

  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "postBy",
        model: User,
        select: { _id: 1, name: 1 },
      })
      .lean();

    return NextResponse.json({ data: blogs }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  const body = (await req.json()) as IBlog;
  let { slug, name, link, content, postBy, category, image } = body;
  try {
    // check duplicate
    const blogCheck = await Blog.findOne({ slug });
    if (blogCheck) {
      return Response.json(
        { message: "This Blog already exist. change the name" },
        { status: 200 }
      );
    }

    //set slug if null
    let slugCat = slugString(name);
    if (slug === "") {
      slug = slugCat;
    }

    if (link === "") {
      link = "/blog/posts/" + slugCat;
    }

    // Save to db
    const blog = await new Blog({
      name,
      slug,
      link,
      content,
      postBy,
      category,
      image,
    }).save();

    return NextResponse.json({ data: blog }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
