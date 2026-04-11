# Roadmap

## Bugs

- **Duplicate messages on Telegram** - intermittent. Partially fixed but still occurs occasionally.
- **Zombie processes** - claude subprocesses occasionally don't exit cleanly.

## Nice to have

- **Tool activity indicators** - TUI shows spinner but no "Running Bash..." status.
- **Model picker** - `/model` search doesn't list glueclaw models. Models work when set via config.

## Future

- **Persistent subprocess** - keep one `claude` process alive per session instead of spawning per turn. Eliminates startup latency, matches ClawMux architecture.
- **Autofix detection** - healthcheck cron that binary searches and patches new Anthropic triggers automatically.
- **npm publish** - `openclaw plugins install glueclaw` instead of git clone.
