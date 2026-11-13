# mylink (마이링크)

> 양세화의 프로필과 링크를 한곳에 모아 공유하는 링크인바이오 서비스
>
> 🔗 **배포 주소:** [https://mylink-eight-ivory.vercel.app](https://mylink-eight-ivory.vercel.app)
> 👤 **공개 프로필 예시:** [https://mylink-eight-ivory.vercel.app/ysh8436](https://mylink-eight-ivory.vercel.app/ysh8436)

## 소개
내 프로필과 여러 링크를 한 페이지에 모아 `내주소/{아이디}` 로 공유할 수 있는 나만의 웹 서비스입니다.

## 주요 기능
- **구글 로그인** — Firebase Authentication (Google 계정만 지원)
- **링크 추가 · 수정 · 삭제** — 제목·주소 입력 검사, `https://` 자동 보정, 사이트별 아이콘 자동 표시
- **공개 페이지 `/{아이디}`** — 아이디는 구글 이메일의 `@` 앞부분, 로그인 없이 누구나 볼 수 있음
- **클릭 수 집계** — 공개 페이지에서 링크를 누르면 +1 (방문자에게는 숨기고 본인에게만 표시)
- **통계 페이지 `/stats`** — 총 클릭수 · 링크별 막대 차트 · 순위표
- **프로필 수정** — 이름 · 한 줄 소개 (낙관적 업데이트로 바로 반영)

## 화면 목록
| 주소 | 내용 | 로그인 |
|---|---|---|
| `/` | 로그인: 마이페이지 본문(프로필 + 프로필 수정 + 링크 추가 폼 + 내 링크 목록·클릭 수) / 비로그인: 랜딩 페이지 | 선택 |
| `/mypage` | 마이페이지 본문 (비로그인이면 로그인 안내) | 필요 |
| `/dashboard` | 내 링크 카드 + [링크 추가] 다이얼로그 + 수정·삭제·클릭 수 (비로그인이면 로그인 안내) | 필요 |
| `/stats` | 총 클릭수 · 링크별 막대 차트 · 순위표 (비로그인이면 `/` 로 이동) | 필요 |
| `/[displayName]` | 공개 페이지 — 프로필 + 링크(새 탭), 클릭 수 숨김, 클릭 시 +1 | 불필요 |
| 없는 `/{아이디}` | 404 페이지 (서버 판단, 상태 코드 404) | — |

## 기술 스택
- **프레임워크:** Next.js 16.3.4 (App Router, webpack 모드)
- **라이브러리:** React 19
- **언어:** TypeScript 5
- **스타일링:** Tailwind CSS v4 · shadcn/ui
- **백엔드:** Firebase (Authentication · Cloud Firestore)
- **데이터·상태:** TanStack Query v5 · Zustand v5
- **기타:** sonner (토스트 알림) · recharts (통계 차트)

## 실행 방법

### 1. Firebase 프로젝트 준비
1. [Firebase 콘솔](https://console.firebase.google.com)에서 새 프로젝트를 만듭니다.
2. **Authentication → 로그인 방법**에서 **Google** 을 사용 설정합니다.
3. **Firestore Database** 를 만듭니다. (위치: 서울 `asia-northeast3` 추천)
4. **프로젝트 설정 → 내 앱**에서 웹 앱을 등록하고 `firebaseConfig` 값을 확인합니다.

### 2. 환경 변수 설정
`.env.example` 을 복사해 `.env.local` 을 만들고, Firebase 웹 앱 설정값 7개를 채웁니다.

```bash
# Windows (PowerShell)
Copy-Item .env.example .env.local
# Mac / Linux
cp .env.example .env.local
```

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

> `.env.local` 은 `.gitignore` 에 들어 있어 GitHub 에 올라가지 않습니다.

### 3. 보안 규칙 게시
Firebase 콘솔 → **Firestore Database → 규칙** 탭에서 내용을 전부 지우고, 이 저장소의 `firestore.rules` 내용을 붙여넣은 뒤 **게시**합니다.

### 4. 설치 및 실행
```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 에 접속하여 확인할 수 있습니다.

## 문서
- [`docs/PRD.md`](docs/PRD.md) — 기획서 (화면·기능·데이터 구조·범위)
- [`docs/design.md`](docs/design.md) — 디자인 시스템 (스위치 네온)

## 만든 사람
- **양세화** ([@sehwa0605](https://github.com/sehwa0605))

## 라이선스
[MIT](LICENSE)
