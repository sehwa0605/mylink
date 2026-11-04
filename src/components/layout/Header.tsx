"use client";

// 리액트 기본 임포트
import React from "react";
// Next.js Link 컴포넌트 임포트
import Link from "next/link";
// 현재 URL 경로 감지를 위한 훅 임포트
import { usePathname } from "next/navigation";
// 구글 로그인 상태 감지 및 구독 훅 임포트
import { useAuthListener } from "@/store/useAuthStore";
// 사용자 상태 훅 임포트
import { useUser } from "@/hooks/useUser";
// 구글 소셜 로그인 버튼 임포트
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
// 프로필 드롭다운 메뉴 컴포넌트 임포트
import { ProfileMenu } from "@/components/layout/ProfileMenu";
// shadcn buttonVariants 임포트
import { buttonVariants } from "@/components/ui/button";
// 로딩 스켈레톤 컴포넌트 임포트
import { Skeleton } from "@/components/ui/skeleton";
// 클래스 병합 유틸리티 함수 임포트
import { cn } from "@/lib/utils";
// 루시드 외부 링크 아이콘 임포트
import { ExternalLink } from "lucide-react";

// 전역 최상단 고정 헤더 컴포넌트 (가이드 11주차: sticky top-0, 탭 네비게이션)
export function Header() {
  // 앱 전체에서 단 1회 구글 인증 변경 상태를 구독하는 리스너 등록
  useAuthListener();

  // 사용자 계정 및 준비 상태 가져오기
  const { user, authReady, pagePath } = useUser();
  // 현재 접속 중인 경로 감지
  const pathname = usePathname();

  // 마이페이지 탭 활성화 여부 (/ 또는 /mypage)
  const isMyPageActive = pathname === "/" || pathname === "/mypage";
  // 통계 탭 활성화 여부 (/stats)
  const isStatsActive = pathname === "/stats";

  return (
    // 최상단 고정 헤더 래퍼 (배경 블러 및 테두리 효과)
    <header className="sticky top-0 z-40 w-full bg-background/85 backdrop-blur-md border-b border-border shadow-xs">
      {/* 1. 상단 기본 메인 헤더 바 */}
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* 좌측 서비스 로고: / 링크 (마우스 오버 시 밑줄 효과) */}
        <Link
          href="/"
          aria-label="mylink 첫 화면으로"
          className="flex items-center gap-2 group select-none cursor-pointer"
        >
          {/* 닌텐도 스위치 조이콘 감성의 듀얼 컬러 네온 도트 */}
          <div className="flex gap-1" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-primary" />
            <span className="size-2.5 rounded-full bg-accent" />
          </div>
          {/* mylink 텍스트 로고 */}
          <span className="font-extrabold text-xl tracking-tight text-foreground group-hover:underline underline-offset-4">
            mylink
          </span>
        </Link>

        {/* 우측 사용자 액션 영역 (로그인 상태에 따라 분기) */}
        <div className="flex items-center gap-2.5">
          {/* 인증 상태 로딩 중(authReady false): 깜빡임 방지용 스켈레톤 자리표시 */}
          {!authReady ? (
            <Skeleton className="h-9 w-28 rounded-xl" />
          ) : !user ? (
            // 비로그인 상태: [Google로 로그인] 버튼 노출
            <GoogleLoginButton variant="header" />
          ) : (
            // 로그인 상태: [🏠 내 페이지] 새 탭 링크 + 프로필 드롭다운 메뉴
            <>
              {/* 내 공개 페이지 바로가기 버튼 (새 탭 열림) */}
              <a
                href={pagePath}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "h-9 px-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90 flex items-center gap-1.5 cursor-pointer"
                )}
              >
                <span>🏠 내 페이지</span>
                <ExternalLink className="size-3 text-primary-foreground/80" />
              </a>

              {/* 프로필 아바타 드롭다운 메뉴 */}
              <ProfileMenu />
            </>
          )}
        </div>
      </div>

      {/* 2. 로그인된 사용자에게만 노출되는 헤더 하단 네비게이션 탭 바 */}
      {authReady && user && (
        <div className="max-w-4xl mx-auto px-4 border-t border-border/50 h-10 flex items-center gap-1.5 overflow-x-auto text-xs">
          {/* 마이페이지 이동 탭 */}
          <Link
            href="/"
            aria-current={isMyPageActive ? "page" : undefined}
            className={cn(
              "px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer",
              isMyPageActive
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <span>👤 마이페이지</span>
          </Link>

          {/* 통계 페이지 이동 탭 (13주차 구현) */}
          <Link
            href="/stats"
            aria-current={isStatsActive ? "page" : undefined}
            className={cn(
              "px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer",
              isStatsActive
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <span>📊 통계</span>
          </Link>
        </div>
      )}
    </header>
  );
}
