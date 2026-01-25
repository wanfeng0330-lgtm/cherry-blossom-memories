import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { TREE_CONFIG, ANIMATION_CONFIG } from '../utils/constants';

/**
 * 花瓣飘落动画钩子
 * 创建和管理樱花飘落效果
 */
export function usePetalsAnimation() {
  const petalsRef = useRef(null);
  const animationRef = useRef(null);

  /**
   * 创建单个花瓣几何体
   */
  const createPetalGeometry = useCallback(() => {
    // 使用圆形几何体作为花瓣
    const geometry = new THREE.CircleGeometry(0.05, 8);
    return geometry;
  }, []);

  /**
   * 创建花瓣材质
   */
  const createPetalMaterial = useCallback(() => {
    return new THREE.MeshBasicMaterial({
      color: 0xFFB7C5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
  }, []);

  /**
   * 创建花瓣实例
   */
  const createPetals = useCallback(() => {
    const { petalCount } = TREE_CONFIG;
    const geometry = createPetalGeometry();
    const material = createPetalMaterial();

    const petals = [];
    const velocities = [];

    for (let i = 0; i < petalCount; i++) {
      const mesh = new THREE.Mesh(geometry, material.clone());

      // 随机初始位置（在树上方）
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        5 + Math.random() * 3,
        (Math.random() - 0.5) * 10
      );

      // 随机旋转
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      // 随机缩放
      const scale = 0.5 + Math.random() * 0.5;
      mesh.scale.set(scale, scale, scale);

      petals.push(mesh);

      // 随机速度
      velocities.push({
        y: -0.01 - Math.random() * 0.02,
        x: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01,
        rotX: (Math.random() - 0.5) * 0.02,
        rotY: (Math.random() - 0.5) * 0.02,
        rotZ: (Math.random() - 0.5) * 0.02
      });
    }

    const group = new THREE.Group();
    petals.forEach(petal => group.add(petal));

    return { group, velocities };
  }, [createPetalGeometry, createPetalMaterial]);

  /**
   * 动画循环
   */
  const animatePetals = useCallback((group, velocities) => {
    return () => {
      group.children.forEach((petal, i) => {
        const vel = velocities[i];

        // 更新位置
        petal.position.x += vel.x + Math.sin(Date.now() * 0.001 + i) * 0.002;
        petal.position.y += vel.y;
        petal.position.z += vel.z + Math.cos(Date.now() * 0.001 + i) * 0.002;

        // 更新旋转
        petal.rotation.x += vel.rotX;
        petal.rotation.y += vel.rotY;
        petal.rotation.z += vel.rotZ;

        // 重置到底部的花瓣
        if (petal.position.y < -2) {
          petal.position.y = 5 + Math.random() * 2;
          petal.position.x = (Math.random() - 0.5) * 10;
          petal.position.z = (Math.random() - 0.5) * 10;
        }
      });
    };
  }, []);

  /**
   * 初始化花瓣系统
   */
  const initPetals = useCallback(() => {
    if (petalsRef.current) return;

    const { group, velocities } = createPetals();
    petalsRef.current = { group, velocities };

    return group;
  }, [createPetals]);

  /**
   * 开始动画
   */
  const startAnimation = useCallback(() => {
    if (!petalsRef.current) return;

    const animate = animatePetals(petalsRef.current.group, petalsRef.current.velocities);

    const loop = () => {
      animate();
      animationRef.current = requestAnimationFrame(loop);
    };

    loop();
  }, [animatePetals]);

  /**
   * 停止动画
   */
  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  /**
   * 清理资源
   */
  const cleanup = useCallback(() => {
    stopAnimation();

    if (petalsRef.current) {
      petalsRef.current.group.children.forEach(petal => {
        petal.geometry.dispose();
        petal.material.dispose();
      });
      petalsRef.current = null;
    }
  }, [stopAnimation]);

  return {
    petalsRef,
    initPetals,
    startAnimation,
    stopAnimation,
    cleanup
  };
}
