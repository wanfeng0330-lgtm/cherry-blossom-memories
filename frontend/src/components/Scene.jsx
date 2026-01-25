import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CherryBlossomScene } from './CherryTree/Tree';
import LoadingSpinner from './UI/LoadingSpinner';
import { useBreakpoints } from '../hooks/useMediaQuery';

/**
 * 3D场景容器组件
 */
export default function Scene({
  photos,
  selectedMonth,
  onPhotoClick,
  autoRotate
}) {
  const { isSmallScreen } = useBreakpoints();

  return (
    <div className="canvas-container">
      <Canvas
        camera={{
          position: [0, 3, isSmallScreen ? 8 : 6],
          fov: 50
        }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <CherryBlossomScene
            photos={photos}
            selectedMonth={selectedMonth}
            onPhotoClick={onPhotoClick}
            autoRotate={autoRotate}
          />
        </Suspense>
      </Canvas>

      {/* 加载指示器 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Suspense fallback={<LoadingSpinner />}>
          <div />
        </Suspense>
      </div>
    </div>
  );
}
