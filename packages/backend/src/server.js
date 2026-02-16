import Fastify from 'fastify';
import path from 'path';
import os from 'os';
import sseRoutes, { broadcastSSE } from './routes/sse.js';
import teamRoutes from './routes/teams.js';
import { startFileWatcher } from './services/fileWatcher.js';
import { loadAllTeams } from './services/teamLoader.js';

const TEAMS_PATH = process.env.TEAMS_PATH || path.join(os.homedir(), '.claude', 'teams');

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// 启动服务器
const start = async () => {
  try {
    // 注册CORS插件
    await fastify.register(import('@fastify/cors'), {
      origin: true, // 允许所有来源（开发环境）
    });

    // 注册路由
    await fastify.register(sseRoutes);
    await fastify.register(teamRoutes);

    // 启动文件监听
    startFileWatcher(TEAMS_PATH, broadcastSSE);

    // 预加载团队列表
    const teams = await loadAllTeams();
    fastify.log.info(`已加载 ${teams.length} 个团队`);

    // 启动HTTP服务器
    await fastify.listen({ port: parseInt(process.env.PORT) || 3001, host: process.env.HOST || '0.0.0.0' });
    fastify.log.info(`服务器启动成功: http://localhost:${process.env.PORT || 3001}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
