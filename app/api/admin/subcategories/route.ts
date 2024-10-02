// @ts-nocheck
import { dbConnect } from "@/lib/dbConnect";
import SubCategory from "@/models/SubCategory";
import { slugString } from "@/lib/utils";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const subCategory = searchParams.get("subCategory");

    let subcategories = [];

    if (categoryId) {
      const data = await SubCategory.find({ parent: categoryId })
        .sort({
          _id: -1,
        })
        .select("name");
      return Response.json(
        {
          data,
        },
        { status: 200 }
      );
    }

    if (subCategory) {
      let category = await SubCategory.findById(subCategory).select("parent");
      const data = category?.parent;
      return Response.json({ data }, { status: 200 });
    }

    subcategories = await SubCategory.find()
      .sort({ _id: -1 })
      .populate({
        path: "parent",
        model: Category,
      })
      .lean();

    //redefinir le tableau pour l'affichage dans le datatable

    for (let index = 0; index < subcategories.length; index++) {
      subcategories[index]["parent"] = subcategories[index]["parent"].name;
    }

    return Response.json(
      {
        data: subcategories,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    let { name, slug, parent, link } = await req.json();

    if (!name || !parent || !link) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    //create slug if not provide
    let slugCat = slugString(name);
    if (slug === "") {
      slug = slugCat;
    }

    // check duplicate
    const subCategoryCheckParent = await SubCategory.findOne({
      name: name,
      parent: parent,
    });
    if (subCategoryCheckParent) {
      return Response.json(
        {
          message:
            "This sub category already exist for this Category. change the name",
        },
        { status: 200 }
      );
    }

    const checkValues = await SubCategory.findOne({
      $and: [
        {
          $or: [{ name: name }, { slug: slug }, { link: link }],
        },
      ],
    });
    if (checkValues) {
      return Response.json(
        { message: "This sub category already exist. change values" },
        { status: 200 }
      );
    }

    const newSubCategory = await new SubCategory({
      parent,
      name,
      slug,
      link,
    }).save();

    let newSubcate = {
      _id: newSubCategory._id,
    };

    await Category.findByIdAndUpdate(parent, {
      $push: { submenu: newSubcate },
    });

    return Response.json(
      {
        message: "SubCategory created!",
        newSubCategory,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();
  try {
    let { _id, name, slug, parent, link } = await req.json();

    if (!name || !parent || !slug || !link || !_id) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    let slugCat = slugString(name);

    if (slug === "") {
      slug = slugCat;
    }

    // check duplicate
    const check = await SubCategory.findOne({
      $and: [
        {
          $or: [{ name: name }, { slug: slug }, { link: link }],
        },
        {
          _id: { $ne: _id },
        },
      ],
    });

    if (!check) {
      await SubCategory.findByIdAndUpdate(_id, {
        name,
        parent,
        slug,
        link,
      });

      return NextResponse.json(
        { message: "sub category update" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "this sub Category already exist change values" },
        { status: 200 }
      );
    }
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  const body = await req.json();
  try {
    await SubCategory.findByIdAndDelete(body.id);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
