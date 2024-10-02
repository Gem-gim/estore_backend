import { dbConnect } from "@/lib/dbConnect";
import Brand from "@/models/Brand";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Review from "@/models/Review";
import SubCategory from "@/models/SubCategory";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { getCategory } from "@/actions/subcategory";
import { slugString } from "@/lib/utils";
import Order from "@/models/Order";
import uuid from 'uuid-random';

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const bestsellers = searchParams.get("bestsellers");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const id = searchParams.get("id");

    let CategoryOrSubId;

    if (search) {
      const products = await Product.find({
        name: { $regex: search, $options: "i" },
      })
        .limit(10)
        .lean();

      return Response.json({ products }, { status: 200 });
    }

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
            model: User,
          },
        })
        .populate({ path: "category", model: Category })

        .populate({ path: "subCategories", model: SubCategory });

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

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { brand, description, name, subCategories } = await req.json();

    if (!brand || !description || !subCategories || !name) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    const response = await getCategory(subCategories[0]);
    const category = response;

    let slug = slugString(name);

    let data = await new Product({
      name,
      description,
      brand,
      slug,
      category,
      subCategories,
      details: [],
      questions: [],
      reviews: [],
      subProducts: [],
    }).save();

    return Response.json(
      {
        message: "Product created Success!",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();

  const body = await req.json();

  if (body.step === "basicinfo") {
    if (
      !body.brand ||
      !body.description ||
      !body.subCategories ||
      !body.name ||
      !body.id
    ) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    let category = await getCategory(body.subCategories[0]);

    let slug = slugString(body.name);

    await Product.findByIdAndUpdate(body.id, {
      name: body.name,
      description: body.description,
      brand: body.brand,
      slug: slug,
      category: category,
      subCategories: body.subCategories,
    });

    let data = await Product.findById(body.id);
    return Response.json({ message: "Succes", data }, { status: 200 });
  } else if (body.step === "variation") {
    const id = body.id;
    if (
      !body.sku ||
      body.options.length === 0 ||
      body.style.name === "" ||
      body.style.color === "" ||
      body.style.image === ""
    ) {
      return Response.json(
        { message: "missing info", data: body },
        { status: 500 }
      );
    }

    let updateProduct = {
      style: body.style,
      sku: body.sku,
      options: body.options,
    };

    await Product.findByIdAndUpdate(body.id, {
      $push: { subProducts: updateProduct },
    });

    let data = await Product.findById(body.id);

    return Response.json(
      { message: "Style added successfully", data },
      { status: 200 }
    );
  } else if (body.step === "additionnal") {
    if (!body.content || !body.details || !body.id) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    let featured = false;

    if (body.featured === "yes") {
      featured = true;
    }

    let updateProduct = {
      details: body.details,
      content: body.content,
      featured: featured,
    };

    await Product.findByIdAndUpdate(body.id, updateProduct);

    let data = await Product.findById(body.id);

    return Response.json({ message: "Succes", data }, { status: 200 });
  } else {
    return Response.json({ message: "Error" }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  await dbConnect();

  try {
    const { id } = await req.json();

    if (!id) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    await Product.findByIdAndDelete(id);

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
