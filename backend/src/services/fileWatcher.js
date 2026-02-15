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
