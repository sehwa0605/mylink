// Next.js 404 리다이렉트 함수 임포트
import { notFound } from "next/navigation";
// Next.js 메타데이터 생성 타입 임포트
import type { Metadata } from "next";
// 공개 페이지 데이터 조회 함수 임포트 (서버 컴포넌트에서 실행)
import { fetchPublicPage } from "@/lib/publicPage";
// 클라이언트 공개 프로필 뷰 컴포넌트 임포트
import { ProfileView } from "@/components/profile/ProfileView";
// 공개 페이지 타입 정의 임포트
import type { PublicPage } from "@/lib/types";

// Next.js 16 동적 라우트 파라미터 Props 타입 정의 (params는 Promise)
export interface ProfilePageProps {
  // 비동기 라우트 파라미터 객체
  params: Promise<{
    // URL에서 전달된 공개 주소명
    displayName: string;
  }>;
}

// 공개 페이지 동적 메타데이터 생성 함수 (SEO, 오픈 그래프 및 트위터 카드)
export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  // 비동기 파라미터에서 displayName 추출
  const { displayName: raw } = await params;
  // URL 인코딩 해제 (한글 및 특수문자 복원)
  const displayName = decodeURIComponent(raw);
  // 정규화된 공개 페이지 경로 문자열 생성
  const canonicalPath = `/${encodeURIComponent(displayName)}`;

  try {
    // 공개 페이지 데이터 사전 조회
    const page = await fetchPublicPage(displayName);

    // 존재하지 않는 사용자인 경우 404 안내 메타데이터 및 검색 색인 제외 반환
    if (page === null) {
      return {
        // 루트 템플릿과 결합되어 '프로필을 찾을 수 없음 | mylink'로 표시
        title: "프로필을 찾을 수 없음",
        // 404 상태 설명 문구
        description: `요청하신 @${displayName} 공개 프로필을 찾을 수 없습니다.`,
        // 존재하지 않는 페이지는 검색 엔진 색인에서 제외
        robots: {
          // 검색 결과 노출 제외
          index: false,
          // 링크 추적 제외
          follow: false,
        },
      };
    }

    // 사용자 이름 결정 (실명 우선, 없으면 핸들명)
    const userName =
      page?.profile?.username || page?.profile?.displayName || displayName;
    // 브라우저 탭 및 공유 카드용 제목 구성
    const pageTitle =
      userName === displayName ? `${userName}` : `${userName} (@${displayName})`;
    // 사용자 소개글 결정 (한 줄 소개가 없으면 기본 설명 문구 생성)
    const description =
      page?.profile?.bio ||
      `${userName}(@${displayName})님의 모든 링크와 포트폴리오를 mylink에서 확인해 보세요.`;
    // 등록된 상위 링크 제목들을 키워드로 추출 (최대 5개)
    const linkKeywords = (page?.links || [])
      .slice(0, 5)
      .map((link) => link.title)
      .filter(Boolean);

    // 완성된 동적 SEO 메타데이터 객체 반환
    return {
      // 루트 템플릿(%s | mylink)과 결합될 페이지 타이틀
      title: pageTitle,
      // 검색 엔진 요약 설명
      description,
      // 사용자 맞춤 검색 키워드 배열
      keywords: [
        // 사용자 이름
        userName,
        // 사용자 핸들 아이디
        displayName,
        // 서비스 영문명
        "mylink",
        // 서비스 국문명
        "마이링크",
        // 페이지 성격 키워드 1
        "공개 프로필",
        // 페이지 성격 키워드 2
        "포트폴리오",
        // 등록된 대표 링크 제목들
        ...linkKeywords,
      ],
      // 대표 URL(Canonical) 경로 설정
      alternates: {
        // 공개 프로필 대표 경로
        canonical: canonicalPath,
      },
      // 소셜 공유용 오픈 그래프 메타데이터
      openGraph: {
        // 공유 카드 제목
        title: `${pageTitle} | mylink`,
        // 공유 카드 설명
        description,
        // 공유 대상 페이지 경로
        url: canonicalPath,
        // 사이트 브랜드명
        siteName: "mylink",
        // 한국어 로케일
        locale: "ko_KR",
        // 프로필 타입 지정
        type: "profile",
      },
      // 트위터(X) 공유 카드 메타데이터
      twitter: {
        // 대형 썸네일 카드 형식
        card: "summary_large_image",
        // 트위터 카드 제목
        title: `${pageTitle} | mylink`,
        // 트위터 카드 설명
        description,
      },
    };
  } catch {
    // 일시적 오류 발생 시 기본 폴백 메타데이터 반환
    const fallbackDescription = `${displayName}님의 mylink 공개 프로필입니다.`;
    return {
      // 기본 폴백 타이틀
      title: displayName,
      // 기본 폴백 설명
      description: fallbackDescription,
      // 대표 URL(Canonical) 경로 설정
      alternates: {
        // 공개 프로필 대표 경로
        canonical: canonicalPath,
      },
      // 기본 오픈 그래프 설정
      openGraph: {
        // 공유 카드 제목
        title: `${displayName} | mylink`,
        // 공유 카드 설명
        description: fallbackDescription,
        // 공유 대상 페이지 경로
        url: canonicalPath,
        // 사이트 브랜드명
        siteName: "mylink",
        // 한국어 로케일
        locale: "ko_KR",
        // 프로필 타입 지정
        type: "profile",
      },
      // 기본 트위터 카드 설정
      twitter: {
        // 대형 썸네일 카드 형식
        card: "summary_large_image",
        // 트위터 카드 제목
        title: `${displayName} | mylink`,
        // 트위터 카드 설명
        description: fallbackDescription,
      },
    };
  }
}

// [displayName] 동적 라우팅 서버 컴포넌트 (가이드 12주차)
export default async function ProfilePage({ params }: ProfilePageProps) {
  // Next.js 16 규격: params Promise 해제
  const { displayName: raw } = await params;
  // URL 인코딩된 글자(예: %20 등)를 원래 문자열로 디코딩
  const displayName = decodeURIComponent(raw);

  // 서버에서 조회한 페이지 데이터 저장 변수
  let page: PublicPage | null | undefined;

  try {
    // Firestore에서 사용자 프로필 및 최신 링크 목록 조회
    page = await fetchPublicPage(displayName);
  } catch (err) {
    // 일시적인 네트워크 오류 등은 404로 단정하지 않고 에러 로그만 출력
    console.error("공개 페이지 서버 조회 실패:", err);
    page = undefined;
  }

  // 사용자가 확실히 존재하지 않는 경우(null) 404 페이지로 이동 (주의: try 밖에서 호출해야 함)
  if (page === null) {
    notFound();
  }

  // 조회된 초기 데이터(initialPage)와 함께 클라이언트 뷰 컴포넌트 렌더링
  return <ProfileView handle={displayName} initialPage={page} />;
}
