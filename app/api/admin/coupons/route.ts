import { dbConnect } from "@/lib/dbConnect";
import Coupon from "@/models/Coupon";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ data: coupons }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  const body = await req.json();
  const { coupon, startDate, endDate, discount, status } = body;
  try {
    // check duplicate
    const check = await Coupon.findOne({ coupon });
    if (check) {
      return Response.json(
        { message: "This already exist, change the code" },
        { status: 200 }
      );
    }

    // Save to db
    const data = await new Coupon({
      coupon,
      startDate,
      endDate,
      discount,
      status,
    }).save();

    return NextResponse.json(
      { data, message: "New Promo code created" },
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
    // check duplicate
    const check = await Coupon.findOne({
      $and: [
        {
          $or: [{ coupon: body.coupon }],
        },
        {
          _id: { $ne: body._id },
        },
      ],
    });

    if (!check) {
      const coupon = await Coupon.findByIdAndUpdate(body._id, body);

      return NextResponse.json(
        { coupon: coupon, message: "coupon update" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "this coupon already exist change values" },
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
    await Coupon.findByIdAndDelete(body.id);

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
