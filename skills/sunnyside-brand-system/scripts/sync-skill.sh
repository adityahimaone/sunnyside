#!/usr/bin/env bash
# Mirror skills/sunnyside-* into .agents/skills/ (and global mirrors)
set -euo pipefail
root="$(git rev-parse --show-toplevel)"

if [[ -f "$root/scripts/sync-all-skills.sh" ]]; then
  bash "$root/scripts/sync-all-skills.sh"
else
  a="$root/skills/sunnyside-brand-system"
  b="$root/.agents/skills/sunnyside-brand-system"
  if [[ "${1:-}" == "--reverse" ]]; then src="$b"; dst="$a"; else src="$a"; dst="$b"; fi
  rm -rf "$dst"
  mkdir -p "$(dirname "$dst")"
  cp -a "$src" "$dst"
  diff -rq "$a" "$b" && echo "in sync: $src -> $dst"
fi
