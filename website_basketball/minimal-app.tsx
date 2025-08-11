import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";

const MinimalApp: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log("MinimalApp mounted");
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
      <h1>Shot Doctor AI - Minimal Test</h1>
      <p>This is a minimal test to verify that React is working correctly.</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Video Test</h2>
        <video 
          ref={videoRef}
          src="/final_ball.mov"
          controls
          style={{ width: '100%', borderRadius: '8px', border: '2px solid #666' }}
          onError={(e) => console.error("Video error:", e)}
          onLoadedData={() => console.log("Video loaded successfully")}
        />
      </div>
    </div>
  );
};

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <MinimalApp />
    </React.StrictMode>
  );
}
