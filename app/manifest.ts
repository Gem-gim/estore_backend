import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "A full stack e-commerce app built with NextJs and TailwindCss",
    short_name: "Ecommerce",
    description:
      "Carrefour - Online store selling electronics fashions and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/assets/images/logo.svg",
        sizes: "100x100",
        type: "svg",
      },
    ],
  };
}
