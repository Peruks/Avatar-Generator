"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAvatars, Avatar } from "@/lib/db";

export default function ProfilePage() {
    const [stats, setStats] = useState({ count: 0 });

    useEffect(() => {
        getAvatars().then((avatars) => {
            setStats({ count: avatars.length });
        });
    }, []);

    return (
        <div className="min-h-screen p-4 flex flex-col items-center">
            <header className="w-full max-w-md flex justify-between items-center mb-8">
                <Link href="/" className="text-primary hover:underline">
                    &larr; Home
                </Link>
                <h1 className="text-xl font-bold">Profile</h1>
            </header>

            <div className="w-full max-w-md bg-surface p-6 rounded-lg border border-gray-800">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-2xl">
                        👤
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">User</h2>
                        <p className="text-sm text-gray-400">@handle</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/30 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">{stats.count}</div>
                        <div className="text-xs text-gray-400">Avatars Created</div>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-accent">0</div>
                        <div className="text-xs text-gray-400">Packs Generated</div>
                    </div>
                </div>

                <button className="w-full py-2 border border-gray-700 rounded-lg hover:bg-gray-800 mb-2">
                    Export Data Backup
                </button>
                <Link href="/about" className="block w-full py-2 text-center text-gray-400 hover:text-white">
                    About & Legal
                </Link>
            </div>
        </div>
    );
}
