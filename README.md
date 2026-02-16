# AgenteamBoard

Agent Teams 监控系统 - 实时监控和查看多 Agent 团队的对话消息。

## 功能特性

- 📊 **团队管理** - 自动加载和监控多个 Agent 团队
- 👥 **成员列表** - 查看团队中的所有成员及其角色
- 💬 **消息监控** - 实时接收和显示团队对话消息
- 🔍 **消息筛选** - 按成员筛选消息，支持搜索功能
- 🎨 **现代界面** - 三栏布局，响应式设计，流畅的用户体验
- 🔄 **SSE 实时更新** - 通过 Server-Sent Events 实时推送新消息
- ⚙️ **系统消息** - 显示系统协议消息（非 JSON 格式）

## 技术栈

### 后端
- **Fastify** - 高性能 Web 框架
- **Node.js** - 运行时环境（要求 >= 18.0.0）
- **Chokidar** - 文件监听，自动加载团队配置
- **SSE (Server-Sent Events)** - 实时消息推送

### 前端
- **Vue 3** - 使用 Composition API
- **Pinia** - 状态管理
- **Vite** - 开发服务器和构建工具
- **TailwindCSS** - 实用优先的 CSS 框架
- **Vue Virtual Scroller** - 虚拟滚动，优化长列表性能

## 项目结构

```
agenteam-board/
├── package.json              # 根 package.json，定义 bin 和 workspaces
├── bin/
│   └── cli.js                # CLI 入口
├── packages/
│   ├── backend/              # 后端代码
│   │   ├── package.json
│   │   └── src/
│   │       ├── server.js
│   │       ├── routes/
│   │       ├── services/
│   │       └── utils/
│   └── frontend/             # 前端代码
│       ├── package.json
│       ├── vite.config.js
│       ├── index.html
│       └── src/
└── README.md
```

## 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm 或 yarn

### 方式一：使用 NPX（推荐）

安装并运行（一键启动）：

```bash
npx agenteam-board
```

这将自动：
- 启动后端 API 服务器（端口 3001）
- 启动前端开发服务器（端口 3000）
- 自动打开浏览器访问应用

按 `Ctrl+C` 可同时停止两个服务。

### 方式二：从源码运行

1. 克隆仓库
```bash
git clone <repository-url>
cd AgenteamBoard
```

2. 安装依赖（自动安装所有 workspaces）
```bash
npm install
```

3. 运行开发服务器
```bash
npm run dev
```

或者分别启动后端和前端：
```bash
# 启动后端
npm run backend

# 在另一个终端启动前端
npm run frontend
```

4. 访问应用
```
前端: http://localhost:3000
API: http://localhost:3001
```

### 方式三：全局安装

```bash
# 全局安装
npm link

# 运行
agenteam-board

# 或者
npm run dev
```

## 配置

### 团队配置

后端会自动监听 `C:\Users\nicor\.claude\teams` 目录下的团队配置文件。团队配置应为 JSON 格式：

```json
{
  "id": "team-id",
  "name": "团队名称",
  "members": [
    {
      "name": "成员名称",
      "agentType": "agent 类型",
      "color": "blue"
    }
  ]
}
```

### API 端点

- `GET /api/teams` - 获取所有团队
- `GET /api/teams/:teamId/messages` - 获取指定团队的消息
- `GET /api/events` - SSE 实时事件流

## 使用说明

### 三栏布局

1. **左侧栏** - 显示所有团队
2. **中间栏** - 显示选中团队的成员列表
3. **右侧主区域** - 显示消息内容

### 导航流程

1. 点击左侧团队 → 展开成员列表
2. 点击成员 → 筛选该成员的消息
3. 使用返回按钮返回上一级

### 系统消息

系统协议消息会以特殊格式显示，带有 ⚙️ 图标，便于区分普通对话消息和系统消息。

## 开发

### 前端打包（生产构建）

```bash
cd frontend
npm run build
```

构建产物将生成在 `frontend/dist` 目录。

### 预览生产构建

本地预览打包后的应用：

```bash
cd frontend
npm run preview
```

预览服务器默认运行在 http://localhost:4173

## 部署

### 方式一：开发环境部署

#### 1. 启动后端

```bash
cd backend
npm install
npm run dev
```

后端将运行在 http://localhost:3001

#### 2. 启动前端（开发模式）

```bash
cd frontend
npm install
npm run dev
```

前端将运行在 http://localhost:3002

### 方式二：生产环境部署

#### 1. 启动后端

```bash
cd backend
npm install --production
node src/server.js
```

或使用 PM2 进程管理器（推荐）：

```bash
# 安装 PM2
npm install -g pm2

# 启动后端
pm2 start backend/src/server.js --name "agenteam-backend"

# 查看日志
pm2 logs agenteam-backend

# 停止服务
pm2 stop agenteam-backend

# 重启服务
pm2 restart agenteam-backend
```

#### 2. 前端打包和部署

**打包前端：**

```bash
cd frontend
npm install
npm run build
```

**部署方式 A - 使用后端静态文件服务（推荐）：**

1. 将 `frontend/dist` 目录复制到后端项目
2. 后端会自动提供静态文件服务

```bash
# Windows
xcopy frontend\dist backend\static /E /I /Y

# Linux/Mac
cp -r frontend/dist backend/static
```

3. 访问 http://localhost:3001 即可使用完整应用

**部署方式 B - 使用独立 Web 服务器：**

使用 Nginx 或 Apache 配置静态文件服务：

Nginx 配置示例：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 代理 API 请求到后端
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SSE 事件流代理
    location /api/events {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_set_header Cache-Control 'no-cache';
        chunked_transfer_encoding off;
    }
}
```

### 方式三：Docker 部署（推荐用于生产）

创建 `Dockerfile`（后端）：

```dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制后端代码
COPY backend/package*.json ./backend/
COPY backend/src ./backend/src
RUN cd backend && npm install --production

# 复制前端代码并构建
COPY frontend/package*.json ./frontend/
COPY frontend/src ./frontend/src
COPY frontend/index.html ./frontend/
COPY frontend/vite.config.js ./frontend/
COPY frontend/postcss.config.js ./frontend/
COPY frontend/tailwind.config.js ./frontend/
RUN cd frontend && npm install && npm run build

# 移动构建产物到后端静态目录
RUN mv frontend/dist backend/static

EXPOSE 3001

WORKDIR /app/backend
CMD ["node", "src/server.js"]
```

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  agenteam-board:
    build: .
    ports:
      - "3001:3001"
    volumes:
      - C:/Users/nicor/.claude/teams:/teams:ro
    restart: unless-stopped
```

构建和运行：

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 环境变量配置（可选）

创建 `.env` 文件（backend/.env）：

```env
PORT=3001
TEAMS_FILE_PATH=C:\Users\nicor\.claude\teams
```

修改 `backend/src/server.js` 以支持环境变量。

## 故障排除

### SSE 连接失败

确保后端服务器正在运行，并检查防火墙设置。

### 团队列表为空

检查团队配置文件路径是否正确，文件格式是否有效。

### 消息不更新

查看浏览器控制台是否有错误信息，确认 SSE 连接状态（右上角指示器）。

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
