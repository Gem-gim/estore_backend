import { Options, Product, Review, SubProduct } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugString(name: string) {
  let url = "";
  url = name
    .trim()
    .replaceAll(" ", "-")
    .replaceAll(/[`~!@#$%^&*()_|+\=?;:'",.<>{}\[\]\\\/]/gi, "")
    .toLowerCase();
  return url;
}

export function dateTostring(name: string) {
  const date = name.substring(0, 10);

  const hours = name.substring(11, 16);

  return date + " " + hours;
}

export const discountPrice = (price: number, discount: number): number => {
  let price_final: number = 0;

  price_final = (price * (100 - discount)) / 100;
  return parseInt(price_final.toFixed(2));
};

export const getDate = (date: Date): string => {
  const newDate = new Date(date).toDateString();
  return newDate;
};

export const getRatingNote = (reviews: Review[]): number => {
  const ratingTotal = reviews.reduce(
    (accumulator: number, currentValue: Review): number =>
      accumulator + currentValue?.rating,
    0
  );
  const rating = (ratingTotal / reviews.length).toFixed(0);

  if (!parseFloat(rating)) {
    return 0;
  }

  return parseFloat(rating);
};

export const getBestPriceWithDiscountFromProduct = (
  product: Product
): number => {
  const data = product.subProducts.map((subProduct: SubProduct) => {
    return subProduct.options.map((options: Options) => {
      return options.discount
        ? discountPrice(options.price, options.discount)
        : options.price;
    });
  });

  const sort = data.map((item: Array<number>) => {
    return item.sort((a: number, b: number) => {
      return a - b;
    });
  });

  const finalSort = sort
    .map((item: Array<number>) => {
      return item[0];
    })
    .sort((a: number, b: number) => {
      return a - b;
    })[0];

  return finalSort;
};

export const getBestPriceWithoutDiscountFromProduct = (
  product: Product
): number => {
  const data = product.subProducts.map((subProduct: SubProduct) => {
    return subProduct.options.map((options: Options) => {
      return options.price;
    });
  });

  const sort = data.map((item: Array<number>) => {
    return item.sort((a: number, b: number) => {
      return a - b;
    });
  });

  const finalSort = sort
    .map((item: Array<number>) => {
      return item[0];
    })
    .sort((a: number, b: number) => {
      return a - b;
    })[0];

  return finalSort;
};

export const getDiscountRate = (
  price: number,
  discountPrice: number
): number => {
  const d = (price - discountPrice) * (100 / price);
  return parseFloat(d.toFixed(2));
};

export const validFileExtensions: { [key: string]: string[] } = {
  image: ["jpg", "gif", "png", "jpeg", "svg", "webp"],
};

export const fileTypeArray = [
  "image/jpg",
  "image/gif",
  "image/png",
  "image/jpeg",
  "image/svg",
  "image/webp",
];

export function isValidFileType(fileName: string, fileType: string): boolean {
  if (!fileName) return false;

  return validFileExtensions[fileType].indexOf(fileName.split(".").pop()!) > -1
    ? true
    : false;
}

export function getAllowedExt(type: string): string {
  return validFileExtensions[type].map((e) => `.${e}`).toString();
}

export const MAX_FILE_SIZE = 5000000;
