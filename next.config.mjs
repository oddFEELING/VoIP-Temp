/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["aceternity.com", "www.provu.co.uk", "api.dicebear.com"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
