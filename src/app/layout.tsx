import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FarcasterInit from "@/components/FarcasterInit";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "BaseStyle Lab",
    description: "Avatar Generator Farcaster Mini App",
    manifest: "/manifest.json",
    other: {
        "fc:frame": "vNext",
        "fc:miniapp": "v1",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <script src="https://cdn.farcaster.xyz/actions.js" defer></script>
            </head>
            <body className={inter.className}>
                <FarcasterInit />
                {children}
            </body>
        </html>
    );
}
