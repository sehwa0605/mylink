// 리액트 기본 임포트
import React from "react";
// Next.js 메타데이터 타입 임포트
import type { Metadata } from "next";
// 로그인 검사 가드 컴포넌트 임포트
import { RequireLogin } from "@/components/auth/RequireLogin";
// 마이페이지 뷰 컴포넌트 임포트
import { MyPageView } from "@/components/mypage/MyPageView";

// 마이페이지(/mypage) SEO 메타데이터 설정
export const metadata: Metadata = {
  // 브라우저 탭 제목 (루트 템플릿과 결합되어 '마이페이지 | mylink'로 표시)
  title: "마이페이지",
  // 검색 엔진 및 소셜 공유용 페이지 설명
  description:
    "내 프로필 이름과 한 줄 소개를 수정하고 나만의 링크 목록과 클릭 수를 관리하는 마이페이지입니다.",
  // 마이페이지 검색 키워드 목록
  keywords: [
    // 서비스 영문명
    "mylink",
    // 서비스 국문명
    "마이링크",
    // 페이지명 키워드
    "마이페이지",
    // 주요 기능 키워드 1
    "프로필 관리",
    // 주요 기능 키워드 2
    "링크 추가",
    // 서비스 분류 키워드
    "링크인바이오",
  ],
  // 대표 URL(Canonical) 경로 설정
  alternates: {
    // 마이페이지 대표 경로
    canonical: "/mypage",
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
    title: "마이페이지 | mylink",
    // 공유 카드 설명
    description:
      "내 프로필 이름과 한 줄 소개를 수정하고 나만의 링크 목록과 클릭 수를 관리하는 마이페이지입니다.",
    // 공유 대상 페이지 경로
    url: "/mypage",
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
    title: "마이페이지 | mylink",
    // 트위터 카드 설명
    description:
      "내 프로필 이름과 한 줄 소개를 수정하고 나만의 링크 목록과 클릭 수를 관리하는 마이페이지입니다.",
  },
};

// /mypage 라우트 페이지 컴포넌트 (로그인 필수 보호 페이지)
export default function MyPageRoute() {
  return (
    // 로그인한 사용자만 마이페이지 콘텐츠에 접근 가능하도록 가드 적용
    <RequireLogin>
      <MyPageView />
    </RequireLogin>
  );
}
