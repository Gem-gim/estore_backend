import { dbConnect } from "@/lib/dbConnect";
import Brand from "@/models/Brand";
import Category from "@/models/Category";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Review from "@/models/Review";
import SubCategory from "@/models/SubCategory";
import User from "@/models/User";
import { createClerkClient } from "@clerk/backend";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");
    const related = searchParams.get("related");
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const bestsellers = searchParams.get("bestsellers");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const id = searchParams.get("id");

    let CategoryOrSubId;
    //clerck
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (id) {
      const data = await Product.findOne({ _id: id })
        .populate({ path: "category", model: Category })
        .populate({ path: "brand", model: Brand })
        .populate({ path: "subCategories", model: SubCategory })
        .populate({
          path: "reviews",
          model: Review,
          populate: {
            path: "reviewBy",
            model: User,
          },
        })
        .lean();

      return Response.json({ data }, { status: 200 });
    }

    if (related) {
      const data = await Product.find({ category: related })
        .populate({ path: "category", model: Category })
        .populate({ path: "brand", model: Brand })
        .populate({ path: "subCategories", model: SubCategory })
        .populate({
          path: "reviews",
          model: Review,
          populate: {
            path: "reviewBy",
            model: User,
          },
        })
        .lean();

      return Response.json({ data }, { status: 200 });
    }

    if (search) {
      const products = await Product.find({
        name: { $regex: ".*" + search, $options: "is" },
      })
        .limit(10)
        .lean();

      return Response.json({ data: products }, { status: 200 });
    }

    if (featured === "yes") {
      const data = await Product.find({
        featured: true,
      })
        .limit(10)
        .lean();

      return Response.json({ data }, { status: 200 });
    }

    if (bestsellers === "yes") {
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

      for (let index = 0; index < products_.length; index++) {
        const element = products_[index];

        const idProduct = products.filter(
          (item) => item.toString() == element._id.toString()
        );

        const sales = idProduct.length;

        products_[index]["sales"] = sales;
      }
      const sortedPro = products_
        .sort((a, b) => {
          return b?.sales! - a?.sales!;
        })
        .slice(0, 10);
      return Response.json({ data: sortedPro, pro: products }, { status: 200 });
    }

    if (slug) {
      const data = await Product.findOne({ slug })
        .populate({
          path: "reviews",
          model: Review,
          populate: {
            path: "reviewBy",
            // model: User,
          },
        })
        .populate({ path: "category", model: Category })

        .populate({ path: "subCategories", model: SubCategory });

      // const user = await clerkClient.users.getUser(user_id);
      return Response.json({ data }, { status: 200 });
    }

    if (category) {
      const categoryId = await Category.findOne({ slug: category }).lean();

      if (categoryId) {
        CategoryOrSubId = categoryId._id;
      } else {
        const SubcategoryId = await SubCategory.findOne({
          slug: category,
        }).lean();
        CategoryOrSubId = SubcategoryId?._id;
      }

      if (filter) {
        if (filter === "alphabetic") {
          const data = await Product.find({
            $or: [
              { category: CategoryOrSubId },
              { subCategories: { $in: [CategoryOrSubId] } },
            ],
          }).sort({ name: 1 }); // ascending
          // .limit(parseInt(limit));
          return Response.json({ data }, { status: 200 });
        }

        if (filter === "latest") {
          const data = await Product.find({
            $or: [
              { category: CategoryOrSubId },
              { subCategories: { $in: [CategoryOrSubId] } },
            ],
            "subProducts.options.price": { $gte: minPrice, $lte: maxPrice },
          }).sort({ createdAt: -1 }); // descending
          // .limit(parseInt(limit));
          return Response.json({ data }, { status: 200 });
        }

        if (filter === "priceHighToLow") {
          const data = await Product.find({
            $or: [
              { category: CategoryOrSubId },
              { subCategories: { $in: [CategoryOrSubId] } },
            ],
          }).sort({
            "subProducts.options.price": -1,
          }); // descending
          // .limit(parseInt(limit));
          return Response.json({ data }, { status: 200 });
        }

        if (filter === "priceLowToHigh") {
          const data = await Product.find({
            $or: [
              { category: CategoryOrSubId },
              { subCategories: { $in: [CategoryOrSubId] } },
            ],
          }).sort({
            "subProducts.options.price": 1,
          }); // descending
          // .limit(parseInt(limit));
          return Response.json({ data }, { status: 200 });
        }
      }
    } else {
      if (filter) {
        if (filter === "alphabetic") {
          const data = await Product.find({
            "subProducts.options.price": { $gte: minPrice, $lte: maxPrice },
          }).sort({ name: 1 }); // ascending
          // .limit(parseInt(limit));
          return Response.json({ data }, { status: 200 });
        }

        if (filter === "latest") {
          const data = await Product.find({
            "subProducts.options.price": { $gte: minPrice, $lte: maxPrice },
          }).sort({ createdAt: -1 }); // descending
          // .limit(parseInt(limit));
          return Response.json({ data }, { status: 200 });
        }

        if (filter === "priceHighToLow") {
          const data = await Product.find({
            "subProducts.options.price": { $gte: minPrice, $lte: maxPrice },
          }).sort({
            "subProducts.options.price": -1,
          }); // descending
          // .limit(parseInt(limit));
          return Response.json({ data }, { status: 200 });
        }

        if (filter === "priceLowToHigh") {
          const data = await Product.find({
            "subProducts.options.price": { $gte: minPrice, $lte: maxPrice },
          }).sort({
            "subProducts.options.price": 1,
          }); // descending
          // .limit(parseInt(limit));
          return Response.json({ data }, { status: 200 });
        }
      }

      const Products = await Product.find({
        "subProducts.style": { $ne: null },
      })
        .populate({
          path: "category",
          model: Category,
        })
        .populate({
          path: "reviews",
          model: Review,
        })
        .populate({
          path: "subCategories",
          model: Category,
        })
        .populate({
          path: "brand",
          model: Brand,
        })
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({ data: Products }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
