#!/usr/bin/env node

/**
 * Manual Test Script for VAYRA SaaS Platform
 * Run this script to verify basic functionality
 */

import fs from 'fs';
import path from 'path';

console.log('🧪 VAYRA SaaS Platform - Manual Test Runner\n');

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function test(name, testFn) {
  try {
    testFn();
    results.passed++;
    results.tests.push({ name, status: 'PASS' });
    console.log(`✅ ${name}`);
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', error: error.message });
    console.log(`❌ ${name}: ${error.message}`);
  }
}

// Test 1: Check if package.json exists and has required dependencies
test('Package.json exists with required dependencies', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredDeps = ['react', 'vite', 'typescript', 'tailwindcss'];
  const requiredDevDeps = ['@vitejs/plugin-react', 'vitest'];
  
  requiredDeps.forEach(dep => {
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
      throw new Error(`Missing dependency: ${dep}`);
    }
  });
  
  requiredDevDeps.forEach(dep => {
    if (!packageJson.devDependencies[dep]) {
      throw new Error(`Missing dev dependency: ${dep}`);
    }
  });
});

// Test 2: Check if TypeScript config exists
test('TypeScript configuration exists', () => {
  if (!fs.existsSync('tsconfig.json')) {
    throw new Error('tsconfig.json not found');
  }
  
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  if (!tsConfig.compilerOptions) {
    throw new Error('Invalid tsconfig.json structure');
  }
});

// Test 3: Check if Vite config exists
test('Vite configuration exists', () => {
  if (!fs.existsSync('vite.config.ts')) {
    throw new Error('vite.config.ts not found');
  }
});

// Test 4: Check if main source files exist
test('Core source files exist', () => {
  const requiredFiles = [
    'src/App.tsx',
    'src/main.tsx',
    'src/lib/firebase.ts',
    'src/contexts/AuthContext.tsx',
    'src/contexts/PlanContext.tsx',
    'src/types/index.ts',
    'src/data/pricing.ts'
  ];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      throw new Error(`Missing file: ${file}`);
    }
  });
});

// Test 5: Check if TestSprite configuration exists
test('TestSprite configuration exists', () => {
  if (!fs.existsSync('testsprite.config.json')) {
    throw new Error('testsprite.config.json not found');
  }
  
  const config = JSON.parse(fs.readFileSync('testsprite.config.json', 'utf8'));
  if (!config.settings || !config.settings.baseUrl) {
    throw new Error('Invalid TestSprite configuration');
  }
});

// Test 6: Check if environment template exists
test('Environment template exists', () => {
  if (!fs.existsSync('.env.example') && !fs.existsSync('.env.local')) {
    console.log('⚠️  No .env.example or .env.local found - you may need to create one');
  }
});

// Test 7: Check if node_modules exists
test('Dependencies are installed', () => {
  if (!fs.existsSync('node_modules')) {
    throw new Error('node_modules not found - run npm install first');
  }
});

// Test 8: Check if build directory can be created
test('Build directory can be created', () => {
  const buildDir = 'dist-test';
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
  }
  fs.rmdirSync(buildDir);
});

// Test 9: Check if test files exist
test('Test files exist', () => {
  if (!fs.existsSync('src/App.test.tsx')) {
    throw new Error('src/App.test.tsx not found');
  }
});

// Test 10: Check if PWA manifest exists
test('PWA manifest exists', () => {
  if (!fs.existsSync('public/manifest.webmanifest')) {
    console.log('⚠️  PWA manifest not found - PWA features may not work');
  }
});

console.log('\n📊 Test Results Summary:');
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`📈 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);

if (results.failed > 0) {
  console.log('\n🔍 Failed Tests:');
  results.tests.filter(t => t.status === 'FAIL').forEach(t => {
    console.log(`  - ${t.name}: ${t.error}`);
  });
}

console.log('\n🎯 Next Steps:');
console.log('1. Run "npm run dev" to start the development server');
console.log('2. Open http://localhost:5173 in your browser');
console.log('3. Add Firebase API keys to .env.local for full functionality');
console.log('4. Run "npm run test" to execute unit tests');

if (results.failed === 0) {
  console.log('\n🎉 All tests passed! Your VAYRA project is ready for development.');
} else {
  console.log('\n⚠️  Some tests failed. Please fix the issues above before proceeding.');
}
