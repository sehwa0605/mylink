"use client";

// 리액트 기본 임포트
import * as React from "react";
// TanStack Query 공급자 컴포넌트 임포트
import { QueryClientProvider } from "@tanstack/react-query";
// 클라이언트 쿼리 클라이언트 획득 유틸리티 임포트
import { getQueryClient } from "@/lib/queryClient";

// QueryProvider 컴포넌트 Props 인터페이스 정의
export interface QueryProviderProps {
  // 하위 자식 컴포넌트 트리
  children: React.ReactNode;
}

// 앱 전역에 TanStack Query 컨텍스트를 제공하는 클라이언트 래퍼 컴포넌트
export function QueryProvider({ children }: QueryProviderProps) {
  // 싱글톤 브라우저 QueryClient 인스턴스 가져오기
  const queryClient = getQueryClient();

  return (
    // React Query 캐시 컨텍스트 공급
    <QueryClientProvider client={queryClient}>
      {/* 자식 컴포넌트들 렌더링 */}
      {children}
    </QueryClientProvider>
  );
}
