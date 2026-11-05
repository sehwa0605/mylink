// Next.js Open Graph 이미지 생성을 위한 ImageResponse 임포트
import { ImageResponse } from "next/og";
// 공개 프로필 및 링크 목록 조회 함수 임포트
import { fetchPublicPage } from "@/lib/publicPage";
// 기본 소개글 상수 임포트
import { DEFAULT_BIO } from "@/lib/usersFirestore";

// 동적 경로 오픈 그래프 이미지 대체 텍스트(alt) 설정
export const alt = "mylink 공개 프로필";

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
};

// /[displayName] 동적 경로 전용 오픈 그래프 이미지 생성 함수 (정적 OG 이미지와 동일한 문법 및 히어로 디자인)
export default async function Image({
  params,
}: {
  params: Promise<{ displayName: string }>;
}) {
  // Next.js 16 비동기 params에서 displayName 추출
  const { displayName: raw } = await params;
  // URL 인코딩된 한글·특수문자 복원
  const decodedHandle = decodeURIComponent(raw);

  // 화면에 표시할 사용자 이름 기본값
  let userName = decodedHandle;
  // 화면에 표시할 고유 핸들 기본값
  let handle = decodedHandle;
  // 화면에 표시할 한 줄 소개 기본값
  let userBio = `${decodedHandle}님의 모든 링크와 포트폴리오를 한 페이지에서 확인해보세요.`;
  // 등록된 링크 제목 요약 배열
  let linkTitles: string[] = [];
  // 총 링크 개수
  let linkCount = 0;

  try {
    // Firestore 응답 지연으로 이미지가 안 열리는 현상을 방지하기 위해 2.5초 타임아웃 적용
    const page = await Promise.race([
      fetchPublicPage(decodedHandle),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
    ]);

    // 조회된 사용자 데이터가 있으면 실제 프로필 정보로 교체
    if (page) {
      // 실명(username) 우선 사용, 없으면 displayName 사용
      userName = page.profile.username || page.profile.displayName || decodedHandle;
      // 핸들명 적용
      handle = page.profile.displayName || decodedHandle;
      // 커스텀 소개글이 있으면 적용
      if (page.profile.bio && page.profile.bio !== DEFAULT_BIO) {
        userBio = page.profile.bio;
      }
      // 전체 링크 개수 저장
      linkCount = page.links.length;
      // 상위 3개 링크 제목 추출
      linkTitles = page.links.slice(0, 3).map((link) => link.title);
    }
  } catch {
    // 네트워크 오류 발생 시에도 이미지가 정상 생성되도록 기본값 유지
  }

  // 소개글이 너무 길면 한 줄에 예쁘게 들어오도록 55자 이내로 정리
  const safeBio = userBio.length > 55 ? `${userBio.slice(0, 55)}...` : userBio;

  // 하단 다크 버튼에 표시할 문구 구성 (대표 링크 제목 또는 기본 안내)
  const ctaText =
    linkTitles.length > 0
      ? `${linkTitles.join(" · ")} 보러가기`
      : `@${handle} 프로필 보러가기`;

  // ImageResponse를 통해 정적 OG 이미지와 통일된 히어로 레이아웃을 PNG로 반환
  return new ImageResponse(
    (
      // 랜딩 페이지 히어로와 동일한 전체 배경 컨테이너 (중앙 정렬)
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
          // 정적 OG 이미지와 동일한 바탕색 (#F8F9FA)
          backgroundColor: THEME.background,
          // 전체 안쪽 여백
          padding: "60px 80px",
          // 상대 위치 지정
          position: "relative",
          // 기본 산세리프 글꼴 지정
          fontFamily: "sans-serif",
        }}
      >
        {/* 상단 헤더 바 (정적 OG 이미지와 동일한 구조: 좌측 mylink 로고 + 우측 핸들 배지) */}
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
            // 흰색 헤더 배경
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

          {/* 우측 헤더 공개 프로필 핸들 배지 */}
          <div
            style={{
              // 플렉스 가로 배치
              display: "flex",
              // 세로 중앙 정렬
              alignItems: "center",
              // 도트와 텍스트 간격
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
            <span style={{ color: THEME.accent }}>{`@${handle}`}</span>
            <span>공개 프로필</span>
          </div>
        </div>

        {/* 중앙 히어로 섹션 본문 (정적 OG 이미지와 완벽히 통일된 중앙 정렬 레이아웃) */}
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
            // 헤더 높이만큼 아래로 중심 보정
            marginTop: 36,
            // 요소 간 간격
            gap: 26,
          }}
        >
          {/* 1. 상단 스위치 듀얼 네온 배지 */}
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
              {linkCount > 0
                ? `아이디어를 코드로 연결하는 링크인바이오 · 링크 ${linkCount}개`
                : "아이디어를 코드로 연결하는 링크인바이오"}
            </div>
          </div>

          {/* 2. 대형 헤드라인 2줄 (사용자 이름 + 그라데이션 @핸들) 및 한 줄 소개 */}
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
            {/* 헤드라인 1번째 줄: 사용자 이름 */}
            <div
              style={{
                // 대형 글자 크기
                fontSize: 64,
                // 가장 굵은 글씨체
                fontWeight: 900,
                // 전경색
                color: THEME.foreground,
                // 자간 축소
                letterSpacing: "-0.03em",
                // 줄 높이
                lineHeight: 1.15,
                // 플렉스 표시
                display: "flex",
              }}
            >
              {`${userName}님의 마이링크`}
            </div>

            {/* 헤드라인 2번째 줄: 레드~네온블루 그라데이션 @displayName */}
            <div
              style={{
                // 대형 글자 크기
                fontSize: 60,
                // 가장 굵은 글씨체
                fontWeight: 900,
                // 자간 축소
                letterSpacing: "-0.03em",
                // 줄 높이
                lineHeight: 1.15,
                // 정적 OG 이미지와 동일한 레드~네온블루 그라데이션
                backgroundImage:
                  "linear-gradient(90deg, #E60012 0%, #EF4444 50%, #00BDFF 100%)",
                // 텍스트 클리핑
                backgroundClip: "text",
                // 투명 글자색으로 그라데이션 노출
                color: "transparent",
                // 플렉스 표시
                display: "flex",
              }}
            >
              {`@${handle}`}
            </div>

            {/* 부제 문구: 사용자의 한 줄 소개(bio) */}
            <div
              style={{
                // 부제 글자 크기
                fontSize: 24,
                // 중간 굵기
                fontWeight: 500,
                // 보조 글자색
                color: THEME.mutedForeground,
                // 위쪽 여백
                marginTop: 8,
                // 플렉스 표시
                display: "flex",
              }}
            >
              {safeBio}
            </div>
          </div>

          {/* 3. 하단 다크 액션 버튼 모양 배지 및 안내 문구 (정적 OG 이미지와 통일) */}
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
            {/* 대표 링크 목록을 보여주는 다크 콘솔 버튼 */}
            <div
              style={{
                // 플렉스 가로 배치
                display: "flex",
                // 세로 중앙 정렬
                alignItems: "center",
                // 가로 중앙 정렬
                justifyContent: "center",
                // 도트와 텍스트 간격
                gap: 12,
                // 버튼 안쪽 여백
                padding: "18px 44px",
                // rounded-2xl 모서리
                borderRadius: 20,
                // 다크 배경 (#1A1D20)
                backgroundColor: THEME.foreground,
                // 밝은 글자색 (#F8F9FA)
                color: THEME.background,
                // 글자 크기
                fontSize: 22,
                // 굵은 글씨
                fontWeight: 700,
                // 부드러운 그림자
                boxShadow: "0 10px 20px rgba(26, 29, 32, 0.14)",
              }}
            >
              {/* 스위치 네온 포인트 도트 */}
              <div
                style={{
                  // 가로 12px
                  width: 12,
                  // 세로 12px
                  height: 12,
                  // 원형
                  borderRadius: 999,
                  // 네온 블루 색상
                  backgroundColor: THEME.accent,
                  // 플렉스 표시
                  display: "flex",
                }}
              />
              <span>{ctaText}</span>
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
              {`mylink / @${handle} 공개 프로필에서 모든 링크를 확인하세요`}
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
