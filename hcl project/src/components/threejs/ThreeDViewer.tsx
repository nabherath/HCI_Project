
import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useRoomDesign } from '@/contexts/RoomDesignContext';
import { Furniture } from '@/models/furniture';

const RoomScene = () => {
  const { currentRoom } = useRoomDesign();
  
  if (!currentRoom) return null;
  
  // Scale factors to adjust room size
  const scaleFactorX = currentRoom.width / 500;
  const scaleFactorY = currentRoom.height / 400;
  
  // Room dimensions
  const roomWidth = 10 * scaleFactorX;
  const roomLength = 10 * scaleFactorY;
  const roomHeight = 5;
  
  return (
    <group position={[0, 0, 0]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color={currentRoom.floorColor} />
      </mesh>
      
      {/* Walls */}
      {/* Back wall */}
      <mesh position={[0, roomHeight / 2, -roomLength / 2]}>
        <planeGeometry args={[roomWidth, roomHeight]} />
        <meshStandardMaterial color={currentRoom.wallColor} />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[roomLength, roomHeight]} />
        <meshStandardMaterial color={currentRoom.wallColor} />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[roomWidth / 2, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[roomLength, roomHeight]} />
        <meshStandardMaterial color={currentRoom.wallColor} />
      </mesh>
      
      {/* Furniture */}
      {currentRoom.furniture.map((furniture) => (
        <FurnitureModel 
          key={furniture.id} 
          furniture={furniture} 
          roomWidth={roomWidth} 
          roomLength={roomLength} 
        />
      ))}
    </group>
  );
};

interface FurnitureModelProps {
  furniture: Furniture;
  roomWidth: number;
  roomLength: number;
}

const FurnitureModel = ({ furniture, roomWidth, roomLength }: FurnitureModelProps) => {
  // Adjust positions to fit the 3D space
  // Map x,y from 2D space to 3D coordinates
  const x = (furniture.x / 500) * roomWidth - roomWidth / 2 + (furniture.width / 500) * roomWidth / 2;
  const z = (furniture.y / 400) * roomLength - roomLength / 2 + (furniture.height / 400) * roomLength / 2;
  
  // Scale furniture sizes proportionally to room
  const width = (furniture.width / 500) * roomWidth;
  const length = (furniture.height / 400) * roomLength;
  
  // Adjust height based on furniture type
  const getHeightForFurniture = (type: string): number => {
    switch (type) {
      case 'chair': return 0.8;
      case 'sofa': return 0.9;
      case 'table': return 0.75;
      case 'bed': return 0.5;
      case 'cabinet': return 1.2;
      case 'desk': return 0.75;
      case 'bookshelf': return 1.8;
      case 'rug': return 0.05;
      default: return 0.5;
    }
  };
  
  const height = getHeightForFurniture(furniture.type);
  const rotationY = THREE.MathUtils.degToRad(furniture.rotation);
  
  return (
    <group position={[x, height / 2, z]} rotation={[0, rotationY, 0]}>
      <mesh>
        <boxGeometry args={[width, height, length]} />
        <meshStandardMaterial color={furniture.color} />
      </mesh>
    </group>
  );
};

const CameraControls = () => {
  const { camera, gl } = useThree();
  const controls = useRef<any>();

  useFrame(() => {
    if (controls.current) {
      controls.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controls}
      args={[camera, gl.domElement]}
      enableDamping
      dampingFactor={0.05}
      minDistance={2}
      maxDistance={20}
      maxPolarAngle={Math.PI / 2 - 0.1}
    />
  );
};

const ThreeDViewer = () => {
  const { currentRoom } = useRoomDesign();
  
  if (!currentRoom) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>No room selected. Please create or load a room first.</p>
      </div>
    );
  }
  
  return (
    <div className="h-full w-full">
      <Canvas shadows camera={{ position: [0, 5, 5], fov: 60 }}>
        <CameraControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <RoomScene />
      </Canvas>
    </div>
  );
};

export default ThreeDViewer;
