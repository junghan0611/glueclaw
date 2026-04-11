# GlueClaw

Glue Claude back into OpenClaw. **May be buggy!.**

Uses the official Claude CLI and scrubs out
[Anthropic's detection triggers](docs/detection-patterns.md) from the system
prompt due to [Anthropic not allowing its use](https://iili.io/BuL3tKN.png).
Tested with Telegram. As far as I can tell all functions work such as
heartbeats.

## Install

Requires [OpenClaw](https://docs.openclaw.ai) and
[Claude Code](https://claude.ai/claude-code) logged in with Max.
Non-destructive, won't touch your existing config or sessions. Works with
OpenClaw 2026.4.2+.

```bash
git clone https://github.com/zeulewan/glueclaw.git \
  && cd glueclaw && bash install.sh
```

See [docs/installation.md](docs/installation.md) for uninstall and details on
what the installer does.

## Models

| Model                      | Claude Model | Context |
| -------------------------- | ------------ | ------- |
| `glueclaw/glueclaw-opus`   | Opus 4.6     | 1M      |
| `glueclaw/glueclaw-sonnet` | Sonnet 4.6   | 200k    |
| `glueclaw/glueclaw-haiku`  | Haiku 4.5    | 200k    |

Switch in TUI: `/model glueclaw/glueclaw-opus`

## Notes

- Tested with Telegram and OpenClaw TUI
- Switching between GlueClaw and other backends (e.g. Codex) works seamlessly
  via `/model`
- The installer patches one file in OpenClaw's dist (`server-*.js`) to expose
  the MCP loopback token to plugins. A `.glueclaw-bak` backup is created.
  Updating OpenClaw (`npm install -g openclaw`) restores the original -- just
  re-run `bash install.sh` to re-apply the patch.

## Disclaimer

This project uses only official, documented Claude Code CLI flags. No reverse
engineering, no credential extraction, no API spoofing. It's your Max
subscription, your `claude` binary, your machine. Use at your own risk. Not
affiliated with or endorsed by Anthropic or OpenClaw.

## Documentation

- [Installation](docs/installation.md) -- install, uninstall, and what the
  installer does
- [Architecture](docs/architecture.md) -- how GlueClaw works under the hood
- [Testing](docs/testing.md) -- test procedures for all features
- [Health Check](docs/healthcheck.md) -- daily monitoring and troubleshooting
- [Detection Patterns](docs/detection-patterns.md) -- Anthropic trigger
  documentation and binary search procedure
- [Roadmap](docs/roadmap.md) -- known issues and future plans
- [Contributing](CONTRIBUTING.md) -- developer setup and workflow
