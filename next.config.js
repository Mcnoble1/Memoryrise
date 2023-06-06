module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["www.google.com", "cloudinary.com", "res.cloudinary.com"],
  },
  swcMinify: true,
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  async rewrites() {
    return [
      {
        source: "/loaderio-f0b84a05b7bd6749b4d02ca0a1c5a7b6.txt",
        destination: "/api/loader",
      },
    ];
  },
};
