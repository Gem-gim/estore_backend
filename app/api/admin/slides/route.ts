import { dbConnect } from "@/lib/dbConnect";
import Slide from "@/models/Slide";
import { ISlide } from "@/types";

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

export async function POST(req: Request) {
  await dbConnect();

  const body = (await req.json()) as ISlide;
  try {
    // Save to db
    const slide = await new Slide(body).save();

    return NextResponse.json(
      { slide: slide, message: "New slide added" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();

  const body = await req.json();
  try {
    await Slide.findByIdAndUpdate(body._id, body);

    return NextResponse.json({ message: "Slide updated!" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();

  try {
    const { id } = await req.json();

    if (!id) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    await Slide.findByIdAndDelete(id);

    return Response.json(
      {
        message: "delete succesfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
