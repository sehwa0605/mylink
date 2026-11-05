// Next.js Open Graph 이미지 생성을 위한 ImageResponse 임포트
import { ImageResponse } from "next/og";
// 구글 공식 브랜드 로고 SVG 경로 임포트
import { siGoogle } from "simple-icons";

// 일반 경로 오픈 그래프 이미지 대체 텍스트(alt) 설정
export const alt = "mylink — 나만의 스위치 네온 마이링크";

// 오픈 그래프 표준 이미지 크기 설정 (1200x630)
export const size = {
  // 가로 픽셀 크기
  width: 1200,
  // 세로 픽셀 크기
  height: 630,
};

// 이미지 MIME 타입 설정
export const contentType = "image/png";

// docs/design.md 및 globals.css의 스위치 네온(Switch Neon) 디자인 토큰 상수
const THEME = {
  // 랜딩 페이지 바탕 색상 (--background)
  background: "#F8F9FA",
  // 기본 본문 및 헤드라인 글자 색상 (--foreground)
  foreground: "#1A1D20",
  // 배지 및 카드 표면 색상 (--card)
  card: "#FFFFFF",
  // 닌텐도 시그니처 레드 (--primary)
  primary: "#E60012",
  // 조이콘 네온 시안 블루 (--accent)
  accent: "#00BDFF",
  // 부제 및 보조 설명 글자 색상 (--muted-foreground)
  mutedForeground: "#64748B",
  // 배지 및 카드 테두리 색상 (--border)
  border: "#E2E8F0",
  // 구글 공식 로고 색상 (--logo-google)
  googleBlue: "#4285F4",
};

// 랜딩 페이지 히어로 섹션과 동일한 디자인의 정적(일반 경로) 오픈 그래프 이미지 생성 함수
export default async function OpenGraphImage() {
  // ImageResponse를 통해 랜딩 페이지 히어로 섹션 레이아웃을 PNG 이미지로 반환
  return new ImageResponse(
    (
      // 랜딩 페이지 전체 배경 컨테이너 (중앙 정렬)
      <div
        style={{
          // 전체 너비 100%
          width: "100%",
          // 전체 높이 100%
          height: "100%",
          // Satori 플렉스 컨테이너
          display: "flex",
          // 세로 방향 중앙 배치
          flexDirection: "column",
          // 가로 중앙 정렬
          alignItems: "center",
          // 세로 중앙 정렬
          justifyContent: "center",
          // 랜딩 페이지와 동일한 바탕색 (#F8F9FA)
          backgroundColor: THEME.background,
          // 전체 안쪽 여백
          padding: "60px 80px",
          // 상대 위치 지정
          position: "relative",
          // 기본 산세리프 글꼴 지정
          fontFamily: "sans-serif",
        }}
      >
        {/* 상단 헤더 바 느낌의 얇은 구분선과 mylink 로고 (랜딩 페이지 상단 헤더 재현) */}
        <div
          style={{
            // 상단 고정 위치
            position: "absolute",
            // 위쪽 끝 배치
            top: 0,
            // 왼쪽 끝 배치
            left: 0,
            // 오른쪽 끝 배치
            right: 0,
            // 헤더 높이
            height: 76,
            // 흰색 반투명 헤더 배경
            backgroundColor: THEME.card,
            // 하단 테두리선
            borderBottom: `1px solid ${THEME.border}`,
            // 플렉스 가로 정렬
            display: "flex",
            // 세로 중앙 정렬
            alignItems: "center",
            // 좌우 양끝 배치
            justifyContent: "space-between",
            // 좌우 여백
            padding: "0 64px",
          }}
        >
          {/* 좌측 서비스 로고: 듀얼 컬러 네온 도트 + mylink */}
          <div
            style={{
              // 플렉스 가로 배치
              display: "flex",
              // 세로 중앙 정렬
              alignItems: "center",
              // 도트와 텍스트 간격
              gap: 12,
            }}
          >
            {/* 조이콘 듀얼 도트 그룹 */}
            <div
              style={{
                // 플렉스 가로 배치
                display: "flex",
                // 도트 간 간격
                gap: 6,
              }}
            >
              {/* 닌텐도 레드 도트 */}
              <div
                style={{
                  // 도트 가로 크기
                  width: 14,
                  // 도트 세로 크기
                  height: 14,
                  // 원형 처리
                  borderRadius: 999,
                  // 닌텐도 레드 색상
                  backgroundColor: THEME.primary,
                  // 플렉스 표시
                  display: "flex",
                }}
              />
              {/* 네온 블루 도트 */}
              <div
                style={{
                  // 도트 가로 크기
                  width: 14,
                  // 도트 세로 크기
                  height: 14,
                  // 원형 처리
                  borderRadius: 999,
                  // 네온 시안 블루 색상
                  backgroundColor: THEME.accent,
                  // 플렉스 표시
                  display: "flex",
                }}
              />
            </div>

            {/* mylink 텍스트 로고 */}
            <div
              style={{
                // 로고 글자 크기
                fontSize: 28,
                // 가장 굵은 글씨
                fontWeight: 900,
                // 전경색
                color: THEME.foreground,
                // 자간 축소
                letterSpacing: "-0.03em",
                // 플렉스 표시
                display: "flex",
              }}
            >
              mylink
            </div>
          </div>

          {/* 우측 헤더 작은 로그인 버튼 모양 배지 */}
          <div
            style={{
              // 플렉스 가로 배치
              display: "flex",
              // 세로 중앙 정렬
              alignItems: "center",
              // 아이콘과 텍스트 간격
              gap: 8,
              // 안쪽 여백
              padding: "8px 18px",
              // 모서리 둥글기
              borderRadius: 14,
              // 흰색 배경
              backgroundColor: THEME.card,
              // 테두리
              border: `1px solid ${THEME.border}`,
              // 글자 크기
              fontSize: 16,
              // 굵은 글씨
              fontWeight: 700,
              // 글자색
              color: THEME.foreground,
            }}
          >
            {/* 구글 공식 G 로고 아이콘 */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={THEME.googleBlue}
            >
              <path d={siGoogle.path} />
            </svg>
            <span>Google로 로그인</span>
          </div>
        </div>

        {/* 중앙 히어로 섹션 본문 (LandingPage의 1~3번 요소와 동일한 구성) */}
        <div
          style={{
            // 플렉스 컨테이너
            display: "flex",
            // 세로 방향 정렬
            flexDirection: "column",
            // 가로 중앙 정렬
            alignItems: "center",
            // 세로 중앙 정렬
            justifyContent: "center",
            // 헤더 높이만큼 살짝 아래로 중심 보정
            marginTop: 36,
            // 요소 간 간격
            gap: 28,
          }}
        >
          {/* 1. 상단 스위치 듀얼 네온 배지 (LandingPage 1번과 동일) */}
          <div
            style={{
              // 플렉스 가로 배치
              display: "flex",
              // 세로 중앙 정렬
              alignItems: "center",
              // 도트와 문구 간격
              gap: 12,
              // 안쪽 여백
              padding: "10px 24px",
              // 알약 모양 둥근 모서리
              borderRadius: 999,
              // 흰색 카드 배경
              backgroundColor: THEME.card,
              // 얇은 테두리선
              border: `1px solid ${THEME.border}`,
              // 은은한 그림자
              boxShadow: "0 2px 6px rgba(26, 29, 32, 0.04)",
            }}
          >
            {/* 레드 & 블루 조이콘 도트 */}
            <div
              style={{
                // 플렉스 가로 배치
                display: "flex",
                // 도트 간격
                gap: 8,
              }}
            >
              {/* 레드 도트 */}
              <div
                style={{
                  // 가로 12px
                  width: 12,
                  // 세로 12px
                  height: 12,
                  // 원형
                  borderRadius: 999,
                  // 닌텐도 레드
                  backgroundColor: THEME.primary,
                  // 플렉스 표시
                  display: "flex",
                }}
              />
              {/* 블루 도트 */}
              <div
                style={{
                  // 가로 12px
                  width: 12,
                  // 세로 12px
                  height: 12,
                  // 원형
                  borderRadius: 999,
                  // 네온 블루
                  backgroundColor: THEME.accent,
                  // 플렉스 표시
                  display: "flex",
                }}
              />
            </div>

            {/* 배지 텍스트 */}
            <div
              style={{
                // 글자 크기
                fontSize: 20,
                // 굵은 글씨
                fontWeight: 700,
                // 진한 글자색
                color: THEME.foreground,
                // 플렉스 표시
                display: "flex",
              }}
            >
              아이디어를 코드로 연결하는 링크인바이오
            </div>
          </div>

          {/* 2. 대형 헤드라인 2줄 및 부제 영역 (LandingPage 2번과 동일) */}
          <div
            style={{
              // 플렉스 세로 배치
              display: "flex",
              // 세로 방향
              flexDirection: "column",
              // 가로 중앙 정렬
              alignItems: "center",
              // 줄 간격
              gap: 12,
              // 중앙 정렬
              textAlign: "center",
            }}
          >
            {/* 헤드라인 1번째 줄 */}
            <div
              style={{
                // 대형 글자 크기
                fontSize: 64,
                // 가장 굵은 글씨체 (font-black)
                fontWeight: 900,
                // 전경색
                color: THEME.foreground,
                // 자간 축소 (tracking-tight)
                letterSpacing: "-0.03em",
                // 줄 높이
                lineHeight: 1.15,
                // 플렉스 표시
                display: "flex",
              }}
            >
              내 모든 링크를 하나로,
            </div>

            {/* 헤드라인 2번째 줄 (from-primary via-red-500 to-accent 그라데이션 그대로 적용) */}
            <div
              style={{
                // 대형 글자 크기
                fontSize: 64,
                // 가장 굵은 글씨체 (font-black)
                fontWeight: 900,
                // 자간 축소
                letterSpacing: "-0.03em",
                // 줄 높이
                lineHeight: 1.15,
                // 랜딩 페이지 히어로와 동일한 좌->우 레드~네온블루 그라데이션
                backgroundImage:
                  "linear-gradient(90deg, #E60012 0%, #EF4444 50%, #00BDFF 100%)",
                // 텍스트 영역에만 배경 클리핑
                backgroundClip: "text",
                // 글자 자체 색상을 투명하게 처리하여 그라데이션 노출
                color: "transparent",
                // 플렉스 표시
                display: "flex",
              }}
            >
              나만의 스위치 네온 마이링크
            </div>

            {/* 부제 문구 (LandingPage 부제와 동일) */}
            <div
              style={{
                // 부제 글자 크기
                fontSize: 24,
                // 중간 굵기 (font-medium)
                fontWeight: 500,
                // 보조 글자색 (text-muted-foreground)
                color: THEME.mutedForeground,
                // 위쪽 여백
                marginTop: 8,
                // 플렉스 표시
                display: "flex",
              }}
            >
              GitHub, 블로그, 포트폴리오를 한 페이지에 모아 나만의 주소로 세상과 공유해보세요.
            </div>
          </div>

          {/* 3. 구글 로그인 CTA 버튼 및 하단 보조 문구 (LandingPage 3번과 동일) */}
          <div
            style={{
              // 플렉스 세로 배치
              display: "flex",
              // 세로 방향
              flexDirection: "column",
              // 가로 중앙 정렬
              alignItems: "center",
              // 버튼과 보조 문구 간격
              gap: 12,
              // 상단 여백
              marginTop: 8,
            }}
          >
            {/* Google로 계속하기 대형 다크 버튼 (GoogleLoginButton variant="landing" 재현) */}
            <div
              style={{
                // 플렉스 가로 배치
                display: "flex",
                // 세로 중앙 정렬
                alignItems: "center",
                // 가로 중앙 정렬
                justifyContent: "center",
                // 로고와 텍스트 간격
                gap: 14,
                // 버튼 안쪽 여백
                padding: "18px 44px",
                // rounded-2xl 모서리
                borderRadius: 20,
                // bg-foreground (#1A1D20) 배경
                backgroundColor: THEME.foreground,
                // text-background (#F8F9FA) 글자색
                color: THEME.background,
                // 글자 크기
                fontSize: 22,
                // 굵은 글씨
                fontWeight: 700,
                // 부드러운 그림자 (shadow-md)
                boxShadow: "0 10px 20px rgba(26, 29, 32, 0.14)",
              }}
            >
              {/* 구글 공식 브랜드 로고 SVG */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={THEME.googleBlue}
              >
                <path d={siGoogle.path} />
              </svg>
              <span>Google로 계속하기</span>
            </div>

            {/* 버튼 아래 보조 안내 텍스트 */}
            <div
              style={{
                // 글자 크기
                fontSize: 16,
                // 중간 굵기
                fontWeight: 500,
                // 보조 글자색
                color: THEME.mutedForeground,
                // 플렉스 표시
                display: "flex",
              }}
            >
              별도 가입 없이 Google 계정으로 즉시 시작하세요
            </div>
          </div>
        </div>
      </div>
    ),
    // ImageResponse 해상도 옵션 전달
    {
      ...size,
    }
  );
}
