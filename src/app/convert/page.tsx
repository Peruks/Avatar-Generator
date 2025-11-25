"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { saveAvatar } from "@/lib/db";
import { useRouter } from "next/navigation";
import AvatarEditor from "@/components/canvas/AvatarEditor";

export default function ConvertPage() {
    const [image, setImage] = useState<string | null>(null);
    const [style, setStyle] = useState("posterize");
    const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
    const router = useRouter();

    const availableTraits = [
        { id: 'hair-punk', url: '/traits/hair/punk.svg', category: 'hair' },
        { id: 'eyes-shades', url: '/traits/eyes/shades.svg', category: 'eyes' },
        { id: 'mouth-smile', url: '/traits/mouth/smile.svg', category: 'mouth' },
        { id: 'bg-dark', url: '/traits/backgrounds/bg_dark.svg', category: 'background' },
    ];

    const toggleTrait = (url: string) => {
        setSelectedTraits(prev =>
            prev.includes(url) ? prev.filter(t => t !== url) : [...prev, url]
        );
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        const canvas = document.getElementById('avatar-canvas') as HTMLCanvasElement;
        if (canvas) {
            const dataUrl = canvas.toDataURL("image/png");
            const id = crypto.randomUUID();
            await saveAvatar({
                id,
                name: `Avatar ${id.slice(0, 4)}`,
                style,
                createdAt: Date.now(),
                imageData: dataUrl,
                traits: selectedTraits,
            });
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen p-4 flex flex-col items-center">
            <header className="w-full max-w-md flex justify-between items-center mb-6">
                <Link href="/" className="text-primary hover:underline">
                    &larr; Back
                </Link>
                <h1 className="text-xl font-bold">Avatar Studio</h1>
            </header>

            <main className="w-full max-w-md flex flex-col gap-6">
                {/* Canvas Area */}
                <div className="aspect-square bg-surface rounded-lg border border-gray-800 overflow-hidden relative">
                    {!image ? (
                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-surface/50 transition-colors">
                            <span className="text-4xl mb-2">📷</span>
                            <span className="text-sm text-gray-400">Upload Photo</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </label>
                    ) : (
                        <AvatarEditor
                            imageSrc={image}
                            styleMode={style}
                            traits={selectedTraits}
                        />
                    )}
                </div>

                {/* Controls */}
                {image && (
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {['posterize', 'punk', 'neon', 'doodle'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStyle(s)}
                                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${style === s
                                            ? "bg-primary text-black font-bold"
                                            : "bg-surface border border-gray-700 hover:border-primary"
                                        }`}
                                >
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {availableTraits.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => toggleTrait(t.url)}
                                    className={`p-2 rounded border text-xs ${selectedTraits.includes(t.url) ? 'border-accent bg-accent/20' : 'border-gray-700'
                                        }`}
                                >
                                    {t.category}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent/90"
                        >
                            Save Avatar
                        </button>

                        <button
                            onClick={() => setImage(null)}
                            className="w-full py-2 text-gray-400 hover:text-white"
                        >
                            Reset
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
