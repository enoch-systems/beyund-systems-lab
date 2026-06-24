/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/students",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
