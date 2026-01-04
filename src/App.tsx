import { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultViewer } from './components/ResultViewer';
import { processImage, type ProcessedImageResult } from './utils/imageProcessor';
import { Layers, Zap, ArrowRight, Github } from 'lucide-react';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedImageResult | null>(null);

  const handleImageSelect = async (file: File) => {
    setIsProcessing(true);
    try {
      // Add a small artificial delay for UX (to see the loading state)
      await new Promise(r => setTimeout(r, 1500));
      const processed = await processImage(file);
      setResult(processed);
    } catch (error) {
      console.error(error);
      alert('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mono-50 to-mono-200 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-mono-900 selection:text-white">

      {/* Header */}
      <header className="max-w-4xl w-full flex flex-col items-center text-center mb-12">
        <div className="bg-white p-3 rounded-2xl shadow-sm mb-6 animate-in zoom-in duration-500">
          <img src="logo.svg" alt="MonoPixel Logo" className="size-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-mono-900 mb-4 animate-in slide-in-from-bottom-4 duration-500 delay-100">
          MonoPixel
        </h1>
        <p className="text-lg text-mono-500 max-w-2xl animate-in slide-in-from-bottom-4 duration-500 delay-200">
          Remove color information to compress images efficiently. <br className="hidden sm:block" />
          See how much space you save by going grayscale.
        </p>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-3xl">
        {!result && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-mono-200/50 p-8 border border-white/50 animate-in fade-in zoom-in-95 duration-500 delay-300">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-6">
                <div className="relative">
                  <div className="size-16 border-4 border-mono-100 border-t-mono-900 rounded-full animate-spin"></div>
                  <Zap className="absolute inset-0 m-auto size-6 text-mono-900 animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-bold text-mono-800">Processing...</h3>
                  <p className="text-mono-500">Stripping color layers & compressing</p>
                </div>

                {/* Progress Bar (Visual only) */}
                <div className="w-64 h-2 bg-mono-100 rounded-full overflow-hidden">
                  <div className="h-full bg-mono-900 animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '50%' }} />
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: Layers, title: "Input RGB", desc: "Upload full color image" },
                    { icon: ArrowRight, title: "Process", desc: "Remove hue/saturation" },
                    { icon: Zap, title: "Output Mono", desc: "Save optimized file" },
                  ].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl bg-mono-50 border border-mono-100">
                      <step.icon className="size-6 text-mono-400 mb-2" />
                      <h4 className="font-semibold text-mono-700 text-sm">{step.title}</h4>
                      <p className="text-xs text-mono-400">{step.desc}</p>
                    </div>
                  ))}
                </div>

                <ImageUploader onImageSelect={handleImageSelect} isProcessing={isProcessing} />
              </div>
            )}
          </div>
        )}

        {result && (
          <ResultViewer result={result} onReset={reset} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 text-mono-400 text-sm flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
        <a href="https://github.com/netshdev" target="_blank" rel="noopener noreferrer">
          <Github className="size-4" />
          <span>netshdev</span>
        </a>
      </footer>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

export default App;
