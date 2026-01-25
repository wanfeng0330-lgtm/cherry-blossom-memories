/**
 * 加载动画组件
 */
export default function LoadingSpinner({ size = 'md', text = '加载中...' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className={`spinner rounded-full ${sizeClasses[size]}`} />
      {text && (
        <p className="text-cherry-dark/70 text-sm">{text}</p>
      )}
    </div>
  );
}
