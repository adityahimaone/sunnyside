#!/usr/bin/env bash
# scripts/sync-all-skills.sh
# Synchronizes all Sunnyside skills across:
#   1. repo source: skills/<name>
#   2. local project mirror: .agents/skills/<name>
#   3. global mirrors: ~/.agents/skills/<name> and ~/.gemini/antigravity-cli/skills/<name>
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
SKILLS=(
  "sunnyside-brand-system"
  "sunnyside-taste-ui"
  "sunnyside-components"
  "sunnyside-review"
  "sunnyside-dashboard-system"
  "sunnyside-print"
  "sunnyside-thumbnail"
  "implement-brand-system"
)

echo "🔄 Synchronizing Sunnyside Skill Suite..."

for s in "${SKILLS[@]}"; do
  src="$root/skills/$s"
  if [[ ! -d "$src" ]]; then
    echo "⚠️ Source skill directory not found: $src"
    continue
  fi

  # 1. Project .agents/skills/ mirror
  proj_dst="$root/.agents/skills/$s"
  rm -rf "$proj_dst"
  mkdir -p "$(dirname "$proj_dst")"
  cp -a "$src" "$proj_dst"
  echo "  ✓ Mirrored $s → .agents/skills/$s"

  # 2. ~/.agents/skills mirror (if directory exists)
  if [[ -d "$HOME/.agents/skills" ]]; then
    user_agents_dst="$HOME/.agents/skills/$s"
    rm -rf "$user_agents_dst"
    cp -a "$src" "$user_agents_dst"
    echo "  ✓ Mirrored $s → ~/.agents/skills/$s"
  fi

  # 3. ~/.gemini/antigravity-cli/skills mirror (if directory exists)
  if [[ -d "$HOME/.gemini/antigravity-cli/skills" ]]; then
    gemini_dst="$HOME/.gemini/antigravity-cli/skills/$s"
    rm -rf "$gemini_dst"
    cp -a "$src" "$gemini_dst"
    echo "  ✓ Mirrored $s → ~/.gemini/antigravity-cli/skills/$s"
  fi
done

echo "✨ All skills synchronized successfully across all targets."
