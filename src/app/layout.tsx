import type { Metadata } from "next";
import "./globals.css";

// 사이트 기본 메타데이터 설정 (브라우저 탭 제목 및 검색 설명)
export const metadata: Metadata = {
  title: "양세화 | 프로필",
  description: "저는 유기나노공학과 양세화입니다.",
};

// 최상위 레이아웃 컴포넌트: 모든 페이지를 감싸는 기본 뼈대
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 언어 설정을 한국어(ko)로 지정하고 깔끔한 시스템 글꼴(font-sans) 적용
    <html lang="ko" className="h-full antialiased font-sans">
      {/* 화면 전체 높이를 채우고 플렉스 박스로 배치 */}
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
