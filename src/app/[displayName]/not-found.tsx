"use client";

// 리액트 기본 임포트
import React from "react";
// 404 뷰 컴포넌트 임포트
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";

// 존재하지 않는 공개 주소(/{displayName}) 접근 시 표시되는 404 페이지 컴포넌트 (12주차)
export default function NotFound() {
  // 스위치 네온 스타일의 404 전용 컴포넌트 렌더링
  return <ProfileNotFound />;
}
