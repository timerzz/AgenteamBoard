# AgenteamBoard

Real-time monitoring dashboard for AI agent team conversations.

[中文文档](README_ZH.md)

## Introduction

AgenteamBoard is a web-based dashboard for monitoring AI agent team conversations in real-time. It provides a visual interface to track messages, team members, and collaboration patterns across multiple agent teams.

### Features

- 📊 **Team Management** - Automatically load and monitor multiple agent teams
- 👥 **Member List** - View all team members and their roles
- 💬 **Message Monitoring** - Real-time message reception and display
- 🔍 **Message Filtering** - Filter messages by member with search functionality
- 🎨 **Modern Interface** - Three-column layout, responsive design, smooth UX
- 🔄 **SSE Real-time Updates** - Push new messages via Server-Sent Events
- ⚙️ **System Messages** - Display system protocol messages with special formatting

## Claude Code Skill Usage

AgenteamBoard can be used as a Claude Code Skill, allowing Claude to automatically recognize when team monitoring is needed.

### Install Skill

```bash
# Install to Claude Code
npm run install-skill

# Uninstall
npm run uninstall-skill
```

### Usage in Claude Code

After installation, Claude Code will automatically recognize and use this skill, or you can explicitly request:

```
Use agenteam-board skill to monitor my agent teams
```

The skill enables:
- One-command dashboard startup
- Real-time team conversation monitoring
- Member activity tracking
- System message inspection

For more details, see [skills/README.md](skills/README.md).

## NPX Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Method 1: NPX (Recommended)

Install and run with one command:

```bash
npx agenteam-board
```

This will automatically:
- Start backend API server (port 3001+)
- Start frontend dev server (port 3000+)
- Open browser automatically
- Display all teams from `~/.claude/teams`

Press `Ctrl+C` to gracefully shutdown both servers.

### Method 2: From Source

1. Clone repository
```bash
git clone <repository-url>
cd AgenteamBoard
```

2. Install dependencies (auto-installs all workspaces)
```bash
npm install
```

3. Run development server
```bash
npm run dev
```

Or start backend and frontend separately:
```bash
# Start backend
npm run backend

# In another terminal, start frontend
npm run frontend
```

4. Access application
```
Frontend: http://localhost:3000
API: http://localhost:3001
```

### Method 3: Global Installation

```bash
# Install globally
npm link

# Run
agenteam-board

# Or
npm run dev
```

## Technical Architecture

### Technology Stack

#### Backend
- **Fastify** - High-performance web framework
- **Node.js** - Runtime environment (>= 18.0.0)
- **Chokidar** - File watching for auto-loading team configs
- **SSE (Server-Sent Events)** - Real-time message streaming

#### Frontend
- **Vue 3** - Composition API
- **Pinia** - State management
- **Vite** - Development server and build tool
- **TailwindCSS** - Utility-first CSS framework
- **Vue Virtual Scroller** - Virtual scrolling for long lists

### Project Structure

```
agenteam-board/
├── package.json              # Root package.json with bin and workspaces
├── bin/
│   └── cli.js                # CLI entry point
├── packages/
│   ├── backend/              # Backend code
│   │   ├── package.json
│   │   └── src/
│   │       ├── server.js     # Main server
│   │       ├── routes/       # API routes
│   │       ├── services/     # Business logic
│   │       └── utils/        # Utilities
│   └── frontend/             # Frontend code
│       ├── package.json
│       ├── vite.config.js
│       ├── index.html
│       └── src/
├── skills/
│   └── agenteam-board/       # Claude Code skill
└── scripts/
    ├── install-skill.js      # Skill installation script
    └── uninstall-skill.js    # Skill uninstallation script
```

### Architecture Diagram

```
User Browser
    ↓
Frontend (Vue 3 + Vite)
    ↓ HTTP/SSE
Backend (Fastify)
    ↓ File System
~/.claude/teams/
    ├── team-1/
    │   ├── config.json       # Team configuration
    │   └── inboxes/          # Member message inboxes
    │       ├── agent1.json
    │       └── agent2.json
    └── team-2/
        ├── config.json
        └── inboxes/
```

### How It Works

1. **Backend Initialization**
   - Loads team configurations from `~/.claude/teams`
   - Sets up file watcher with Chokidar
   - Starts Fastify server with CORS enabled
   - Exposes REST API and SSE endpoint

2. **Frontend Connection**
   - Vue app initializes Pinia stores
   - Establishes SSE connection to `/api/events`
   - Fetches initial team list via `/api/teams`
   - Renders three-column layout

3. **Real-time Updates**
   - File changes trigger Chokidar events
   - Backend broadcasts updates via SSE
   - Frontend receives and updates stores reactively
   - UI automatically re-renders

4. **Message Flow**
   - Agent team writes messages to inbox files
   - File watcher detects changes
   - Backend reads and parses messages
   - SSE pushes to connected clients
   - Virtual scroller efficiently renders messages

### API Endpoints

- `GET /api/teams` - List all teams
- `GET /api/teams/:teamId/messages` - Get team messages
- `GET /api/events` - SSE stream for real-time updates

### Configuration

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

### UI Layout

1. **Left Column** - Display all teams
2. **Middle Column** - Display selected team's members
3. **Right Column** - Display message content

### Navigation Flow

1. Click team → View team members
2. Click member → Filter messages by that member
3. Use back button → Return to previous view

## Deployment

### Development Environment

```bash
# Start both servers
npm run dev

# Or start separately
npm run backend  # Terminal 1
npm run frontend # Terminal 2
```

### Production Environment

#### Backend
```bash
cd packages/backend
npm install --production
node src/server.js
```

#### Frontend Build
```bash
cd packages/frontend
npm install
npm run build
```

The build output will be in `packages/frontend/dist`.

For detailed deployment options (PM2, Docker, Nginx), see the deployment section in README_ZH.md.

## Troubleshooting

### No Teams Displayed

**Problem**: Dashboard shows empty team list

**Solutions**:
- Verify `~/.claude/teams` directory exists
- Check team config files are valid JSON
- Inspect browser console for errors

### Connection Issues

**Problem**: SSE connection fails or messages don't update

**Solutions**:
- Verify backend is running (check port 3001+)
- Check firewall settings
- Refresh browser page

### Port Conflicts

**Problem**: Ports 3000-3010 are in use

**Solutions**:
- AgenteamBoard automatically finds available ports using portfinder
- Check console output for actual ports used
- Kill conflicting processes if needed

## License

MIT License

## Contributing

Issues and Pull Requests are welcome!

## Related Projects

- [Claude Code](https://github.com/anthropics/claude-code) - AI-powered coding assistant
- [Superpowers Marketplace](https://github.com/nickmillerdev/superpowers-marketplace) - Claude Code skills marketplace
