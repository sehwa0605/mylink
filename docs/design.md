# mylink 디자인 시스템 — 스위치 네온 (Switch Neon)

## 1. 분위기
닌텐도 스위치 콘솔의 조이콘(네온 레드 & 네온 블루)과 경쾌하고 모던한 게임 인터페이스 감성을 담은 테마입니다.
- **포인트 1:** 맑은 화이트/연그레이(#F8F9FA) 배경에 닌텐도 시그니처 레드(#E60012)와 네온 시안 블루(#00BDFF)를 조이콘처럼 균형 있게 배치
- **포인트 2:** 조이콘 본체를 연상시키는 둥근 모서리(16px, rounded-2xl)와 기분 좋은 터치감의 부드러운 그림자
- **포인트 3:** 버튼 호버 시 살짝 떠오르는(-translate-y-0.5) 경쾌한 콘솔 UI 인터랙션

## 2. 색 → shadcn 토큰
| 이름 | 값 | shadcn 토큰 | 쓰는 곳 |
|---|---|---|---|
| 바탕 (Background) | `#F8F9FA` | `--background` | 페이지 전체 배경 |
| 글자 (Foreground) | `#1A1D20` | `--foreground` | 기본 본문 텍스트 |
| 카드 면 (Card) | `#FFFFFF` | `--card` | 프로필 카드, 링크 버튼 배경 |
| 카드 글자 (Card Foreground) | `#1A1D20` | `--card-foreground` | 카드 내부 텍스트 |
| 주요 색상 (Primary) | `#E60012` | `--primary` | 닌텐도 레드 (핵심 버튼, 메인 로고, 액센트) |
| 주요 글자 (Primary Foreground) | `#FFFFFF` | `--primary-foreground` | 주요 버튼 텍스트 (흰색) |
| 보조/강조 (Accent / Joy-Con Blue) | `#00BDFF` | `--accent` | 네온 블루 (조이콘 우측 포인트, 뱃지, 링크 화살표) |
| 보조 글자 (Muted Foreground) | `#64748B` | `--muted-foreground` | 부제, 한 줄 소개 보조 텍스트, 날짜 |
| 마우스 오버 (Muted) | `#F1F5F9` | `--muted` | 버튼 호버 시 배경색 |
| 테두리 (Border) | `#E2E8F0` | `--border` | 카드 및 버튼 외곽선 |
| 위험/경고 (Destructive) | `#DC2626` | `--destructive` | 삭제 확인 모달 및 파괴적 액션 |

> ⚠️ **대비 주의 사항**: `#00BDFF`(네온 블루)와 `#E60012`(닌텐도 레드) 위에는 반드시 `#FFFFFF`(흰색) 글자를 사용하여 또렷한 가독성을 보장합니다.

## 3. 글꼴
- 본문 / 제목 / 숫자: 깔끔하고 가독성 높은 시스템 산세리프 (`font-sans`: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)

## 4. 모양
| 항목 | 값 | 토큰·클래스 |
|---|---|---|
| 모서리 | 16px | `rounded-2xl` (`--radius`) |
| 그림자 | 부드러운 콘솔 섀도우 | `shadow-md hover:shadow-lg` |
| 링크 버튼 | 가로 꽉 채움, 좌측 조이콘 액센트 바, 우측 화살표 `>` | `Button size="block"` |
| 아바타 | 원형 + 닌텐도 레드 테두리 링 + 내부 그림자 | `rounded-full ring-4 ring-[#E60012]/15` |

## 5. 컴포넌트에 적용한 것
- **프로필 상단:** 닌텐도 스위치 조이콘을 상징하는 좌측 레드(#E60012) & 우측 블루(#00BDFF) 듀얼 배지 포인트
- **링크 카드:** 클릭하기 좋은 와이드 블록형 버튼, 호버 시 상단으로 1px 떠오름 및 네온 하이라이트
