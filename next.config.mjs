/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
        authApiUrl: process.env.NEXT_PUBLIC_AUTH_API_URL,
        userApiUrl: process.env.NEXT_PUBLIC_USER_API_URL,
    },
}

export default nextConfig