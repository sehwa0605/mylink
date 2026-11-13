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

// 검색 엔진 제출용 사이트맵(/sitemap.xml) 생성 함수
export default function sitemap(): MetadataRoute.Sitemap {
  // 사이트맵에 포함할 공개 페이지 경로 목록 반환
  return [
    {
      // 메인 랜딩 페이지 주소
      url: siteUrl,
      // 마지막 수정 시각
      lastModified: new Date(),
      // 변경 주기 (주간)
      changeFrequency: "weekly",
      // 검색 중요도 (최상)
      priority: 1,
    },
    {
      // 제작자 기본 공개 프로필 페이지 주소
      url: `${siteUrl}/ysh8436`,
      // 마지막 수정 시각
      lastModified: new Date(),
      // 변경 주기 (주간)
      changeFrequency: "weekly",
      // 검색 중요도 (높음)
      priority: 0.8,
    },
  ];
}
