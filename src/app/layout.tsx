// 메타데이터 타입 임포트
import type { Metadata } from "next";
// 전역 CSS 스타일시트 임포트 (Tailwind v4 및 디자인 토큰)
import "./globals.css";
// 상단 중앙 토스트 알림창 컴포넌트 임포트
import { Toaster } from "@/components/ui/sonner";

// 사이트 기본 메타데이터 설정 (브라우저 탭 제목 및 검색 설명)
export const metadata: Metadata = {
  // 브라우저 탭 기본 타이틀
  title: "양세화 | 프로필",
  // 검색 엔진 및 소셜 공유용 소개글
  description: "유기나노공학을 공부하며 아이디어를 코드로 만듭니다.",
};

// 최상위 레이아웃 컴포넌트: 모든 페이지를 감싸는 기본 뼈대
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 언어 설정을 한국어(ko)로 지정하고 깔끔한 시스템 글꼴(font-sans) 적용
    <html lang="ko" className="h-full antialiased font-sans">
      {/* 화면 전체 높이를 채우고 플렉스 박스로 배치 */}
      <body className="min-h-full flex flex-col">
        {/* 각 페이지의 실제 콘텐츠 렌더링 */}
        {children}
        {/* 전역 알림을 표시하는 상단 중앙 토스트 컨테이너 */}
        <Toaster />
      </body>
    </html>
  );
}
