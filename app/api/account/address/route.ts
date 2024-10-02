import { dbConnect } from "@/lib/dbConnect";
import Shipping from "@/models/Shipping";
import User from "@/models/User";

export async function PUT(req: Request) {
  await dbConnect();

  try {
    const { user_id, newAddress } = await req.json();

    if (!user_id || !newAddress) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    const updateAddress = {
      _id: newAddress._id,
    };

    await User.findByIdAndUpdate(user_id, {
      $pull: { address: updateAddress },
    });

    await User.findByIdAndUpdate(user_id, {
      $push: { address: newAddress },
    });

    return Response.json(
      {
        message: "saved succesfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();

  try {
    const { user_id, newAddress } = await req.json();

    if (!user_id || !newAddress) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    const updateAddress = {
      _id: newAddress._id,
    };

    await Shipping.findOneAndUpdate(
      { user: user_id },
      {
        $pull: { address: updateAddress },
      }
    );

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
