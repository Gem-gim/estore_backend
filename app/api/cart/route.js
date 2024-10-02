import Product from "@/models/Product";
import { dbConnect } from "@/lib/dbConnect";
import { discountPrice } from "@/lib/utils";
import Cart from "@/models/Cart";
import { createClerkClient } from "@clerk/backend";

export async function GET(request) {
  dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const style = Number(searchParams.get("style"));
  const option = Number(searchParams.get("option"));
  const user_id = searchParams.get("user_id");

  try {
    if (user_id) {
      const data = await Cart.findOne({ user: user_id })
        .sort({ createdAt: -1 })
        .lean();
      return Response.json({ data }, { status: 200 });
    }

    if (style >= 0 && option >= 0 && id !== "") {
      const product = await Product.findById(id).lean();
      let priceBefore = product?.subProducts[style].options[option].price;
      let discount = product?.subProducts[style].options[option].discount;
      let price = discount ? discountPrice(priceBefore, discount) : priceBefore;

      return Response.json(
        {
          _id: product?._id,
          name: product?.name,
          description: product?.description,
          optionBefore: option,
          option: product?.subProducts[style].options[option].option,
          slug: product?.slug,
          sku: product?.subProducts[style].sku,
          brand: product?.brand,
          images: product?.subProducts[style].options[option].images,
          styleBefore: style,
          style: product?.subProducts[style].style,
          price,
          priceBefore,
          stock: product?.subProducts[style].options[option].qty,
        },
        { status: 200 }
      );
    } else {
      return Response.json({ message: "fill data" }, { status: 200 });
    }
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function POST(req) {
  const { cart, user_id } = await req.json();

  if (!cart || !user_id) {
    return Response.json({ message: "missing info" }, { status: 500 });
  }

  let products = [];

  //clerck
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });
  const user = await clerkClient.users.getUser(user_id);

  // let user = await User.findOne({ email: user_id });

  let cartTotal = 0;

  for (let i = 0; i < cart.length; i++) {
    const element = cart[i];
    let dbProduct = await Product.findById(element._id).lean(); // get product
    let subProduct = dbProduct?.subProducts[element.styleBefore]; //get a variation of a product

    let tempProduct = {};

    // let price = subProduct?.options?.find(
    //   (p: Options) => p.option === element.option
    // );

    tempProduct.product = element._id;
    tempProduct.name = element.name;
    tempProduct.images = element.images[0];
    tempProduct.option = element.option;
    tempProduct.style = {
      color: element.style.color,
      image: element.style.image,
      name: element.style.name,
    };
    tempProduct.qty = parseInt(element.qty);
    tempProduct.price = element.price;

    cartTotal = cartTotal + element.qty * element.price;
    products.push(tempProduct);
  }

  let addCart = await new Cart({
    products,
    cartTotal: cartTotal.toFixed(2),
    user: user?.id,
  }).save();

  return Response.json({ addCart, message: "Order created!" }, { status: 200 });
}

export async function PUT(req) {
  const { products } = await req.json();
  const size = 0;
  products.map(async (p) => {
    const dbProduct = await Product.findById(p._id).lean(); // get product

    const quantity = dbProduct.subProducts[p.style].sizes.find(
      (x) => x.size == p.size
    ).qty;
    const discount = dbProduct.subProducts[p.style].discount;
    const priceBefore = dbProduct.subProducts[p.style].sizes[size].price;
    return {
      priceBefore: priceBefore,
      // price: discount > 0 ? originalPrice / discount : originalPrice,
      discount: discount,
      quantity: quantity,
      shippingFee: dbProduct.shipping,
    };
  });

  const data = await Promise.all(promises);

  return NextResponse.json(data);
}
