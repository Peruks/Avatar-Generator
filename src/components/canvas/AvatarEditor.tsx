"use client";

import { useRef, useEffect } from "react";
import { filters } from "@/lib/image-processing";

interface AvatarEditorProps {
    imageSrc: string;
    styleMode: string;
    traits?: string[];
    onSave?: (dataUrl: string) => void;
}

export default function AvatarEditor({ imageSrc, styleMode, traits = [], onSave }: AvatarEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !imageSrc) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageSrc;
        img.onload = () => {
            // Reset canvas
            canvas.width = 512;
            canvas.height = 512;

            // Draw original
            ctx.drawImage(img, 0, 0, 512, 512);

            // Apply filters
            switch (styleMode) {
                case "posterize":
                    filters.posterize(ctx, 512, 512);
                    break;
                case "punk":
                    filters.punk(ctx, 512, 512);
                    break;
                case "neon":
                    filters.neon(ctx, 512, 512);
                    break;
                case "doodle":
                    filters.doodle(ctx, 512, 512);
                    break;
            }

            // Draw traits
            traits.forEach(traitUrl => {
                const traitImg = new Image();
                traitImg.src = traitUrl;
                traitImg.onload = () => {
                    ctx.drawImage(traitImg, 0, 0, 512, 512);
                };
            });
        };
    }, [imageSrc, styleMode, traits]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full object-contain"
            id="avatar-canvas"
        />
    );
}
