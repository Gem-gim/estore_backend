import Review from "@/models/Review";
import Product from "@/models/Product";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { reviewBy, review, rating, productId } = body;

    if (!productId || !reviewBy || !review || !rating) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    // TODO:check if he has a review o this product

    const newReview = await new Review({
      reviewBy,
      rating,
      review,
    }).save();

    const updateProduct = {
      _id: newReview._id,
    };

    await Product.findByIdAndUpdate(productId, {
      $push: { reviews: updateProduct },
    });

    return Response.json(
      { message: "Thanks for your review!", data: newReview },
      { status: 200 }
    );
  } catch (err) {
    return Response.json({ err }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { reviewId, likeBy, remove } = body;

    if (!reviewId || !likeBy) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    const updateReview = {
      _id: likeBy,
    };
    if (remove === false) {
      await Review.findByIdAndUpdate(reviewId, {
        $push: { likes: updateReview },
      });
    } else {
      await Review.findByIdAndUpdate(reviewId, {
        $pull: { likes: updateReview },
      });
    }

    return Response.json({ message: "Thanks for your like!" }, { status: 200 });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
