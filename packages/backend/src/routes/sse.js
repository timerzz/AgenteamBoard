const clients = new Set();
const MAX_CLIENTS = 100; // 最大客户端连接数
let heartbeatInterval = null;
let cleanupInterval = null;

/**
 * 清理所有资源（定时器、客户端连接）
 */
export function cleanup() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
  clients.clear();
}

/**
 * 清理断开的客户端
 */
function cleanupClients() {
  for (const client of clients) {
    if (client.reply.raw.closed) {
      clients.delete(client);
    }
  }
}

/**
 * 广播事件到所有客户端
 * @param {string} event - 事件名称
 * @param {object} data - 事件数据
 */
export function broadcastSSE(event, data) {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

  for (const client of clients) {
    try {
      client.reply.raw.write(message);
    } catch (error) {
      console.error('SSE发送失败:', error.message);
      clients.delete(client);
    }
  }
}

/**
 * 启动心跳检测
 */
function startHeartbeat() {
  if (heartbeatInterval) {
    return;
  }

  heartbeatInterval = setInterval(() => {
    const heartbeat = ': heartbeat\n\n';
    for (const client of clients) {
      try {
        client.reply.raw.write(heartbeat);
      } catch (error) {
        clients.delete(client);
      }
    }
  }, 30000); // 每30秒发送心跳
}

/**
 * 注册SSE路由
 * @param {object} fastify - Fastify实例
 */
export default async function sseRoutes(fastify) {
  startHeartbeat();

  // 定期清理断开的客户端
  cleanupInterval = setInterval(cleanupClients, 60000); // 每60秒清理一次

  // 服务器关闭时清理资源
  const cleanupHandler = () => {
    cleanup();
    process.exit(0);
  };

  process.on('SIGTERM', cleanupHandler);
  process.on('SIGINT', cleanupHandler);

  fastify.get('/api/events', async (request, reply) => {
    // 限制最大连接数
    if (clients.size >= MAX_CLIENTS) {
      return reply.code(503).send({
        error: '服务器繁忙，请稍后重试',
        message: `已达到最大连接数限制 (${MAX_CLIENTS})`
      });
    }
    // 设置SSE响应头
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // 禁用Nginx缓冲
    });

    const clientId = Date.now();
    const client = { id: clientId, reply };
    clients.add(client);

    // 发送连接成功消息
    reply.raw.write(`event: connected\ndata: ${JSON.stringify({ clientId, timestamp: new Date().toISOString() })}\n\n`);

    request.raw.on('close', () => {
      clients.delete(client);
    });

    request.raw.on('error', (error) => {
      console.error('SSE客户端错误:', error.message);
      clients.delete(client);
    });

    // 返回promise保持连接
    return new Promise(() => {});
  });
}
