"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Options, SubProduct } from "@/types";
import { Eye } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Zoom from "react-medium-image-zoom";

export default function ProductVariationModal({
  product,
  setOpenModal,
  openModal,
}: {
  product: SubProduct;
  setOpenModal: (value: boolean) => void;
  openModal: boolean;
}) {
  const [images, setImages] = React.useState(product.options[0].images);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpenModal(!openModal)}
          variant="outline"
          className="inline-flex gap-4 items-center ms-10 text-xl text-white bg-primary"
        >
          <Eye className="h-6 w-6 text-primary-700" />
          <span className="text-sm font-medium text-primary-700">Show</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-xl overflow-auto h-screen">
        <div className="grid gap-8 lg:grid-cols-1">
          <div className="flex flex-col gap-10">
            <h2 className="text-xl font-bold">Media</h2>

            <div className="flex gap-4">
              {images &&
                images.map((item: string, idx: number) => {
                  return (
                    <div key={idx}>
                      <Image src={item} alt="image" width={300} height={300} />
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Sku</h2>

            <div className="flex flex-col gap-4">
              <div className="flex w-full p-2 border border-slate-300">
                {product.sku}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Style</h2>

            <div className="flex flex-col gap-4">
              <label htmlFor="sku">Name:</label>
              <div className="break-all flex flex-wrap p-2 border border-slate-300 text-wrap">
                {product.style.name}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="sku">Color code:</label>
              <div className="flex w-full p-2 border border-slate-300">
                {product.style.color}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="sku">Color Image:</label>
              <div className="break-all flex flex-wrap p-2 border border-slate-300 text-wrap">
                {product.style.image}
              </div>
            </div>
          </div>

          {/* options  */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">Options</h2>

            <div className="flex flex-col gap-8">
              {product.options &&
                product.options.map((item: Options, idx: number) => {
                  return (
                    <div
                      className="flex gap-4 overflow-auto w-full justify-between"
                      key={idx}
                    >
                      <div className="flex flex-col gap-2">
                        <label htmlFor="sku">Size:</label>
                        <div className="flex w-full p-2 border border-slate-300">
                          {item.option}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="sku">Qty:</label>
                        <div className="flex w-full p-2 border border-slate-300">
                          {item.qty}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="sku">Price:</label>
                        <div className="flex w-full p-2 border border-slate-300">
                          {item.price}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="sku">Sold:</label>
                        <div className="flex w-full p-2 border border-slate-300">
                          {item.sold}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="sku">Discount:</label>
                        <div className="flex w-full p-2 border border-slate-300">
                          {item.discount}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="sku">Images: </label>
                        <div className="flex gap-4 items-center">
                          {item.images.map((img: string, idx: number) => {
                            return (
                              <Avatar key={idx} className="">
                                <Zoom>
                                  <AvatarImage src={img} alt="image" />
                                </Zoom>
                                <AvatarFallback>...</AvatarFallback>
                              </Avatar>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                      <label htmlFor="sku">Actions: </label>
                      <Button className="flex items-center">
                        <Eye
                          className="text-white"
                          onClick={() => setImages(item.images)}
                        />{" "}
                      </Button>
                    </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
