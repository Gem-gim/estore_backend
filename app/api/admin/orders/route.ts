import { dbConnect } from "@/lib/dbConnect";
import Coupon from "@/models/Coupon";
import Order from "@/models/Order";

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const user = searchParams.get("user");

  if (user) {
    const data = await Order.find({ user })
      .populate("user")
      .populate({
        path: "couponApplied",
        model: Coupon,
        match: { couponApplied: { $exists: false } },
      })
      .lean();
    return Response.json({ data }, { status: 200 });
  }

  if (id) {
    const data = await Order.findById(id)
      .populate("user")
      .populate({ path: "couponApplied", model: Coupon })
      .lean();
  }

  const data = await Order.find()
    .populate("user")
    .populate({ path: "couponApplied", model: Coupon })
    .lean();

  return Response.json({ data }, { status: 200 });
}

export async function PUT(req: Request) {
  await dbConnect();

  try {
    const { id, status, shippingStatus } = await req.json();

    if (!id) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    const order = await Order.findByIdAndUpdate(id, {
      status,
      shippingStatus,
    });

    return Response.json(
      {
        message: "Order status updated!",
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
