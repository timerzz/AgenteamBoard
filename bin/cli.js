#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import open from 'open';
import portfinder from 'portfinder';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

async function main() {
  // 查找后端可用端口（从 3001 开始）
  portfinder.basePort = 3001;
  const apiPort = await portfinder.getPortPromise();

  // 查找前端可用端口（从后端端口+1开始，确保不冲突）
  portfinder.basePort = apiPort + 1;
  const frontendPort = await portfinder.getPortPromise();

  const apiUrl = `http://localhost:${apiPort}`;
  const frontendUrl = `http://localhost:${frontendPort}`;

  console.log('');
  console.log('  🚀 Starting AgenteamBoard...');
  console.log('');
  console.log(`  API:     ${apiUrl}`);
  console.log(`  Frontend: ${frontendUrl}`);
  console.log('');

  // 启动后端服务器
  const backend = spawn('node', ['src/server.js'], {
    cwd: join(rootDir, 'packages/backend'),
    env: { ...process.env, PORT: String(apiPort) },
    stdio: 'inherit'
  });

  // 等待后端启动
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 启动前端开发服务器
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: join(rootDir, 'packages/frontend'),
    env: { ...process.env, API_PORT: String(apiPort), PORT: String(frontendPort) },
    stdio: 'inherit',
    shell: true
  });

  // 等待前端启动后打开浏览器
  setTimeout(async () => {
    console.log('  📖 Opening browser...');
    await open(frontendUrl);
  }, 3000);

  // 优雅关闭
  const cleanup = () => {
    console.log('\n  🛑 Shutting down...');
    backend.kill();
    frontend.kill();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

main().catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});
