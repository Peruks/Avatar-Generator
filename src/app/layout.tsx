import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
            <body className={inter.className}>
                <FarcasterInit />
                {children}
                <Script
                    src="https://cdn.farcaster.xyz/actions.js"
                    strategy="afterInteractive"
                    onLoad={() => {
                        // @ts-ignore
                        if (window.sdk && window.sdk.actions) {
                            // @ts-ignore
                            window.sdk.actions.ready();
                            console.log("Farcaster SDK Ready (onLoad)");
                        }
                    }}
                />
            </body>
        </html>
    );
}
