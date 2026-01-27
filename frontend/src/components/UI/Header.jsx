import { Upload, Music } from 'lucide-react';

/**
 * 头部组�� - 标题和控制按钮
 */
export default function Header({
  title = '樱花树时光机',
  onUploadClick,
  onAudioUploadClick
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
      <div className="relative max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 标题 */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="text-4xl drop-shadow-lg">🌸</div>
              <div className="absolute -top-1 -right-1 text-lg">✨</div>
              <div className="absolute -bottom-1 -left-1 text-sm">💕</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg border border-pink-100">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                {title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-pink-400 text-sm">💕</span>
                <span className="text-cherry-dark/80 text-sm font-medium">郑涵予</span>
                <span className="text-pink-400 text-sm">&</span>
                <span className="text-cherry-dark/80 text-sm font-medium">张远欣</span>
                <span className="text-pink-400 text-sm">💕</span>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-3">
            {/* 音乐上传按钮 */}
            <button
              onClick={onAudioUploadClick}
              className="group p-2.5 bg-purple-500/80 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 relative"
              title="上传音乐"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <Music className="relative text-white" size={20} />
            </button>

            <button
              onClick={onUploadClick}
              className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                <Upload size={18} />
                <span className="font-medium">上传</span>
                <span>📷</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 底部装饰线 */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
    </header>
  );
}
