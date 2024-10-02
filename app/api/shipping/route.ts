import { dbConnect } from "@/lib/dbConnect";
import Shipping from "@/models/Shipping";
import Address from "@/models/Shipping";
import { createClerkClient } from "@clerk/backend";
import { NextResponse } from "next/server";

/** Next auth config ---------------------------------------------------------*/
// import User from "@/models/User";
// export async function POST(req: Request) {
//   await dbConnect();
//   try {
//     const { shipping, user_id } = await req.json();

//     if (!shipping || !user_id) {
//       return Response.json({ message: "missing info" }, { status: 500 });
//     }

//     const user = await User.findById(user_id);
//     if (!user) {
//       return Response.json({ message: "user not found" }, { status: 500 });
//     }

//     await user.updateOne({
//       $push: {
//         address: shipping,
//       },
//     });

//     return Response.json(
//       { shipping, message: "new address added" },
//       { status: 200 }
//     );
//   } catch (error) {
//     return Response.json({ error }, { status: 500 });
//   }
// }/** Next auth config ---------------------------------------------------------*/

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");

  try {
    if (user_id) {
      const data = await Shipping.findOne({ user: user_id }).lean();
      return Response.json({ data }, { status: 200 });
    }
    return Response.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { shipping, user_id } = await req.json();

    if (!shipping || !user_id) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    //clerck
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    const user = await clerkClient.users.getUser(user_id);

    if (!user) {
      return Response.json({ message: "user not found" }, { status: 500 });
    }

    //check if address exist
    const exist = await Address.findOne({ user: user.id });

    if (exist) {
      // update
      await exist.updateOne({
        $push: {
          address: shipping,
        },
      });
    } else {
      // create new
      const newAddress = new Address({
        user: user.id,
        address: [shipping],
      });

      await newAddress.save();
    }

    return Response.json(
      { data: shipping, message: "new address added" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
