import { dbConnect } from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import Coupon from "@/models/Coupon";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const dates = Date.now();

    const data = await Coupon.findOne({
      status: "available",
      endDate: { $gte: dates },
    }).lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { coupon, user } = await req.json();

    if (!coupon || !user) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    let dates = Date.now();
    const couponCheck = await Coupon.findOne({
      coupon: coupon,
      status: "available",
      endDate: { $gte: dates },
    });

    if (couponCheck === null) {
      return Response.json(
        {
          message: " this coupon code is expired ",
          data: couponCheck,
        },
        { status: 200 }
      );
    }

    const cart = await Cart.findOne({ user: user }).sort({ createdAt: -1 });

    let totalAfterDiscount =
      cart?.cartTotal! - (cart?.cartTotal! * couponCheck.discount) / 100;

    await Cart.findOneAndUpdate({ user: user }, { totalAfterDiscount });

    return Response.json(
      {
        message: "Coupon applied!",
        totalAfterDiscount,
        coupon: couponCheck,
        discount: couponCheck.discount,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
