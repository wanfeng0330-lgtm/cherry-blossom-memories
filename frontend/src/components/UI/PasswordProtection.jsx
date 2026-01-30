import { useState } from 'react';
import { Lock, Heart } from 'lucide-react';

const CORRECT_PASSWORD = 'zhangyuanxin317';

export default function PasswordProtection({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 简单验证
    if (password === CORRECT_PASSWORD) {
      // 保存解锁状态到 sessionStorage（关闭浏览器后需要重新输入）
      sessionStorage.setItem('cherry_unlocked', 'true');
      onUnlock();
    } else {
      setError('密码错误，请重试');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200">
      {/* 樱花装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-xl md:text-2xl opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            🌸
          </div>
        ))}
      </div>

      {/* 密码输入框 */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md mx-4 border border-pink-100">
        {/* 顶部装饰 */}
        <div className="absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center shadow-lg">
            <Lock size={24} md:size={32} className="text-white" />
          </div>
        </div>

        {/* 标题 */}
        <div className="text-center mt-4 md:mt-6 mb-4 md:mb-6">
          <div className="flex justify-center mb-2 md:mb-3">
            <span className="text-4xl md:text-5xl">🌸</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 md:mb-2">樱花树时光机</h1>
          <p className="text-gray-500 text-xs md:text-sm">请输入密码访问</p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入访问密码"
              className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors text-center text-base md:text-lg"
              autoFocus
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-2 md:p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs md:text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full py-2.5 md:py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            {isLoading ? '验证中...' : '进入'}
          </button>
        </form>

        {/* 底部装饰 */}
        <div className="text-center mt-4 md:mt-6 text-pink-400">
          <Heart size={14} md:size={16} className="inline mr-1" />
          <span className="text-xs md:text-sm">郑涵予 & 张远欣</span>
          <Heart size={14} md:size={16} className="inline ml-1" />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
}
