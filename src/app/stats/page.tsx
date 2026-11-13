// Next.js 메타데이터 타입 임포트
import type { Metadata } from "next";
// 통계 대시보드 뷰 컴포넌트 임포트
import { StatsView } from "@/components/stats/StatsView";

// 통계(/stats) 페이지 SEO 메타데이터 설정
export const metadata: Metadata = {
  // 브라우저 탭 제목 (루트 템플릿과 결합되어 '통계 | mylink'로 표시)
  title: "통계",
  // 검색 엔진 및 공유 설명
  description:
    "내 링크별 누적 클릭 수와 방문 통계를 차트와 순위표로 한눈에 확인해 보세요.",
  // 통계 페이지 검색 키워드 목록
  keywords: [
    // 서비스 영문명
    "mylink",
    // 서비스 국문명
    "마이링크",
    // 페이지 주요 키워드 1
    "클릭 통계",
    // 페이지 주요 키워드 2
    "방문 분석",
    // 페이지 주요 키워드 3
    "링크 순위",
    // 서비스 분류 키워드
    "링크인바이오",
  ],
  // 대표 URL(Canonical) 경로 설정
  alternates: {
    // 통계 페이지 대표 경로
    canonical: "/stats",
  },
  // 로그인 필수 개인 관리 페이지이므로 검색 엔진 색인 및 링크 추적 차단
  robots: {
    // 검색 결과 색인 제외
    index: false,
    // 페이지 내 링크 추적 제외
    follow: false,
  },
  // 소셜 공유용 오픈 그래프 메타데이터
  openGraph: {
    // 공유 카드 제목
    title: "통계 | mylink",
    // 공유 카드 설명
    description:
      "내 링크별 누적 클릭 수와 방문 통계를 차트와 순위표로 한눈에 확인해 보세요.",
    // 공유 대상 페이지 경로
    url: "/stats",
    // 사이트 브랜드명
    siteName: "mylink",
    // 한국어 로케일
    locale: "ko_KR",
    // 웹사이트 타입
    type: "website",
  },
  // 트위터(X) 공유 카드 메타데이터
  twitter: {
    // 대형 썸네일 카드 형식
    card: "summary_large_image",
    // 트위터 카드 제목
    title: "통계 | mylink",
    // 트위터 카드 설명
    description:
      "내 링크별 누적 클릭 수와 방문 통계를 차트와 순위표로 한눈에 확인해 보세요.",
  },
};

// 통계 페이지 서버 컴포넌트 라우트 (가이드 13주차)
export default function StatsPage() {
  // 클라이언트 통계 뷰 컴포넌트 렌더링
  return <StatsView />;
}
