import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Slide } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function HeaderImage({ slug }: { slug?: string }) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getSlides = () => {
      setLoading(true);
      axios
        .get(process.env.NEXT_PUBLIC_SERVER_URL + "/api/slides")
        .then((response) => {
          setSlides(
            response.data.data.filter(
              (item: Slide) => item.slug === "banner-category"
            )
          );
        })

        .catch((error) => {
          console.log(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getSlides();
  }, []);

  return (
    <>
      {!loading ? (
        <div
          className={`w-full h-[350px] rounded-lg bg-cover flex justify-center  items-center bg-neutral-300`}
          style={{
            backgroundImage: `url(${slides[0]?.image})`,
          }}
        >
          <h1
            className={cn(
              "text-xl lg:text-4xl font-bold  uppercase tracking-widest text-white backdrop-blur-0"
            )}
          >
            {slug}
          </h1>
        </div>
      ) : (
        <Skeleton className={cn("h-[325px] w-full rounded-xl")} />
      )}
    </>
  );
}
