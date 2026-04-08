#!/usr/bin/env node
/**
 * Verification script to check monorepo setup
 * Run: node verify-setup.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const checks = [];

function check(name, fn) {
  try {
    fn();
    checks.push({ name, status: '✓', message: 'OK' });
    return true;
  } catch (err) {
    checks.push({ name, status: '✗', message: err.message });
    return false;
  }
}

console.log('🔍 Verifying Sout-Elyad Setup...\n');

// Check 1: Root package.json exists
check('Root package.json', () => {
  if (!fs.existsSync('package.json')) throw new Error('Missing package.json');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!pkg.scripts.dev) throw new Error('Missing dev script');
});

// Check 2: Backend exists
check('Backend directory', () => {
  if (!fs.existsSync('backend')) throw new Error('Backend directory not found');
  if (!fs.existsSync('backend/package.json')) throw new Error('Backend package.json missing');
  if (!fs.existsSync('backend/server.js')) throw new Error('Backend server.js missing');
});

// Check 3: Frontend exists
check('Frontend directory', () => {
  if (!fs.existsSync('frontend')) throw new Error('Frontend directory not found');
  if (!fs.existsSync('frontend/package.json')) throw new Error('Frontend package.json missing');
  if (!fs.existsSync('frontend/vite.config.js')) throw new Error('Frontend vite.config.js missing');
});

// Check 4: Backend dependencies
check('Backend dependencies', () => {
  if (!fs.existsSync('backend/node_modules')) throw new Error('Run: cd backend && npm install');
  const pkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
  const required = ['express', 'mongoose', 'dotenv', 'jsonwebtoken'];
  required.forEach(dep => {
    if (!pkg.dependencies[dep]) throw new Error(`Missing dependency: ${dep}`);
  });
});

// Check 5: Frontend dependencies
check('Frontend dependencies', () => {
  if (!fs.existsSync('frontend/node_modules')) throw new Error('Run: cd frontend && npm install');
  const pkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
  const required = ['react', 'react-dom', 'vite'];
  required.forEach(dep => {
    if (!pkg.dependencies[dep] && !pkg.devDependencies[dep]) {
      throw new Error(`Missing dependency: ${dep}`);
    }
  });
});

// Check 6: Root dependencies (concurrently)
check('Root dependencies', () => {
  if (!fs.existsSync('node_modules')) throw new Error('Run: npm install');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!pkg.devDependencies.concurrently) throw new Error('Missing concurrently');
});

// Check 7: Backend config.env
check('Backend config.env', () => {
  if (!fs.existsSync('backend/config.env')) throw new Error('Backend config.env missing');
  const config = fs.readFileSync('backend/config.env', 'utf8');
  if (!config.includes('PORT=')) throw new Error('PORT not set in config.env');
  if (!config.includes('DATABASE=')) throw new Error('DATABASE not set in config.env');
  if (!config.includes('CORS_ORIGIN=')) throw new Error('CORS_ORIGIN not set in config.env');
});

// Check 8: Vite proxy configuration
check('Vite proxy config', () => {
  const viteConfig = fs.readFileSync('frontend/vite.config.js', 'utf8');
  if (!viteConfig.includes('proxy')) throw new Error('Vite proxy not configured');
  if (!viteConfig.includes('/api')) throw new Error('API proxy route missing');
});

// Check 9: MongoDB connection
check('MongoDB connection', () => {
  try {
    execSync('mongosh --eval "db.version()" --quiet', {
      stdio: 'pipe',
      timeout: 5000
    });
  } catch (err) {
    throw new Error('MongoDB not running on localhost:27017');
  }
});

// Print results
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
checks.forEach(({ name, status, message }) => {
  const color = status === '✓' ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}${status}\x1b[0m ${name.padEnd(30)} ${message}`);
});
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const allPassed = checks.every(c => c.status === '✓');

if (allPassed) {
  console.log('✅ All checks passed! You can now run:');
  console.log('   npm run dev\n');
  process.exit(0);
} else {
  console.log('❌ Some checks failed. Please fix the issues above.\n');
  process.exit(1);
}
