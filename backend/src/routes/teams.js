import { loadAllTeams, loadTeam, loadTeamMessages } from '../services/teamLoader.js';

/**
 * 注册团队相关API路由
 * @param {object} fastify - Fastify实例
 */
export default async function teamRoutes(fastify) {
  // 获取所有团队列表
  fastify.get('/api/teams', async (request, reply) => {
    try {
      const teams = await loadAllTeams();
      return teams;
    } catch (error) {
      console.error('加载团队列表失败:', error);
      reply.code(500);
      return { error: '加载团队列表失败', message: error.message };
    }
  });

  // 获取单个团队详情
  fastify.get('/api/teams/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const team = await loadTeam(id);

      if (!team) {
        reply.code(404);
        return { error: '团队不存在', teamId: id };
      }

      return team;
    } catch (error) {
      console.error('加载团队详情失败:', error);
      reply.code(500);
      return { error: '加载团队详情失败', message: error.message };
    }
  });

  // 获取团队消息
  fastify.get('/api/teams/:id/messages', async (request, reply) => {
    try {
      const { id } = request.params;
      const { limit, before } = request.query;

      const options = {};
      if (limit) {
        options.limit = parseInt(limit, 10);
      }
      if (before) {
        options.before = before;
      }

      const messages = await loadTeamMessages(id, options);
      return messages;
    } catch (error) {
      console.error('加载团队消息失败:', error);
      reply.code(500);
      return { error: '加载团队消息失败', message: error.message };
    }
  });
}
