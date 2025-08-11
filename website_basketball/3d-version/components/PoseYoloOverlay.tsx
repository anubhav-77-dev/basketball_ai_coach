import React, { useRef, useEffect, useState } from "react";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { getAngle } from "../utils/poseMath";

const VIDEO_PATH = "/final_ball.mov";
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 360;
const YOLO_FPS = 60; // Match your YOLO inference FPS
const TOTAL_FRAMES = 2014; // frame_0000.json to frame_2013.json

const PoseYoloOverlay: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [poseModel, setPoseModel] = useState<Pose | null>(null);
  const lastPoseResults = useRef<any>(null);
  const [yoloData, setYoloData] = useState<{ [key: string]: any[] }>({});
  const prevBallCenter = useRef<{x: number, y: number} | null>(null);
  const prevTime = useRef<number | null>(null);
  const frameVitals = useRef<any[]>([]);

  // Preload all YOLO JSON files into memory
  useEffect(() => {
    const loadAllYolo = async () => {
      const data: { [key: string]: any[] } = {};
      await Promise.all(
        Array.from({ length: TOTAL_FRAMES }).map(async (_, i) => {
          const idx = String(i).padStart(4, "0");
          try {
            const res = await fetch(`/yolo_results/frame_${idx}.json`);
            const json = await res.json();
            data[idx] = json;
            console.log(`Loaded YOLO frame ${idx}:`, json);
          } catch (e) {
            data[idx] = [];
            console.error(`Failed to load YOLO frame ${idx}:`, e);
          }
        })
      );
      setYoloData(data);
      console.log('All YOLO data loaded:', data);
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
      console.log("Pose results:", results);
      lastPoseResults.current = results;
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
  }, [ready, poseModel]);

  // Animation loop to draw both pose and YOLO overlays from preloaded data
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

      // --- Vitals to save ---
      let leftElbowAngle = null;
      let rightElbowAngle = null;
      let ballSpeed = null;

      // Draw pose landmarks if available
      const poseResults = lastPoseResults.current;
      if (poseResults && poseResults.poseLandmarks) {
        drawConnectors(ctx, poseResults.poseLandmarks, POSE_CONNECTIONS, { color: "#F97316", lineWidth: 3 });
        drawLandmarks(ctx, poseResults.poseLandmarks, { color: "#EA580C", lineWidth: 2 });

        // --- Elbow Angle Overlay ---
        const lm = poseResults.poseLandmarks;
        const leftShoulder = lm[11], leftElbow = lm[13], leftWrist = lm[15];
        const rightShoulder = lm[12], rightElbow = lm[14], rightWrist = lm[16];

        if (leftShoulder && leftElbow && leftWrist) {
          leftElbowAngle = getAngle(
            { x: leftShoulder.x * CANVAS_WIDTH, y: leftShoulder.y * CANVAS_HEIGHT },
            { x: leftElbow.x * CANVAS_WIDTH, y: leftElbow.y * CANVAS_HEIGHT },
            { x: leftWrist.x * CANVAS_WIDTH, y: leftWrist.y * CANVAS_HEIGHT }
          );
          ctx.save();
          ctx.font = "20px Arial";
          ctx.fillStyle = "red";
          ctx.fillText(`${leftElbowAngle.toFixed(0)}°`, leftElbow.x * CANVAS_WIDTH + 10, leftElbow.y * CANVAS_HEIGHT - 10);
          ctx.restore();
        }
        if (rightShoulder && rightElbow && rightWrist) {
          rightElbowAngle = getAngle(
            { x: rightShoulder.x * CANVAS_WIDTH, y: rightShoulder.y * CANVAS_HEIGHT },
            { x: rightElbow.x * CANVAS_WIDTH, y: rightElbow.y * CANVAS_HEIGHT },
            { x: rightWrist.x * CANVAS_WIDTH, y: rightWrist.y * CANVAS_HEIGHT }
          );
          ctx.save();
          ctx.font = "20px Arial";
          ctx.fillStyle = "red";
          ctx.fillText(`${rightElbowAngle.toFixed(0)}°`, rightElbow.x * CANVAS_WIDTH + 10, rightElbow.y * CANVAS_HEIGHT - 10);
          ctx.restore();
        }
      }

      // Draw YOLO overlay for current frame from preloaded data
      const currentTime = video.currentTime;
      const frameIdx = Math.min(Math.floor(currentTime * YOLO_FPS), TOTAL_FRAMES - 1);
      const idxStr = String(frameIdx).padStart(4, "0");
      const detections = yoloData[idxStr] || [];
      if (frameIdx >= 1994) {
        console.log('[DEBUG] LAST FRAMES - frame', frameIdx, 'detections:', detections);
      }
      let ball = detections.find((det) => det.name === "sports ball" || det.name === "basketball");
      if (frameIdx >= 1994 && ball) {
        console.log('[DEBUG] LAST FRAMES - Ball detection in frame', frameIdx, 'box:', ball.box);
      }
      if (Array.isArray(detections)) {
        detections.forEach((det) => {
          if (!det.box) return;
          const { x1, y1, x2, y2 } = det.box;
          const w = x2 - x1;
          const h = y2 - y1;
          ctx.strokeStyle = "#00FF00";
          ctx.lineWidth = 3;
          ctx.strokeRect(x1, y1, w, h);
          ctx.font = "16px Arial";
          ctx.fillStyle = "#00FF00";
          ctx.fillText(
            `${det.name} (${Math.round(det.confidence * 100)}%)`,
            x1,
            y1 > 20 ? y1 - 5 : y1 + 15
          );
        });
      }
      // --- Ball Speed Overlay ---
      if (ball && ball.box) {
        const { x1, y1, x2, y2 } = ball.box;
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, 2 * Math.PI);
        ctx.strokeStyle = "#00FF00";
        ctx.lineWidth = 2;
        ctx.stroke();
        // Ball speed calculation
        if (prevBallCenter.current && prevTime.current !== null) {
          const dx = cx - prevBallCenter.current.x;
          const dy = cy - prevBallCenter.current.y;
          const dt = currentTime - prevTime.current;
          ballSpeed = dt > 0 ? Math.sqrt(dx * dx + dy * dy) / dt : 0; // pixels per second
          ctx.font = "20px Arial";
          ctx.fillStyle = "#00FF00";
          ctx.fillText(`Speed: ${ballSpeed.toFixed(1)} px/s`, cx + 10, cy - 10);
        }
        prevBallCenter.current = { x: cx, y: cy };
        prevTime.current = currentTime;
        ctx.restore();
      }

      // --- Save vitals for this frame ---
      frameVitals.current.push({
        timestamp: currentTime,
        leftElbowAngle,
        rightElbowAngle,
        ballSpeed
      });

      animationId = requestAnimationFrame(drawOverlay);
    };
    drawOverlay();
    return () => cancelAnimationFrame(animationId);
  }, [ready, yoloData]);

  // Save vitals to file when video ends
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(frameVitals.current));
      const dlAnchorElem = document.createElement('a');
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", "frame_vitals.json");
      document.body.appendChild(dlAnchorElem);
      dlAnchorElem.click();
      dlAnchorElem.remove();
    };
    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <video
        ref={videoRef}
        src={VIDEO_PATH}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        controls
        onPlay={() => setReady(true)}
        className="rounded-lg shadow-lg"
        style={{ width: "100%" }}
      />
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      <div className="text-center mt-2 text-gray-400 text-sm">
        Pose + YOLO detection overlay
      </div>
    </div>
  );
};

export default PoseYoloOverlay; 