# Doonafolio

디자이너 출신 AI 서비스 프론트엔드 개발자 **이승연**의 포트폴리오 웹사이트입니다.
레트로-모던 에디토리얼 무드의 반응형 정적 사이트입니다.

## 디자인 컨셉

- 따뜻한 **옐로우 격자(grid) 배경** 위에 떠 있는 **아이보리 패널** 레이아웃
- 컬러 시스템: 오렌지-옐로우(메인) · 고채도 블루(보색) · 아이보리/크림/차콜(중립)
- 프로젝트는 **좌측 정사각형 컬러칩 버튼** 갤러리 + 우측 'Team / Project' 사인 → 버튼 클릭 시 **우측 패널이 상세로 인플레이스 전환**
- 떠 있는 pill 형태 네비게이션 · 에디토리얼 타이포그래피

## 기술

- HTML · CSS · Vanilla JavaScript (프레임워크 · 빌드 도구 없음)
- 폰트: **Pretendard**(본문·제목) · **Lobster**(로고·이름) · Bricolage Grotesque · Space Mono
- 디자인 시스템 토큰(`:root`)으로 색상 · radius · shadow · 타이포그래피 관리

## 주요 인터랙션

- 히어로: 우측 사인("AI / Frontend / Developer") **글자 단위 등장** + 제목 줄별 순차 등장
- 프로젝트: 좌측 **정사각형 카드** 클릭 → 우측 패널이 해당 프로젝트 상세로 **인플레이스 전환**(같은 카드 재클릭·ESC로 닫기) · 우측 'Team / Project' 사인 글자 등장 + 'Click' 힌트 모션
- 스크롤 시 섹션 **reveal 애니메이션**, 네비 바 **스크롤 다운 시 숨김 / 업 시 표시**, 새로고침 시 **항상 최상단에서 시작**
- 모바일(≤680px): 네비가 **햄버거 메뉴**로 전환
- `prefers-reduced-motion` 대응 (모션 최소화 설정 존중)

## 폴더 구조

```
doonafolio
├── index.html   # 마크업 (프로젝트 상세는 <template> → 우측 패널로 인플레이스 렌더)
├── style.css    # 스타일 (색상·spacing·radius·shadow는 :root 토큰에서 관리)
├── script.js    # 상세 패널 전환 · 스크롤 애니메이션 · 네비 숨김/햄버거 · 사인 글자 분해 · 최상단 시작
└── assets/      # 로고 이미지 (withDOG, On_You)
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
<summary><b>개발 중 발생한 주요 이슈와 원인·대응 내역</b>
</summary>

<table>
<thead><tr><th>#</th><th>증상</th><th>원인</th><th>해결</th></tr></thead>
<tbody>
<tr><td>1</td><td>히어로 사인 애니메이션 재생 시 배경 격자가 사라짐</td><td>대형 텍스트의 transform 애니메이션이 별도 합성 레이어를 생성 → <code>body</code> 배경(grid)이 리페인트되지 않는 Chrome 합성 버그</td><td>격자를 <code>body::before</code> 고정 레이어(<code>position:fixed; z-index:-1</code>)로 분리해 콘텐츠 레이어와 독립시킴</td></tr>
<tr><td>2</td><td>사인 글자 등장 시 버벅임 + 잔상(ghosting)</td><td>글자별 <code>transform</code>(translate/rotate) 애니메이션이 대형 글리프에서 리페인트 잔상 유발</td><td>글자 애니메이션을 <code>opacity</code> 전환만 사용하도록 단순화 + <code>.hero-sign</code>에 <code>backface-visibility:hidden</code>으로 GPU 레이어 고정</td></tr>
<tr><td>3</td><td>Lobster 사인 글자 끝(swash)이 잘림</td><td>글자별 <code>will-change:opacity</code>가 각 글자를 개별 합성 레이어로 만들며 글리프 오버플로를 클립</td><td>글자별 <code>will-change</code> 제거(opacity 전환만으로도 충분히 부드러움)</td></tr>
<tr><td>4</td><td>스크롤 안내가 등장 직후 깜빡(밝기 점프)</td><td>등장(<code>cuein</code>) 종료 opacity와 호흡(<code>cuefloat</code>) 시작 opacity 불일치</td><td>두 애니메이션 이음새의 opacity 값을 동일(.5)하게 맞춰 매끄럽게 연결</td></tr>
<tr><td>5</td><td>프로젝트 상세가 모달(새 창)처럼 떠서 흐름이 끊김</td><td>별도 모달 레이어로 콘텐츠를 띄우는 구조</td><td>카드의 <code>&lt;template&gt;</code> 내용을 우측 패널에 <code>cloneNode</code>로 인플레이스 렌더(같은 카드 재클릭·ESC로 닫기)</td></tr>
<tr><td>6</td><td>카드 전환 시 상세 위치가 클릭마다 위아래로 흔들림</td><td>우측 영역이 가운데 정렬이라 상세 높이에 따라 위치가 달라짐</td><td>상세 열릴 때 우측 영역을 상단 고정(<code>justify-content:flex-start</code>)해 위치 일관화</td></tr>
<tr><td>7</td><td>About 우측(Currently·Focus)이 좌측 본문과 위·아래 라인이 안 맞음</td><td>우측 컬럼이 단순 top/bottom 정렬이라 본문 높이와 어긋남</td><td>2단 그리드 <code>align-items:stretch</code> + 우측 <code>justify-content:space-between</code>, 본문 메타라인 <code>margin-top:auto</code>로 하단 고정해 양 라인 정렬</td></tr>
<tr><td>8</td><td>카드 좌우 여백이 섹션마다 불일치</td><td>본문 카드는 <code>.wrap</code> 자체가 카드(풀폭)인 반면, 푸터 카드는 <code>.wrap</code> 내부 요소라 여백이 다름</td><td>본문 카드 <code>max-width</code>를 <code>calc(var(--maxw) - 60px)</code>로 맞추고 <code>main &gt; section</code>에 좌우 패딩 부여해 정렬 통일</td></tr>
<tr><td>9</td><td>긴 강조 문장 / 'Team Project' 사인이 좁은 화면에서 컬럼을 넘침</td><td>전 구간 <code>white-space:nowrap</code>, 폰트가 <code>vw</code>로 커지며 컬럼 폭 초과</td><td>넓은 화면(<code>min-width</code>)에서만 한 줄 고정, 그 이하는 줄바꿈 + 사인은 <code>clamp</code> 최소값까지 축소해 항상 2단 유지</td></tr>
<tr><td>10</td><td>다크모드에서 격자가 보이지 않음</td><td>다크 토큰의 <code>--grid-bg</code>/<code>--grid-line</code> 대비가 거의 없어 격자가 묻힘</td><td>스코프를 라이트 단일 테마로 결정 — 테마 토글·자동 감지 스크립트 제거</td></tr>
</tbody>
</table>

</details>

## GitHub Pages 배포

1. 이 폴더를 GitHub 저장소에 push
2. 저장소 **Settings → Pages** 이동
3. Source: **Deploy from a branch** → Branch: **main** / **`/(root)`** → **Save**
4. 잠시 뒤 발급되는 주소에서 확인

> 저장소 이름을 `사용자명.github.io`(예: `oooonbbo-wq.github.io`)로 만들면
> `https://사용자명.github.io/` 처럼 더 깔끔한 주소로 배포됩니다.
