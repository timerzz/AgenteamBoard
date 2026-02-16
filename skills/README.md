# AgenteamBoard Skill

这是 AgenteamBoard 的 Claude Code Skill 封装。

## 安装到 Claude Code

### 方法 1: 复制到 Claude Code skills 目录

```bash
# 复制 skill 到 Claude Code 的 skills 目录
cp -r skills/agenteam-board ~/.claude/skills/
```

### 方法 2: 创建符号链接（推荐，便于更新）

```bash
# 创建符号链接
ln -s $(pwd)/skills/agenteam-board ~/.claude/skills/agenteam-board
```

## 使用方法

在 Claude Code 中，当需要监控 agent 团队活动时，Claude 会自动找到这个 skill 并使用它。

或者你可以明确要求：

```
使用 agenteam-board skill 监控我的 agent 团队
```

## 更新 Skill

如果使用符号链接方式安装，只需在项目目录更新：

```bash
cd /path/to/AgenteamBoard
git pull
```

## 发布到 Superpowers Marketplace（可选）

如果你想将这个 skill 贡献到 superpowers marketplace：

1. Fork [superpowers-marketplace](https://github.com/nickmillerdev/superpowers-marketplace)
2. 将 `skills/agenteam-board/` 复制到 marketplace 的 `skills/` 目录
3. 提交 Pull Request

## Skill 内容

这个 skill 包含：
- 如何启动 AgenteamBoard
- 功能说明和导航
- 配置和故障排除
- 常见使用案例
