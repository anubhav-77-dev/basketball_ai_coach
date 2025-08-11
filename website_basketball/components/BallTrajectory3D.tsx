import React, { useMemo } from 'react';
import { Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface BallPosition {
  time: number;
  position: [number, number, number];
}

interface BallTrajectory3DProps {
  positions: BallPosition[];
  color?: string;
  showPoints?: boolean;
}

const BallTrajectory3D: React.FC<BallTrajectory3DProps> = ({ 
  positions, 
  color = '#ff8800', 
  showPoints = true 
}) => {
  // Filter out positions with undefined/null values
  const validPositions = useMemo(() => 
    positions.filter(p => 
      p.position && 
      !isNaN(p.position[0]) && 
      !isNaN(p.position[1]) && 
      !isNaN(p.position[2])
    ),
    [positions]
  );

  // Create points for the line
  const points = useMemo(() => 
    validPositions.map(p => new THREE.Vector3(...p.position)),
    [validPositions]
  );

  if (points.length < 2) {
    return null; // Need at least 2 points to draw a line
  }

  return (
    <group>
      {/* Draw the trajectory line */}
      <Line
        points={points}
        color={color}
        lineWidth={2}
      />
      
      {/* Draw points at each position */}
      {showPoints && validPositions.map((ballPos, index) => (
        <Sphere 
          key={`ball-point-${index}`}
          args={[0.02]} // Small sphere for each point
          position={ballPos.position}
        >
          <meshStandardMaterial color={color} />
        </Sphere>
      ))}
    </group>
  );
};

export default BallTrajectory3D;
