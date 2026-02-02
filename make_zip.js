const fs = require('fs');
const path = require('path');

// Simple tar.gz creation using native Node.js
const { execSync } = require('child_process');

// Create a clean structure
const distDir = 'frontend/dist';
const files = [
  { src: 'index.html', dest: 'index.html' },
  { src: 'assets/index-BuVgxeW8.css', dest: 'assets/index-BuVgxeW8.css' },
  { src: 'assets/index-Rr_AaBd8.js', dest: 'assets/index-Rr_AaBd8.js' }
];

console.log('Creating deploy.zip...');
