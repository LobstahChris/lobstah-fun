#!/bin/bash
# LobstahFun: Squad Context Pre-Processor (WAKE_UP_PREP)
# Usage: ./scripts/core/wake_up.sh [agent_name]

AGENT=$1
REPO_DIR="/home/ubuntu/.openclaw/Desktop/projects/lobstah-fun"
TODAY=$(date +"%Y-%m-%d")

echo "### 🌅 INITIALIZATION: $(echo $AGENT | tr '[:lower:]' '[:upper:]')"
echo "Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"

echo -e "\n#### 🧬 CORE SOUL"
cat "$REPO_DIR/web/content/docs/workspace/squad/$AGENT.mdx"

echo -e "\n#### 🗺️ CURRENT ROADMAP"
cat "$REPO_DIR/web/content/docs/workspace/roadmap.mdx"

echo -e "\n#### 🏁 LATEST STANDUP"
if [ -f "$REPO_DIR/web/content/docs/workspace/daily-standups/$TODAY.mdx" ]; then
    cat "$REPO_DIR/web/content/docs/workspace/daily-standups/$TODAY.mdx"
else
    echo "No standup for today yet."
fi

echo -e "\n#### 🎯 ACTIVE ASSIGNMENTS (Step D)"
gh issue list --repo LobstahFun/lobstah-fun --json number,title,body --label "$AGENT"
