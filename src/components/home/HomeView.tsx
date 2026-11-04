"use client";

// 리액트 기본 임포트
import React from "react";
// 사용자 상태 커스텀 훅 임포트
import { useUser } from "@/hooks/useUser";
// 비로그인 사용자용 랜딩 페이지 컴포넌트 임포트
import { LandingPage } from "@/components/landing/LandingPage";
// 로그인 사용자용 마이페이지 뷰 컴포넌트 임포트
import { MyPageView } from "@/components/mypage/MyPageView";
// 로딩 스켈레톤 컴포넌트 임포트
import { Skeleton } from "@/components/ui/skeleton";

// 메인 홈(/) 화면 통합 뷰 컴포넌트 (가이드 11주차: 로그인 여부에 따라 랜딩 vs 마이페이지 분기)
export function HomeView() {
  // 인증 준비 상태 및 로그인 사용자 정보 획득
  const { user, authReady } = useUser();

  // 1. Firebase Auth 초기 로딩 상태: 깜빡임 방지용 스켈레톤 표시
  if (!authReady) {
    return (
      <main className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto space-y-4">
          <Skeleton className="w-full h-44 rounded-3xl" />
          <Skeleton className="w-full h-12 rounded-2xl" />
          <Skeleton className="w-full h-14 rounded-2xl" />
          <Skeleton className="w-full h-14 rounded-2xl" />
        </div>
      </main>
    );
  }

  // 2. 비로그인 상태: 서비스 소개 및 로그인 유도 랜딩 페이지 노출
  if (!user) {
    return (
      <main className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 sm:p-6">
        <LandingPage />
      </main>
    );
  }

  // 3. 로그인 상태: 마이페이지(프로필 + 링크 관리) 화면 노출
  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-start p-4 sm:p-6">
      <MyPageView />
    </main>
  );
}
