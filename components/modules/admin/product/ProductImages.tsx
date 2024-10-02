"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import Image from "next/image";
import { IoCloseCircle } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "axios";
import { ErrorMessage } from "formik";

export default function ProductImages({
  loading,
  setLoading,
  uploadImages,
  setUploadImages,
}: {
  loading: boolean;
  uploadImages: string[];
  setLoading: (value: boolean) => void;
  setUploadImages: (value: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<string[]>([]);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!loading) {
      setLoading(true);
    }

    const target = e.target as HTMLInputElement;

    const files_ = target.files as FileList;

    let files = Array.from(files_);

    files.forEach((img: File, i) => {
      if (images.length > 5) {
        toast.error("max 5 images");
        files = files.filter((item: File) => item.name !== img.name);
        return;
      } else if (img.size > 1024 * 1024 * 2) {
        toast.error("size too big, less than 2mo");
        return;
      } else {
        // const reader = new FileReader();
        // reader.readAsDataURL(img);
        // reader.onload = (e: ProgressEvent<FileReader>) => {
        //   setImages([...images, e?.target?.result]);
        // };

        const formData = new FormData();
        formData.append("file", files[i]);

        const myPromise = axios
          .post(
            process.env.NEXT_PUBLIC_SERVER_URL + "/api/cloudinary",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((response) => {
            const data = response.data;
            setUploadImages([...uploadImages, data.imgUrl]);
            setImages([...images, data.imgUrl]);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
        toast.promise(myPromise, {
          loading: "Uploading...",
          success: "Done.",
          error: "Error when fetching",
        });
      }
    });

    return;
  };

  const removeImages = (image: string) => {

    setImages(images.filter((img: string) =>  img !== image))
    setUploadImages(uploadImages.filter((img: string) =>  img !== image))
  };

  return (
    <div className="flex w-full flex-col flex-wrap gap-4">
      <h3 className="font-normal text-base">Images:</h3>
      <div className="flex justify-start w-auto">
        <input
          disabled={loading}
          name="image"
          type="file"
          id="image"
          ref={inputRef}
          hidden
          onChange={handleImages}
          accept="image/png, image/jpg,image/jpeg"
        />
        <Button
          className="flex gap-4 bg-primary-700 text-white capitalize"
          onClick={(e) => {
            e.preventDefault();
            inputRef?.current?.click();
          }}
        >
          <span>add images</span>
          <UploadIcon className="text-slate-100" />
        </Button>
      </div>

      <div className="flex gap-4 h-80 w-full border border-slate-200 mt-4 p-4 overflow-auto">
        {uploadImages &&
          uploadImages.map((item: string, idx: number) => (
            <div key={idx} className="relative">
              <IoCloseCircle size={40} onClick={() => removeImages(item)} className="cursor-pointer" />
              <Image
                src={item}
                alt="image"
                width="100"
                height="100"
                className="h-auto w-40"
              />
            </div>
          ))}
      </div>
      <ErrorMessage
        name="images"
        component="div"
        className="py-2 font-bold text-red-900"
      />
    </div>
  );
}
