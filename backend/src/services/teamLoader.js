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
