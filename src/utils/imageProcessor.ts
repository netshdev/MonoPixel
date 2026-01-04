export interface ProcessedImageResult {
    originalUrl: string;
    processedUrl: string;
    originalSize: number;
    processedSize: number;
    reductionPercentage: number;
    format: string;
}

export const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const getBlob = (canvas: HTMLCanvasElement, quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Conversion failed'));
        }, 'image/webp', quality);
    });
};

export const processImage = (file: File): Promise<ProcessedImageResult> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const originalUrl = URL.createObjectURL(file);

        img.onload = async () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                    const luma = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
                    data[i] = luma;     // R
                    data[i + 1] = luma; // G
                    data[i + 2] = luma; // B
                }

                ctx.putImageData(imageData, 0, 0);

                let quality = 0.8;
                let blob = await getBlob(canvas, quality);
                while (blob.size >= file.size && quality > 0.1) {
                    quality -= 0.1;
                    blob = await getBlob(canvas, quality);
                }

                const processedUrl = URL.createObjectURL(blob);
                const processedSize = blob.size;
                const originalSize = file.size;
                const reductionPercentage = ((originalSize - processedSize) / originalSize) * 100;

                resolve({
                    originalUrl,
                    processedUrl,
                    originalSize,
                    processedSize,
                    reductionPercentage,
                    format: 'webp'
                });
            } catch (err) {
                reject(err);
            }
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = originalUrl;
    });
};
