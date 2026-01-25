import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createBlossomMaterial, calculateBlossomPositions } from '../../utils/treeGeometry';
import { Branches } from './Branch';

/**
 * 樱花粒子组件 - 使用Points渲染樱花簇
 */
export default function Blossom({ branches }) {
  const pointsRef = useRef(null);
  const timeRef = useRef(0);

  const { geometry, material } = useMemo(() => {
    // 计算樱花位置
    const { positions, colors } = calculateBlossomPositions(branches);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = createBlossomMaterial();

    return { geometry, material };
  }, [branches]);

  // 添加微妙的浮动动画
  useFrame((state) => {
    if (pointsRef.current) {
      timeRef.current += 0.01;

      const positions = pointsRef.current.geometry.attributes.position;
      const originalPositions = geometry.attributes.position;

      for (let i = 0; i < positions.count; i++) {
        const ox = originalPositions.getX(i);
        const oy = originalPositions.getY(i);
        const oz = originalPositions.getZ(i);

        // 轻微的波浪运动
        const wave = Math.sin(timeRef.current + i * 0.1) * 0.02;

        positions.setX(i, ox + wave);
        positions.setY(i, oy + Math.cos(timeRef.current + i * 0.15) * 0.02);
        positions.setZ(i, oz + Math.sin(timeRef.current + i * 0.08) * 0.02);
      }

      positions.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material}>
      <bufferGeometry {...geometry} />
    </points>
  );
}
