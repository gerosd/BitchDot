import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["127.0.0.1", "10.222.10.*"],
    reactStrictMode: true,
}

export default withFlowbiteReact(nextConfig);