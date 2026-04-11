# GlueClaw

OpenClaw provider plugin that routes inference through the Claude CLI, using a
Claude Max subscription instead of API keys.

Scrubs [Anthropic's detection triggers](docs/detection-patterns.md) from the
OpenClaw system prompt so the Claude CLI accepts it.

[My X post](https://x.com/zeulewan/status/2042769065408680223)

## Install

Requires [OpenClaw](https://docs.openclaw.ai) 2026.4.2+ and
[Claude Code](https://claude.ai/claude-code) logged in with Max.

```bash
git clone https://github.com/zeulewan/glueclaw.git \
  && cd glueclaw && bash install.sh
```

See [installation docs](docs/installation.md) for uninstall and details.

## Models

| Model                      | Claude Model | Context |
| -------------------------- | ------------ | ------- |
| `glueclaw/glueclaw-opus`   | Opus 4.6     | 1M      |
| `glueclaw/glueclaw-sonnet` | Sonnet 4.6   | 200k    |
| `glueclaw/glueclaw-haiku`  | Haiku 4.5    | 200k    |

Switch in TUI: `/model glueclaw/glueclaw-opus`

## Disclaimer

Uses only official Claude Code CLI flags. No reverse engineering, no credential
extraction, no API spoofing. Use at your own risk.

## Docs

- [Installation](docs/installation.md)
- [Architecture](docs/architecture.md)
- [Testing](docs/testing.md)
- [Detection Patterns](docs/detection-patterns.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Roadmap](docs/roadmap.md)
- [Contributing](CONTRIBUTING.md)
