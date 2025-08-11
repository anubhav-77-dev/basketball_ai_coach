import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import PoseYoloOverlay from "./components/PoseYoloOverlay";
import PoseYolo3DOverlay from "./components/PoseYolo3DOverlay";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Technology from "./components/Technology";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";
import VisualShowcase from "./components/VisualShowcase";
import Testimonials from "./components/Testimonials";
import AnalysisReport from "./components/AnalysisReport";
import { AnalysisResult, FrameData } from "./types";
import { geminiService } from "./services/geminiService";

const App: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [viewMode, setViewMode] = useState<'2d' | '3d' | 'both'>('2d');
  const [activeSection, setActiveSection] = useState('home');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [shotAttempted, setShotAttempted] = useState<boolean | null>(null);

  const handleAnalyze = async (frameData: FrameData[], duration: number) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setShotAttempted(null);

    try {
      const isVideoRelevant = await geminiService.isVideoRelevant(frameData);
      if (!isVideoRelevant) {
        setShotAttempted(false);
        setAnalysisResult(null);
        setIsAnalyzing(false);
        return;
      }

      const result = await geminiService.analyzeShootingForm(frameData, duration);
      setAnalysisResult(result);
      setShotAttempted(true);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Please check the console and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoSrc(URL.createObjectURL(file));
      window.location.hash = 'analysis';
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      setActiveSection(window.location.hash.replace('#', '') || 'home');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="bg-white">
      <Header />
      <main>
        <div id="home" className={`page-section ${activeSection === 'home' ? 'active' : ''}`}>
          <Hero />
          <Features />
          <VisualShowcase />
          <Testimonials />
        </div>
        <div id="analysis" className={`page-section ${activeSection === 'analysis' ? 'active' : ''}`}>
          <div className="container mx-auto px-6 py-16">
            <div className="text-center bg-gray-50 p-10 rounded-xl border border-dashed border-gray-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Shot Analyzer</h2>
              <p className="text-gray-500 mb-6 max-w-xl mx-auto">Upload a video to get your free analysis. For best results, use a clear, side-view video.</p>
              <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" id="video-upload" />
              <label htmlFor="video-upload" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 cursor-pointer">
                ⬆️ Upload Video
              </label>
            </div>

            {videoSrc && (
              <div className="mt-8">
                <div className="flex justify-center mb-6">
                  <button onClick={() => setViewMode('2d')} className={`px-4 py-2 rounded-l-lg text-sm font-semibold ${viewMode === '2d' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-800'}`}>2D View</button>
                  <button onClick={() => setViewMode('3d')} className={`px-4 py-2 text-sm font-semibold ${viewMode === '3d' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-800'}`}>3D View</button>
                  <button onClick={() => setViewMode('both')} className={`px-4 py-2 rounded-r-lg text-sm font-semibold ${viewMode === 'both' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-800'}`}>Both Views</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {(viewMode === '2d' || viewMode === 'both') && (
                    <div className={`bg-gray-50 p-6 rounded-xl border border-gray-200 ${viewMode === 'both' ? 'col-span-1' : 'lg:col-span-2'}`}>
                      <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">2D Analysis</h3>
                      <PoseYoloOverlay 
                        videoSrc={videoSrc} 
                        onAnalyze={handleAnalyze}
                        analysisResult={analysisResult}
                        isAnalyzing={isAnalyzing}
                        shotAttempted={shotAttempted}
                      />
                    </div>
                  )}
                  
                  {(viewMode === '3d' || viewMode === 'both') && (
                    <div className={`bg-gray-50 p-6 rounded-xl border border-gray-200 ${viewMode === 'both' ? 'col-span-1' : 'lg:col-span-2'}`}>
                      <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">3D Analysis</h3>
                      <PoseYolo3DOverlay videoSrc={videoSrc} />
                    </div>
                  )}
                </div>
                {analysisResult && (
                  <div className="mt-8">
                    <AnalysisReport result={analysisResult} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div id="tech" className={`page-section ${activeSection === 'tech' ? 'active' : ''}`}>
          <Technology />
        </div>
        <div id="pricing" className={`page-section ${activeSection === 'pricing' ? 'active' : ''}`}>
          <Pricing />
        </div>
      </main>
      <Footer />
    </div>
  );
};

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found. Check index.html");
}
