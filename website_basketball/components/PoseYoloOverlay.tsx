import React, { useRef, useEffect, useState } from "react";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { getAngle } from "../utils/poseMath";
import { geminiService } from '../services/geminiService';
import { FrameData, AnalysisResult, FrameVitals } from '../types';
import FeedbackAnnotation from './FeedbackAnnotation';
import { FeedbackTimeline } from './FeedbackTimeline';
import DribblingBasketball from './DribblingBasketball';

interface PoseYoloOverlayProps {
  videoSrc: string;
  onAnalyze: (frameData: FrameData[], duration: number) => void;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  shotAttempted: boolean | null;
}

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 360;
const YOLO_FPS = 60;
const TOTAL_FRAMES = 2014;

const PoseYoloOverlay: React.FC<PoseYoloOverlayProps> = ({ videoSrc, onAnalyze, analysisResult, isAnalyzing, shotAttempted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [poseModel, setPoseModel] = useState<Pose | null>(null);
  const lastPoseResults = useRef<any>(null);
  const [yoloData, setYoloData] = useState<{ [key: string]: any[] }>({});
  const frameVitals = useRef<FrameVitals[]>([]);
  const [videoPlayed, setVideoPlayed] = useState(false);
  const [isRelevant, setIsRelevant] = useState<boolean | null>(null);
  const poseDetectionCount = useRef(0);
  const framesProcessed = useRef(0);

  // Preload YOLO JSON files
  useEffect(() => {
    const loadAllYolo = async () => {
      const data: { [key: string]: any[] } = {};
      const framesToLoad = TOTAL_FRAMES;
      console.log(`Starting to load ${framesToLoad} YOLO frames...`);
      
      try {
        for (let i = 0; i < framesToLoad; i++) {
          const idx = String(i).padStart(4, "0");
          try {
            const res = await fetch(`/yolo_results/frame_${idx}.json`);
            const json = await res.json();
            data[idx] = json;
          } catch (e) {
            data[idx] = [];
          }
        }
        setYoloData(data);
        console.log(`Successfully loaded ${Object.keys(data).length} YOLO frames`);
      } catch (error) {
        console.error("Error loading YOLO data:", error);
      }
    };
    loadAllYolo();
  }, []);

  // Load pose model
  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    setPoseModel(pose);
  }, []);

  // Run pose detection and store latest results
  useEffect(() => {
    if (!ready || !videoRef.current || !poseModel) return;
    let animationId: number;

    poseModel.onResults((results) => {
      lastPoseResults.current = results;

      if (isRelevant === null) {
        framesProcessed.current++;
        let personDetected = false;
        if (results.poseLandmarks) {
          const leftShoulder = results.poseLandmarks[11];
          const rightShoulder = results.poseLandmarks[12];
          if ((leftShoulder?.visibility ?? 0) > 0.5 && (rightShoulder?.visibility ?? 0) > 0.5) {
            personDetected = true;
          }
        }

        if (personDetected) {
          poseDetectionCount.current++;
        }

        if (framesProcessed.current > 120) {
          const detectionRate = poseDetectionCount.current / framesProcessed.current;
          if (detectionRate < 0.5) {
            setIsRelevant(false);
            if (videoRef.current) videoRef.current.pause();
          } else {
            setIsRelevant(true);
          }
        }
      }
    });

    const processFrame = async () => {
      if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
        await poseModel.send({ image: videoRef.current });
      }
      animationId = requestAnimationFrame(processFrame);
    };
    processFrame();
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [ready, poseModel, isRelevant]);

  // Animation loop to draw overlays
  useEffect(() => {
    if (!ready) return;
    let animationId: number;
    const drawOverlay = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) {
            animationId = requestAnimationFrame(drawOverlay);
            return;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            animationId = requestAnimationFrame(drawOverlay);
            return;
        }
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        let leftElbowAngle = null;
        let rightElbowAngle = null;
        let ballSpeed = null;

        const poseResults = lastPoseResults.current;
        if (poseResults && poseResults.poseLandmarks) {
            drawConnectors(ctx, poseResults.poseLandmarks, POSE_CONNECTIONS, { color: "#F97316", lineWidth: 3 });
            drawLandmarks(ctx, poseResults.poseLandmarks, { color: "#EA580C", lineWidth: 2 });
            const lm = poseResults.poseLandmarks;
            const leftShoulder = lm[11], leftElbow = lm[13], leftWrist = lm[15];
            const rightShoulder = lm[12], rightElbow = lm[14], rightWrist = lm[16];

            if (leftShoulder && leftElbow && leftWrist) {
                leftElbowAngle = getAngle({ x: leftShoulder.x, y: leftShoulder.y }, { x: leftElbow.x, y: leftElbow.y }, { x: leftWrist.x, y: leftWrist.y });
            }
            if (rightShoulder && rightElbow && rightWrist) {
                rightElbowAngle = getAngle({ x: rightShoulder.x, y: rightShoulder.y }, { x: rightElbow.x, y: rightElbow.y }, { x: rightWrist.x, y: rightWrist.y });
            }
        }

        const currentTime = video.currentTime;
        const frameIdx = Math.min(Math.floor(currentTime * YOLO_FPS), TOTAL_FRAMES - 1);
        const idxStr = String(frameIdx).padStart(4, "0");
        const detections = yoloData[idxStr] || [];
        let ball = detections.find((det: any) => det.name === "sports ball" || det.name === "basketball");

        if (ball) {
            const { x1, y1, x2, y2 } = ball.box;
            const w = x2 - x1;
            const h = y2 - y1;
            ctx.strokeStyle = "#00FF00";
            ctx.lineWidth = 3;
            ctx.strokeRect(x1, y1, w, h);
        }
        
        const vitals: FrameVitals = {
            timestamp: currentTime,
            leftElbowAngle,
            rightElbowAngle,
            ballSpeed
        };

        const existingVitalIndex = frameVitals.current.findIndex(v => Math.abs(v.timestamp - currentTime) < 0.1);
        if (existingVitalIndex === -1) {
            frameVitals.current.push(vitals);
        } else {
            frameVitals.current[existingVitalIndex] = vitals;
        }

        animationId = requestAnimationFrame(drawOverlay);
    };
    drawOverlay();
    return () => cancelAnimationFrame(animationId);
  }, [ready, yoloData]);

  const handleAnalyzeClick = async () => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const duration = video.duration;
    const frameData: FrameData[] = [];
    const numFrames = 25;

    for (let i = 0; i < numFrames; i++) {
      video.currentTime = (i / (numFrames - 1)) * duration;
      await new Promise(resolve => setTimeout(resolve, 80));
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const vitals = frameVitals.current.find(v => Math.abs(v.timestamp - video.currentTime) < 0.1) || { timestamp: video.currentTime, leftElbowAngle: null, rightElbowAngle: null, ballSpeed: null };
        frameData.push({
          vitals,
          frame: canvas.toDataURL('image/jpeg')
        });
      }
    }
    onAnalyze(frameData, duration);
  };

  const handleTimestampClick = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.play();
    }
  };

  const activeFeedback = analysisResult?.events.find(e => 
    videoRef.current && Math.abs(videoRef.current.currentTime - e.timestamp) < 1.0
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      {isRelevant === false && (
        <div style={{ 
          color: 'white', 
          backgroundColor: 'rgba(255, 0, 0, 0.7)', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          This video does not appear to contain basketball-related activity. Please upload a different video.
        </div>
      )}
      <div className="relative">
        <video
          ref={videoRef}
          src={videoSrc}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          controls
          onPlay={() => setReady(true)}
          onEnded={() => setVideoPlayed(true)}
          className="rounded-lg shadow-lg"
          style={{ width: "100%", border: '2px solid #ccc' }}
        />
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={handleAnalyzeClick}
          disabled={isAnalyzing || !videoPlayed}
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 disabled:bg-gray-400"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Full Shot'}
        </button>
      </div>

      {shotAttempted === false && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-4 rounded-lg">
          <p className="font-bold">Analysis Paused</p>
          <p>It seems no shot was attempted in this video. Please upload a video where you perform a full jump shot.</p>
        </div>
      )}

      {analysisResult && (
        <div className="mt-4">
          <FeedbackTimeline result={analysisResult} onTimestampClick={handleTimestampClick} />
        </div>
      )}
    </div>
  );
};

export default PoseYoloOverlay;