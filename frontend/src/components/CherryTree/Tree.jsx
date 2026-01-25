import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Trunk from './Trunk';
import { Branches } from './Branch';
import Blossom from './Blossom';
import { PhotoCards } from './PhotoCard';
import FallingPetals from './FallingPetals';
import { useTreeRotation } from '../../hooks/useTreeRotation';
import { usePhotoPosition } from '../../hooks/usePhotoPosition';

/**
 * 主樱花树组件 - 程序化生成的完整樱花树
 */
export default function Tree({
  photos = [],
  selectedMonth,
  onPhotoClick,
  autoRotate = false
}) {
  const treeGroupRef = useRef(null);
  const [branches, setBranches] = useState([]);

  const { treeRef, rotateToMonth, toggleAutoRotate } = useTreeRotation();
  const { getPhotoPosition } = usePhotoPosition(photos);

  // 构建树枝数据
  const branchesData = useMemo(() => {
    const result = [];
    const branchCount = 8;
    const subBranchCount = 4;

    // 主树枝
    for (let i = 0; i < branchCount; i++) {
      const angle = (i / branchCount) * Math.PI * 2;
      const upwardAngle = Math.PI / 6;
      const branchLength = 2.5;

      const start = new THREE.Vector3(0, 3, 0);
      const direction = new THREE.Vector3(
        Math.cos(angle) * Math.cos(upwardAngle),
        Math.sin(upwardAngle),
        Math.sin(angle) * Math.cos(upwardAngle)
      ).normalize();

      const end = start.clone().add(direction.clone().multiplyScalar(branchLength));

      result.push({ start, end, level: 0, index: i });

      // 次级树枝
      for (let j = 0; j < subBranchCount; j++) {
        const subAngle = angle + ((j - subBranchCount / 2) * 0.3);
        const subUpward = Math.PI / 4;
        const subLength = 1.2;

        const subDirection = new THREE.Vector3(
          Math.cos(subAngle) * Math.cos(subUpward),
          Math.sin(subUpward),
          Math.sin(subAngle) * Math.cos(subUpward)
        ).normalize();

        const subEnd = end.clone().add(subDirection.clone().multiplyScalar(subLength));

        result.push({ start: end, end: subEnd, level: 1, index: j });
      }
    }

    return result;
  }, []);

  // 同步treeRef和treeGroupRef
  const setRefs = (node) => {
    treeGroupRef.current = node;
    treeRef.current = node;
  };

  // 处理月份变化
  const handleMonthChange = (month) => {
    rotateToMonth(month);
  };

  // 监听selectedMonth变化
  useMemo(() => {
    if (selectedMonth) {
      handleMonthChange(selectedMonth);
    }
  }, [selectedMonth]);

  // 控制自动旋转
  useMemo(() => {
    toggleAutoRotate(autoRotate, 0.0005);
  }, [autoRotate, toggleAutoRotate]);

  return (
    <group ref={setRefs}>
      {/* 树干 */}
      <Trunk position={[0, 0, 0]} />

      {/* 树枝 */}
      <Branches position={[0, 3, 0]} />

      {/* 樱花 */}
      <Blossom branches={branchesData} />

      {/* 照片挂件 */}
      <PhotoCards
        photos={photos}
        getPhotoPosition={getPhotoPosition}
        onPhotoClick={onPhotoClick}
      />

      {/* 飘落花瓣 */}
      <FallingPetals enabled={true} />
    </group>
  );
}

/**
 * 完整的3D场景组件
 */
export function CherryBlossomScene({
  photos = [],
  selectedMonth,
  onPhotoClick,
  autoRotate = false
}) {
  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#FFB7C5" />

      {/* 樱花树 */}
      <Tree
        photos={photos}
        selectedMonth={selectedMonth}
        onPhotoClick={onPhotoClick}
        autoRotate={autoRotate}
      />

      {/* 地面 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <circleGeometry args={[8, 32]} />
        <meshStandardMaterial
          color="#90EE90"
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* 环境贴图 */}
      <Environment preset="sunset" />

      {/* 轨道控制 */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        autoRotate={false}
      />
    </>
  );
}
