import { dbConnect } from "@/lib/dbConnect";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import SubCategory from "@/models/SubCategory";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const filter = searchParams.get("filter");
    const id = searchParams.get("id");

    if (id) {
      const data = await Category.findById(id);
      return Response.json({ data }, { status: 200 });
    }
    if (filter === "topsalescategories") {
      const orders = await Order.find().lean();

      let products = [];
      for (let index = 0; index < orders.length; index++) {
        const order = orders[index];

        for (let index = 0; index < order["products"].length; index++) {
          const product = order["products"][index];
          products.push(product.product);
        }
      }

      const products_ = await Product.find().lean();
      const categories = await Category.find().lean();

      for (let index = 0; index < products_.length; index++) {
        const element = products_[index];

        const idProduct = products.filter(
          (item) => item.toString() == element._id.toString()
        );
        const sales = idProduct.length;
        products_[index]["sales"] = sales;
      }

      for (let index = 0; index < categories.length; index++) {
        const element = categories[index];
        const sales = products_
          .filter((item) => item.category.toString() == element._id.toString())
          .reduce((total: any, valeur: any) => total + valeur.sales, 0);

        element["sales"] = sales;
      }
      const sortedcategories = categories
        .sort((a, b) => {
          return b?.sales! - a?.sales!;
        })
        .slice(0, 4);
      return Response.json({ data: sortedcategories }, { status: 200 });
    }

    if (slug) {
      const data = await Category.findOne({ slug });
      return Response.json({ data }, { status: 200 });
    }

    const categories = await Category.find()
      .populate({
        path: "submenu",
        model: SubCategory,
        select: { _id: 1, name: 1, link: 1 },
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ data: categories }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
