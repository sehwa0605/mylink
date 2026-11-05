// Next.js Open Graph 이미지 생성을 위한 ImageResponse 임포트
import { ImageResponse } from "next/og";

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

// docs/design.md의 스위치 네온(Switch Neon) 디자인 토큰 상수 매핑
const THEME = {
  // 전체 바탕 색상 (--background)
  background: "#F8F9FA",
  // 기본 글자 색상 (--foreground)
  foreground: "#1A1D20",
  // 카드 표면 색상 (--card)
  card: "#FFFFFF",
  // 닌텐도 시그니처 레드 (--primary)
  primary: "#E60012",
  // 주요 버튼 흰색 글자 (--primary-foreground)
  primaryForeground: "#FFFFFF",
  // 조이콘 네온 시안 블루 (--accent)
  accent: "#00BDFF",
  // 보조 회색 바탕 (--muted)
  muted: "#F1F5F9",
  // 보조 설명 글자 색상 (--muted-foreground)
  mutedForeground: "#64748B",
  // 카드 및 요소 테두리 색상 (--border)
  border: "#E2E8F0",
};

// 루트 및 일반 경로(/, /mypage, /dashboard, /stats) 공용 오픈 그래프 이미지 생성 함수
export default async function OpenGraphImage() {
  // ImageResponse를 통해 JSX 레이아웃을 PNG 이미지로 렌더링하여 반환
  return new ImageResponse(
    (
      // 전체 1200x630 캔버스 컨테이너 (스위치 네온 밝은 배경)
      <div
        style={{
          // 전체 너비 100%
          width: "100%",
          // 전체 높이 100%
          height: "100%",
          // Satori 필수 플렉스 레이아웃 지정
          display: "flex",
          // 세로 방향 정렬
          flexDirection: "column",
          // 가로 중앙 정렬
          alignItems: "center",
          // 세로 중앙 정렬
          justifyContent: "center",
          // 스위치 네온 바탕색 적용
          backgroundColor: THEME.background,
          // 내부 여백 설정
          padding: "48px 64px",
          // 상대 위치 지정
          position: "relative",
          // 기본 산세리프 글꼴 지정
          fontFamily: "sans-serif",
        }}
      >
        {/* 좌측 조이콘 닌텐도 레드 액센트 바 */}
        <div
          style={{
            // 절대 위치 지정
            position: "absolute",
            // 왼쪽 끝에 배치
            left: 0,
            // 상단에서 64px 띄움
            top: 64,
            // 하단에서 64px 띄움
            bottom: 64,
            // 바 두께 18px
            width: 18,
            // 닌텐도 레드 배경색
            backgroundColor: THEME.primary,
            // 오른쪽 모서리 둥글게 처리
            borderTopRightRadius: 16,
            // 오른쪽 하단 모서리 둥글게 처리
            borderBottomRightRadius: 16,
            // 플렉스 표시
            display: "flex",
          }}
        />

        {/* 우측 조이콘 네온 블루 액센트 바 */}
        <div
          style={{
            // 절대 위치 지정
            position: "absolute",
            // 오른쪽 끝에 배치
            right: 0,
            // 상단에서 64px 띄움
            top: 64,
            // 하단에서 64px 띄움
            bottom: 64,
            // 바 두께 18px
            width: 18,
            // 네온 시안 블루 배경색
            backgroundColor: THEME.accent,
            // 왼쪽 상단 모서리 둥글게 처리
            borderTopLeftRadius: 16,
            // 왼쪽 하단 모서리 둥글게 처리
            borderBottomLeftRadius: 16,
            // 플렉스 표시
            display: "flex",
          }}
        />

        {/* 중앙 메인 콘솔 카드 프레임 */}
        <div
          style={{
            // 카드 가로 꽉 채우기
            width: "100%",
            // 카드 세로 꽉 채우기
            height: "100%",
            // 카드 배경 흰색
            backgroundColor: THEME.card,
            // 콘솔 라운드 모서리 36px
            borderRadius: 36,
            // 외곽 테두리
            border: `2px solid ${THEME.border}`,
            // 부드러운 콘솔 그림자
            boxShadow: "0 20px 45px rgba(26, 29, 32, 0.08)",
            // 플렉스 컨테이너
            display: "flex",
            // 세로 방향 배치
            flexDirection: "column",
            // 가로 중앙 정렬
            alignItems: "center",
            // 세로 공간 균등 배분
            justifyContent: "space-between",
            // 카드 내부 여백
            padding: "48px 56px",
          }}
        >
          {/* 1. 상단 스위치 듀얼 네온 배지 */}
          <div
            style={{
              // 플렉스 가로 정렬
              display: "flex",
              // 세로 중앙 정렬
              alignItems: "center",
              // 도트와 텍스트 간격
              gap: 12,
              // 배지 안쪽 여백
              padding: "10px 24px",
              // 알약 형태 둥근 모서리
              borderRadius: 999,
              // 연회색 배경
              backgroundColor: THEME.muted,
              // 테두리선
              border: `2px solid ${THEME.border}`,
            }}
          >
            {/* 레드 도트 */}
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
            {/* 블루 도트 */}
            <div
              style={{
                // 도트 가로 크기
                width: 14,
                // 도트 세로 크기
                height: 14,
                // 원형 처리
                borderRadius: 999,
                // 네온 블루 색상
                backgroundColor: THEME.accent,
                // 플렉스 표시
                display: "flex",
              }}
            />
            {/* 상단 배지 문구 */}
            <div
              style={{
                // 글자 크기
                fontSize: 20,
                // 굵은 글씨
                fontWeight: 800,
                // 본문 글자색
                color: THEME.foreground,
                // 플렉스 표시
                display: "flex",
              }}
            >
              아이디어를 코드로 연결하는 링크인바이오 · mylink
            </div>
          </div>

          {/* 2. 중앙 메인 타이틀 및 서브 카피 영역 */}
          <div
            style={{
              // 플렉스 컨테이너
              display: "flex",
              // 세로 방향 배치
              flexDirection: "column",
              // 가로 중앙 정렬
              alignItems: "center",
              // 요소 간 간격
              gap: 18,
              // 텍스트 중앙 정렬
              textAlign: "center",
            }}
          >
            {/* 첫 번째 줄 타이틀 */}
            <div
              style={{
                // 큰 제목 글자 크기
                fontSize: 56,
                // 가장 굵은 글씨체
                fontWeight: 900,
                // 진한 전경색
                color: THEME.foreground,
                // 자간 축소
                letterSpacing: "-0.03em",
                // 플렉스 표시
                display: "flex",
              }}
            >
              내 모든 링크를 하나로,
            </div>

            {/* 두 번째 줄 포인트 타이틀 (닌텐도 레드 & 네온 블루 조합) */}
            <div
              style={{
                // 플렉스 가로 배치
                display: "flex",
                // 세로 중앙 정렬
                alignItems: "center",
                // 단어 사이 간격
                gap: 16,
                // 큰 제목 글자 크기
                fontSize: 60,
                // 가장 굵은 글씨체
                fontWeight: 900,
                // 자간 축소
                letterSpacing: "-0.03em",
              }}
            >
              {/* 스위치 네온 강조 텍스트 */}
              <span style={{ color: THEME.primary }}>나만의 스위치 네온</span>
              {/* 마이링크 강조 텍스트 */}
              <span style={{ color: THEME.accent }}>마이링크</span>
            </div>

            {/* 부제 설명 문구 */}
            <div
              style={{
                // 부제 글자 크기
                fontSize: 24,
                // 중간 굵기
                fontWeight: 600,
                // 보조 텍스트 색상
                color: THEME.mutedForeground,
                // 상단 여백
                marginTop: 6,
                // 플렉스 표시
                display: "flex",
              }}
            >
              GitHub · 블로그 · 포트폴리오를 한 페이지에 모아 세상과 공유하세요
            </div>
          </div>

          {/* 3. 하단 핵심 기능 3가지 요약 배지 바 */}
          <div
            style={{
              // 플렉스 가로 정렬
              display: "flex",
              // 세로 중앙 정렬
              alignItems: "center",
              // 중앙 배치
              justifyContent: "center",
              // 배지 간 간격
              gap: 20,
              // 가로 전체 폭
              width: "100%",
            }}
          >
            {/* 배지 1: 원클릭 링크 모음 */}
            <div
              style={{
                // 플렉스 가로 정렬
                display: "flex",
                // 세로 중앙 정렬
                alignItems: "center",
                // 아이콘과 글자 간격
                gap: 10,
                // 안쪽 여백
                padding: "14px 24px",
                // 모서리 둥글기
                borderRadius: 20,
                // 연회색 배경
                backgroundColor: THEME.muted,
                // 테두리
                border: `2px solid ${THEME.border}`,
                // 글자 크기
                fontSize: 20,
                // 굵기
                fontWeight: 700,
                // 글자색
                color: THEME.foreground,
              }}
            >
              <span style={{ color: THEME.primary }}>●</span>
              <span>원클릭 링크 모음</span>
            </div>

            {/* 배지 2: 나만의 고유 주소 */}
            <div
              style={{
                // 플렉스 가로 정렬
                display: "flex",
                // 세로 중앙 정렬
                alignItems: "center",
                // 아이콘과 글자 간격
                gap: 10,
                // 안쪽 여백
                padding: "14px 24px",
                // 모서리 둥글기
                borderRadius: 20,
                // 연회색 배경
                backgroundColor: THEME.muted,
                // 테두리
                border: `2px solid ${THEME.border}`,
                // 글자 크기
                fontSize: 20,
                // 굵기
                fontWeight: 700,
                // 글자색
                color: THEME.foreground,
              }}
            >
              <span style={{ color: THEME.accent }}>●</span>
              <span>나만의 고유 공개 주소</span>
            </div>

            {/* 배지 3: 실시간 클릭 통계 */}
            <div
              style={{
                // 플렉스 가로 정렬
                display: "flex",
                // 세로 중앙 정렬
                alignItems: "center",
                // 아이콘과 글자 간격
                gap: 10,
                // 안쪽 여백
                padding: "14px 24px",
                // 모서리 둥글기
                borderRadius: 20,
                // 연회색 배경
                backgroundColor: THEME.muted,
                // 테두리
                border: `2px solid ${THEME.border}`,
                // 글자 크기
                fontSize: 20,
                // 굵기
                fontWeight: 700,
                // 글자색
                color: THEME.foreground,
              }}
            >
              <span style={{ color: THEME.primary }}>●</span>
              <span>실시간 클릭 통계</span>
            </div>
          </div>
        </div>
      </div>
    ),
    // ImageResponse 크기 옵션 전달
    {
      ...size,
    }
  );
}
