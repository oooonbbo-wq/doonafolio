#!/bin/bash
# ============================================================
#  GIF → H.264 MP4 일괄 변환 (용량 90%+ 절감)
#  - 화면 녹화는 프레임 간 압축이 되는 H.264가 GIF보다 훨씬 효율적
#  - 슬라이드는 확장자에 따라 <video>로 렌더되므로 .mp4만 있으면 동작
#  - 필요 도구: ffmpeg  →  설치: brew install ffmpeg
#  사용법:  bash tools/optimize-gifs.sh
# ============================================================
set -e
cd "$(dirname "$0")/.."

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "✗ ffmpeg가 없습니다.  먼저:  brew install ffmpeg"
  exit 1
fi

echo "GIF → MP4 변환 시작..."
find assets -iname '*.gif' | while IFS= read -r f; do
  out="${f%.gif}.mp4"
  # crf 27 = 화질/용량 균형, faststart = 웹 스트리밍, scale = h264용 짝수 해상도 보정
  ffmpeg -y -i "$f" \
    -movflags +faststart \
    -pix_fmt yuv420p \
    -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
    -c:v libx264 -crf 27 -preset veryfast -an \
    "$out" >/dev/null 2>&1 \
    && printf "  %5.1fMB → %5.1fMB  %s\n" \
         "$(echo "$(stat -f%z "$f")/1048576" | bc -l)" \
         "$(echo "$(stat -f%z "$out")/1048576" | bc -l)" \
         "$(basename "$out")" \
    || echo "  ✗ 변환 실패: $f"
done

echo ""
echo "✅ 변환 완료. 다음 2단계만 하면 적용됩니다:"
echo "  1) script.js의 gif 참조를 mp4로 교체:"
echo "       sed -i '' \"s/\\.gif'/.mp4'/g\" script.js"
echo "  2) 미리보기가 정상이면 원본 gif 삭제(용량 회수):"
echo "       find assets -iname '*.gif' -delete"
echo ""
echo "  ※ 적용 후 캐시 버전(index.html ?v=) 올리고 커밋하세요."
