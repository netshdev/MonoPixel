import React, { useState } from 'react';
import { Download, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { formatBytes, type ProcessedImageResult } from '../utils/imageProcessor';

interface ResultViewerProps {
    result: ProcessedImageResult;
    onReset: () => void;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ result, onReset }) => {
    const [showOriginal, setShowOriginal] = useState(false);

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-2xl shadow-sm border border-mono-200 overflow-hidden">
                <div className="relative aspect-video bg-mono-100 group overflow-hidden">
                    <img
                        src={showOriginal ? result.originalUrl : result.processedUrl}
                        alt="Preview"
                        className="size-full object-contain transition-opacity duration-300"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-black/50 backdrop-blur-sm p-3 text-white text-center text-sm font-medium">
                        {showOriginal ? 'Original (RGB)' : 'Restored (Grayscale)'}
                    </div>

                    <button
                        onMouseDown={() => setShowOriginal(true)}
                        onMouseUp={() => setShowOriginal(false)}
                        onMouseLeave={() => setShowOriginal(false)}
                        onTouchStart={() => setShowOriginal(true)}
                        onTouchEnd={() => setShowOriginal(false)}
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur hover:bg-white text-mono-800 px-4 py-2 rounded-full shadow-lg text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 select-none"
                    >
                        <ArrowLeftRight className="size-4" />
                        Hold to Compare
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                                <CheckCircle2 className="size-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-mono-900">Compression Successful</h3>
                                <p className="text-mono-500 text-sm">Color data removed & optimized</p>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-mono-500">Original Size:</span>
                                <span className="font-mono text-mono-900">{formatBytes(result.originalSize)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-mono-500">New Size:</span>
                                <span className="font-bold text-green-600">{formatBytes(result.processedSize)}</span>
                            </div>
                            <div className="h-2 bg-mono-100 rounded-full overflow-hidden mt-2">
                                <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: `${100 - result.reductionPercentage}%` }}
                                />
                            </div>
                            <p className="text-xs text-right text-green-600 font-medium">
                                {result.reductionPercentage.toFixed(1)}% Reduction
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 justify-center">
                        <a
                            href={result.processedUrl}
                            download={`monopixel-output.${result.format}`}
                            className="flex items-center justify-center gap-2 w-full bg-mono-900 text-white hover:bg-mono-800 px-6 py-3 rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-mono-900/10"
                        >
                            <Download className="size-5" />
                            Download Grayscale
                        </a>
                        <button
                            onClick={onReset}
                            className="text-mono-500 hover:text-mono-800 text-sm font-medium py-2 transition-colors"
                        >
                            Process Another Image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
