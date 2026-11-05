// 리액트 기본 임포트
import React from "react";
// Next.js 메타데이터 타입 임포트
import type { Metadata } from "next";
// 404 뷰 컴포넌트 임포트
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";

// 404 Not Found 페이지 메타데이터 설정 (검색 색인 제외)
export const metadata: Metadata = {
  // 브라우저 탭 제목 (루트 템플릿과 결합되어 '페이지를 찾을 수 없습니다 | mylink'로 표시)
  title: "페이지를 찾을 수 없습니다",
  // 404 안내 설명
  description:
    "요청하신 공개 프로필 주소가 존재하지 않습니다. 주소(Username)의 철자를 다시 확인해 주세요.",
  // 404 에러 페이지는 검색 엔진 색인에서 제외
  robots: {
    // 검색 색인 비허용
    index: false,
    // 링크 추적 비허용
    follow: false,
  },
};

// 존재하지 않는 공개 주소(/{displayName}) 접근 시 표시되는 404 페이지 컴포넌트 (12주차)
export default function NotFound() {
  // 스위치 네온 스타일의 404 전용 컴포넌트 렌더링
  return <ProfileNotFound />;
}
