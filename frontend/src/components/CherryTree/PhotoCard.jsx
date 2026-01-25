import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 照片挂件组件 - 悬浮在树上的照片
 */
export default function PhotoCard({
  photo,
  position,
  rotation,
  onClick,
  index
}) {
  const meshRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState(null);

  // 加载图片纹理
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
    photo.url || photo.thumbnail,
    (loadedTexture) => {
      loadedTexture.colorSpace = THREE.SRGBColorSpace;
      setTexture(loadedTexture);
    },
    undefined,
    (error) => {
      console.error('Failed to load texture:', error);
    }
  );

  // 悬浮动画
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const offset = index * 0.5;
      meshRef.current.position.y =
        position[1] + Math.sin(time * 2 + offset) * 0.1;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick(photo);
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  if (!texture) return null;

  const cardWidth = 0.8;
  const cardHeight = 0.6;

  return (
    <group position={position} rotation={rotation}>
      <Billboard>
        <group
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          {/* 照片卡片背景 */}
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[cardWidth + 0.1, cardHeight + 0.1]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive={hovered ? '#FFB7C5' : '#ffffff'}
              emissiveIntensity={hovered ? 0.5 : 0}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* 照片 */}
          <mesh>
            <planeGeometry args={[cardWidth, cardHeight]} />
            <meshStandardMaterial
              map={texture}
              transparent
              opacity={1}
            />
          </mesh>

          {/* 悬停发光效果 */}
          {hovered && (
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[cardWidth + 0.15, cardHeight + 0.15]} />
              <meshBasicMaterial
                color="#FFB7C5"
                transparent
                opacity={0.3}
              />
            </mesh>
          )}

          {/* 日期标签 */}
          {photo.date && (
            <Text
              position={[0, -cardHeight / 2 - 0.15, 0]}
              fontSize={0.08}
              color="#5D4E5D"
              anchorX="center"
              anchorY="top"
            >
              {new Date(photo.date).toLocaleDateString('zh-CN', {
                month: 'short',
                day: 'numeric'
              })}
            </Text>
          )}
        </group>
      </Billboard>
    </group>
  );
}

/**
 * 照片挂件容器组件
 */
export function PhotoCards({ photos, getPhotoPosition, onPhotoClick }) {
  return (
    <group>
      {photos.map((photo, index) => {
        const posData = getPhotoPosition(photo._id || photo.url);

        if (!posData) return null;

        return (
          <PhotoCard
            key={photo._id || photo.url || index}
            photo={photo}
            position={[
              posData.position.x,
              posData.position.y,
              posData.position.z
            ]}
            rotation={[
              posData.rotation.x,
              posData.rotation.y,
              posData.rotation.z
            ]}
            onClick={onPhotoClick}
            index={index}
          />
        );
      })}
    </group>
  );
}
