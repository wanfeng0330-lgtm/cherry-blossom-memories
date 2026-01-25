import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere } from '@react-three/drei';

// 简单测试场景
function TestScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <Box position={[0, 0, 0]} args={[1, 1, 1]}>
        <meshStandardMaterial color="pink" />
      </Box>
      <Sphere position={[2, 0, 0]} args={[0.5, 32, 32]}>
        <meshStandardMaterial color="lightblue" />
      </Sphere>
      <OrbitControls />
    </>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'linear-gradient(to bottom, #ffeef8, #fff5f5)' }}>
      <h1 style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, color: '#5D4E5D' }}>
        🌸 樱花树时光机 - 测试版
      </h1>
      <Canvas camera={{ position: [0, 2, 5] }}>
        <TestScene />
      </Canvas>
    </div>
  );
}
