// Next.js 동적 Open Graph 이미지 생성을 위한 ImageResponse 임포트
import { ImageResponse } from "next/og";
// 공개 프로필 및 링크 목록 조회 함수 임포트
import { fetchPublicPage } from "@/lib/publicPage";
// 기본 소개글 상수 임포트
import { DEFAULT_BIO } from "@/lib/usersFirestore";

// 동적 경로 오픈 그래프 이미지 기본 대체 텍스트(alt) 설정
export const alt = "mylink 공개 프로필";

// 오픈 그래프 표준 이미지 해상도 설정 (1200x630)
export const size = {
  // 가로 픽셀 크기
  width: 1200,
  // 세로 픽셀 크기
  height: 630,
};

// 이미지 MIME 타입 설정
export const contentType = "image/png";

// docs/design.md의 스위치 네온(Switch Neon) 디자인 시스템 토큰 매핑
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

// 동적 라우트 파라미터 Props 인터페이스 정의 (Next.js 16: params는 Promise)
export interface DynamicOgProps {
  // 비동기 라우트 파라미터 객체
  params: Promise<{
    // URL 경로의 사용자 공개 핸들명
    displayName: string;
  }>;
}

// /[displayName] 동적 경로 전용 스위치 네온 오픈 그래프 이미지 생성 함수
export default async function DynamicOpenGraphImage({ params }: DynamicOgProps) {
  // 비동기 params에서 원본 displayName 추출
  const { displayName: raw } = await params;
  // 한글이나 특수문자가 포함된 핸들명 디코딩
  const decodedHandle = decodeURIComponent(raw);

  // 화면에 표시할 사용자 이름 초기값 설정
  let userName = decodedHandle;
  // 화면에 표시할 고유 핸들 초기값 설정
  let handle = decodedHandle;
  // 화면에 표시할 한 줄 소개 초기값 설정
  let userBio = "아이디어를 코드로 연결하는 나만의 링크 모음 페이지입니다.";
  // 미리보기에 표시할 상위 링크 제목 배열 초기값
  let previewTitles: string[] = [];
  // 전체 등록된 링크 개수 초기값
  let totalLinkCount = 0;

  try {
    // Firestore에서 해당 사용자의 공개 프로필 및 링크 데이터 조회
    const page = await fetchPublicPage(decodedHandle);
    // 사용자 데이터가 존재하는 경우 실제 프로필과 링크 정보 반영
    if (page) {
      // 실명(username)이 있으면 우선 사용하고 없으면 displayName 사용
      userName = page.profile.username || page.profile.displayName || decodedHandle;
      // 공개 주소 핸들명 설정
      handle = page.profile.displayName || decodedHandle;
      // 사용자가 작성한 소개글이 있으면 반영
      if (page.profile.bio && page.profile.bio !== DEFAULT_BIO) {
        userBio = page.profile.bio;
      }
      // 전체 링크 개수 저장
      totalLinkCount = page.links.length;
      // 최대 3개의 대표 링크 제목만 추출하여 카드에 표시
      previewTitles = page.links.slice(0, 3).map((link) => link.title);
    }
  } catch (err) {
    // 네트워크 등 조회 실패 시에도 OG 이미지가 깨지지 않도록 기본값 유지
    console.error("동적 OG 이미지 데이터 조회 실패:", err);
  }

  // 등록된 링크가 없을 때 오른쪽 카드 영역에 보여줄 기본 안내 항목 구성
  const displayLinks =
    previewTitles.length > 0
      ? previewTitles
      : [
          `${userName}님의 프로필 페이지`,
          "등록된 활동 링크 한눈에 보기",
          `mylink / @${handle}`,
        ];

  // 아바타 원형 배지에 표시할 첫 글자 추출
  const initialLetter = (handle.slice(0, 1) || "M").toUpperCase();

  // 긴 소개글이 레이아웃을 넘치지 않도록 48자 이내로 말줄임 처리
  const safeBio =
    userBio.length > 48 ? `${userBio.slice(0, 48)}...` : userBio;

  // ImageResponse로 스위치 네온 콘솔 스타일의 동적 프로필 OG 이미지 반환
  return new ImageResponse(
    (
      // 전체 1200x630 캔버스 래퍼
      <div
        style={{
          // 가로 100%
          width: "100%",
          // 세로 100%
          height: "100%",
          // 플렉스 레이아웃
          display: "flex",
          // 가로 중앙 정렬
          alignItems: "center",
          // 세로 중앙 정렬
          justifyContent: "center",
          // 스위치 네온 바탕색
          backgroundColor: THEME.background,
          // 바깥 여백
          padding: "44px 60px",
          // 상대 위치
          position: "relative",
          // 기본 산세리프 폰트
          fontFamily: "sans-serif",
        }}
      >
        {/* 좌측 조이콘 닌텐도 레드 액센트 바 */}
        <div
          style={{
            // 절대 위치 지정
            position: "absolute",
            // 왼쪽 끝 고정
            left: 0,
            // 상단 여백 56px
            top: 56,
            // 하단 여백 56px
            bottom: 56,
            // 두께 20px
            width: 20,
            // 닌텐도 레드 색상
            backgroundColor: THEME.primary,
            // 우측 상단 둥근 모서리
            borderTopRightRadius: 18,
            // 우측 하단 둥근 모서리
            borderBottomRightRadius: 18,
            // 플렉스 표시
            display: "flex",
          }}
        />

        {/* 우측 조이콘 네온 블루 액센트 바 */}
        <div
          style={{
            // 절대 위치 지정
            position: "absolute",
            // 오른쪽 끝 고정
            right: 0,
            // 상단 여백 56px
            top: 56,
            // 하단 여백 56px
            bottom: 56,
            // 두께 20px
            width: 20,
            // 조이콘 네온 블루 색상
            backgroundColor: THEME.accent,
            // 좌측 상단 둥근 모서리
            borderTopLeftRadius: 18,
            // 좌측 하단 둥근 모서리
            borderBottomLeftRadius: 18,
            // 플렉스 표시
            display: "flex",
          }}
        />

        {/* 메인 스위치 콘솔 카드 (좌측 프로필 + 우측 링크 리스트 2단 구성) */}
        <div
          style={{
            // 가로 전체 채움
            width: "100%",
            // 세로 전체 채움
            height: "100%",
            // 흰색 카드 배경
            backgroundColor: THEME.card,
            // 콘솔 라운드 모서리 36px
            borderRadius: 36,
            // 카드 테두리
            border: `2px solid ${THEME.border}`,
            // 부드러운 그림자
            boxShadow: "0 24px 48px rgba(26, 29, 32, 0.08)",
            // 플렉스 가로 2단 배치
            display: "flex",
            // 세로 방향 늘리기
            alignItems: "stretch",
            // 좌우 공간 분리
            justifyContent: "space-between",
            // 내부 패딩
            padding: "44px 48px",
            // 좌우 컬럼 간격
            gap: 40,
          }}
        >
          {/* [좌측 컬럼] 사용자 프로필 요약 영역 */}
          <div
            style={{
              // 좌측 비율 46%
              width: "46%",
              // 플렉스 컨테이너
              display: "flex",
              // 세로 방향 배치
              flexDirection: "column",
              // 상하 공간 분배
              justifyContent: "space-between",
              // 좌측 정렬
              alignItems: "flex-start",
              // 우측 구분선
              borderRight: `2px solid ${THEME.border}`,
              // 구분선 안쪽 여백
              paddingRight: 36,
            }}
          >
            {/* 상단 mylink 브랜드 로고 배지 */}
            <div
              style={{
                // 플렉스 가로 배치
                display: "flex",
                // 세로 중앙 정렬
                alignItems: "center",
                // 도트와 로고 간격
                gap: 10,
                // 배지 안쪽 여백
                padding: "8px 18px",
                // 알약형 모서리
                borderRadius: 999,
                // 연회색 배경
                backgroundColor: THEME.muted,
                // 테두리
                border: `2px solid ${THEME.border}`,
              }}
            >
              {/* 레드 조이콘 도트 */}
              <div
                style={{
                  // 도트 가로 크기
                  width: 12,
                  // 도트 세로 크기
                  height: 12,
                  // 원형
                  borderRadius: 999,
                  // 닌텐도 레드
                  backgroundColor: THEME.primary,
                  // 플렉스 표시
                  display: "flex",
                }}
              />
              {/* 블루 조이콘 도트 */}
              <div
                style={{
                  // 도트 가로 크기
                  width: 12,
                  // 도트 세로 크기
                  height: 12,
                  // 원형
                  borderRadius: 999,
                  // 네온 블루
                  backgroundColor: THEME.accent,
                  // 플렉스 표시
                  display: "flex",
                }}
              />
              {/* 로고 텍스트 */}
              <div
                style={{
                  // 글자 크기
                  fontSize: 20,
                  // 굵기
                  fontWeight: 900,
                  // 전경색
                  color: THEME.foreground,
                  // 플렉스 표시
                  display: "flex",
                }}
              >
                mylink
              </div>
            </div>

            {/* 중앙 아바타 + 이름 + 핸들 + 한 줄 소개 */}
            <div
              style={{
                // 플렉스 세로 배치
                display: "flex",
                // 세로 방향 정렬
                flexDirection: "column",
                // 좌측 정렬
                alignItems: "flex-start",
                // 요소 간격
                gap: 14,
                // 가로 전체 폭
                width: "100%",
              }}
            >
              {/* 원형 이니셜 아바타 배지 (닌텐도 레드 + 소프트 링) */}
              <div
                style={{
                  // 아바타 가로 크기
                  width: 104,
                  // 아바타 세로 크기
                  height: 104,
                  // 완전한 원형
                  borderRadius: 999,
                  // 닌텐도 레드 배경
                  backgroundColor: THEME.primary,
                  // 흰색 글자
                  color: THEME.primaryForeground,
                  // 이니셜 글자 크기
                  fontSize: 48,
                  // 가장 굵은 글씨
                  fontWeight: 900,
                  // 플렉스 중앙 정렬
                  display: "flex",
                  // 세로 중앙 정렬
                  alignItems: "center",
                  // 가로 중앙 정렬
                  justifyContent: "center",
                  // 외곽 소프트 레드 링 테두리
                  border: "8px solid rgba(230, 0, 18, 0.16)",
                }}
              >
                {initialLetter}
              </div>

              {/* 사용자 이름 (실명 또는 닉네임) */}
              <div
                style={{
                  // 이름 글자 크기
                  fontSize: 44,
                  // 굵은 글씨체
                  fontWeight: 900,
                  // 진한 글자색
                  color: THEME.foreground,
                  // 자간 조정
                  letterSpacing: "-0.02em",
                  // 한 줄 줄바꿈 방지
                  lineHeight: 1.15,
                  // 플렉스 표시
                  display: "flex",
                }}
              >
                {userName}
              </div>

              {/* @displayName 네온 블루 핸들 배지 */}
              <div
                style={{
                  // 핸들 글자 크기
                  fontSize: 24,
                  // 굵기
                  fontWeight: 800,
                  // 네온 시안 블루 색상
                  color: THEME.accent,
                  // 플렉스 표시
                  display: "flex",
                }}
              >
                {`@${handle}`}
              </div>

              {/* 사용자 한 줄 소개 문구 */}
              <div
                style={{
                  // 소개글 글자 크기
                  fontSize: 21,
                  // 중간 굵기
                  fontWeight: 600,
                  // 보조 글자색
                  color: THEME.mutedForeground,
                  // 줄간격
                  lineHeight: 1.4,
                  // 플렉스 표시
                  display: "flex",
                }}
              >
                {safeBio}
              </div>
            </div>

            {/* 하단 공개 프로필 주소 안내 캡션 */}
            <div
              style={{
                // 플렉스 가로 배치
                display: "flex",
                // 세로 중앙 정렬
                alignItems: "center",
                // 간격
                gap: 8,
                // 글자 크기
                fontSize: 18,
                // 굵기
                fontWeight: 700,
                // 보조 글자색
                color: THEME.mutedForeground,
              }}
            >
              <span style={{ color: THEME.primary }}>●</span>
              <span>{`mylink / @${handle}`}</span>
            </div>
          </div>

          {/* [우측 컬럼] 대표 링크 카드 프리뷰 영역 */}
          <div
            style={{
              // 우측 비율 54%
              width: "54%",
              // 플렉스 컨테이너
              display: "flex",
              // 세로 방향 배치
              flexDirection: "column",
              // 상하 균등 배치
              justifyContent: "space-between",
            }}
          >
            {/* 우측 상단 섹션 헤더: 콘솔 타이틀 및 링크 수 배지 */}
            <div
              style={{
                // 플렉스 가로 배치
                display: "flex",
                // 세로 중앙 정렬
                alignItems: "center",
                // 좌우 끝 정렬
                justifyContent: "space-between",
                // 가로 전체 폭
                width: "100%",
              }}
            >
              {/* 좌측 헤더 텍스트 */}
              <div
                style={{
                  // 글자 크기
                  fontSize: 22,
                  // 굵기
                  fontWeight: 800,
                  // 진한 글자색
                  color: THEME.foreground,
                  // 플렉스 표시
                  display: "flex",
                }}
              >
                공유된 링크 목록
              </div>

              {/* 우측 링크 개수 카운트 배지 */}
              <div
                style={{
                  // 플렉스 가로 배치
                  display: "flex",
                  // 세로 중앙 정렬
                  alignItems: "center",
                  // 안쪽 여백
                  padding: "6px 16px",
                  // 둥근 알약 모서리
                  borderRadius: 999,
                  // 닌텐도 레드 배경
                  backgroundColor: THEME.primary,
                  // 흰색 글자
                  color: THEME.primaryForeground,
                  // 글자 크기
                  fontSize: 18,
                  // 굵기
                  fontWeight: 800,
                }}
              >
                {totalLinkCount > 0 ? `총 ${totalLinkCount}개 링크` : "SWITCH NEON"}
              </div>
            </div>

            {/* 대표 링크 3개 카드 리스트 (LinkButton 디자인과 통일) */}
            <div
              style={{
                // 플렉스 세로 배치
                display: "flex",
                // 세로 방향
                flexDirection: "column",
                // 카드 간 간격
                gap: 18,
                // 가로 전체 폭
                width: "100%",
              }}
            >
              {displayLinks.map((titleText, index) => {
                // 긴 링크 제목은 24자 이내로 깔끔하게 자르기
                const shortTitle =
                  titleText.length > 24
                    ? `${titleText.slice(0, 24)}...`
                    : titleText;
                // 홀수/짝수 인덱스에 따라 레드/블루 포인트 교차 적용
                const badgeColor = index % 2 === 0 ? THEME.primary : THEME.accent;

                return (
                  <div
                    key={`${index}-${shortTitle}`}
                    style={{
                      // 가로 전체 폭
                      width: "100%",
                      // 플렉스 가로 배치
                      display: "flex",
                      // 세로 중앙 정렬
                      alignItems: "center",
                      // 좌우 끝 정렬
                      justifyContent: "space-between",
                      // 카드 내부 여백
                      padding: "22px 26px",
                      // 스위치 콘솔 20px 라운드
                      borderRadius: 22,
                      // 연회색 배경
                      backgroundColor: THEME.background,
                      // 테두리
                      border: `2px solid ${THEME.border}`,
                    }}
                  >
                    {/* 좌측 번호 배지 + 링크 제목 */}
                    <div
                      style={{
                        // 플렉스 가로 정렬
                        display: "flex",
                        // 세로 중앙 정렬
                        alignItems: "center",
                        // 간격
                        gap: 16,
                      }}
                    >
                      {/* 조이콘 컬러 원형 번호 아이콘 */}
                      <div
                        style={{
                          // 가로 크기
                          width: 36,
                          // 세로 크기
                          height: 36,
                          // 모서리 둥글기
                          borderRadius: 12,
                          // 레드 또는 블루 배경색
                          backgroundColor: badgeColor,
                          // 흰색 글자
                          color: THEME.primaryForeground,
                          // 글자 크기
                          fontSize: 18,
                          // 굵기
                          fontWeight: 900,
                          // 플렉스 중앙 정렬
                          display: "flex",
                          // 세로 중앙
                          alignItems: "center",
                          // 가로 중앙
                          justifyContent: "center",
                        }}
                      >
                        {index + 1}
                      </div>

                      {/* 링크 제목 텍스트 */}
                      <div
                        style={{
                          // 제목 글자 크기
                          fontSize: 24,
                          // 굵기
                          fontWeight: 800,
                          // 전경색
                          color: THEME.foreground,
                          // 플렉스 표시
                          display: "flex",
                        }}
                      >
                        {shortTitle}
                      </div>
                    </div>

                    {/* 우측 스위치 네온 블루 화살표 (>) */}
                    <div
                      style={{
                        // 화살표 글자 크기
                        fontSize: 28,
                        // 가장 굵은 글씨
                        fontWeight: 900,
                        // 네온 블루 색상
                        color: THEME.accent,
                        // 플렉스 표시
                        display: "flex",
                      }}
                    >
                      &gt;
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 우측 하단 안내 문구 */}
            <div
              style={{
                // 플렉스 가로 배치
                display: "flex",
                // 세로 중앙 정렬
                alignItems: "center",
                // 우측 정렬
                justifyContent: "flex-end",
                // 글자 크기
                fontSize: 17,
                // 굵기
                fontWeight: 700,
                // 보조 글자색
                color: THEME.mutedForeground,
              }}
            >
              클릭하여 전체 프로필과 링크를 확인하세요 →
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
