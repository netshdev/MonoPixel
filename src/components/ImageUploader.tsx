import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
    onImageSelect: (file: File) => void;
    isProcessing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isProcessing }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const validateAndSelect = (file: File) => {
        setError(null);
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (PNG, JPG, etc.)');
            return;
        }
        onImageSelect(file);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSelect(e.dataTransfer.files[0]);
        }
    }, [onImageSelect]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSelect(e.target.files[0]);
        }
    };

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
        relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300
        flex flex-col items-center justify-center p-12 text-center
        ${isDragging
                    ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                    : 'border-mono-300 bg-white hover:border-mono-400'
                }
        ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
      `}
        >
            <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 size-full cursor-pointer opacity-0"
                disabled={isProcessing}
            />

            <div className={`
        size-16 mb-4 rounded-full flex items-center justify-center
        bg-mono-100 text-mono-500 transition-colors
        ${isDragging ? 'bg-blue-100 text-blue-600' : ''}
      `}>
                {error ? <AlertCircle className="size-8 text-red-500" /> : <Upload className="size-8" />}
            </div>

            <h3 className="text-xl font-semibold text-mono-800 mb-2">
                {error ? 'Invalid File' : 'Drag & Drop'}
            </h3>
            <p className="text-mono-500 max-w-xs mx-auto text-sm">
                {error || 'or Click to Upload Image (RGB)'}
            </p>

            {error && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setError(null);
                    }}
                    className="mt-4 text-xs font-medium text-red-600 hover:underline z-10 relative"
                >
                    Try Again
                </button>
            )}
        </div>
    );
};
