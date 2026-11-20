#!/usr/bin/env bash
# Build one chapter deck: ./build.sh <paper> <chapter>   e.g. ./build.sh lopez2019 1
# Output: decks/<paper>/<paper>_ch<N>.pptx
set -euo pipefail
cd "$(dirname "$0")"
PAPER=$1; CH=$2
: "${PPTX_SKILL:?set PPTX_SKILL to the pptx skill directory (for apply_theme.js)}"
OUT=decks/$PAPER/${PAPER}_ch${CH}.pptx
FIG=build/figs/${PAPER}_ch${CH}
mkdir -p "decks/$PAPER" "$FIG"
node "src/$PAPER/ch$CH.js" "$OUT" "$FIG"
python3 src/postprocess.py "$OUT" "$FIG"
python3 "$PPTX_SKILL/scripts/office/validate.py" "$OUT"
