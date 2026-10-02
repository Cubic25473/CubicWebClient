import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages serves static files only; Firebase remains client-side.
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
