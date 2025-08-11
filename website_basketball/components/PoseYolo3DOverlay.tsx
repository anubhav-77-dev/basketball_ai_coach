import React, { useRef, useEffect, useState } from "react";
import { Pose, Results } from "@mediapipe/pose";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import BasketballCourt3D from "./BasketballCourt3D";

interface PoseYolo3DOverlayProps {
  videoSrc: string;
}

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 360;

// Define the connections for the 3D skeleton
const poseConnections = [
  // Torso
  [11, 12], [11, 23], [12, 24], [23, 24],
  // Left arm
  [11, 13], [13, 15],
  // Right arm
  [12, 14], [14, 16],
  // Left leg
  [23, 25], [25, 27],
  // Right leg
  [24, 26], [26, 28],
];

// 3D Skeleton Component
const PoseSkeleton: React.FC<{ poseResults: Results | null }> = ({ poseResults }) => {
  if (!poseResults || !poseResults.poseLandmarks) {
    return null;
  }

  const landmarks = poseResults.poseLandmarks.map(lm => 
    new THREE.Vector3(
      (lm.x - 0.5) * 2,
      -(lm.y - 0.5) * 2,
      -(lm.visibility ?? 0) * 0.5
    )
  );

  return (
    <group>
      {landmarks.map((pos, i) => (
        <mesh key={`joint-${i}`} position={pos}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#0ea5e9" />
        </mesh>
      ))}
      {poseConnections.map(([i, j], index) => {
        const start = landmarks[i];
        const end = landmarks[j];
        if (!start || !end) return null;
        
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
        
        return (
          <mesh key={`bone-${index}`} position={center} quaternion={quaternion}>
            <cylinderGeometry args={[0.01, 0.01, length, 8]} />
            <meshStandardMaterial color="#0ea5e9" />
          </mesh>
        );
      })}
    </group>
  );
};

// 3D Basketball Component
const Basketball: React.FC<{ position: THREE.Vector3 | null }> = ({ position }) => {
  if (!position) return null;
  
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color="orange" roughness={0.8} />
    </mesh>
  );
};

// Main 3D Overlay Component
const PoseYolo3DOverlay: React.FC<PoseYolo3DOverlayProps> = ({ videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [poseModel, setPoseModel] = useState<Pose | null>(null);
  const [poseResults, setPoseResults] = useState<Results | null>(null);
  const [ballPosition, setBallPosition] = useState<THREE.Vector3 | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load pose model
  useEffect(() => {
    const model = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    model.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    setPoseModel(model);
    return () => { model.close(); };
  }, []);

  // Main processing loop
  useEffect(() => {
    if (!isProcessing || !videoRef.current || !poseModel) return;

    poseModel.onResults((results) => {
        setPoseResults(results);

        if (results.poseLandmarks) {
            const lm = results.poseLandmarks;
            const leftWrist = lm[15];
            const rightWrist = lm[16];

            if (leftWrist && rightWrist && (leftWrist.visibility ?? 0) > 0.5 && (rightWrist.visibility ?? 0) > 0.5) {
                const avgX = (leftWrist.x + rightWrist.x) / 2;
                const avgY = (leftWrist.y + rightWrist.y) / 2;
                const avgVis = ((leftWrist.visibility ?? 0) + (rightWrist.visibility ?? 0)) / 2;

                const x3d = (avgX - 0.5) * 2;
                const y3d = -(avgY - 0.5) * 2;
                const z3d = -avgVis * 0.5;
                
                setBallPosition(new THREE.Vector3(x3d, y3d, z3d));
            } else {
                setBallPosition(null);
            }
        } else {
            setBallPosition(null);
        }
    });

    let animationId: number;
    const processFrame = async () => {
      if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
        await poseModel.send({ image: videoRef.current });
      }
      animationId = requestAnimationFrame(processFrame);
    };
    
    processFrame();

    return () => {
      cancelAnimationFrame(animationId);
      poseModel.onResults(() => {});
    };
  }, [isProcessing, poseModel, videoRef]);

  return (
    <div className="w-full">
      <video
        ref={videoRef}
        src={videoSrc}
        controls
        onPlay={() => setIsProcessing(true)}
        onPause={() => setIsProcessing(false)}
        crossOrigin="anonymous"
        className="w-full rounded-lg shadow-lg border-2 border-gray-200"
      />
      
      <div className="w-full h-96 mt-4 border border-gray-200 rounded-lg">
        <Canvas>
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={75} />
          <PoseSkeleton poseResults={poseResults} />
          <Basketball position={ballPosition} />
          <BasketballCourt3D />
          <OrbitControls />
        </Canvas>
      </div>
      
      <div className="text-center mt-2 text-gray-500 text-sm">
        3D Pose + Ball Visualization (Drag to rotate view)
      </div>
    </div>
  );
};

export default PoseYolo3DOverlay;
