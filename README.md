# 이승연 포트폴리오

디자이너 출신 AI 서비스 프론트엔드 개발자 **이승연**의 포트폴리오 웹사이트입니다.
라이트/다크 모드 토글과 반응형 레이아웃을 지원하는 정적 사이트입니다.

🔗 **Live:** https://oooonbbo-wq.github.io/  &larr; *(배포 후 본인 GitHub Pages 주소로 교체)*

## 기술
- HTML · CSS · Vanilla JavaScript (프레임워크 · 빌드 도구 없음)
- 폰트: Pretendard, Bricolage Grotesque, Space Mono
- 라이트/다크 테마 (시스템 설정 자동 감지 + localStorage 저장)

## 폴더 구조
```
.
├── index.html   # 마크업
├── style.css    # 스타일 (색상은 :root / [data-theme="dark"] 에서 관리)
└── script.js    # 테마 토글 · 스크롤 애니메이션
```

## 로컬에서 보기
VS Code의 **Live Server** 확장으로 `index.html`을 열거나, 브라우저로 파일을 직접 열면 됩니다.

## GitHub Pages 배포
1. 이 폴더를 GitHub 저장소에 push
2. 저장소 **Settings → Pages** 이동
3. Source: **Deploy from a branch** → Branch: **main** / **`/(root)`** → **Save**
4. 잠시 뒤 발급되는 주소에서 확인

> 저장소 이름을 `사용자명.github.io`(예: `oooonbbo-wq.github.io`)로 만들면
> `https://사용자명.github.io/` 처럼 더 깔끔한 주소로 배포됩니다.
