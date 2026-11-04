"use client";

// 리액트 기본 훅 임포트
import React from "react";
// Next.js 라우팅용 Link 컴포넌트 임포트
import Link from "next/link";
// 현재 브라우저 URL 경로 추출용 훅 임포트
import { usePathname } from "next/navigation";
// shadcn Card 컴포넌트 임포트
import { Card } from "@/components/ui/card";
// shadcn buttonVariants 유틸리티 임포트
import { buttonVariants } from "@/components/ui/button";
// Lucide 아이콘 임포트
import { SearchX, Home, AlertCircle } from "lucide-react";
// 클래스 유틸리티 함수 임포트
import { cn } from "@/lib/utils";

// 존재하지 않는 공개 페이지 주소 접속 시 노출되는 스위치 네온 테마 404 뷰 컴포넌트 (12주차)
export function ProfileNotFound() {
  // 현재 URL 경로 가져오기 (예: "/unknown")
  const pathname = usePathname() || "";
  // 앞쪽 슬래시(/)를 제거하고 디코딩하여 실제 입력된 사용자 핸들명 추출
  const rawHandle = pathname.replace(/^\/+/, "");
  // URI 디코딩 처리
  const handle = decodeURIComponent(rawHandle);

  return (
    // 화면 중앙 정렬 404 메인 컨테이너
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      {/* 404 안내 카드 */}
      <Card className="w-full max-w-md bg-card border border-border shadow-lg rounded-3xl p-6 sm:p-8 text-center space-y-6">
        {/* 상단 닌텐도 스위치 감성의 듀얼 네온 데코레이션 */}
        <div className="flex justify-center items-center gap-2" aria-hidden="true">
          {/* 네온 레드 닷 */}
          <span className="size-3 rounded-full bg-primary animate-pulse" />
          {/* 네온 블루 닷 */}
          <span className="size-3 rounded-full bg-accent animate-pulse" />
        </div>

        {/* 대형 404 타이틀 (네온 그라데이션) */}
        <div className="space-y-2">
          {/* 404 숫자 헤딩 */}
          <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-foreground">
            <span className="text-primary">4</span>
            <span className="text-muted-foreground">0</span>
            <span className="text-accent">4</span>
          </h1>
          {/* 주요 에러 메시지 */}
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            페이지를 찾을 수 없어요
          </h2>
        </div>

        {/* 사용자가 입력한 잘못된 주소 안내 상자 */}
        <div className="bg-muted/60 border border-border rounded-2xl p-4 text-left space-y-2">
          {/* 안내 라벨 */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <SearchX className="size-4 text-primary shrink-0" />
            <span>요청하신 주소</span>
          </div>
          {/* 입력된 주소 코드 블록 */}
          <p className="font-mono text-sm font-bold text-foreground break-all bg-background/80 px-3 py-2 rounded-xl border border-border/60">
            /{handle || "..."}
          </p>
          {/* 상세 안내 문구 */}
          <div className="flex items-start gap-1.5 text-xs text-muted-foreground pt-1">
            <AlertCircle className="size-3.5 text-accent shrink-0 mt-0.5" />
            <span>
              존재하지 않는 사용자 주소예요. 주소(Username)의 철자를 다시 확인해 주세요.
            </span>
          </div>
        </div>

        {/* 첫 화면으로 돌아가기 버튼 */}
        <div className="pt-2">
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: "default" }),
              "w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold shadow-sm hover:bg-primary/90 flex items-center justify-center gap-2 cursor-pointer"
            )}
          >
            <Home className="size-4" />
            <span>홈으로 가기</span>
          </Link>
        </div>
      </Card>
    </div>
  );
}
