import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TREE_CONFIG } from '../../utils/constants';

/**
 * 飘落花瓣动画组件
 */
export default function FallingPetals({ enabled = true }) {
  const petalsRef = useRef(null);
  const velocitiesRef = useRef([]);

  // 创建花瓣粒子系统
  const { geometry, material, count } = useMemo(() => {
    const petalCount = TREE_CONFIG.petalCount;

    // 创建花瓣形状（圆形）
    const petalGeometry = new THREE.CircleGeometry(0.05, 8);

    // 创建材质
    const petalMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFB7C5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });

    // 创建实例化几何体以提高性能
    const instancedGeometry = new THREE.InstancedBufferGeometry();
    instancedGeometry.index = petalGeometry.index;
    instancedGeometry.attributes.position = petalGeometry.attributes.position;
    instancedGeometry.attributes.uv = petalGeometry.attributes.uv;

    // 初始化位置
    const positions = new Float32Array(petalCount * 3);
    const randoms = new Float32Array(petalCount * 4); // random values for animation

    for (let i = 0; i < petalCount; i++) {
      // 随机初始位置
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = 5 + Math.random() * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

      // 随机参数
      randoms[i * 4] = Math.random(); // speed multiplier
      randoms[i * 4 + 1] = Math.random(); // horizontal sway
      randoms[i * 4 + 2] = Math.random(); // rotation speed
      randoms[i * 4 + 3] = Math.random(); // size
    }

    instancedGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    instancedGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 4));

    return {
      geometry: instancedGeometry,
      material: petalMaterial,
      count: petalCount
    };
  }, []);

  // 初始化速度
  useEffect(() => {
    velocitiesRef.current = [];
    for (let i = 0; i < count; i++) {
      velocitiesRef.current.push({
        y: -0.01 - Math.random() * 0.02,
        sway: (Math.random() - 0.5) * 0.02,
        rotSpeed: (Math.random() - 0.5) * 0.05
      });
    }
  }, [count]);

  // 动画循环
  useFrame((state) => {
    if (!petalsRef.current || !enabled) return;

    const positions = petalsRef.current.geometry.attributes.position;
    const randoms = petalsRef.current.geometry.attributes.aRandom;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const vel = velocitiesRef.current[i];
      const speedMult = randoms.array[i * 4];
      const sway = randoms.array[i * 4 + 1];
      const size = 0.3 + randoms.array[i * 4 + 3] * 0.5;

      let x = positions.array[i * 3];
      let y = positions.array[i * 3 + 1];
      let z = positions.array[i * 3 + 2];

      // 更新位置
      y += vel.y * speedMult;
      x += Math.sin(time * 0.5 + i * sway) * 0.003;
      z += Math.cos(time * 0.5 + i * sway) * 0.003;

      // 重置到底部的花瓣
      if (y < -3) {
        y = 5 + Math.random() * 2;
        x = (Math.random() - 0.5) * 12;
        z = (Math.random() - 0.5) * 12;
      }

      positions.array[i * 3] = x;
      positions.array[i * 3 + 1] = y;
      positions.array[i * 3 + 2] = z;
    }

    positions.needsUpdate = true;
  });

  if (!enabled) return null;

  return (
    <instancedMesh
      ref={petalsRef}
      args={[geometry, material, count]}
      position={[0, 0, 0]}
    >
      <instancedBufferGeometry {...geometry} />
      <meshBasicMaterial {...material} />
    </instancedMesh>
  );
}
