// 리액트 기본 임포트
import React from "react";
// 로그인 검사 가드 컴포넌트 임포트
import { RequireLogin } from "@/components/auth/RequireLogin";
// 대시보드 뷰 컴포넌트 임포트
import { DashboardView } from "@/components/dashboard/DashboardView";

// /dashboard 라우트 페이지 컴포넌트 (로그인 필수 보호 페이지)
export default function DashboardRoute() {
  return (
    // 로그인한 사용자만 대시보드 화면에 접근 가능하도록 가드 적용
    <RequireLogin>
      <DashboardView />
    </RequireLogin>
  );
}
