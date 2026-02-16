#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, lstatSync, readlinkSync, rmSync } from 'fs';
import os from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const claudeSkillsDir = join(os.homedir(), '.claude', 'skills');
const skillTarget = join(claudeSkillsDir, 'agenteam-board');

console.log('🗑️  Uninstalling AgenteamBoard skill...\n');

if (!existsSync(skillTarget)) {
  console.log('ℹ️  Skill is not installed');
  process.exit(0);
}

const stats = lstatSync(skillTarget);

if (stats.isSymbolicLink()) {
  const linkTarget = readlinkSync(skillTarget);
  console.log('Removing symlink to: ' + linkTarget);
}

rmSync(skillTarget, { recursive: true, force: true });

console.log('✅ Skill uninstalled successfully');
