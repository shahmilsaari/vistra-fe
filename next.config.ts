const nextConfig = {
  // Keep Strict Mode for dev checks; duplicate renders are handled via abort-aware fetchers.
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
