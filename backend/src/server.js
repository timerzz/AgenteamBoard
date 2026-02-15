import Fastify from 'fastify';
import cors from '@fastify/cors';
import path from 'path';
import sseRoutes, { broadcastSSE } from './routes/sse.js';
import teamRoutes from './routes/teams.js';
import { startFileWatcher } from './services/fileWatcher.js';
import { loadAllTeams } from './services/teamLoader.js';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// 注册CORS插件
await fastify.register(cors, {
  origin: true, // 允许所有来源（开发环境）
});

// 注册路由
await fastify.register(sseRoutes);
await fastify.register(teamRoutes);

// 静态文件服务（前端生产构建）
await fastify.register(import('@fastify/static'), {
  root: path.join(process.cwd(), '../frontend/dist'),
  prefix: '/', // 可选：如果需要API优先，可以改为'/app'
});

// 启动服务器
const start = async () => {
  try {
    const teamsPath = path.join(process.env.HOME, '.claude', 'teams');

    // 启动文件监听
    startFileWatcher(teamsPath, broadcastSSE);

    // 预加载团队列表
    const teams = await loadAllTeams();
    fastify.log.info(`已加载 ${teams.length} 个团队`);

    // 启动HTTP服务器
    await fastify.listen({ port: parseInt(process.env.PORT) || 3000, host: process.env.HOST || '0.0.0.0' });
    fastify.log.info(`服务器启动成功: http://localhost:${process.env.PORT || 3000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
