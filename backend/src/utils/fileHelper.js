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
