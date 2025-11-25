// Helper to find closest color in a palette
const findClosestColor = (r: number, g: number, b: number, palette: number[][]) => {
    let minDist = Infinity;
    let closest = palette[0];
    for (const color of palette) {
        const dist = Math.pow(r - color[0], 2) + Math.pow(g - color[1], 2) + Math.pow(b - color[2], 2);
        if (dist < minDist) {
            minDist = dist;
            closest = color;
        }
    }
    return closest;
};

// Punk Palette (Skin tones, vibrant hair, darks)
const PUNK_PALETTE = [
    [0, 0, 0], // Black
    [255, 255, 255], // White
    [255, 204, 153], // Light Skin
    [204, 153, 102], // Med Skin
    [102, 51, 0], // Dark Skin
    [255, 0, 0], // Red
    [0, 255, 0], // Green
    [0, 0, 255], // Blue
    [255, 0, 255], // Magenta
    [0, 255, 255], // Cyan
    [255, 255, 0], // Yellow
    [100, 100, 100], // Gray
];

// Pastel Palette for Doodles
const DOODLE_PALETTE = [
    [255, 179, 186], // Pastel Red
    [255, 223, 186], // Pastel Orange
    [255, 255, 186], // Pastel Yellow
    [186, 255, 201], // Pastel Green
    [186, 225, 255], // Pastel Blue
    [226, 196, 255], // Pastel Purple
    [255, 255, 255], // White
    [50, 50, 50],    // Dark Gray (for outlines)
];

export const filters = {
    posterize: (ctx: CanvasRenderingContext2D, width: number, height: number, levels: number = 4) => {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const step = 255 / (levels - 1);

        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.round(data[i] / step) * step;
            data[i + 1] = Math.round(data[i + 1] / step) * step;
            data[i + 2] = Math.round(data[i + 2] / step) * step;
        }
        ctx.putImageData(imageData, 0, 0);
    },

    punk: (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // 1. Pixelate heavily (e.g., 64x64 grid)
        const size = 8; // Pixel size
        const w = Math.ceil(width / size);
        const h = Math.ceil(height / size);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = h;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        tempCtx.drawImage(ctx.canvas, 0, 0, w, h);

        // 2. Quantize colors to Punk Palette
        const imageData = tempCtx.getImageData(0, 0, w, h);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const color = findClosestColor(data[i], data[i + 1], data[i + 2], PUNK_PALETTE);
            data[i] = color[0];
            data[i + 1] = color[1];
            data[i + 2] = color[2];
        }
        tempCtx.putImageData(imageData, 0, 0);

        // 3. Draw back
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tempCanvas, 0, 0, width, height);
    },

    doodle: (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // 1. Edge Detection for Outlines
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const w = width;

        const grayData = new Uint8ClampedArray(width * height);
        for (let i = 0; i < data.length; i += 4) {
            grayData[i / 4] = (data[i] + data[i + 1] + data[i + 2]) / 3;
        }

        const output = new Uint8ClampedArray(data.length);
        const gx = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
        const gy = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let sumX = 0;
                let sumY = 0;

                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const val = grayData[(y + ky) * w + (x + kx)];
                        sumX += val * gx[ky + 1][kx + 1];
                        sumY += val * gy[ky + 1][kx + 1];
                    }
                }

                const mag = Math.sqrt(sumX * sumX + sumY * sumY);
                const idx = (y * w + x) * 4;

                // 2. Color Fill (Pastel)
                // Sample original color at this pixel
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const pastel = findClosestColor(r, g, b, DOODLE_PALETTE);

                if (mag > 100) {
                    // Edge -> Black
                    output[idx] = 0;
                    output[idx + 1] = 0;
                    output[idx + 2] = 0;
                    output[idx + 3] = 255;
                } else {
                    // Fill -> Pastel
                    output[idx] = pastel[0];
                    output[idx + 1] = pastel[1];
                    output[idx + 2] = pastel[2];
                    output[idx + 3] = 255;
                }
            }
        }
        ctx.putImageData(new ImageData(output, width, height), 0, 0);
    },

    neon: (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const w = width;

        const gx = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
        const gy = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

        const output = new Uint8ClampedArray(data.length);

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let sumX = 0;
                let sumY = 0;

                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = ((y + ky) * w + (x + kx)) * 4;
                        const val = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                        sumX += val * gx[ky + 1][kx + 1];
                        sumY += val * gy[ky + 1][kx + 1];
                    }
                }

                const mag = Math.sqrt(sumX * sumX + sumY * sumY);
                const idx = (y * w + x) * 4;

                if (mag > 40) {
                    // Bright Neon Edges
                    output[idx] = 0;
                    output[idx + 1] = 255;
                    output[idx + 2] = 255;
                    output[idx + 3] = 255;
                } else {
                    // Dark Background
                    output[idx] = 10;
                    output[idx + 1] = 10;
                    output[idx + 2] = 20;
                    output[idx + 3] = 255;
                }
            }
        }

        ctx.putImageData(new ImageData(output, width, height), 0, 0);
    },
};
