#!/usr/bin/env bash
# Build one chapter deck: ./build.sh <paper> <chapter>   e.g. ./build.sh lopez2019 1
# Output: decks/<paper>/<paper>_ch<N>.pptx
set -euo pipefail
cd "$(dirname "$0")"
PAPER=$1; CH=$2
: "${PPTX_SKILL:=/root/.claude/skills/synced/aa9118d1-e698-4429-a4ef-0631f61817fb_828df25a-6c0b-4f77-a93c-2cd9d11b6de1/pptx}"
export PPTX_SKILL
export NODE_PATH="$PWD/node_modules:$(npm root -g)${NODE_PATH:+:$NODE_PATH}"
OUT=decks/$PAPER/${PAPER}_ch${CH}.pptx
FIG=build/figs/${PAPER}_ch${CH}
mkdir -p "decks/$PAPER" "$FIG"
node "src/$PAPER/ch$CH.js" "$OUT" "$FIG"
python3 src/postprocess.py "$OUT" "$FIG"
python3 "$PPTX_SKILL/scripts/office/validate.py" "$OUT"
