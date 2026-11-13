// Next.js 메타데이터 라우트 타입 임포트
import type { MetadataRoute } from "next";

// 배포 환경(Vercel) 또는 기본 프로덕션 도메인 기준 URL 계산
const siteUrl =
  // 1순위: 직접 설정한 사이트 URL 환경 변수
  process.env.NEXT_PUBLIC_SITE_URL ||
  // 2순위: Vercel 프로덕션 대표 도메인 (자동 제공)
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : // 3순위: Vercel 프리뷰/배포 도메인 (자동 제공)
      process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : // 4순위: 기본 프로덕션 배포 도메인
        "https://mylink-eight-ivory.vercel.app");

// 검색 엔진 크롤러 수집 규칙(/robots.txt) 생성 함수
export default function robots(): MetadataRoute.Robots {
  // 로봇 크롤링 허용/차단 규칙 및 사이트맵 주소 반환
  return {
    // 모든 검색 로봇에 대한 크롤링 규칙 설정
    rules: {
      // 모든 크롤러(User-Agent) 대상
      userAgent: "*",
      // 공개 페이지 및 루트 경로 수집 허용
      allow: "/",
      // 로그인 필수 개인 관리 페이지는 크롤링 차단
      disallow: ["/dashboard", "/mypage", "/stats"],
    },
    // 사이트맵 XML 전체 URL 지정
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
