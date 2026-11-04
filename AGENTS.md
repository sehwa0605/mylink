# mylink — 에이전트 작업 규칙

## 사용자
- 이름: 양세화 (Sehwa Yang) · GitHub: sehwa0605 · 이메일: ysh8436@gmail.com
- 코딩 완전 초보. 한국어로, 전문 용어는 풀어서 설명. 설명 길이: 짧게 핵심만
- 이해 확인 질문(퀴즈): 붙이지 않음
- 컴퓨터: Windows

## 작업 규칙
- 작업이 끝나면: 커밋+푸시까지 알아서
- 커밋 메시지: feat:/fix:/style:/refactor:/chore:/docs: + 한국어 한 줄
- 주차 하나가 끝나면 커밋하고 멈춘다. 다음 주차는 새 대화에서.
- 실시간 기능(onSnapshot)은 쓰지 않는다. 데이터는 TanStack Query 로 "저장 후 다시 불러오기".
- displayName(공개 주소) 수정 기능은 만들지 않는다.

## 사고 방지 (예외 없음)
- 자동 테스트에서 mailto:/tel: 링크 클릭 금지 (href 형식만 검사)
- 프로세스 종료는 PID 로만. pkill -f "짧은단어" 금지
- 입력을 기다리는 명령(cat > 파일 등) 금지
- force push·커밋 기록 수정은 먼저 물어보기
- .env.local 은 절대 커밋하지 않기 (커밋 전 git status 확인)

## 코드 규칙 (가이드 4장 요약)
- 새 파일은 가이드 4장 4-5 폴더 구조를 따른다
- shadcn/ui 컴포넌트 먼저. 스타일은 Tailwind 클래스만 (CSS Module·style={{}} 금지)
- 화면 코드에는 색 코드 대신 토큰 클래스(bg-primary 등)만. 디자인 값은 docs/design.md → globals.css 토큰
- 코드에 줄마다 한국어 주석
- npm 스크립트는 next dev --webpack / next build --webpack

## 진행 상황
- 0장 완료 — 기본 사용자 정보 및 작업 규칙 수립
- 2주차 완료 — 프로젝트 생성, 프로필 페이지
- 3주차 완료 — GitHub 저장소(sehwa0605/mylink) 생성 및 연동, 초기 푸시 완료
- 4주차 완료 — 스위치 네온 디자인 채택, 프로필 리디자인, docs/design.md 작성 완료
- 5주차 완료 — 기획서(docs/PRD.md) 및 화면 개발용 샘플 데이터(src/lib/sampleLinks.ts) 작성 완료
- 6주차 완료 — shadcn/ui 도입, 스위치 네온 토큰 매핑, 프로필 헤더 및 링크 목록 컴포넌트 분리 완성

<!-- 아래 BEGIN~END 블록은 Next.js 가 관리한다. 이 위에만 쓸 것 -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
