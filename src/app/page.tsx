// Next.js 메타데이터 타입 임포트
import type { Metadata } from "next";
// 홈 및 랜딩 페이지 뷰 컴포넌트 임포트
import { HomeView } from "@/components/home/HomeView";

// 메인 홈(/) 페이지 SEO 메타데이터 설정
export const metadata: Metadata = {
  // 루트 홈 화면 전용 전체 타이틀 지정
  title: {
    // 템플릿 중복 없이 그대로 표시할 절대 타이틀
    absolute: "mylink — 나만의 스위치 네온 마이링크",
  },
  // 검색 엔진 결과에 표시될 메인 페이지 설명
  description:
    "내 모든 링크를 하나로! GitHub, 블로그, 포트폴리오를 한 페이지에 모아 나만의 공개 주소로 세상과 공유해보세요.",
  // 메인 페이지 검색 키워드 목록
  keywords: [
    // 서비스 영문명
    "mylink",
    // 서비스 국문명
    "마이링크",
    // 핵심 기능 키워드
    "링크인바이오",
    // 프로필 공유 키워드
    "프로필 공유",
    // 포트폴리오 키워드
    "포트폴리오 링크",
    // 테마 디자인 키워드
    "스위치 네온",
  ],
  // 대표 URL(Canonical) 경로 설정
  alternates: {
    // 홈 페이지 대표 경로
    canonical: "/",
  },
  // 소셜 공유용 오픈 그래프 메타데이터
  openGraph: {
    // 공유 카드 제목
    title: "mylink — 나만의 스위치 네온 마이링크",
    // 공유 카드 설명
    description:
      "내 모든 링크를 하나로! GitHub, 블로그, 포트폴리오를 한 페이지에 모아 나만의 공개 주소로 세상과 공유해보세요.",
    // 공유 대상 페이지 경로
    url: "/",
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
    title: "mylink — 나만의 스위치 네온 마이링크",
    // 트위터 카드 설명
    description:
      "내 모든 링크를 하나로! GitHub, 블로그, 포트폴리오를 한 페이지에 모아 나만의 공개 주소로 세상과 공유해보세요.",
  },
};

// 4장 4-5 라우트: src/app/page.tsx -> HomeView 연결
export default function Home() {
  // 클라이언트 홈 뷰 컴포넌트 렌더링
  return <HomeView />;
}
