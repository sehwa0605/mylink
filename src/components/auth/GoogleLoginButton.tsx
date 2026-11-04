"use client";

// 리액트 기본 임포트
import React from "react";
// shadcn Button 컴포넌트 임포트
import { Button } from "@/components/ui/button";
// Zustand 인증 스토어 임포트
import { useAuthStore } from "@/store/useAuthStore";
// 구글 공식 브랜드 SVG 경로 (simple-icons) 임포트
import { siGoogle } from "simple-icons";
// 스피너 로더 아이콘 임포트
import { Loader2 } from "lucide-react";
// 클래스 병합 유틸리티 함수 임포트
import { cn } from "@/lib/utils";

// GoogleLoginButton 컴포넌트 Props 인터페이스 정의
export interface GoogleLoginButtonProps {
  // 버튼 표시 위치에 따른 스타일 변형 (헤더용 소형 / 랜딩용 대형)
  variant?: "header" | "landing";
  // 추가 스타일 클래스명
  className?: string;
}

// 구글 소셜 로그인 전용 액션 버튼 컴포넌트 (11주차)
export function GoogleLoginButton({
  variant = "header",
  className,
}: GoogleLoginButtonProps) {
  // 구글 로그인 함수 구독
  const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle);
  // 로그인 팝업 활성화 여부 상태 구독
  const signingIn = useAuthStore((state) => state.signingIn);

  // 랜딩 페이지용 큰 버튼 스타일 분기
  const isLanding = variant === "landing";

  return (
    // 로그인 버튼 (진행 중일 때 비활성화 처리)
    <Button
      type="button"
      disabled={signingIn}
      onClick={() => signInWithGoogle()}
      className={cn(
        // 기본 플렉스 정렬 및 커서 포인터 스타일
        "flex items-center justify-center font-bold transition-all cursor-pointer select-none",
        // 랜딩 페이지 전용 대형 버튼 스타일
        isLanding
          ? "h-12 px-6 rounded-2xl bg-foreground text-background hover:bg-foreground/90 text-base shadow-md hover:shadow-lg active:scale-[0.98] gap-3 w-full sm:w-auto"
          // 헤더 전용 컴팩트 버튼 스타일
          : "h-9 px-3.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs shadow-xs gap-2",
        className
      )}
    >
      {/* 로그인 팝업 처리 중일 때: 스피너와 '로그인 중…' 텍스트 노출 */}
      {signingIn ? (
        <>
          <Loader2 className={cn("animate-spin text-muted-foreground", isLanding ? "size-5" : "size-4")} />
          <span>로그인 중…</span>
        </>
      ) : (
        // 대기 상태일 때: 공식 구글 G 로고와 로그인 안내 텍스트 노출
        <>
          {/* 구글 공식 브랜드 로고 SVG (공식 브랜드 색상 #4285F4 적용) */}
          <svg
            role="img"
            viewBox="0 0 24 24"
            className={cn("shrink-0 fill-[#4285F4]", isLanding ? "size-5" : "size-4")}
            aria-hidden="true"
          >
            <path d={siGoogle.path} />
          </svg>
          {/* 문구 분기: 랜딩은 'Google로 계속하기', 헤더는 'Google로 로그인' */}
          <span>{isLanding ? "Google로 계속하기" : "Google로 로그인"}</span>
        </>
      )}
    </Button>
  );
}
