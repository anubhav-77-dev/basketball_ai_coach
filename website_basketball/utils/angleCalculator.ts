/**
 * Utility functions for calculating various joint angles from pose landmarks
 */

import { Landmark, ShootingAngles, FrameAnalysis } from '../types';

/**
 * Calculate angle between three points in 3D space
 */
export function calculateAngle(a: Landmark, b: Landmark, c: Landmark): number {
  if (!a || !b || !c) return 0;
  if (a.visibility < 0.5 || b.visibility < 0.5 || c.visibility < 0.5) return 0;

  // Create vectors from point B to A and C
  const vectorBA = {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z
  };

  const vectorBC = {
    x: c.x - b.x,
    y: c.y - b.y,
    z: c.z - b.z
  };

  // Calculate dot product
  const dotProduct = vectorBA.x * vectorBC.x + vectorBA.y * vectorBC.y + vectorBA.z * vectorBC.z;

  // Calculate magnitudes of vectors
  const magnitudeBA = Math.sqrt(vectorBA.x * vectorBA.x + vectorBA.y * vectorBA.y + vectorBA.z * vectorBA.z);
  const magnitudeBC = Math.sqrt(vectorBC.x * vectorBC.x + vectorBC.y * vectorBC.y + vectorBC.z * vectorBC.z);

  // Calculate angle in radians and convert to degrees
  const angleRad = Math.acos(dotProduct / (magnitudeBA * magnitudeBC));
  const angleDeg = angleRad * (180 / Math.PI);

  return angleDeg;
}

/**
 * Calculate key joint angles relevant for basketball shooting form
 */
export function calculateShootingAngles(landmarks: Landmark[]): ShootingAngles {
  if (!landmarks || landmarks.length < 33) {
    return {
      rightElbowAngle: 0,
      rightShoulderAngle: 0,
      rightWristAngle: 0,
      leftElbowAngle: 0,
      leftShoulderAngle: 0,
      leftWristAngle: 0,
      kneeAngle: 0,
      hipAngle: 0,
      ankleAngle: 0,
      trunkAngle: 0
    };
  }

  // Joint indexes from MediaPipe Pose
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftElbow = landmarks[13];
  const rightElbow = landmarks[14];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const leftKnee = landmarks[25];
  const rightKnee = landmarks[26];
  const leftAnkle = landmarks[27];
  const rightAnkle = landmarks[28];

  // Calculate important joint angles
  const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  
  const rightShoulderAngle = calculateAngle(rightHip, rightShoulder, rightElbow);
  const leftShoulderAngle = calculateAngle(leftHip, leftShoulder, leftElbow);
  
  const rightWristAngle = calculateAngle(rightElbow, rightWrist, rightWrist); // Needs special calculation
  const leftWristAngle = calculateAngle(leftElbow, leftWrist, leftWrist); // Needs special calculation
  
  // Lower body angles
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const kneeAngle = (rightKneeAngle + leftKneeAngle) / 2; // Average of both knees
  
  const hipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
  const ankleAngle = calculateAngle(rightKnee, rightAnkle, rightAnkle); // Needs special calculation
  
  // Trunk angle (vertical alignment)
  const midShoulder = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2,
    z: (leftShoulder.z + rightShoulder.z) / 2,
    visibility: Math.min(leftShoulder.visibility || 0, rightShoulder.visibility || 0)
  };
  
  const midHip = {
    x: (leftHip.x + rightHip.x) / 2,
    y: (leftHip.y + rightHip.y) / 2,
    z: (leftHip.z + rightHip.z) / 2,
    visibility: Math.min(leftHip.visibility || 0, rightHip.visibility || 0)
  };
  
  // Create a vertical point above midHip
  const verticalPoint = {
    x: midHip.x,
    y: midHip.y - 1, // Going up in the y direction (screen coords)
    z: midHip.z,
    visibility: 1
  };
  
  const trunkAngle = calculateAngle(midShoulder, midHip, verticalPoint);

  return {
    rightElbowAngle,
    rightShoulderAngle,
    rightWristAngle,
    leftElbowAngle,
    leftShoulderAngle,
    leftWristAngle,
    kneeAngle,
    hipAngle,
    ankleAngle,
    trunkAngle
  };
}

/**
 * Generate a frame-by-frame analysis of shooting form
 */
export function generateFrameAnalysis(landmarks: Landmark[], ballPosition: [number, number, number] | null, frameNumber: number, timestamp: number): FrameAnalysis {
  const angles = calculateShootingAngles(landmarks);
  
  return {
    frameNumber,
    timestamp,
    angles,
    ballPosition,
    // Add additional data here as needed
  };
}

/**
 * These types are now defined in ../types.ts
 */
