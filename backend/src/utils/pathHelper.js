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
