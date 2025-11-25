"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAvatars, Avatar } from "@/lib/db";
import { exportAvatarsToZip } from "@/lib/export";

export default function Home() {
    const [isReady, setIsReady] = useState(false);
    const [avatars, setAvatars] = useState<Avatar[]>([]);

    useEffect(() => {
        // Farcaster SDK Ready Check
        const initSDK = async () => {
            try {
                // @ts-ignore
                if (window.sdk && window.sdk.actions) {
                    // @ts-ignore
                    window.sdk.actions.ready();
                    setIsReady(true);
                }
            } catch (error) {
                console.error("Farcaster SDK Error:", error);
            }
        };
        initSDK();

        // Load avatars
        getAvatars().then(setAvatars);
    }, []);

    const handleExport = () => {
        if (avatars.length > 0) {
            exportAvatarsToZip(avatars);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-4">
            <header className="w-full max-w-md flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    BaseStyle Lab
                </h1>
                <Link href="/profile" className="text-sm text-gray-400 hover:text-white">
                    Profile
                </Link>
            </header>

            <div className="w-full max-w-md mb-8 flex gap-2">
                <Link
                    href="/convert"
                    className="flex-1 py-4 text-center bg-primary/20 border border-primary text-primary rounded-lg hover:bg-primary/30 transition-colors font-bold"
                >
                    + Create New
                </Link>
                {avatars.length > 0 && (
                    <button
                        onClick={handleExport}
                        className="px-4 py-4 bg-surface border border-gray-700 rounded-lg hover:bg-gray-800"
                    >
                        ⬇️ ZIP
                    </button>
                )}
            </div>

            <div className="w-full max-w-md grid grid-cols-2 gap-4">
                {avatars.length === 0 ? (
                    <div className="col-span-2 aspect-video bg-surface rounded-lg flex items-center justify-center border border-gray-800">
                        <span className="text-gray-600 text-xs">No avatars yet. Create one!</span>
                    </div>
                ) : (
                    avatars.map(avatar => (
                        <div key={avatar.id} className="relative aspect-square bg-surface rounded-lg overflow-hidden border border-gray-800 group">
                            <img src={avatar.imageData} alt={avatar.name} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-xs truncate">{avatar.name}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
