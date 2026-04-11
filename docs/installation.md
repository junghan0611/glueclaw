# Installation

## Prerequisites

- [OpenClaw](https://docs.openclaw.ai) 2026.4.2+
- [Claude Code](https://claude.ai/claude-code) logged in with Max
- Node.js 18+

## Install

```bash
git clone https://github.com/zeulewan/glueclaw.git \
  && cd glueclaw && bash install.sh
```

The installer is idempotent. Re-run after OpenClaw updates to re-apply patches.

## What the installer does

1. Installs npm dependencies
2. Adds `GLUECLAW_KEY=local` to shell profile
3. Registers the plugin with OpenClaw
4. Configures models and `gateway.tools.allow`
5. Writes auth profile to `~/.openclaw/agents/main/agent/auth-profiles.json`
6. Patches `server-*.js` in OpenClaw's dist to expose the MCP loopback token
   (backup created as `.glueclaw-bak`)
7. Starts the gateway on port 18789

## Verify

```bash
export GLUECLAW_KEY=local
openclaw agent --agent main \
  --message "say banana" 2>&1 | tail -n 1
```

Expected output: `banana`

## Uninstall

```bash
openclaw config set agents.defaults.model \
  anthropic/claude-sonnet-4-6
cd "$(dirname "$(command -v openclaw)")/../lib/\
node_modules/openclaw/dist" && \
  for f in *.glueclaw-bak; do \
    [ -f "$f" ] && mv "$f" "${f%.glueclaw-bak}"; \
  done
openclaw gateway restart
```
