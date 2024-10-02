import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { userSchema } from "@/types";
import bcrypt from "bcrypt";

export async function PUT(req: Request) {
  await dbConnect();

  try {
    const { id, name, email, password, confirm_password, image } =
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
