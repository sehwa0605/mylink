// 리액트 기본 임포트
import React from "react";
// 로그인 검사 가드 컴포넌트 임포트
import { RequireLogin } from "@/components/auth/RequireLogin";
// 마이페이지 뷰 컴포넌트 임포트
import { MyPageView } from "@/components/mypage/MyPageView";

// /mypage 라우트 페이지 컴포넌트 (로그인 필수 보호 페이지)
export default function MyPageRoute() {
  return (
    // 로그인한 사용자만 마이페이지 콘텐츠에 접근 가능하도록 가드 적용
    <RequireLogin>
      <MyPageView />
    </RequireLogin>
  );
}
