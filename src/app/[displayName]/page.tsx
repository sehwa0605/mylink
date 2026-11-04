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

// 공개 페이지 동적 메타데이터 생성 함수 (SEO 및 브라우저 탭 제목)
export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  // 비동기 파라미터에서 displayName 추출
  const { displayName: raw } = await params;
  // URL 인코딩 해제 (한글 및 특수문자 복원)
  const displayName = decodeURIComponent(raw);

  try {
    // 공개 페이지 데이터 사전 조회
    const page = await fetchPublicPage(displayName);
    // 사용자 이름 결정 (실명 우선, 없으면 핸들명)
    const title =
      page?.profile?.username || page?.profile?.displayName || displayName;
    // 사용자 소개글 결정
    const description =
      page?.profile?.bio || `${displayName}님의 mylink 프로필입니다.`;

    // 메타데이터 객체 반환
    return {
      title: `${title} | mylink`,
      description,
      openGraph: {
        title: `${title} | mylink`,
        description,
      },
    };
  } catch {
    // 오류 발생 시 기본 메타데이터 반환
    return {
      title: `${displayName} | mylink`,
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
