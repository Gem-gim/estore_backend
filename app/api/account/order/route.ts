import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function PUT(req: Request) {
  await dbConnect();

  try {
    const { id, user } = await req.json();

    if (!id || !user) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    const order = await Order.findByIdAndUpdate(id, {
      status: "cancelled",
    });

    return Response.json(
      {
        message: "Order cancelled!",
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
