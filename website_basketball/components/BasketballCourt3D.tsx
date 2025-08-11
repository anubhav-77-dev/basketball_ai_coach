import React from 'react';
import * as THREE from 'three';
import { Cylinder, Box } from '@react-three/drei';

const BasketballCourt3D: React.FC = () => {
  // Create a simple basketball court with a floor, hoop, and backboard
  return (
    <group position={[0, -1.5, 0]}>
      {/* Court floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#3C6382" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Grid helper for reference */}
      <gridHelper args={[10, 10, 0xffffff, 0x888888]} />
      
      {/* Hoop */}
      <group position={[0, 0, -4]}>
        {/* Backboard */}
        <Box position={[0, 3.0, -0.1]} args={[1.2, 0.9, 0.1]}>
          <meshStandardMaterial color="#FFFFFF" />
        </Box>
        
        {/* Rim */}
        <Cylinder 
          position={[0, 2.5, 0.15]} 
          rotation={[Math.PI / 2, 0, 0]} 
          args={[0.23, 0.23, 0.05, 32, 1, false, 0, Math.PI * 2]}
        >
          <meshStandardMaterial color="#FF4500" />
        </Cylinder>
        
        {/* Pole */}
        <Cylinder 
          position={[0, 1.25, -0.2]} 
          args={[0.1, 0.1, 2.5, 16]}
        >
          <meshStandardMaterial color="#888888" />
        </Cylinder>
      </group>
      
      {/* Free throw line */}
      <mesh position={[0, 0.01, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Three point line (simplified as a curved line) */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4, 4.05, 32, 1, 0, Math.PI]} />
        <meshStandardMaterial color="#FFFFFF" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export default BasketballCourt3D;
