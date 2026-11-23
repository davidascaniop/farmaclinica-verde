import path from "path";
import type { NextConfig } from "next";

// En GitHub Pages el sitio se exporta como archivos estaticos y vive bajo /farmaclinica-verde.
const enPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(enPages
    ? {
        output: "export" as const,
        basePath: "/farmaclinica-verde",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  turbopack: {
    // La raiz es el monorepo para poder importar /shared y /assets.
    root: path.join(__dirname, ".."),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
