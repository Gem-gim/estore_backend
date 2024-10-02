import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  await dbConnect();

  try {
    let intent;

    const { amount, payment_method_id, order_id } = await req.json();

    if (!amount || !order_id || !payment_method_id) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      payment_method: payment_method_id,
      description: "Fractal Store - Order payment",
    });

    intent = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: payment_method_id,
      return_url: process.env.NEXT_PUBLIC_SERVER_URL,
    });

    const order = await Order.findById(order_id);

    if (!order) {
      return Response.json({ message: "order not found" }, { status: 500 });
    }

    order.isPaid = true;
    order.paidAt = new Date(Date.now());
    order.paymentResult = {
      id: intent.id,
      status: intent.status,
      email_address: intent.email_address,
    };

    await order.save();

    return Response.json(
      {
        message: "Your payment has been done! Wait to be delivered!",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
