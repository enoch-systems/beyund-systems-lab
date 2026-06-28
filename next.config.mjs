/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
