# GlueClaw

Glue Claude back into OpenClaw. **Experimental** - may be buggy.

Uses the official Claude CLI and scrubs out [Anthropic's detection triggers](docs/detection-patterns.md) from the system prompt due to [Anthropic not allowing its use](https://iili.io/BuL3tKN.png). Tested with Telegram, but heartbeats and some other features remain to be tested. (tool calls dont show up in the TUI)

[X post](https://x.com/zeulewan/status/2042769065408680223)

## Install

Requires [OpenClaw](https://docs.openclaw.ai) and [Claude Code](https://claude.ai/claude-code) logged in with Max. Non-destructive, won't touch your existing config or sessions. Works with OpenClaw 2026.4.2+.

```bash
git clone https://github.com/zeulewan/glueclaw.git && cd glueclaw && bash install.sh
```

See [installation docs](docs/installation.md) for uninstall and details.

## How it works

Uses the official Claude CLI:

```
claude --dangerously-skip-permissions -p \
    --output-format stream-json \
    --verbose --include-partial-messages \
    --system-prompt <scrubbed prompt> \
    --model <model> \
    --resume <session-id> \
    "<user message>"
```

For this to stop working, they'd have to block the json streaming mode or the custom system prompt mode.

## Models

| Model | Claude Model | Context |
|-------|-------------|---------|
| `glueclaw/glueclaw-opus` | Opus 4.6 | 1M |
| `glueclaw/glueclaw-sonnet` | Sonnet 4.6 | 200k |
| `glueclaw/glueclaw-haiku` | Haiku 4.5 | 200k |

Switch in TUI: `/model glueclaw/glueclaw-opus`

## Notes

- Tested with Telegram and OpenClaw TUI
- Switching between GlueClaw and other backends (e.g. Codex) works seamlessly via `/model`
- The installer patches one file in OpenClaw's dist to expose the MCP loopback token to plugins. A `.glueclaw-bak` backup is created.

## Disclaimer

Uses only official, documented Claude Code CLI flags. No reverse engineering, no credential extraction, no API spoofing. Use at your own risk. Not affiliated with or endorsed by Anthropic or OpenClaw.

## Docs

- [Installation](docs/installation.md)
- [Architecture](docs/architecture.md)
- [Testing](docs/testing.md)
- [Detection Patterns](docs/detection-patterns.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Roadmap](docs/roadmap.md)
- [Contributing](CONTRIBUTING.md)
