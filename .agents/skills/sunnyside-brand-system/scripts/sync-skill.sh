#!/usr/bin/env bash
# Mirror skills/sunnyside-brand-system into .agents/skills/ (or back with --reverse)
# and fail loudly if the copies differ afterwards.
set -euo pipefail
root="$(git rev-parse --show-toplevel)"
a="$root/skills/sunnyside-brand-system"
b="$root/.agents/skills/sunnyside-brand-system"
if [[ "${1:-}" == "--reverse" ]]; then src="$b"; dst="$a"; else src="$a"; dst="$b"; fi
rm -rf "$dst"
mkdir -p "$(dirname "$dst")"
cp -a "$src" "$dst"
diff -rq "$a" "$b" && echo "in sync: $src -> $dst"
