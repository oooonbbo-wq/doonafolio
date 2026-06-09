# 이승연 포트폴리오

디자이너 출신 AI 서비스 프론트엔드 개발자 **이승연**의 포트폴리오 웹사이트입니다.
레트로-모던 에디토리얼 무드의 반응형 정적 사이트입니다.

🔗 **Live:** https://oooonbbo-wq.github.io/  &larr; *(배포 후 본인 GitHub Pages 주소로 교체)*

## 디자인 컨셉
- 따뜻한 **옐로우 격자(grid) 배경** 위에 떠 있는 **아이보리 패널** 레이아웃
- 컬러 시스템: 오렌지-옐로우(메인) · 고채도 블루(보색) · 아이보리/크림/차콜(중립)
- 프로젝트는 **팬톤 컬러칩 카드** → 클릭 시 **아이보리 대형 모달 창**으로 상세 표시
- 떠 있는 pill 형태 네비게이션 · 에디토리얼 타이포그래피

## 기술
- HTML · CSS · Vanilla JavaScript (프레임워크 · 빌드 도구 없음)
- 폰트: **Pretendard**(본문·제목) · **Lobster**(로고·이름) · Bricolage Grotesque · Space Mono
- 디자인 시스템 토큰(`:root`)으로 색상 · radius · shadow · 타이포그래피 관리

## 주요 인터랙션
- 히어로: 우측 사인("AI / Frontend / Developer") **글자 단위 등장** + 제목 줄별 순차 등장
- 프로젝트 카드 클릭 → **모달 오픈** (ESC · 배경 클릭 · 닫기 버튼으로 닫힘)
- 스크롤 시 섹션 **reveal 애니메이션**, 네비 바 **스크롤 다운 시 숨김 / 업 시 표시**
- 모바일(≤680px): 네비가 **햄버거 메뉴**로 전환
- `prefers-reduced-motion` 대응 (모션 최소화 설정 존중)

## 폴더 구조
```
.
├── index.html   # 마크업 (프로젝트 상세는 <template> + 모달 구조)
├── style.css    # 스타일 (색상·spacing·radius·shadow는 :root 토큰에서 관리)
└── script.js    # 모달 · 스크롤 애니메이션 · 네비 숨김 · 햄버거 · 히어로 사인 분해
```

## 로컬에서 보기
프로젝트 폴더에서 간단한 정적 서버를 띄우는 방법을 추천합니다.

```bash
python3 -m http.server 8000
```
→ 브라우저에서 **http://localhost:8000** 접속

또는 VS Code의 **Live Server** 확장으로 `index.html`을 열어도 됩니다.

## 트러블슈팅

<details>
<summary><b>개발 중 발생한 주요 이슈와 원인·대응 내역</b> (펼치기)</summary>

<br>

| # | 증상 | 원인 | 해결 |
|---|------|------|------|
| 1 | 히어로 사인 애니메이션 재생 시 배경 격자가 사라짐 | 대형 텍스트의 transform 애니메이션이 별도 합성 레이어를 생성 → `body` 배경(grid)이 리페인트되지 않는 Chrome 합성 버그 | 격자를 `body::before` **고정 레이어**(`position:fixed; z-index:-1`)로 분리해 콘텐츠 레이어와 독립시킴 |
| 2 | 사인 글자 등장 시 버벅임 + 잔상(ghosting) | 글자별 `transform`(translate/rotate) 애니메이션이 대형 글리프에서 리페인트 잔상 유발 | 글자 애니메이션을 **`opacity` 전환만** 사용하도록 단순화 + `.hero-sign`에 `backface-visibility:hidden`으로 GPU 레이어 고정 |
| 3 | 웹폰트가 적용되지 않고 기본 폰트로 폴백 | `@font-face`의 `src` URL 오류(존재하지 않는 경로) | 눈누 웹폰트 CDN URL 검증 후 적용. Pretendard·Lobster는 `index.html` `<link>` / `style.css`에서 로드 |
| 4 | 다크모드에서 격자가 보이지 않음 | 다크 토큰의 `--grid-bg`/`--grid-line` 대비가 거의 없어 격자가 묻힘 | 다크모드 제거(라이트 단일 테마)로 정책 결정 — 테마 토글·자동 감지 스크립트 삭제 |
| 5 | 카드 좌우 여백이 섹션마다 불일치 | 본문 카드는 `.wrap` 자체가 카드(풀폭)인 반면, 푸터 카드는 `.wrap` 내부 요소라 여백이 다름 | 본문 카드 `max-width`를 `calc(var(--maxw) - 60px)`로 맞추고 `main > section`에 좌우 패딩 부여해 정렬 통일 |
| 6 | 좁은 화면에서 네비 메뉴 노출 안 됨 | 모바일에서 메뉴를 `display:none` 처리했으나 대체 UI 부재 | 680px 이하에서 **햄버거 메뉴(☰) + 드롭다운**으로 전환 (토글 JS 추가) |
| 7 | 로컬 수정 사항이 브라우저에 미반영 | 파일 미저장 또는 정적 서버 캐시 | `Cmd+S` 저장 → `Cmd+Shift+R` 강제 새로고침 → 필요 시 DevTools `Disable cache` |
| 8 | About 우측(Currently·Focus)이 좌측 본문과 위·아래 라인이 안 맞음 | 우측 컬럼이 단순 top/bottom 정렬이라 본문 높이와 어긋남 | 2단 그리드 `align-items:stretch` + 우측 `justify-content:space-between`(상단 Currently·하단 Focus), 본문 메타라인 `margin-top:auto`로 하단 고정해 양 라인 정렬 |
| 9 | 스크롤 안내가 등장 직후 깜빡(밝기 점프) | 등장(`cuein`) 종료 opacity와 호흡(`cuefloat`) 시작 opacity 불일치 | 두 애니메이션 이음새의 opacity 값을 동일(.5)하게 맞춰 매끄럽게 연결 |
| 10 | 긴 강조 문장이 좁은 화면에서 컬럼을 넘침(overflow) | `white-space:nowrap`을 전 구간에 적용 | `@media(min-width:1150px)`에서만 한 줄 고정, 그 이하는 정상 줄바꿈 |
| 11 | 넓은 화면에서 이름(영문+한글)이 2줄로 떨어짐 | 폰트가 `vw` 기준으로 커지며 컬럼 폭 초과 | 영문+한글을 `flex`(`white-space:nowrap`) 한 묶음으로 고정하고 최대 크기 하향 조정 |
| 12 | 큰 사인 글씨가 모바일에서 화면 밖으로 넘침 | 데스크탑 기준 대형 폰트가 작은 뷰포트에서 과도 | 680px 이하에서 `font-size` 축소(`clamp`), 우측 위치는 컨테이너 기준(`max()`)으로 네비·제목과 정렬 |

</details>

## GitHub Pages 배포
1. 이 폴더를 GitHub 저장소에 push
2. 저장소 **Settings → Pages** 이동
3. Source: **Deploy from a branch** → Branch: **main** / **`/(root)`** → **Save**
4. 잠시 뒤 발급되는 주소에서 확인

> 저장소 이름을 `사용자명.github.io`(예: `oooonbbo-wq.github.io`)로 만들면
> `https://사용자명.github.io/` 처럼 더 깔끔한 주소로 배포됩니다.
