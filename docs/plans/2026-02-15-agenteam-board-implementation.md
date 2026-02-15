# AgenteamBoard 实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 构建一个实时监控Agent Teams活动的Web应用，提供聊天和JSON双视图，使用文件系统监听和SSE推送。

**Architecture:** 前后端分离，后端使用Fastify+chokidar监听文件变化，前端使用Vue 3+Pinia+TailwindCSS构建聊天风格界面。通过SSE实现实时推送。

**Tech Stack:** Fastify, chokidar, Vue 3, Vite, Pinia, TailwindCSS, vue-virtual-scroller

---

## 阶段1：项目初始化和基础架构

### Task 1: 初始化后端项目

**Files:**
- Create: `backend/package.json`
- Create: `backend/.env`
- Create: `backend/.gitignore`

**Step 1: 创建后端package.json**

```json
{
  "name": "agenteam-board-backend",
  "version": "1.0.0",
  "description": "AgenteamBoard后端服务",
  "main": "src/server.js",
  "type": "module",
  "scripts": {
    "dev": "fastify start -l info -P src/server.js",
    "start": "NODE_ENV=production node src/server.js"
  },
  "dependencies": {
    "fastify": "^4.26.0",
    "@fastify/cors": "^9.0.1",
    "chokidar": "^3.6.0",
    "proper-lockfile": "^4.1.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Step 2: 创建环境变量配置文件**

```env
# 服务器配置
PORT=3000
HOST=0.0.0.0

# Claude配置
HOME=/c/Users/nicor
TEAMS_PATH=${HOME}/.claude/teams

# 日志级别
LOG_LEVEL=info
```

**Step 3: 创建.gitignore**

```
node_modules/
*.log
.env
.DS_Store
coverage/
```

**Step 4: 提交初始配置**

```bash
git add backend/package.json backend/.env backend/.gitignore
git commit -m "feat: 初始化后端项目配置"
```

### Task 2: 初始化前端项目

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/index.html`
- Create: `frontend/vite.config.js`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/postcss.config.js`
- Create: `frontend/.gitignore`

**Step 1: 创建前端package.json**

```json
{
  "name": "agenteam-board-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "pinia": "^2.1.7",
    "vue-virtual-scroller": "^2.0.0-beta.8"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.1.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

**Step 2: 创建HTML入口**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AgenteamBoard - Agent Teams监控</title>
</head>
<body class="bg-abyss text-text-primary">
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**Step 3: 创建Vite配置**

```javascript
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default {
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/api/events': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
};
```

**Step 4: 创建TailwindCSS配置（深海科技主题）**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        // 背景层级
        void: '#0a0e14',
        abyss: '#0d1117',
        deep: '#151b23',
        surface: '#1c242e',
        elevated: '#242d39',

        // 边框
        'border-subtle': '#2d3748',
        'border-active': '#4a5568',

        // 文本
        'text-primary': '#e6edf3',
        'text-secondary': '#8b949e',
        'text-muted': '#6e7681',
        'text-accent': '#58a6ff',

        // 强调色
        accent: {
          primary: '#00d9ff',
          secondary: '#0ea5e9',
          glow: 'rgba(0, 217, 255, 0.15)',
        },

        // Agent颜色
        agent: {
          blue: '#60a5fa',
          green: '#34d399',
          yellow: '#fbbf24',
          purple: '#a78bfa',
          orange: '#fb923c',
          pink: '#f472b6',
          cyan: '#22d3ee',
          red: '#f87171',
        },
      },
      boxShadow: {
        'glow-sm': '0 0 10px currentColor',
        'glow-md': '0 0 20px currentColor',
        'glow-lg': '0 0 30px currentColor',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.6' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
```

**Step 5: 创建PostCSS配置**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**Step 6: 提交前端配置**

```bash
git add frontend/
git commit -m "feat: 初始化前端项目配置（Vue 3 + Vite + TailwindCSS）"
```

### Task 3: 创建前端基础结构

**Files:**
- Create: `frontend/src/main.js`
- Create: `frontend/src/App.vue`
- Create: `frontend/src/style.css`

**Step 1: 创建应用入口**

```javascript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
```

**Step 2: 创建根组件**

```vue
<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  document.title = 'AgenteamBoard';
});
</script>

<template>
  <div class="min-h-screen bg-abyss">
    <div class="flex h-screen">
      <!-- 侧边栏 -->
      <aside class="w-64 bg-deep border-r border-border-subtle">
        <div class="p-4 border-b border-border-subtle">
          <h1 class="text-xl font-semibold text-accent-primary">AgenteamBoard</h1>
          <p class="text-xs text-text-secondary mt-1">Agent Teams监控</p>
        </div>
        <div class="p-4">
          <p class="text-text-muted text-sm">加载团队列表...</p>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 flex flex-col">
        <header class="h-16 bg-surface border-b border-border-subtle flex items-center justify-between px-6">
          <h2 class="text-lg font-medium text-text-primary">选择一个团队</h2>
          <div class="flex items-center gap-4">
            <span class="text-sm text-text-muted">开发中</span>
          </div>
        </header>
        <div class="flex-1 flex items-center justify-center">
          <p class="text-text-muted">等待团队加载...</p>
        </div>
      </main>
    </div>
  </div>
</template>
```

**Step 3: 创建全局样式**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-abyss text-text-primary antialiased;
  }
}

@layer components {
  /* 自定义滚动条 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-deep;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-border-subtle rounded;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-border-active;
  }
}
```

**Step 4: 提交基础结构**

```bash
git add frontend/src/
git commit -m "feat: 创建前端基础结构和布局"
```

---

## 阶段2：后端核心功能

### Task 4: 实现工具函数模块

**Files:**
- Create: `backend/src/utils/pathHelper.js`
- Create: `backend/src/utils/fileHelper.js`

**Step 1: 创建路径处理工具**

```javascript
import path from 'path';
import os from 'os';

const TEAMS_PATH = process.env.TEAMS_PATH || path.join(os.homedir(), '.claude', 'teams');

/**
 * 获取团队目录路径
 * @param {string} teamId - 团队ID
 * @returns {string} 团队目录完整路径
 */
export function getTeamPath(teamId) {
  return path.join(TEAMS_PATH, teamId);
}

/**
 * 获取团队config.json路径
 * @param {string} teamId - 团队ID
 * @returns {string} config.json完整路径
 */
export function getTeamConfigPath(teamId) {
  return path.join(getTeamPath(teamId), 'config.json');
}

/**
 * 获取团队inboxes目录路径
 * @param {string} teamId - 团队ID
 * @returns {string} inboxes目录完整路径
 */
export function getTeamInboxesPath(teamId) {
  return path.join(getTeamPath(teamId), 'inboxes');
}

/**
 * 获取指定成员的inbox文件路径
 * @param {string} teamId - 团队ID
 * @param {string} memberName - 成员名称
 * @returns {string} inbox文件完整路径
 */
export function getMemberInboxPath(teamId, memberName) {
  return path.join(getTeamInboxesPath(teamId), `${memberName}.json`);
}

/**
 * 从文件路径提取团队ID
 * @param {string} filePath - 文件路径
 * @returns {string|null} 团队ID
 */
export function extractTeamId(filePath) {
  const relative = path.relative(TEAMS_PATH, filePath);
  const parts = relative.split(path.sep);
  return parts[0] || null;
}

/**
 * 从文件路径提取文件名（不含扩展名）
 * @param {string} filePath - 文件路径
 * @returns {string} 文件名
 */
export function getFileName(filePath) {
  return path.basename(filePath, path.extname(filePath));
}
```

**Step 2: 创建文件处理工具**

```javascript
import fs from 'fs/promises';
import lockfile from 'proper-lockfile';
import path from 'path';

/**
 * 安全读取JSON文件（带文件锁）
 * @param {string} filePath - 文件路径
 * @returns {Promise<object|null>} 解析后的JSON对象，失败返回null
 */
export async function readJSONSafe(filePath) {
  try {
    // 使用文件锁避免并发读取冲突
    const release = await lockfile.lock(filePath, {
      retries: {
        retries: 3,
        minTimeout: 50,
        maxTimeout: 200,
      },
    });

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } finally {
      await release();
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null; // 文件不存在
    }
    if (error instanceof SyntaxError) {
      console.error(`JSON解析失败: ${filePath}`, error.message);
      return { parseError: true };
    }
    console.error(`读取文件失败: ${filePath}`, error);
    return null;
  }
}

/**
 * 检查文件是否存在
 * @param {string} filePath - 文件路径
 * @returns {Promise<boolean>} 文件是否存在
 */
export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * 读取目录下所有子目录
 * @param {string} dirPath - 目录路径
 * @returns {Promise<string[]>} 子目录名称数组
 */
export async function listSubdirectories(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * 读取目录下所有文件
 * @param {string} dirPath - 目录路径
 * @param {string} [extension] - 可选，过滤指定扩展名
 * @returns {Promise<string[]>} 文件名数组
 */
export async function listFiles(dirPath, extension) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    let files = entries.filter(entry => entry.isFile()).map(entry => entry.name);

    if (extension) {
      files = files.filter(name => name.endsWith(extension));
    }

    return files;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}
```

**Step 3: 提交工具函数**

```bash
git add backend/src/utils/
git commit -m "feat: 添加路径和文件处理工具函数"
```

### Task 5: 实现团队数据加载服务

**Files:**
- Create: `backend/src/services/teamLoader.js`

**Step 1: 创建团队加载服务**

```javascript
import fs from 'fs/promises';
import path from 'path';
import {
  getTeamPath,
  getTeamConfigPath,
  getTeamInboxesPath,
  extractTeamId,
} from '../utils/pathHelper.js';
import { readJSONSafe, listSubdirectories, listFiles, fileExists } from '../utils/fileHelper.js';

/**
 * 加载所有团队列表
 * @returns {Promise<Array>} 团队列表
 */
export async function loadAllTeams() {
  const teamsPath = path.join(process.env.HOME, '.claude', 'teams');
  const teamIds = await listSubdirectories(teamsPath);

  const teams = [];
  for (const teamId of teamIds) {
    const team = await loadTeam(teamId);
    if (team) {
      teams.push(team);
    }
  }

  return teams;
}

/**
 * 加载单个团队详情
 * @param {string} teamId - 团队ID
 * @returns {Promise<object|null>} 团队对象，失败返回null
 */
export async function loadTeam(teamId) {
  const configPath = getTeamConfigPath(teamId);
  const config = await readJSONSafe(configPath);

  if (!config || config.parseError) {
    return null;
  }

  const inboxesPath = getTeamInboxesPath(teamId);
  const hasInboxes = await fileExists(inboxesPath);

  return {
    id: teamId,
    name: config.name || teamId,
    memberCount: config.members?.length || 0,
    members: config.members || [],
    leadAgentId: config.leadAgentId,
    lastActivity: await getLastActivity(teamId),
    path: getTeamPath(teamId),
    hasInboxes,
  };
}

/**
 * 加载团队的所有消息
 * @param {string} teamId - 团队ID
 * @param {object} options - 选项
 * @param {number} [options.limit] - 限制返回数量
 * @param {string} [options.before] - 只返回此时间之前的消息
 * @returns {Promise<Array>} 消息数组
 */
export async function loadTeamMessages(teamId, options = {}) {
  const inboxesPath = getTeamInboxesPath(teamId);
  const inboxFiles = await listFiles(inboxesPath, '.json');

  let allMessages = [];

  for (const filename of inboxFiles) {
    const inboxPath = path.join(inboxesPath, filename);
    const messages = await readJSONSafe(inboxPath);

    if (Array.isArray(messages)) {
      allMessages = allMessages.concat(messages);
    }
  }

  // 按时间倒序排序
  allMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // 过滤和限制
  if (options.before) {
    const beforeTime = new Date(options.before).getTime();
    allMessages = allMessages.filter(msg => new Date(msg.timestamp).getTime() < beforeTime);
  }

  if (options.limit) {
    allMessages = allMessages.slice(0, options.limit);
  }

  return allMessages;
}

/**
 * 获取团队最后活动时间
 * @param {string} teamId - 团队ID
 * @returns {Promise<string|null>} ISO时间戳
 */
async function getLastActivity(teamId) {
  const messages = await loadTeamMessages(teamId, { limit: 1 });
  return messages[0]?.timestamp || null;
}

/**
 * 从文件路径加载团队（用于文件监听回调）
 * @param {string} filePath - 文件路径
 * @returns {Promise<object|null>} 团队对象
 */
export async function loadTeamFromPath(filePath) {
  const teamId = extractTeamId(filePath);
  if (!teamId) {
    return null;
  }
  return await loadTeam(teamId);
}
```

**Step 2: 提交团队加载服务**

```bash
git add backend/src/services/teamLoader.js
git commit -m "feat: 实现团队数据加载服务"
```

### Task 6: 实现SSE事件流

**Files:**
- Create: `backend/src/routes/sse.js`

**Step 1: 创建SSE路由**

```javascript
const clients = new Set();
let heartbeatInterval = null;

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
  setInterval(cleanupClients, 60000); // 每60秒清理一次

  fastify.get('/api/events', async (request, reply) => {
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
```

**Step 2: 提交SSE路由**

```bash
git add backend/src/routes/sse.js
git commit -m "feat: 实现SSE事件流路由"
```

### Task 7: 实现团队API路由

**Files:**
- Create: `backend/src/routes/teams.js`

**Step 1: 创建团队API路由**

```javascript
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
```

**Step 2: 提交团队API路由**

```bash
git add backend/src/routes/teams.js
git commit -m "feat: 实现团队API路由"
```

### Task 8: 实现文件监听服务

**Files:**
- Create: `backend/src/services/fileWatcher.js`

**Step 1: 创建文件监听服务**

```javascript
import chokidar from 'chokidar';
import path from 'path';
import {
  getTeamConfigPath,
  getTeamInboxesPath,
  extractTeamId,
} from '../utils/pathHelper.js';
import { loadTeam, loadTeamMessages } from './teamLoader.js';

/**
 * 处理配置文件变更
 * @param {string} filePath - 文件路径
 * @param {string} eventType - 事件类型（add, change, unlink）
 * @param {Function} broadcastSSE - SSE广播函数
 */
async function handleConfigChange(filePath, eventType, broadcastSSE) {
  const teamId = extractTeamId(filePath);
  if (!teamId) {
    return;
  }

  const team = await loadTeam(teamId);

  if (eventType === 'unlink') {
    // 团队配置被删除
    broadcastSSE('team:deleted', { teamId });
  } else {
    // 团队配置更新
    broadcastSSE('team:updated', { teamId, team });
  }
}

/**
 * 处理inbox文件变更
 * @param {string} filePath - 文件路径
 * @param {string} eventType - 事件类型（add, change, unlink）
 * @param {Function} broadcastSSE - SSE广播函数
 */
async function handleInboxChange(filePath, eventType, broadcastSSE) {
  const teamId = extractTeamId(filePath);
  if (!teamId) {
    return;
  }

  const messages = await loadTeamMessages(teamId, { limit: 10 });

  if (eventType === 'add' || eventType === 'change') {
    // 新消息或消息更新
    broadcastSSE('message:new', { teamId, messages });
  }
}

/**
 * 启动文件监听
 * @param {string} teamsPath - 团队目录路径
 * @param {Function} broadcastSSE - SSE广播函数
 * @returns {object} chokidar实例
 */
export function startFileWatcher(teamsPath, broadcastSSE) {
  const watcher = chokidar.watch(teamsPath, {
    ignored: /(^|[\/\\])\../, // 忽略隐藏文件
    persistent: true,
    ignoreInitial: true, // 忽略初始扫描，避免触发大量事件
    awaitWriteFinish: {
      stabilityThreshold: 100, // 文件写入稳定100ms后才触发
      pollInterval: 50,
    },
  });

  watcher.on('add', (filePath) => {
    if (filePath.endsWith('config.json')) {
      handleConfigChange(filePath, 'add', broadcastSSE);
    } else if (filePath.endsWith('.json')) {
      handleInboxChange(filePath, 'add', broadcastSSE);
    }
  });

  watcher.on('change', (filePath) => {
    if (filePath.endsWith('config.json')) {
      handleConfigChange(filePath, 'change', broadcastSSE);
    } else if (filePath.endsWith('.json')) {
      handleInboxChange(filePath, 'change', broadcastSSE);
    }
  });

  watcher.on('unlink', (filePath) => {
    if (filePath.endsWith('config.json')) {
      handleConfigChange(filePath, 'unlink', broadcastSSE);
    }
  });

  console.log(`文件监听已启动: ${teamsPath}`);
  return watcher;
}
```

**Step 2: 提交文件监听服务**

```bash
git add backend/src/services/fileWatcher.js
git commit -m "feat: 实现文件监听服务"
```

### Task 9: 创建服务器主入口

**Files:**
- Create: `backend/src/server.js`

**Step 1: 创建服务器入口文件**

```javascript
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
```

**Step 2: 更新package.json依赖**

修改 `backend/package.json`：

```json
{
  "dependencies": {
    "fastify": "^4.26.0",
    "@fastify/cors": "^9.0.1",
    "@fastify/static": "^7.0.0",
    "chokidar": "^3.6.0",
    "proper-lockfile": "^4.1.2"
  }
}
```

**Step 3: 提交服务器入口**

```bash
git add backend/src/server.js backend/package.json
git commit -m "feat: 创建服务器主入口"
```

---

## 阶段3：前端核心功能

### Task 10: 实现Pinia状态管理

**Files:**
- Create: `frontend/src/stores/teams.js`
- Create: `frontend/src/stores/messages.js`
- Create: `frontend/src/stores/view.js`

**Step 1: 创建团队状态store**

```javascript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref([]);
  const activeTeamId = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const activeTeam = computed(() =>
    teams.value.find(t => t.id === activeTeamId.value)
  );

  const hasTeams = computed(() => teams.value.length > 0);

  async function fetchTeams() {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch('/api/teams');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      teams.value = await response.json();
    } catch (err) {
      error.value = err.message;
      console.error('加载团队列表失败:', err);
    } finally {
      loading.value = false;
    }
  }

  function setActiveTeam(teamId) {
    activeTeamId.value = teamId;
  }

  function updateTeam(teamId, updates) {
    const index = teams.value.findIndex(t => t.id === teamId);
    if (index !== -1) {
      teams.value[index] = { ...teams.value[index], ...updates };
    }
  }

  return {
    teams,
    activeTeamId,
    activeTeam,
    loading,
    error,
    hasTeams,
    fetchTeams,
    setActiveTeam,
    updateTeam,
  };
});
```

**Step 2: 创建消息状态store**

```javascript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const hasMessages = computed(() => messages.value.length > 0);

  async function fetchMessages(teamId, options = {}) {
    loading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams();
      if (options.limit) {
        params.append('limit', options.limit);
      }
      if (options.before) {
        params.append('before', options.before);
      }

      const response = await fetch(`/api/teams/${teamId}/messages?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      messages.value = await response.json();
    } catch (err) {
      error.value = err.message;
      console.error('加载消息失败:', err);
    } finally {
      loading.value = false;
    }
  }

  function addMessage(message) {
    messages.value.unshift(message);
  }

  function clearMessages() {
    messages.value = [];
  }

  return {
    messages,
    loading,
    error,
    hasMessages,
    fetchMessages,
    addMessage,
    clearMessages,
  };
});
```

**Step 3: 创建视图状态store**

```javascript
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useViewStore = defineStore('view', () => {
  const currentView = ref('chat'); // 'chat' | 'json'
  const searchQuery = ref('');
  const filterMember = ref(null);

  function setView(view) {
    currentView.value = view;
  }

  function setSearchQuery(query) {
    searchQuery.value = query;
  }

  function setFilterMember(memberName) {
    filterMember.value = memberName;
  }

  function clearFilters() {
    searchQuery.value = '';
    filterMember.value = null;
  }

  return {
    currentView,
    searchQuery,
    filterMember,
    setView,
    setSearchQuery,
    setFilterMember,
    clearFilters,
  };
});
```

**Step 4: 提交状态管理stores**

```bash
git add frontend/src/stores/
git commit -m "feat: 实现Pinia状态管理（teams、messages、view）"
```

### Task 11: 实现SSE连接hook

**Files:**
- Create: `frontend/src/composables/useSSE.js`

**Step 1: 创建SSE composable**

```javascript
import { ref, onUnmounted } from 'vue';
import { useTeamsStore } from '../stores/teams.js';
import { useMessagesStore } from '../stores/messages.js';

/**
 * SSE连接composable
 * @param {string} url - SSE连接URL
 */
export function useSSE(url = '/api/events') {
  const status = ref('disconnected'); // 'disconnected' | 'connecting' | 'connected'
  const clientId = ref(null);
  const reconnectAttempts = ref(0);
  const maxReconnectDelay = 30000; // 最大重连延迟30秒

  let eventSource = null;
  let reconnectTimeout = null;

  /**
   * 计算重连延迟（指数退避）
   * @returns {number} 延迟毫秒数
   */
  function getReconnectDelay() {
    return Math.min(1000 * 2 ** reconnectAttempts.value, maxReconnectDelay);
  }

  /**
   * 连接SSE
   */
  function connect() {
    if (eventSource) {
      eventSource.close();
    }

    status.value = 'connecting';
    eventSource = new EventSource(url);

    // 连接成功
    eventSource.addEventListener('connected', (event) => {
      const data = JSON.parse(event.data);
      clientId.value = data.clientId;
      status.value = 'connected';
      reconnectAttempts.value = 0;
      console.log('SSE已连接:', data);
    });

    // 团队更新事件
    eventSource.addEventListener('team:updated', (event) => {
      const { teamId, team } = JSON.parse(event.data);
      const teamsStore = useTeamsStore();
      teamsStore.updateTeam(teamId, team);
    });

    // 团队删除事件
    eventSource.addEventListener('team:deleted', (event) => {
      const { teamId } = JSON.parse(event.data);
      const teamsStore = useTeamsStore();
      const teams = teamsStore.teams.filter(t => t.id !== teamId);
      teamsStore.teams = teams;
    });

    // 新消息事件
    eventSource.addEventListener('message:new', (event) => {
      const { teamId, messages } = JSON.parse(event.data);
      const teamsStore = useTeamsStore();
      const messagesStore = useMessagesStore();

      // 如果是当前活动团队，更新消息
      if (teamsStore.activeTeamId === teamId) {
        messagesStore.messages = messages;
      }
    });

    // 错误处理
    eventSource.onerror = () => {
      status.value = 'disconnected';
      eventSource.close();
      eventSource = null;

      // 尝试重连
      const delay = getReconnectDelay();
      reconnectAttempts.value++;
      console.log(`SSE断开，${delay}ms后重连...`);

      reconnectTimeout = setTimeout(() => {
        connect();
      }, delay);
    };
  }

  /**
   * 断开连接
   */
  function disconnect() {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    status.value = 'disconnected';
  }

  // 组件卸载时清理
  onUnmounted(() => {
    disconnect();
  });

  return {
    status,
    clientId,
    connect,
    disconnect,
  };
}
```

**Step 2: 提交SSE composable**

```bash
git add frontend/src/composables/useSSE.js
git commit -m "feat: 实现SSE连接composable（支持自动重连）"
```

---

## 阶段4：UI组件实现

### Task 12: 实现TeamList组件

**Files:**
- Create: `frontend/src/components/TeamList.vue`

**Step 1: 创建团队列表组件**

```vue
<script setup>
import { computed } from 'vue';
import { useTeamsStore } from '../stores/teams.js';
import { useViewStore } from '../stores/view.js';

const teamsStore = useTeamsStore();
const viewStore = useViewStore();

const activeTeamId = computed(() => teamsStore.activeTeamId);

function getAgentColor(colorName) {
  const colors = {
    blue: '#60a5fa',
    green: '#34d399',
    yellow: '#fbbf24',
    purple: '#a78bfa',
    orange: '#fb923c',
    pink: '#f472b6',
    cyan: '#22d3ee',
    red: '#f87171',
  };
  return colors[colorName] || colors.blue;
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- 团队列表 -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="teamsStore.loading" class="p-4">
        <p class="text-text-muted text-sm">加载中...</p>
      </div>

      <div v-else-if="teamsStore.error" class="p-4">
        <p class="text-error text-sm">{{ teamsStore.error }}</p>
      </div>

      <div v-else-if="!teamsStore.hasTeams" class="p-4">
        <p class="text-text-muted text-sm">暂无团队</p>
      </div>

      <div v-else class="space-y-1 p-2">
        <div
          v-for="team in teamsStore.teams"
          :key="team.id"
          :class="[
            'p-3 rounded-lg cursor-pointer transition-all duration-200 border-l-2',
            activeTeamId === team.id
              ? 'bg-elevated border-accent-primary shadow-glow-sm'
              : 'bg-transparent border-transparent hover:bg-surface'
          ]"
          @click="teamsStore.setActiveTeam(team.id)"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-text-primary font-medium truncate">{{ team.name }}</h3>
            <span class="text-xs text-text-secondary">{{ team.memberCount }}</span>
          </div>

          <!-- 成员头像预览 -->
          <div class="flex -space-x-2 mt-2">
            <div
              v-for="member in team.members.slice(0, 5)"
              :key="member.name"
              :style="{ backgroundColor: getAgentColor(member.color) }"
              class="w-6 h-6 rounded-full border-2 border-deep"
              :title="member.name"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="p-3 border-t border-border-subtle">
      <div class="flex items-center justify-between text-xs text-text-muted">
        <span>{{ teamsStore.teams.length }} 个团队</span>
      </div>
    </div>
  </div>
</template>
```

**Step 2: 提交TeamList组件**

```bash
git add frontend/src/components/TeamList.vue
git commit -m "feat: 实现TeamList组件"
```

### Task 13: 实现MessageCard组件

**Files:**
- Create: `frontend/src/components/MessageCard.vue`

**Step 1: 创建消息卡片组件**

```vue
<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

const messageType = computed(() => {
  try {
    const parsed = JSON.parse(props.message.text);
    return parsed.type ? 'protocol' : 'normal';
  } catch {
    return 'normal';
  }
});

const protocolData = computed(() => {
  if (messageType.value === 'protocol') {
    return JSON.parse(props.message.text);
  }
  return null;
});

function getAgentColor(colorName) {
  const colors = {
    blue: '#60a5fa',
    green: '#34d399',
    yellow: '#fbbf24',
    purple: '#a78bfa',
    orange: '#fb923c',
    pink: '#f472b6',
    cyan: '#22d3ee',
    red: '#f87171',
  };
  return colors[colorName] || colors.blue;
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) {
    return '刚刚';
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  } else {
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
</script>

<template>
  <div
    :class="[
      'p-4 rounded-xl border transition-all',
      messageType === 'protocol'
        ? 'bg-deep border-border-subtle'
        : 'bg-surface border-border-subtle hover:border-border-active'
    ]"
  >
    <div class="flex items-start gap-3">
      <!-- Agent头像 -->
      <div
        :style="{
          backgroundColor: getAgentColor(message.color),
          boxShadow: `0 0 20px ${getAgentColor(message.color)}40`
        }"
        class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center animate-pulse-slow"
      >
        <span class="text-white text-xs font-bold">
          {{ message.from.charAt(0).toUpperCase() }}
        </span>
      </div>

      <!-- 消息内容 -->
      <div class="flex-1 min-w-0">
        <!-- 头部：名称 + 时间 -->
        <div class="flex items-baseline gap-2 mb-1">
          <span
            :style="{ color: getAgentColor(message.color) }"
            class="font-semibold text-sm"
          >
            {{ message.from }}
          </span>
          <span class="text-xs text-text-muted">
            {{ formatTime(message.timestamp) }}
          </span>
        </div>

        <!-- 普通消息 -->
        <template v-if="messageType === 'normal'">
          <p class="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
            {{ message.text }}
          </p>

          <div
            v-if="message.summary"
            class="mt-2 text-xs text-text-secondary italic"
          >
            {{ message.summary }}
          </div>
        </template>

        <!-- 协议消息 -->
        <div v-else class="bg-deep rounded p-3">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">⚙️</span>
            <span class="text-xs text-text-muted">系统消息</span>
          </div>
          <pre class="text-xs text-text-secondary overflow-x-auto">{{ JSON.stringify(protocolData, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
```

**Step 2: 提交MessageCard组件**

```bash
git add frontend/src/components/MessageCard.vue
git commit -m "feat: 实现MessageCard组件（支持普通消息和协议消息）"
```

### Task 14: 实现MessageFeed组件

**Files:**
- Create: `frontend/src/components/MessageFeed.vue`

**Step 1: 创建消息流组件**

```vue
<script setup>
import { computed, watch, onMounted, ref } from 'vue';
import { useTeamsStore } from '../stores/teams.js';
import { useMessagesStore } from '../stores/messages.js';
import { useViewStore } from '../stores/view.js';
import MessageCard from './MessageCard.vue';

const teamsStore = useTeamsStore();
const messagesStore = useMessagesStore();
const viewStore = useViewStore();

const messagesContainer = ref(null);

const filteredMessages = computed(() => {
  let messages = messagesStore.messages;

  // 成员筛选
  if (viewStore.filterMember) {
    messages = messages.filter(m => m.from === viewStore.filterMember);
  }

  // 搜索过滤
  if (viewStore.searchQuery) {
    const query = viewStore.searchQuery.toLowerCase();
    messages = messages.filter(m =>
      m.text.toLowerCase().includes(query) ||
      (m.summary && m.summary.toLowerCase().includes(query))
    );
  }

  return messages;
});

// 监听活动团队变化，加载消息
watch(() => teamsStore.activeTeamId, async (newTeamId) => {
  if (newTeamId) {
    await messagesStore.fetchMessages(newTeamId, { limit: 100 });
  } else {
    messagesStore.clearMessages();
  }
}, { immediate: true });
</script>

<template>
  <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3">
    <!-- 加载状态 -->
    <div v-if="messagesStore.loading" class="flex items-center justify-center h-full">
      <p class="text-text-muted">加载消息中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="messagesStore.error" class="flex items-center justify-center h-full">
      <p class="text-error">{{ messagesStore.error }}</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!messagesStore.hasMessages" class="flex items-center justify-center h-full">
      <p class="text-text-muted">等待消息...</p>
    </div>

    <!-- 消息列表 -->
    <template v-else>
      <MessageCard
        v-for="message in filteredMessages"
        :key="message.timestamp + message.from"
        :message="message"
      />
    </template>
  </div>
</template>
```

**Step 2: 提交MessageFeed组件**

```bash
git add frontend/src/components/MessageFeed.vue
git commit -m "feat: 实现MessageFeed组件"
```

### Task 15: 实现JsonViewer组件

**Files:**
- Create: `frontend/src/components/JsonViewer.vue`

**Step 1: 创建JSON查看器组件**

```vue
<script setup>
import { computed } from 'vue';
import { useMessagesStore } from '../stores/messages.js';

const messagesStore = useMessagesStore();

const jsonData = computed(() => {
  return JSON.stringify(messagesStore.messages, null, 2);
});
</script>

<template>
  <div class="flex-1 overflow-auto p-4">
    <pre
      class="text-sm text-text-secondary bg-deep p-4 rounded-xl overflow-x-auto"
    >{{ jsonData }}</pre>
  </div>
</template>
```

**Step 2: 提交JsonViewer组件**

```bash
git add frontend/src/components/JsonViewer.vue
git commit -m "feat: 实现JsonViewer组件"
```

### Task 16: 实现ViewToggle组件

**Files:**
- Create: `frontend/src/components/ViewToggle.vue`

**Step 1: 创建视图切换组件**

```vue
<script setup>
import { useViewStore } from '../stores/view.js';

const viewStore = useViewStore();

const views = [
  { id: 'chat', label: '聊天视图', icon: '💬' },
  { id: 'json', label: 'JSON视图', icon: '📄' },
];
</script>

<template>
  <div class="flex bg-deep rounded-lg p-1">
    <button
      v-for="view in views"
      :key="view.id"
      :class="[
        'px-4 py-2 rounded-md text-sm font-medium transition-all',
        viewStore.currentView === view.id
          ? 'bg-accent-primary text-white shadow-glow-sm'
          : 'text-text-secondary hover:text-text-primary hover:bg-elevated'
      ]"
      @click="viewStore.setView(view.id)"
    >
      <span class="mr-2">{{ view.icon }}</span>
      {{ view.label }}
    </button>
  </div>
</template>
```

**Step 2: 提交ViewToggle组件**

```bash
git add frontend/src/components/ViewToggle.vue
git commit -m "feat: 实现ViewToggle组件"
```

### Task 17: 集成所有组件到App

**Files:**
- Modify: `frontend/src/App.vue`

**Step 1: 更新App.vue**

```vue
<script setup>
import { onMounted } from 'vue';
import { useTeamsStore } from './stores/teams.js';
import { useSSE } from './composables/useSSE.js';
import TeamList from './components/TeamList.vue';
import MessageFeed from './components/MessageFeed.vue';
import JsonViewer from './components/JsonViewer.vue';
import ViewToggle from './components/ViewToggle.vue';
import { useViewStore } from './stores/view.js';

const teamsStore = useTeamsStore();
const viewStore = useViewStore();
const { status: sseStatus, connect: connectSSE } = useSSE();

onMounted(async () => {
  // 加载团队列表
  await teamsStore.fetchTeams();

  // 连接SSE
  connectSSE();

  // 默认选中第一个团队
  if (teamsStore.hasTeams) {
    teamsStore.setActiveTeam(teamsStore.teams[0].id);
  }
});
</script>

<template>
  <div class="min-h-screen bg-abyss">
    <!-- SSE状态指示器 -->
    <div class="fixed top-4 right-4 z-50">
      <div
        :class="[
          'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
          sseStatus === 'connected' ? 'bg-success/20 text-success' :
          sseStatus === 'connecting' ? 'bg-warning/20 text-warning' :
          'bg-error/20 text-error'
        ]"
      >
        <span
          :class="[
            'w-2 h-2 rounded-full animate-pulse',
            sseStatus === 'connected' ? 'bg-success' :
            sseStatus === 'connecting' ? 'bg-warning' :
            'bg-error'
          ]"
        />
        {{ sseStatus === 'connected' ? '已连接' : sseStatus === 'connecting' ? '连接中' : '未连接' }}
      </div>
    </div>

    <div class="flex h-screen">
      <!-- 侧边栏 -->
      <aside class="w-64 bg-deep border-r border-border-subtle flex flex-col">
        <div class="p-4 border-b border-border-subtle">
          <h1 class="text-xl font-semibold text-accent-primary">AgenteamBoard</h1>
          <p class="text-xs text-text-secondary mt-1">Agent Teams监控</p>
        </div>
        <TeamList />
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 flex flex-col">
        <header
          v-if="teamsStore.activeTeam"
          class="h-16 bg-surface border-b border-border-subtle flex items-center justify-between px-6"
        >
          <div>
            <h2 class="text-lg font-medium text-text-primary">
              {{ teamsStore.activeTeam.name }}
            </h2>
            <p class="text-xs text-text-secondary">
              {{ teamsStore.activeTeam.memberCount }} 位成员
            </p>
          </div>

          <div class="flex items-center gap-4">
            <ViewToggle />
          </div>
        </header>

        <div
          v-else
          class="h-16 bg-surface border-b border-border-subtle flex items-center px-6"
        >
          <h2 class="text-lg font-medium text-text-primary">选择一个团队</h2>
        </div>

        <!-- 消息/JSON视图 -->
        <MessageFeed v-if="viewStore.currentView === 'chat'" />
        <JsonViewer v-else />
      </main>
    </div>
  </div>
</template>
```

**Step 2: 提交集成**

```bash
git add frontend/src/App.vue
git commit -m "feat: 集成所有组件到App，完成前端界面"
```

---

## 阶段5：测试和优化

### Task 18: 手动测试和修复

**Files:**
- Test: 手动测试所有功能

**Step 1: 安装依赖并启动后端**

```bash
cd backend
npm install
npm run dev
```

**预期输出:**
```
[INFO] 服务器启动成功: http://localhost:3000
[INFO] 已加载 X 个团队
[INFO] 文件监听已启动: C:\Users\nicor\.claude\teams
```

**Step 2: 安装依赖并启动前端**

新开终端：
```bash
cd frontend
npm install
npm run dev
```

**预期输出:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
```

**Step 3: 测试功能清单**

1. 访问 http://localhost:5173/
2. 检查团队列表是否正确显示
3. 点击团队，检查消息是否加载
4. 检查SSE连接状态（右上角指示器）
5. 切换聊天视图/JSON视图
6. 触发一个团队活动，检查实时更新
7. 检查控制台是否有错误

**Step 4: 修复发现的问题**

记录所有问题并逐个修复。

**Step 5: 提交测试和修复**

```bash
git add .
git commit -m "test: 手动测试和bug修复"
```

### Task 19: 添加README文档

**Files:**
- Create: `README.md`

**Step 1: 创建README**

```markdown
# AgenteamBoard

Agent Teams 实时监控系统 - 漂海科技风格

## 功能特性

- ✅ 实时监控 Claude Code Agent Teams 活动
- ✅ 聊天风格和 JSON 双视图模式
- ✅ 自动发现和加载团队
- ✅ SSE 实时推送更新
- ✅ 深海科技美学主题

## 技术栈

**后端**
- Fastify - Web 框架
- chokidar - 文件监听
- Server-Sent Events - 实时推送

**前端**
- Vue 3 - 前端框架
- Vite - 构建工具
- Pinia - 状态管理
- TailwindCSS - 样式框架

## 快速开始

### 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd ../frontend
npm install
```

### 启动开发服务器

**后端（终端1）:**
```bash
cd backend
npm run dev
```

**前端（终端2）:**
```bash
cd frontend
npm run dev
```

### 访问应用

打开浏览器访问: http://localhost:5173/

## 配置

编辑 `backend/.env` 文件：

```env
PORT=3000
HOME=/c/Users/nicor
TEAMS_PATH=${HOME}/.claude/teams
LOG_LEVEL=info
```

## 项目结构

```
AgenteamBoard/
├── backend/          # 后端服务（Fastify）
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── frontend/         # 前端应用（Vue 3）
│   ├── src/
│   │   ├── components/
│   │   ├── stores/
│   │   ├── composables/
│   │   └── App.vue
│   └── package.json
└── README.md
```

## API 文档

### REST API

- `GET /api/teams` - 获取所有团队
- `GET /api/teams/:id` - 获取团队详情
- `GET /api/teams/:id/messages` - 获取团队消息

### SSE 事件

- `connected` - 连接成功
- `team:updated` - 团队更新
- `team:deleted` - 团队删除
- `message:new` - 新消息

## 许可证

MIT
```

**Step 2: 提交README**

```bash
git add README.md
git commit -m "docs: 添加项目README文档"
```

### Task 20: 最终验证和准备部署

**Files:**
- Test: 完整功能验证

**Step 1: 构建前端生产版本**

```bash
cd frontend
npm run build
```

**预期:** 生成 `frontend/dist/` 目录

**Step 2: 测试生产构建**

修改 `backend/src/server.js` 的静态文件路径：

```javascript
await fastify.register(import('@fastify/static'), {
  root: path.join(process.cwd(), '../frontend/dist'),
  prefix: '/',
});
```

启动后端：
```bash
cd backend
npm start
```

访问 http://localhost:3000/

**Step 3: 检查所有功能**

- [ ] 团队列表显示
- [ ] 消息加载
- [ ] 实时更新
- [ ] 视图切换
- [ ] 响应式布局
- [ ] 控制台无错误

**Step 4: 创建 .gitignore（如果还没有）**

项目根目录：
```bash
cat > .gitignore << 'EOF'
node_modules/
*.log
.DS_Store
.env
dist/
coverage/
EOF
```

**Step 5: 最终提交**

```bash
git add .
git commit -m "feat: 完成AgenteamBoard实现"
```

**Step 6: 打标签（可选）**

```bash
git tag -a v1.0.0 -m "AgenteamBoard v1.0.0"
git push origin master --tags
```

---

## 任务完成检查清单

- [x] 阶段1: 项目初始化和基础架构
- [ ] 阶段2: 后端核心功能
- [ ] 阶段3: 前端核心功能
- [ ] 阶段4: UI组件实现
- [ ] 阶段5: 测试和优化

## 下一步

1. 运行此实现计划
2. 修复发现的问题
3. 添加更多功能（搜索、过滤、导出等）
4. 性能优化
5. 部署到生产环境
