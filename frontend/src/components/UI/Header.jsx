/**
 * 头部组件 - 标题（静态版本，无上传功能）
 */
export default function Header({
  title = '樱花树时光机'
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-transparent" />

      {/* 装饰性樱花 */}
      <div className="absolute top-2 left-10 text-2xl opacity-50 animate-pulse">🌸</div>
      <div className="absolute top-4 right-16 text-xl opacity-40 animate-pulse" style={{animationDelay: '0.5s'}}>🌸</div>
      <div className="absolute top-6 left-1/4 text-lg opacity-30 animate-pulse" style={{animationDelay: '1s'}}>🌸</div>

      {/* 内容 */}
      <div className="relative max-w-7xl mx-auto px-3 py-2 md:px-4 md:py-4">
        <div className="flex items-center justify-center gap-2 md:gap-3">
          {/* 标题 */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative">
              <div className="text-2xl md:text-4xl drop-shadow-lg">🌸</div>
              <div className="absolute -top-1 -right-1 text-xs md:text-lg">✨</div>
              <div className="absolute -bottom-1 -left-1 text-[10px] md:text-sm">💕</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 py-2 md:px-5 md:py-3 shadow-lg border border-pink-100">
              <h1 className="text-base md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                {title}
              </h1>
              {/* 桌面端 */}
              <div className="hidden md:flex items-center gap-2 mt-1">
                <span className="text-pink-400 text-sm">💕</span>
                <span className="text-cherry-dark/80 text-sm font-medium">郑涵予</span>
                <span className="text-pink-400 text-sm">&</span>
                <span className="text-cherry-dark/80 text-sm font-medium">张远欣</span>
                <span className="text-pink-400 text-sm">💕</span>
              </div>
              {/* 移动端 */}
              <div className="flex md:hidden items-center justify-center gap-1 mt-1">
                <span className="text-pink-400 text-[10px]">💕</span>
                <span className="text-cherry-dark/80 text-[10px] font-medium">郑涵予</span>
                <span className="text-pink-400 text-[10px]">&</span>
                <span className="text-cherry-dark/80 text-[10px] font-medium">张远欣</span>
                <span className="text-pink-400 text-[10px]">💕</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部装饰线 */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
    </header>
  );
}
