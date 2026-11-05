// Next.js 메타데이터 타입 임포트
import type { Metadata } from "next";
// 통계 대시보드 뷰 컴포넌트 임포트
import { StatsView } from "@/components/stats/StatsView";

// 통계 페이지 정적 메타데이터 설정
export const metadata: Metadata = {
  // 브라우저 탭 타이틀
  title: "통계 | mylink",
  // 검색 엔진 및 공유 설명
  description: "내 링크별 누적 클릭 수와 방문 통계를 한눈에 확인해 보세요.",
};

// 통계 페이지 서버 컴포넌트 라우트 (가이드 13주차)
export default function StatsPage() {
  // 클라이언트 통계 뷰 컴포넌트 렌더링
  return <StatsView />;
}
