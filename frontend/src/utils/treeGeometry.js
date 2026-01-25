import * as THREE from 'three';
import { TREE_CONFIG, COLORS } from './constants';

/**
 * 创建樱花树几何体 - 程序化生成
 */

// 创建树干
export function createTrunkGeometry() {
  const { trunkHeight, trunkRadiusTop, trunkRadiusBottom } = TREE_CONFIG;
  const geometry = new THREE.CylinderGeometry(
    trunkRadiusTop,
    trunkRadiusBottom,
    trunkHeight,
    8
  );

  // 添加顶点扰动，使树干看起来更自然
  const positions = geometry.attributes.position;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < positions.count; i++) {
    vertex.fromBufferAttribute(positions, i);

    // 在底部添加更多扰动
    const heightFactor = 1 - (vertex.y + trunkHeight / 2) / trunkHeight;
    const perturbation = 0.05 * heightFactor;

    vertex.x += (Math.random() - 0.5) * perturbation;
    vertex.z += (Math.random() - 0.5) * perturbation;

    positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  geometry.computeVertexNormals();
  return geometry;
}

// 创建树枝
export function createBranchGeometry(level = 0, parentPosition = new THREE.Vector3(0, 2, 0)) {
  const branches = [];
  const branchCount = level === 0 ? TREE_CONFIG.branchCount : TREE_CONFIG.subBranchCount;
  const branchLength = level === 0 ? 2.5 : 1.2;
  const branchRadius = level === 0 ? 0.08 : 0.04;

  for (let i = 0; i < branchCount; i++) {
    const angle = (i / branchCount) * Math.PI * 2;
    const upwardAngle = level === 0 ? Math.PI / 6 : Math.PI / 4;

    const start = parentPosition.clone();
    const end = new THREE.Vector3(
      Math.cos(angle) * Math.cos(upwardAngle) * branchLength,
      Math.sin(upwardAngle) * branchLength,
      Math.sin(angle) * Math.cos(upwardAngle) * branchLength
    ).add(start);

    const geometry = new THREE.CylinderGeometry(
      branchRadius * 0.7,
      branchRadius,
      branchLength,
      6
    );

    // 调整树枝位置和方向
    geometry.translate(0, branchLength / 2, 0);
    geometry.rotateX(Math.PI / 2 - upwardAngle);
    geometry.rotateY(angle);

    branches.push({
      geometry,
      start,
      end,
      level,
      index: i
    });

    // 递归创建次级树枝
    if (level < TREE_CONFIG.maxDepth) {
      const subBranches = createBranchGeometry(level + 1, end);
      branches.push(...subBranches);
    }
  }

  return branches;
}

// 创建樱花粒子
export function createBlossomTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // 创建樱花花瓣形状
  ctx.beginPath();
  ctx.moveTo(32, 32);

  // 使用多个贝塞尔曲线创建花瓣形状
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const nextAngle = ((i + 1) / 5) * Math.PI * 2;
    const cp1x = 32 + Math.cos(angle) * 28;
    const cp1y = 32 + Math.sin(angle) * 28;
    const cp2x = 32 + Math.cos(angle + 0.3) * 20;
    const cp2y = 32 + Math.sin(angle + 0.3) * 20;
    const endX = 32 + Math.cos(nextAngle) * 8;
    const endY = 32 + Math.sin(nextAngle) * 8;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
  }

  ctx.closePath();

  // 创建渐变填充
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.5, 'rgba(255, 183, 197, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 183, 197, 0)');

  ctx.fillStyle = gradient;
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 创建樱花树材质
export function createTrunkMaterial() {
  return new THREE.MeshStandardMaterial({
    color: COLORS.trunkBrown,
    roughness: 0.9,
    metalness: 0.1
  });
}

export function createBranchMaterial() {
  return new THREE.MeshStandardMaterial({
    color: COLORS.trunkBrown,
    roughness: 0.85,
    metalness: 0.05
  });
}

export function createBlossomMaterial() {
  return new THREE.PointsMaterial({
    color: COLORS.cherryPink,
    size: 0.15,
    map: createBlossomTexture(),
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
}

// 计算樱花在树上的位置
export function calculateBlossomPositions(branches) {
  const positions = [];
  const colors = [];

  branches.forEach(branch => {
    const blossomCount = branch.level === 0 ? 60 : 30;

    for (let i = 0; i < blossomCount; i++) {
      const t = 0.3 + Math.random() * 0.7;
      const x = THREE.MathUtils.lerp(branch.start.x, branch.end.x, t);
      const y = THREE.MathUtils.lerp(branch.start.y, branch.end.y, t);
      const z = THREE.MathUtils.lerp(branch.start.z, branch.end.z, t);

      // 添加一些随机偏移
      const offset = 0.3;
      const px = x + (Math.random() - 0.5) * offset;
      const py = y + (Math.random() - 0.5) * offset;
      const pz = z + (Math.random() - 0.5) * offset;

      positions.push(px, py, pz);

      // 添加颜色变化
      const colorVariation = Math.random() * 0.2;
      colors.push(
        1 + colorVariation,
        0.7 + colorVariation * 0.5,
        0.75 + colorVariation * 0.5
      );
    }
  });

  return { positions, colors };
}

// 生成完整的樱花树数据
export function generateCherryTreeData() {
  const trunkGeometry = createTrunkGeometry();
  const branches = createBranchGeometry(0, new THREE.Vector3(0, TREE_CONFIG.trunkHeight - 1, 0));
  const blossomPositions = calculateBlossomPositions(branches);

  return {
    trunk: trunkGeometry,
    branches,
    blossomPositions
  };
}
