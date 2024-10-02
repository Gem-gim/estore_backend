import bcrypt from "bcrypt";
import { dbConnect } from "@/lib/dbConnect";
import { userSchema } from "@/types";
import User from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return Response.json({ message: "missing info" }, { status: 500 });
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
    const newUser = new User({ name, email, password: hashedPassword });
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
