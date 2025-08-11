// Define the FrameData interface for storing joint angles and positions
export interface FrameData {
  timestamp: number;
  frameNumber: number;
  rightShoulderAngle: number;
  leftShoulderAngle: number;
  rightElbowAngle: number;
  leftElbowAngle: number;
  rightKneeAngle: number;
  leftKneeAngle: number;
  trunkAngle: number;
  ballPosition: {x: number, y: number, z?: number} | null;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D extends Point2D {
  z: number;
  visibility?: number;
}

export function getAngle(a: {x: number, y: number}, b: {x: number, y: number}, c: {x: number, y: number}): number {
  // Returns angle at point b in degrees
  const ab = {x: a.x - b.x, y: a.y - b.y};
  const cb = {x: c.x - b.x, y: c.y - b.y};
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x**2 + ab.y**2);
  const magCB = Math.sqrt(cb.x**2 + cb.y**2);
  const angleRad = Math.acos(dot / (magAB * magCB));
  return angleRad * (180 / Math.PI);
} 

// 3D angle calculation
export function getAngle3D(a: {x: number, y: number, z: number}, b: {x: number, y: number, z: number}, c: {x: number, y: number, z: number}): number {
  // Returns angle at point b in 3D space in degrees
  const ab = {x: a.x - b.x, y: a.y - b.y, z: a.z - b.z};
  const cb = {x: c.x - b.x, y: c.y - b.y, z: c.z - b.z};
  const dot = ab.x * cb.x + ab.y * cb.y + ab.z * cb.z;
  const magAB = Math.sqrt(ab.x**2 + ab.y**2 + ab.z**2);
  const magCB = Math.sqrt(cb.x**2 + cb.y**2 + cb.z**2);
  const angleRad = Math.acos(dot / (magAB * magCB));
  return angleRad * (180 / Math.PI);
}

// Convert MediaPipe coordinates to Three.js coordinates
export function mediapipeToThreeJS(landmark: {x: number, y: number, z: number, visibility?: number}) {
  return {
    x: (landmark.x - 0.5) * 2,    // Convert [0,1] to [-1,1] 
    y: -(landmark.y - 0.5) * 2,   // Flip Y and convert [0,1] to [-1,1]
    z: landmark.z * 2,            // Scale Z for better visibility
    visibility: landmark.visibility
  };
}