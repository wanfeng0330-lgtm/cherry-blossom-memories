import { useEffect, useState, useMemo, useRef } from 'react';
import { useStore } from './store/useStore';
import { List } from 'lucide-react';
import Header from './components/UI/Header';
import Timeline from './components/Timeline/Timeline';
import PhotoModal from './components/UI/PhotoModal';
import PhotoListView from './components/UI/PhotoListView';
import MusicPlayer from './components/UI/MusicPlayer';
import HeartEffect from './components/UI/HeartEffect';
import PasswordProtection from './components/UI/PasswordProtection';

// 照片卡片组件
function PhotoCard({ photo, index, total, onClick, x, y, width, height }) {
  const zIndex = 10 + index;

  return (
    <div
      className="absolute cursor-pointer transition-all duration-300 hover:scale-110 hover:z-50"
      style={{
        left: `calc(50% + ${x}px - ${width / 2}px)`,
        top: `calc(40% + ${y}px - ${height / 2}px)`,
        zIndex,
        animation: `float 3s ease-in-out ${index * 0.2}s infinite`
      }}
      onClick={() => onClick(photo)}
    >
      {/* 光晕效果 */}
      <div
        className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: 'radial-gradient(circle, rgba(255,183,197,0.4) 0%, transparent 70%)'
        }}
      />

      {/* 照片边框 */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-3 transition-all duration-300 hover:shadow-pink-200"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          boxShadow: '0 15px 40px rgba(255, 105, 180, 0.3), 0 0 0 1px rgba(255, 183, 197, 0.2)'
        }}
      >
        {/* 照片内容 */}
        <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center relative">
          {/* 装饰性小爱心 */}
          <div className="absolute top-1 right-1 text-xs opacity-50">💕</div>
          <div className="absolute bottom-1 left-1 text-xs opacity-50">✨</div>

          <img
            src={photo.url || photo.thumbnail}
            alt={photo.caption || '照片'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                  <defs>
                    <linearGradient id="pinkGrad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#FFB7C5"/>
                      <stop offset="100%" style="stop-color:#FFD1DC"/>
                    </linearGradient>
                  </defs>
                  <rect fill="url(#pinkGrad${index})" width="${width}" height="${height}" rx="8"/>
                  <text x="${width/2}" y="${height/2 - 5}" text-anchor="middle" fill="#fff" font-size="${Math.floor(width/6)}">📷</text>
                  <text x="${width/2}" y="${height*0.7}" text-anchor="middle" fill="#fff" font-size="${Math.floor(width/10)}">${new Date(photo.date).toLocaleDateString('zh-CN', {month: 'short', day: 'numeric'})}</text>
                </svg>
              `);
            }}
          />
        </div>

        {/* 悬浮发光效果 */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-pink-300 rounded-2xl animate-pulse" style={{ mixBlendMode: 'overlay', opacity: 0.3 }} />
        </div>
      </div>
    </div>
  );
}

/**
 * 主应用组件
 */
export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isListViewOpen, setIsListViewOpen] = useState(false);
  const photoPositionsRef = useRef(null);

  const {
    photos,
    selectedMonth,
    selectedYear,
    isPhotoModalOpen,
    selectedPhoto,
    fetchPhotos,
    fetchAudios,
    openPhotoModal,
    closePhotoModal,
    getMonthStats,
    setSelectedMonth,
    setSelectedYear
  } = useStore();

  // 检查是否已解锁
  useEffect(() => {
    const unlocked = sessionStorage.getItem('cherry_unlocked') === 'true';
    setIsUnlocked(unlocked);
  }, []);

  // 初始化加载数据
  useEffect(() => {
    if (isUnlocked) {
      // 从2023年10月开始
      setSelectedYear(2023);
      setSelectedMonth(10);

      Promise.all([
        fetchPhotos(),
        fetchAudios()
      ]).then(() => setIsReady(true)).catch(() => setIsReady(true));
    }
  }, [isUnlocked, fetchPhotos, fetchAudios, setSelectedYear, setSelectedMonth]);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  // 未解锁显示密码输入
  if (!isUnlocked) {
    return <PasswordProtection onUnlock={handleUnlock} />;
  }

  // 加载中
  if (!isReady) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-50 flex items-center justify-center relative overflow-hidden">
        {/* 加载时的樱花装饰 */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-3xl opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`
              }}
            >
              🌸
            </div>
          ))}
        </div>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🌸</div>
          <p className="text-pink-500 text-lg">正在加载美好回忆...</p>
        </div>
      </div>
    );
  }

  // 获取月份统计
  const monthStats = getMonthStats();

  // 计算照片位置的缓存key
  const currentPhotosKey = `${selectedYear}-${selectedMonth}-${photos.length}`;

  // 计算照片在树周围的位置（只在月份或照片数量变化时重新计算）
  const getPhotoPositions = () => {
    // 如果缓存存在且key相同，直接返回缓存
    if (photoPositionsRef.current && photoPositionsRef.current.key === currentPhotosKey) {
      return photoPositionsRef.current.positions;
    }

    const positions = [];
    const currentMonthPhotos = photos.filter(p => {
      const date = new Date(p.date);
      return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear;
    });

    const count = currentMonthPhotos.length;
    if (count === 0) {
      photoPositionsRef.current = { key: currentPhotosKey, positions };
      return positions;
    }

    // 检测是否为移动端
    const isMobile = window.innerWidth < 768;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // ========== 圆形布局（套圈策略）==========
    // 根据照片数量决定半径和大小
    let minSize, maxSize, baseRadius, radiusStep;

    if (isMobile) {
      // 移动端参数
      if (count <= 6) {
        minSize = 85; maxSize = 100; baseRadius = 100; radiusStep = 0;
      } else if (count <= 10) {
        minSize = 70; maxSize = 90; baseRadius = 110; radiusStep = 0;
      } else if (count <= 15) {
        minSize = 60; maxSize = 80; baseRadius = 100; radiusStep = 55;
      } else if (count <= 20) {
        minSize = 50; maxSize = 70; baseRadius = 95; radiusStep = 50;
      } else {
        minSize = 45; maxSize = 65; baseRadius = 90; radiusStep = 45;
      }
    } else {
      // 桌面端参数
      if (count <= 8) {
        minSize = 110; maxSize = 160; baseRadius = 180; radiusStep = 0;
      } else if (count <= 15) {
        minSize = 90; maxSize = 130; baseRadius = 190; radiusStep = 0;
      } else if (count <= 25) {
        minSize = 80; maxSize = 120; baseRadius = 170; radiusStep = 80;
      } else if (count <= 35) {
        minSize = 65; maxSize = 100; baseRadius = 160; radiusStep = 70;
      } else {
        minSize = 55; maxSize = 85; baseRadius = 150; radiusStep = 60;
      }
    }

    const size = Math.max(minSize, Math.min(maxSize, Math.floor((isMobile ? 380 : 600) / Math.sqrt(count))));
    const width = size;
    const height = Math.floor(size * 0.75);

    // 心形缩放因子
    const heartScale = isMobile ? 10 : 16;

    currentMonthPhotos.forEach((photo, index) => {
      // 心形参数方程
      // t 从 0 到 2π
      const t = (index / count) * 2 * Math.PI;

      // 心形公式
      const heartX = 16 * Math.pow(Math.sin(t), 3);
      const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)); // y轴翻转

      const randomOffset = isMobile ? 10 : 15;

      const x = heartX * heartScale + (Math.random() - 0.5) * randomOffset;
      const y = heartY * heartScale * 0.55 + (Math.random() - 0.5) * randomOffset; // 压扁y轴让心形更自然

      positions.push({
        photo,
        x,
        y,
        width,
        height
      });
    });

    // 缓存结果
    photoPositionsRef.current = { key: currentPhotosKey, positions };
    return positions;
  };

  // 处理月份变化
  const handleMonthChange = (month, year) => {
    setSelectedMonth(month);
    if (year) {
      setSelectedYear(year);
    }
  };

  // 处理照片点击
  const handlePhotoClick = (photo) => {
    openPhotoModal(photo);
  };

  const photoPositions = getPhotoPositions();

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <div className="h-full flex flex-col">
        {/* 樱花飘落动画 */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                fontSize: `${12 + Math.random() * 16}px`,
                opacity: 0.4 + Math.random() * 0.4,
                animation: `fall ${6 + Math.random() * 6}s linear infinite`,
                animationDelay: `${Math.random() * 8}s`
              }}
            >
              🌸
            </div>
          ))}
        </div>

        {/* 漂浮爱心装饰 */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute text-lg"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                opacity: 0.2 + Math.random() * 0.3,
                animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            >
              💕
            </div>
          ))}
        </div>

        {/* 闪光星星效果 */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `sparkle ${2 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            >
              ✨
            </div>
          ))}
        </div>

        {/* 装饰性圆圈背景 */}
        <div className="fixed top-20 left-5 md:left-10 w-20 md:w-32 h-20 md:h-32 rounded-full bg-pink-200/20 blur-3xl pointer-events-none" />
        <div className="fixed top-40 right-5 md:right-20 w-24 md:w-48 h-24 md:h-48 rounded-full bg-rose-200/20 blur-3xl pointer-events-none" />
        <div className="fixed bottom-40 left-5 md:left-20 w-20 md:w-40 h-20 md:h-40 rounded-full bg-pink-300/20 blur-3xl pointer-events-none" />
        <div className="fixed bottom-20 right-5 md:right-10 w-20 md:w-36 h-20 md:h-36 rounded-full bg-rose-300/20 blur-3xl pointer-events-none" />

        {/* 头部 */}
        <Header />

        {/* 主场景区域 */}
        <div className="relative flex-1 flex items-center justify-center z-10 min-h-0">
          {/* 中心装饰 */}
          <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 blur-2xl opacity-50 pointer-events-none" />

          {/* 照片卡片 */}
          {photoPositions.map(({ photo, x, y, width, height }) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              index={photoPositions.findIndex(p => p.photo.id === photo.id)}
              total={photoPositions.length}
              onClick={handlePhotoClick}
              x={x}
              y={y}
              width={width}
              height={height}
            />
          ))}

          {/* 提示文字 */}
          {photoPositions.length === 0 && (
            <div className="absolute bottom-16 md:bottom-20 text-center z-10 px-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl">
                <p className="text-xl md:text-2xl mb-2">🌸</p>
                <p className="text-pink-500 text-base md:text-lg font-medium">这个月份还没有照片哦~</p>
              </div>
            </div>
          )}
        </div>

        {/* 时间轴 */}
        <Timeline
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={handleMonthChange}
          onYearChange={setSelectedYear}
          monthStats={monthStats}
        />
      </div>

      {/* 照片详情弹窗 */}
      <PhotoModal
        photo={selectedPhoto}
        isOpen={isPhotoModalOpen}
        onClose={closePhotoModal}
      />

      {/* 列表视图按钮 */}
      <button
        onClick={() => setIsListViewOpen(true)}
        className="fixed right-3 md:right-6 top-20 md:top-24 z-40 bg-white/90 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-lg hover:bg-pink-50 transition-all hover:scale-110"
        title="列表视图"
      >
        <List size={20} className="text-pink-500" />
      </button>

      {/* 照片列表视图 */}
      <PhotoListView
        isOpen={isListViewOpen}
        photos={photos}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onClose={() => setIsListViewOpen(false)}
        onPhotoClick={openPhotoModal}
      />

      {/* 音乐播放器 */}
      <MusicPlayer />

      {/* 心形交互效果 */}
      <HeartEffect />

      {/* 底部印记 */}
      <div className="fixed bottom-1 md:bottom-2 left-0 right-0 text-center z-40 pointer-events-none">
        <p className="text-[10px] md:text-xs text-pink-400/70">
          💕 郑涵予 & 张远欣 的浪漫时光 💕
        </p>
      </div>

      {/* 样式动画 */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) rotate(360deg) scale(0.8);
            opacity: 0.7;
          }
          100% {
            transform: translateY(110vh) rotate(720deg) scale(0.6);
            opacity: 0.3;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes sparkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
