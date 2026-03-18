#!/usr/bin/env bash
# sync-memory.sh — Memory sync placeholder
# This script is called by cron every 2h.
# The actual sync logic runs inside the OpenClaw session (AI reads daily notes + updates MEMORY.md).
# This script just signals that the sync was triggered.

WORKSPACE="/root/.openclaw/workspace"
DATE=$(date -u +%Y-%m-%d)
TIME=$(date -u +%H:%M)

echo "[memory-sync] $DATE $TIME UTC — sync triggered"

# Ensure memory dir exists
mkdir -p "$WORKSPACE/memory"

# Log sync timestamp
echo "$DATE $TIME" >> "$WORKSPACE/memory/.sync-log"

echo "[memory-sync] done"
