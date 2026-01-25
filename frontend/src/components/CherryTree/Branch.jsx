import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { createBranchMaterial } from '../../utils/treeGeometry';
import { TREE_CONFIG } from '../../utils/constants';

/**
 * 树枝组件 - 递归生成的樱花树枝
 */
export default function Branch({
  level = 0,
  parentPosition = new THREE.Vector3(0, 2, 0),
  parentDirection = new THREE.Vector3(0, 1, 0)
}) {
  const groupRef = useRef(null);

  const branches = useMemo(() => {
    const branchCount = level === 0 ? TREE_CONFIG.branchCount : TREE_CONFIG.subBranchCount;
    const branchLength = level === 0 ? 2.5 : 1.2;
    const branchRadius = level === 0 ? 0.08 : 0.04;

    const result = [];

    for (let i = 0; i < branchCount; i++) {
      // 计算树枝方向（从父方向偏移）
      const baseAngle = (i / branchCount) * Math.PI * 2;
      const upwardAngle = level === 0 ? Math.PI / 6 : Math.PI / 4;

      const direction = new THREE.Vector3(
        Math.cos(baseAngle) * Math.cos(upwardAngle),
        Math.sin(upwardAngle),
        Math.sin(baseAngle) * Math.cos(upwardAngle)
      ).normalize();

      const start = parentPosition.clone();
      const end = start.clone().add(direction.clone().multiplyScalar(branchLength));

      // 创建树枝几何体
      const geometry = new THREE.CylinderGeometry(
        branchRadius * 0.7,
        branchRadius,
        branchLength,
        6
      );

      // 创建变换矩阵来定位和旋转树枝
      const matrix = new THREE.Matrix4();

      // 首先移动到原点
      matrix.makeTranslation(0, branchLength / 2, 0);

      // 计算旋转（使圆柱体从Y轴旋转到目标方向）
      const up = new THREE.Vector3(0, 1, 0);
      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(up, direction);

      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.makeRotationFromQuaternion(quaternion);

      // 组合变换
      const finalMatrix = new THREE.Matrix4();
      finalMatrix.multiplyMatrices(rotationMatrix, matrix);
      finalMatrix.setPosition(start);

      geometry.applyMatrix4(finalMatrix);
      geometry.computeVertexNormals();

      result.push({
        geometry,
        end,
        direction,
        level
      });

      // 递归创建次级树枝
      if (level < TREE_CONFIG.maxDepth) {
        const subBranches = (
          <Branch
            key={`sub-${i}`}
            level={level + 1}
            parentPosition={end}
            parentDirection={direction}
          />
        );
        result.push(subBranches);
      }
    }

    return result;
  }, [level, parentPosition, parentDirection]);

  const material = createBranchMaterial();

  return (
    <group ref={groupRef}>
      {branches.map((branch, index) => {
        if (branch.geometry) {
          return (
            <mesh
              key={`branch-${level}-${index}`}
              geometry={branch.geometry}
              material={material}
              castShadow
            />
          );
        }
        return branch;
      })}
    </group>
  );
}

/**
 * 所有树枝的容器组件
 */
export function Branches({ position = [0, 3, 0] }) {
  return (
    <group position={position}>
      <Branch level={0} parentPosition={new THREE.Vector3(0, 0, 0)} />
    </group>
  );
}
