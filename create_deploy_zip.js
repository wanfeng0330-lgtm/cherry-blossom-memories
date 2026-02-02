const fs = require('fs');
const path = require('path');

// 使用 Node.js 原生方式创建 zip
const files = [
  { src: 'frontend/dist/index.html', dest: 'index.html' },
  { src: 'frontend/dist/assets/index-BuVgxeW8.css', dest: 'assets/index-BuVgxeW8.css' },
  { src: 'frontend/dist/assets/index-Rr_AaBd8.js', dest: 'assets/index-Rr_AaBd8.js' }
];

// 使用 child_process 调用 tar（如果有 Git Bash）
const { execSync } = require('child_process');

try {
  // 创建临时目录
  const tempDir = 'temp_deploy';
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true });
  }
  fs.mkdirSync(path.join(tempDir, 'assets'), { recursive: true });
  
  // 复制文件
  files.forEach(f => {
    fs.copyFileSync(f.src, path.join(tempDir, f.dest));
  });
  
  // 使用 tar 打包
  execSync(`tar -czf deploy.tar.gz -C ${tempDir} .`, { stdio: 'inherit' });
  
  // 清理
  fs.rmSync(tempDir, { recursive: true });
  
  console.log('Created: deploy.tar.gz');
  console.log('Upload this file to EdgeOne');
} catch (e) {
  console.log('Error:', e.message);
}
