"use client";

// 리액트 기본 임포트
import React from "react";
// 사용자 상태 훅 임포트
import { useUser } from "@/hooks/useUser";
// 로그인 안내 컴포넌트 임포트
import { LoginRequired } from "@/components/auth/LoginRequired";
// 로딩 스켈레톤 컴포넌트 임포트
import { Skeleton } from "@/components/ui/skeleton";

// RequireLogin 컴포넌트 Props 인터페이스 정의
export interface RequireLoginProps {
  // 인증 통과 시 렌더링할 자식 컴포넌트
  children: React.ReactNode;
}

// 로그인 여부를 검사하여 비로그인 접근을 차단하는 가드(문지기) 컴포넌트 (11주차)
export function RequireLogin({ children }: RequireLoginProps) {
  // 인증 완료 여부 및 로그인 사용자 획득
  const { user, authReady } = useUser();

  // 1. Firebase 인증 상태 확인 중(authReady false): 깜빡임 방지용 자리표시(스켈레톤) 노출
  if (!authReady) {
    return (
      <div className="w-full max-w-md mx-auto p-6 space-y-4">
        {/* 프로필 자리표시 */}
        <Skeleton className="w-full h-40 rounded-3xl" />
        {/* 링크 목록 자리표시 */}
        <Skeleton className="w-full h-14 rounded-2xl" />
        <Skeleton className="w-full h-14 rounded-2xl" />
      </div>
    );
  }

  // 2. 비로그인 사용자: 로그인 필요 안내 화면 노출
  if (!user) {
    return <LoginRequired />;
  }

  // 3. 정상 로그인 사용자: 실제 본문 컴포넌트 렌더링
  return <>{children}</>;
}
