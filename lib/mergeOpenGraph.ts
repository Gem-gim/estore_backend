import type { Metadata } from "next";

// Default open graph
const defaultOpenGraph: Metadata["openGraph"] = {
  title: "A full stack e-commerce app built with NextJs and TailwindCss",
  description:
    "Carrefour - Online store selling electronics fashions and more.",
  images: [
    {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/assets/images/og.png`,
    },
  ],
  type: "website",
  url: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
  siteName: "Carrefour",
};

// Dynamic open graph
export const mergeOpenGraph = (og?: Metadata["openGraph"]) => {
  return {
    ...defaultOpenGraph,
    ...og,
    image: og?.images ? og.images : defaultOpenGraph.images,
    title: og?.title ? og.title : defaultOpenGraph.title,
    url: og?.url ? og.url : defaultOpenGraph.url,
  };
};
