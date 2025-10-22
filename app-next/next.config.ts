import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "imgs.search.brave.com" },
      { protocol: "https", hostname: "i.pinimg.com" }, // the underlying image host in your URL
      // add any others you use: images.unsplash.com, res.cloudinary.com, etc.
    ],
  },
};

export default nextConfig;
