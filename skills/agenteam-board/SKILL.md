---
name: agenteam-board
description: Use when monitoring AI agent team conversations, viewing real-time message feeds from multiple teams, or needing a dashboard to track agent collaboration
---

# AgenteamBoard

## Overview

AgenteamBoard is a web-based dashboard for monitoring AI agent team conversations in real-time. It provides a visual interface to track messages, team members, and collaboration patterns across multiple agent teams.

## When to Use

Use this skill when you need to:
- Monitor real-time conversations between AI agents in team environments
- View message feeds from multiple agent teams simultaneously
- Track team membership and agent roles
- Debug agent collaboration by inspecting message patterns
- Provide a visual dashboard for agent team activity

## Quick Start

### Start the Dashboard

```bash
npx agenteam-board
```

This will:
- Start the backend API server (port 3001+)
- Start the frontend dev server (port 3000+)
- Automatically open your browser
- Display all teams from `~/.claude/teams`

### Stop the Dashboard

Press `Ctrl+C` to gracefully shutdown both servers.

## Features

### Three-Column Layout

1. **Left Column (Team List)** - View all available teams
2. **Middle Column (Member List)** - See team members and their roles
3. **Right Column (Message Feed)** - Real-time message stream with filtering

### Navigation Flow

1. Click a team → View team members
2. Click a member → Filter messages by that member
3. Use back button → Return to previous view

### Real-Time Updates

- Uses Server-Sent Events (SSE) for live message streaming
- Automatically updates when new messages arrive
- Connection status indicator in top-right corner

## Configuration

### Team Configuration

Teams are loaded from `~/.claude/teams` directory. Each team has:

```json
{
  "id": "team-id",
  "name": "Team Name",
  "members": [
    {
      "name": "Agent Name",
      "agentType": "agent-type",
      "color": "blue"
    }
  ]
}
```

### Directory Structure

```
~/.claude/teams/
  team-1/
    config.json       # Team configuration
    inboxes/          # Member message inboxes
      agent1.json
      agent2.json
  team-2/
    config.json
    inboxes/
      ...
```

## Alternative Usage Methods

### From Source Code

```bash
# Clone and run
git clone <repository-url>
cd AgenteamBoard
npm install
npm run dev
```

### Global Installation

```bash
npm link
agenteam-board
```

## API Endpoints

The backend provides these endpoints:

- `GET /api/teams` - List all teams
- `GET /api/teams/:teamId/messages` - Get team messages
- `GET /api/events` - SSE stream for real-time updates

## Troubleshooting

### No Teams Displayed

**Problem**: Dashboard shows empty team list

**Solutions**:
- Check `~/.claude/teams` directory exists
- Verify team config files are valid JSON
- Check console for error messages

### Connection Issues

**Problem**: SSE connection fails or messages don't update

**Solutions**:
- Verify backend is running (check port 3001+)
- Check firewall settings
- Refresh browser page

### Port Conflicts

**Problem**: Ports 3000-3010 are in use

**Solutions**:
- AgenteamBoard automatically finds available ports
- Check console output for actual ports used
- Kill conflicting processes if needed

## Common Use Cases

### Monitor Development Team

```bash
# Start dashboard
npx agenteam-board

# Navigate to your dev team
# Watch real-time agent conversations
# Filter by specific agents to track their work
```

### Debug Agent Communication

```bash
# Start dashboard
npx agenteam-board

# Select problematic team
# Review message history
# Identify communication patterns or issues
```

### Multi-Team Overview

```bash
# Start dashboard
npx agenteam-board

# Switch between teams in left column
# Monitor multiple projects simultaneously
```

## Technical Stack

### Backend
- **Fastify** - High-performance web framework
- **Server-Sent Events** - Real-time message streaming
- **Chokidar** - File watching for team updates

### Frontend
- **Vue 3** - Composition API
- **Pinia** - State management
- **Vite** - Development server
- **TailwindCSS** - Styling
- **Vue Virtual Scroller** - Performance optimization

## Architecture

```
User Browser
    ↓
Frontend (Vue 3 + Vite)
    ↓ HTTP/SSE
Backend (Fastify)
    ↓ File System
~/.claude/teams/
```

## Related Skills

- **superpowers:dispatching-parallel-agents** - For creating agent teams
- **superpowers:subagent-driven-development** - For managing agent workflows

## Tips

1. **Keep it Running**: Start the dashboard at the beginning of your work session to monitor agent activity in the background

2. **Filter Strategically**: Use member filtering to focus on specific agents when debugging

3. **Check System Messages**: System protocol messages are marked with ⚙️ icon - useful for understanding agent coordination

4. **Monitor Connection**: Watch the connection indicator - if it turns red, refresh the page

5. **Port Management**: The dashboard uses portfinder to avoid conflicts - check console for actual ports
