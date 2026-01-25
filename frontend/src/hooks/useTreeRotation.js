import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { calculateRotationForMonth } from '../utils/photoPosition';

/**
 * 树旋转动画钩子
 * 用于控制樱花树的旋转动画
 */
export function useTreeRotation() {
  const treeRef = useRef(null);
  const currentRotationRef = useRef(0);
  const isAnimatingRef = useRef(false);

  /**
   * 旋转树到指定月份
   * @param {number} month - 目标月份 (1-12)
   * @param {number} duration - 动画持续时间（秒）
   */
  const rotateToMonth = useCallback((month, duration = 1.5) => {
    if (!treeRef.current || isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    const targetRotation = calculateRotationForMonth(month);

    gsap.to(treeRef.current.rotation, {
      y: targetRotation,
      duration,
      ease: 'power2.inOut',
      onComplete: () => {
        isAnimatingRef.current = false;
        currentRotationRef.current = targetRotation;
      }
    });
  }, []);

  /**
   * 旋转树到指定角度
   * @param {number} angle - 目标角度（弧度）
   * @param {number} duration - 动画持续时间（秒）
   */
  const rotateToAngle = useCallback((angle, duration = 1.5) => {
    if (!treeRef.current || isAnimatingRef.current) return;

    isAnimatingRef.current = true;

    gsap.to(treeRef.current.rotation, {
      y: angle,
      duration,
      ease: 'power2.inOut',
      onComplete: () => {
        isAnimatingRef.current = false;
        currentRotationRef.current = angle;
      }
    });
  }, []);

  /**
   * 自动旋转
   * @param {boolean} enabled - 是否启用自动旋转
   * @param {number} speed - 旋转速度
   */
  const toggleAutoRotate = useCallback((enabled, speed = 0.001) => {
    if (!treeRef.current) return;

    if (enabled) {
      gsap.to(treeRef.current.rotation, {
        y: treeRef.current.rotation.y + Math.PI * 2,
        duration: 60 / speed,
        ease: 'none',
        repeat: -1
      });
    } else {
      gsap.killTweensOf(treeRef.current.rotation);
    }
  }, []);

  /**
   * 重置旋转
   */
  const resetRotation = useCallback((duration = 1) => {
    if (!treeRef.current) return;

    gsap.to(treeRef.current.rotation, {
      y: 0,
      duration,
      ease: 'power2.out'
    });
  }, []);

  return {
    treeRef,
    currentRotation: currentRotationRef,
    rotateToMonth,
    rotateToAngle,
    toggleAutoRotate,
    resetRotation,
    isAnimating: isAnimatingRef
  };
}
