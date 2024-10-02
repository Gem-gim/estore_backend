import { dbConnect } from "@/lib/dbConnect";
import Coupon from "@/models/Coupon";
import Order from "@/models/Order";
import User from "@/models/User";
import { createClerkClient } from "@clerk/backend";

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const user = searchParams.get("user");

  if (user) {
    const data = await Order.find({ user })
      // .populate("user")
      // .populate({
      //   path: "couponApplied",
      //   model: Coupon,
      //   match: { couponApplied: { $exists: false } },
      // })
      .lean();
    return Response.json({ data }, { status: 200 });
  }

  const data = await Order.findById(id)
    // .populate("user")
    .populate({ path: "couponApplied", model: Coupon })
    .lean();

  return Response.json({ data }, { status: 200 });
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const {
      products,
      shippingAddress,
      paymentMethod,
      total,
      user,
      totalBeforeDiscount,
      couponApplied,
      shippingTimes,
      shippingStatus,
      shippingPrice,
    } = await req.json();

    if (
      !products ||
      !shippingAddress ||
      !paymentMethod ||
      !total ||
      !user ||
      !shippingStatus ||
      !shippingTimes
    ) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    //Mongo db
    // const checkUser = await User.findById(user);

    //clerck
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    const checkUser = await clerkClient.users.getUser(user);

    if (!checkUser) {
      return Response.json({ message: "User not found" }, { status: 500 });
    }

    const newOrder = await new Order({
      user: user,
      products,
      shippingAddress,
      paymentMethod,
      total,
      totalBeforeDiscount,
      couponApplied,
      shippingTimes,
      shippingStatus,
      shippingPrice,
    }).save();

    if (newOrder) {
      if (couponApplied) {
        await Coupon.findByIdAndUpdate(couponApplied, {
          status: "used",
        });
      }
    }

    return Response.json(
      {
        message: "Order created!",
        order_id: newOrder._id,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();

  try {
    const { id, status, shippingStatus } = await req.json();

    if (!id) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    const order = await Order.findById(id);

    if (status === "completed") {
      //check if order already is delivered
      if (order?.shippingStatus === "delivered") {
        await Order.findByIdAndUpdate(id, {
          status,
          shippingStatus,
        });
        return Response.json(
          {
            message: "Order completed!.",
            success: true,
          },
          { status: 200 }
        );
      } else {
        return Response.json(
          {
            message: "Products are not delivered yet!.",
            success: false,
          },
          { status: 200 }
        );
      }
    }

    // if shippingStatus is delivered
    if (order?.paymentMethod === "cash_on_delivery" && !order?.isPaid) {
      await Order.findByIdAndUpdate(id, {
        status,
        shippingStatus,
        isPaid: true,
      });

      return Response.json(
        {
          message: "You just confirmed delivery.",
          success: true,
        },
        { status: 200 }
      );
    }

    if (order?.paymentMethod === "credit_card") {
      //if order not paid no delivery
      if (order?.isPaid === false) {
        return Response.json(
          {
            message: "Order is not paid yet.",
            success: false,
          },
          { status: 200 }
        );
      }

      //if is paid
      await Order.findByIdAndUpdate(id, {
        status,
        shippingStatus,
        isPaid: true,
      });

      return Response.json(
        {
          message: "You just confirmed delivery.",
          success: true,
        },
        { status: 200 }
      );
    }

    await Order.findByIdAndUpdate(id, {
      status,
      shippingStatus,
    });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
