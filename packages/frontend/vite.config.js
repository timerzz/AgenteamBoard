import vue from '@vitejs/plugin-vue';
import path from 'path';

// 从环境变量获取后端端口，默认为 3001
const API_PORT = process.env.API_PORT || '3001';
const API_URL = `http://localhost:${API_PORT}`;

// 从环境变量获取前端端口，默认为 3000
const FRONTEND_PORT = parseInt(process.env.PORT) || 3000;

export default {
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: 'localhost',
    port: FRONTEND_PORT,
    strictPort: true, // 使用环境变量指定的端口，如果被占用则报错
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
      },
      '/api/events': {
        target: API_URL,
        changeOrigin: true,
        ws: true,
      },
    },
  },
};
