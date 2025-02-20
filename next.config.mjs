import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "dummyimage.com",
      "lh3.googleusercontent.com",
      "localhost",
      "shopping-hamma.vercel.app",
    ],
  },
};

export default withNextIntl(nextConfig);
