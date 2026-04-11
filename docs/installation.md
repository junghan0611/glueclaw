# Installation

## Prerequisites

- [OpenClaw](https://docs.openclaw.ai) (2026.4.2+)
- [Claude Code](https://claude.ai/claude-code) logged in with a Max subscription
- Node.js and npm

## Install

```bash
git clone https://github.com/zeulewan/glueclaw.git \
  && cd glueclaw && bash install.sh
```

The installer is idempotent and safe to re-run after OpenClaw updates.

## What the installer does

1. Installs npm dependencies (`@mariozechner/pi-ai`,
   `@mariozechner/pi-agent-core`)
2. Adds `GLUECLAW_KEY=local` to your shell profile
3. Registers the plugin with OpenClaw (with fallback for older versions)
4. Configures models and `gateway.tools.allow`
5. Writes an auth profile to `~/.openclaw/agents/main/agent/auth-profiles.json`
6. Patches one file in OpenClaw's dist (`server-*.js`) to expose the MCP
   loopback token. A `.glueclaw-bak` backup is created.
7. Starts the gateway on port 18789

## Uninstall

Switch to another model and restore the patched file from backup:

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

## Re-running the installer

Running `bash install.sh` again is safe at any time:

- Dependencies are updated, not duplicated
- Shell profile export is only added once
- Plugin registration overwrites previous config
- The MCP patch is skipped if already applied
- The gateway is restarted cleanly
