#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { cpSync, existsSync, mkdirSync, symlinkSync, lstatSync, readlinkSync, unlinkSync } from 'fs';
import os from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillSource = join(__dirname, '..', 'skills', 'agenteam-board');
const claudeSkillsDir = join(os.homedir(), '.claude', 'skills');
const skillTarget = join(claudeSkillsDir, 'agenteam-board');

console.log('📦 Installing AgenteamBoard skill for Claude Code...\n');

// 确保 ~/.claude/skills 目录存在
if (!existsSync(claudeSkillsDir)) {
  mkdirSync(claudeSkillsDir, { recursive: true });
  console.log('✅ Created ~/.claude/skills directory');
}

// 检查是否已存在
if (existsSync(skillTarget)) {
  const stats = lstatSync(skillTarget);

  if (stats.isSymbolicLink()) {
    const linkTarget = readlinkSync(skillTarget);
    console.log('ℹ️  Skill already installed (symlink to: ' + linkTarget + ')');
    console.log('   Remove with: rm ~/.claude/skills/agenteam-board');
  } else {
    console.log('ℹ️  Skill already installed (directory)');
    console.log('   Remove with: rm -rf ~/.claude/skills/agenteam-board');
  }
  console.log('\n✨ Installation complete!');
  process.exit(0);
}

// 创建符号链接（开发模式）或复制文件（生产模式）
const isDev = existsSync(join(__dirname, '..', '.git'));

if (isDev) {
  // 开发模式：创建符号链接
  try {
    symlinkSync(skillSource, skillTarget, 'junction');
    console.log('✅ Created symlink (development mode)');
    console.log('   Source: ' + skillSource);
    console.log('   Target: ' + skillTarget);
  } catch (err) {
    console.error('⚠️  Failed to create symlink, falling back to copy');
    cpSync(skillSource, skillTarget, { recursive: true });
    console.log('✅ Copied skill files');
  }
} else {
  // 生产模式：复制文件
  cpSync(skillSource, skillTarget, { recursive: true });
  console.log('✅ Copied skill files');
  console.log('   Target: ' + skillTarget);
}

console.log('\n✨ Installation complete!');
console.log('\n📖 Usage:');
console.log('   The skill is now available in Claude Code.');
console.log('   Claude will automatically use it when monitoring agent teams.');
console.log('\n   Or explicitly request:');
console.log('   "使用 agenteam-board skill 监控我的团队"');
