// 常量配置文件

export const MONTHS = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
];

export const COLORS = {
  cherryPink: 0xFFB7C5,
  cherryLight: 0xFFD1DC,
  cherryBright: 0xFF69B4,
  cherryDark: 0x5D4E5D,
  trunkBrown: 0x8B5A2B,
  leafGreen: 0x90EE90
};

export const TREE_CONFIG = {
  trunkHeight: 4,
  trunkRadiusTop: 0.3,
  trunkRadiusBottom: 0.5,
  branchCount: 8,
  subBranchCount: 4,
  maxDepth: 2,
  blossomCount: 500,
  petalCount: 50
};

export const ANIMATION_CONFIG = {
  rotationDuration: 1.5,
  floatAmplitude: 0.1,
  floatSpeed: 0.001,
  petalFallSpeed: 0.02,
  petalFallDuration: 10000
};

export const API_ENDPOINTS = {
  photos: '/api/photos',
  upload: '/api/upload',
  photosByMonth: (month) => `/api/photos/month/${month}`
};

export const PHOTO_POSITIONS = {
  minRadius: 2.5,
  maxRadius: 4.5,
  minHeight: 1.5,
  maxHeight: 4.5,
  anglePerMonth: 30 // 360 / 12 = 30 degrees per month
};

export const FILE_UPLOAD = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};
