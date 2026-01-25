import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createTrunkMaterial } from '../../utils/treeGeometry';

/**
 * 树干组件 - 程序化生成的樱花树干
 */
export default function Trunk({ position = [0, 0, 0] }) {
  const meshRef = useRef(null);

  // 创建树干几何体
  const geometry = useRef(() => {
    const { trunkHeight, trunkRadiusTop, trunkRadiusBottom } = {
      trunkHeight: 4,
      trunkRadiusTop: 0.3,
      trunkRadiusBottom: 0.5
    };

    const geom = new THREE.CylinderGeometry(
      trunkRadiusTop,
      trunkRadiusBottom,
      trunkHeight,
      8
    );

    // 添加顶点扰动，使树干看起来更自然
    const positions = geom.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i);

      // 在底部添加更多扰动
      const heightFactor = 1 - (vertex.y + trunkHeight / 2) / trunkHeight;
      const perturbation = 0.08 * heightFactor;

      vertex.x += (Math.random() - 0.5) * perturbation;
      vertex.z += (Math.random() - 0.5) * perturbation;

      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    geom.computeVertexNormals();
    return geom;
  })();

  const material = createTrunkMaterial();

  return (
    <mesh
      ref={meshRef}
      geometry={geometry.current}
      material={material}
      position={position}
      castShadow
      receiveShadow
    />
  );
}
