// 메타데이터 타입 임포트
import type { Metadata } from "next";
// 전역 CSS 스타일시트 임포트 (Tailwind v4 및 디자인 토큰)
import "./globals.css";
// 상단 중앙 토스트 알림창 컴포넌트 임포트
import { Toaster } from "@/components/ui/sonner";
// TanStack Query 공급자 컴포넌트 임포트
import { QueryProvider } from "@/components/providers/QueryProvider";
// 전역 상단 고정 헤더 컴포넌트 임포트 (11주차)
import { Header } from "@/components/layout/Header";

// 배포 환경(Vercel) 또는 로컬 환경에 맞는 사이트 기준 URL 계산
const siteUrl =
  // 1순위: 직접 설정한 사이트 URL 환경 변수
  process.env.NEXT_PUBLIC_SITE_URL ||
  // 2순위: Vercel 프로덕션 대표 도메인 (자동 제공)
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : // 3순위: Vercel 프리뷰/배포 도메인 (자동 제공)
      process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : // 4순위: 로컬 개발 서버 기본 주소
        "http://localhost:3000");

// 사이트 전역 기본 메타데이터 설정 (SEO 최적화, 오픈 그래프 및 트위터 카드)
export const metadata: Metadata = {
  // 상대 경로 메타데이터(OG 이미지, canonical 등)의 기준 URL 설정
  metadataBase: new URL(siteUrl),
  // 브라우저 탭 제목 및 하위 페이지 타이틀 템플릿 설정
  title: {
    // 하위 페이지에서 별도 타이틀을 지정하지 않았을 때의 기본 제목
    default: "mylink — 나만의 스위치 네온 마이링크",
    // 하위 페이지 타이틀 뒤에 자동으로 붙는 브랜드 접미사 템플릿
    template: "%s | mylink",
  },
  // 검색 엔진에 노출될 서비스 기본 설명
  description:
    "GitHub, 블로그, 포트폴리오를 한 페이지에 모아 나만의 주소로 세상과 공유하는 링크인바이오 서비스",
  // 웹 애플리케이션 이름 명시
  applicationName: "mylink",
  // 검색 엔진 최적화를 위한 핵심 키워드 목록
  keywords: [
    // 서비스 영문명
    "mylink",
    // 서비스 국문명
    "마이링크",
    // 카테고리 핵심 키워드
    "링크인바이오",
    // 영문 카테고리 키워드
    "link in bio",
    // 활용 목적 키워드 1
    "포트폴리오",
    // 활용 목적 키워드 2
    "프로필 링크",
    // 제작자 이름 키워드
    "양세화",
  ],
  // 제작자 정보 명시
  authors: [
    // 제작자 이름 및 GitHub 주소
    { name: "양세화 (Sehwa Yang)", url: "https://github.com/sehwa0605" },
  ],
  // 콘텐츠 생성자 명시
  creator: "양세화 (Sehwa Yang)",
  // 서비스 발행 주체 명시
  publisher: "mylink",
  // 검색 로봇 수집 및 링크 추적 허용 설정
  robots: {
    // 페이지 색인 허용
    index: true,
    // 페이지 내 링크 추적 허용
    follow: true,
  },
  // 카카오톡·슬랙·페이스북 등 소셜 미디어 공유용 오픈 그래프 기본 설정
  openGraph: {
    // 웹사이트 타입 지정
    type: "website",
    // 한국어 로케일 지정
    locale: "ko_KR",
    // 기본 루트 경로
    url: "/",
    // 사이트 브랜드 이름
    siteName: "mylink",
    // 공유 카드 기본 제목
    title: "mylink — 나만의 스위치 네온 마이링크",
    // 공유 카드 기본 설명
    description:
      "GitHub, 블로그, 포트폴리오를 한 페이지에 모아 나만의 주소로 세상과 공유하는 링크인바이오 서비스",
  },
  // X(트위터) 공유 카드 기본 설정
  twitter: {
    // 대형 썸네일 요약 카드 형식 사용
    card: "summary_large_image",
    // 트위터 카드 기본 제목
    title: "mylink — 나만의 스위치 네온 마이링크",
    // 트위터 카드 기본 설명
    description:
      "GitHub, 블로그, 포트폴리오를 한 페이지에 모아 나만의 주소로 세상과 공유하는 링크인바이오 서비스",
  },
  // 크롬 브라우저 영문 페이지 오판에 따른 자동 번역 팝업 방지 설정
  other: {
    // 구글 자동 번역 비활성화 메타 태그
    google: "notranslate",
  },
};

// 최상위 레이아웃 컴포넌트: 모든 페이지를 감싸는 기본 뼈대
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 언어 설정을 한국어(ko)로 지정하고 translate="no"로 크롬 번역 팝업 방지
    <html lang="ko" translate="no" className="h-full antialiased font-sans">
      {/* 화면 전체 높이를 채우고 플렉스 박스로 배치 */}
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* TanStack Query 전역 공급자로 앱 전체 감싸기 */}
        <QueryProvider>
          {/* 모든 페이지 최상단에 고정되는 헤더 바 */}
          <Header />
          {/* 각 페이지의 실제 콘텐츠 렌더링 영역 */}
          <div className="flex-1 w-full">
            {children}
          </div>
        </QueryProvider>
        {/* 전역 알림을 표시하는 상단 중앙 토스트 컨테이너 */}
        <Toaster />
      </body>
    </html>
  );
}
