import bcrypt from "bcrypt";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { userSchema } from "@/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");

  try {
    if (user_id) {
      const data = await User.findById(user_id).lean();
      return Response.json({ data }, { status: 200 });
    }

    const data = await User.find().lean();
    return Response.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    let { email, name, password, role, image } = body;

    if (!email || !name || !password) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    if (image === "") {
      image = "https://cdn-icons-png.flaticon.com/128/4322/4322991.png";
    }

    if (role === "") {
      role = "user";
    }

    // check validation
    const validatedFields = userSchema.safeParse({
      name: name,
      email: email,
      password: password,
    });
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 500 }
      );
    }

    const findUser = await User.findOne({ email });
    if (findUser) {
      return Response.json({ message: "this email is taken" }, { status: 500 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      image,
      role,
    });
    const addedUser = await newUser.save();

    // const activation_token = createActivationToken({
    //   id: addedUser._id.toString(),
    // })
    // const url = `${process.env.BASE_URL}/activate/${activation_token}`

    return Response.json(
      { addedUser, message: "Registered successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();

  try {
    const { id, name, email, password, confirm_password, image, role } =
      await req.json();

    if (!id || !name || !email || !password || !confirm_password) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    const validatedFields = userSchema.safeParse({
      name: name,
      email: email,
      password: password,
    });
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.findByIdAndUpdate(id, {
      name,
      email,
      password: hashedPassword,
      image,
      role,
    });

    return Response.json(
      {
        message: "User updated!",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  const body = await req.json();
  try {
    const user = await User.findById(body._id);
    if (user?.role === "admin") {
      return NextResponse.json(
        { message: "Admin can not be deleted" },
        { status: 200 }
      );
    }
    await User.findByIdAndDelete(body._id);

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
