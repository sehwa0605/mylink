// Next.js Open Graph 이미지 생성을 위한 ImageResponse 임포트
import { ImageResponse } from "next/og";

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

// 기본 한 줄 소개 문구 상수
const DEFAULT_BIO_TEXT = "한 줄 소개를 입력해주세요.";

// Firestore REST API 응답에서 프로필과 링크 요약을 가볍게 조회하는 함수 (무거운 Firebase SDK 번들링 제거)
async function fetchProfileForOg(handle: string): Promise<{
  userName: string;
  bio: string | null;
  linkTitles: string[];
  linkCount: number;
} | null> {
  // 환경 변수에서 Firebase 프로젝트 ID 확인
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  // 프로젝트 ID가 없으면 즉시 null 반환
  if (!projectId) {
    return null;
  }

  // Firestore REST API 기본 엔드포인트 구성
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

  // 1.5초 타임아웃 컨트롤러 설정
  const controller = new AbortController();
  // 타임아웃 타이머 등록
  const timer = setTimeout(() => controller.abort(), 1500);

  try {
    // 1. users 컬렉션에서 displayName이 일치하는 사용자 문서 1건 조회
    const userRes = await fetch(`${baseUrl}:runQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "users" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "displayName" },
              op: "EQUAL",
              value: { stringValue: handle },
            },
          },
          limit: 1,
        },
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    // 응답 실패 시 null 반환
    if (!userRes.ok) {
      return null;
    }

    // JSON 파싱
    const userRows = await userRes.json();
    // 첫 번째 문서 결과 추출
    const docObj = Array.isArray(userRows) ? userRows[0]?.document : undefined;
    // 일치하는 문서가 없으면 null 반환
    if (!docObj?.fields) {
      return null;
    }

    // 문서 전체 경로에서 uid 추출
    const docName: string = docObj.name || "";
    // 경로 마지막 조각이 uid
    const uid = docObj.fields.uid?.stringValue || docName.split("/").pop() || "";
    // 사용자 이름 추출 (username 우선, 없으면 displayName)
    const userName =
      docObj.fields.username?.stringValue ||
      docObj.fields.displayName?.stringValue ||
      handle;
    // 한 줄 소개 추출
    const bio = docObj.fields.bio?.stringValue || null;

    // 대표 링크 제목 보관 배열
    let linkTitles: string[] = [];
    // 전체 링크 개수 보관 변수
    let linkCount = 0;

    // 2. uid가 존재하면 해당 사용자의 links 서브컬렉션 목록 조회
    if (uid) {
      const linksRes = await fetch(`${baseUrl}/users/${uid}/links?pageSize=10`, {
        signal: controller.signal,
        cache: "no-store",
      });

      // 링크 목록 응답이 정상이면 제목 추출
      if (linksRes.ok) {
        const linksData = await linksRes.json();
        const docs = Array.isArray(linksData?.documents)
          ? linksData.documents
          : [];
        // 전체 링크 수 기록
        linkCount = docs.length;
        // 상위 3개 링크 제목 추출
        linkTitles = docs
          .slice(0, 3)
          .map(
            (d: { fields?: { title?: { stringValue?: string } } }) =>
              d.fields?.title?.stringValue || ""
          )
          .filter(Boolean);
      }
    }

    // 조회 결과 반환
    return { userName, bio, linkTitles, linkCount };
  } catch {
    // 네트워크 또는 타임아웃 발생 시 null 반환
    return null;
  } finally {
    // 타이머 해제
    clearTimeout(timer);
  }
}

// /[displayName] 동적 경로 전용 오픈 그래프 이미지 생성 함수 (정적 OG 이미지와 동일한 문법 및 히어로 디자인)
export default async function OpenGraphImage({
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
  const handle = decodedHandle;
  // 화면에 표시할 한 줄 소개 기본값
  let userBio = `${decodedHandle}님의 모든 링크와 포트폴리오를 한 페이지에서 확인해보세요.`;
  // 등록된 링크 제목 요약 배열
  let linkTitles: string[] = [];
  // 총 링크 개수
  let linkCount = 0;

  // 가벼운 REST API로 사용자 프로필 및 링크 요약 조회
  const profileData = await fetchProfileForOg(decodedHandle);
  // 데이터가 존재하면 화면 표시값 갱신
  if (profileData) {
    // 사용자 실명/닉네임 반영
    userName = profileData.userName;
    // 기본 문구가 아닌 커스텀 소개글이 있으면 반영
    if (profileData.bio && profileData.bio !== DEFAULT_BIO_TEXT) {
      userBio = profileData.bio;
    }
    // 링크 제목 배열 반영
    linkTitles = profileData.linkTitles;
    // 총 링크 수 반영
    linkCount = profileData.linkCount;
  }

  // 소개글이 너무 길면 한 줄에 예쁘게 들어오도록 55자 이내로 정리
  const safeBio = userBio.length > 55 ? `${userBio.slice(0, 55)}...` : userBio;

  // 상단 배지에 표시할 문구
  const badgeText =
    linkCount > 0
      ? `아이디어를 코드로 연결하는 링크인바이오 · 링크 ${linkCount}개`
      : "아이디어를 코드로 연결하는 링크인바이오";

  // 헤드라인 1번째 줄 문구
  const headlineLine1 = `${userName}님의 마이링크`;
  // 헤드라인 2번째 줄 문구
  const headlineLine2 = `@${handle}`;

  // 하단 다크 버튼에 표시할 문구
  const ctaText =
    linkTitles.length > 0
      ? `${linkTitles.join(" · ")} 보러가기`
      : `@${handle} 프로필 보러가기`;

  // 하단 보조 안내 문구
  const footerCaption = `mylink / @${handle} 공개 프로필에서 모든 링크를 확인하세요`;

  // ImageResponse를 통해 정적 OG 이미지와 동일한 히어로 레이아웃을 PNG로 반환
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
        {/* 상단 헤더 바 (정적 OG 이미지와 동일한 구조) */}
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

          {/* 우측 헤더 공개 프로필 배지 */}
          <div
            style={{
              // 플렉스 가로 배치
              display: "flex",
              // 세로 중앙 정렬
              alignItems: "center",
              // 간격
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
            <span style={{ color: THEME.accent }}>{headlineLine2}</span>
            <span>공개 프로필</span>
          </div>
        </div>

        {/* 중앙 히어로 섹션 본문 (정적 OG 이미지와 동일한 구조) */}
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
            gap: 28,
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
              {badgeText}
            </div>
          </div>

          {/* 2. 대형 헤드라인 2줄 및 부제 영역 */}
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
              {headlineLine1}
            </div>

            {/* 헤드라인 2번째 줄 (from-primary via-red-500 to-accent 그라데이션 그대로 적용) */}
            <div
              style={{
                // 대형 글자 크기
                fontSize: 64,
                // 가장 굵은 글씨체
                fontWeight: 900,
                // 자간 축소
                letterSpacing: "-0.03em",
                // 줄 높이
                lineHeight: 1.15,
                // 정적 OG 이미지와 동일한 레드~네온블루 그라데이션
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
              {headlineLine2}
            </div>

            {/* 부제 문구 */}
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

          {/* 3. 하단 다크 버튼 및 보조 문구 */}
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
            {/* 대표 링크를 보여주는 대형 다크 버튼 */}
            <div
              style={{
                // 플렉스 가로 배치
                display: "flex",
                // 세로 중앙 정렬
                alignItems: "center",
                // 가로 중앙 정렬
                justifyContent: "center",
                // 아이콘과 텍스트 간격
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
                // 부드러운 그림자
                boxShadow: "0 10px 20px rgba(26, 29, 32, 0.14)",
              }}
            >
              {/* 네온 블루 도트 */}
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
              {footerCaption}
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
