import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * 心形交互效果组件
 */
export default function HeartEffect() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      // 只在左键点击时触发
      if (e.button !== 0) return;

      // 创建心形
      const heart = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: 10 + Math.random() * 20,
        color: ['#FFB7C5', '#FFD1DC', '#FF69B4'][Math.floor(Math.random() * 3)]
      };

      setHearts(prev => [...prev, heart]);

      // 移除心形
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== heart.id));
      }, 1000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return createPortal(
    <>
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="heart-effect"
          style={{
            left: `${heart.x}px`,
            top: `${heart.y}px`,
            fontSize: `${heart.size}px`,
            color: heart.color
          }}
        >
          ❤️
        </div>
      ))}
    </>,
    document.body
  );
}
