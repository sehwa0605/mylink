"use client";

// 리액트 기본 임포트
import React from "react";
// shadcn Card 컴포넌트 임포트
import { Card } from "@/components/ui/card";
// 구글 소셜 로그인 버튼 임포트
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
// 루시드 스파클 및 링크 아이콘 임포트
import { Sparkles, Link as LinkIcon, ShieldCheck, Zap } from "lucide-react";

// 비로그인 사용자가 메인(/) 접속 시 노출되는 스위치 네온 감성의 랜딩 페이지 컴포넌트 (11주차)
export function LandingPage() {
  return (
    // 랜딩 페이지 중앙 정렬 컨테이너
    <div className="w-full max-w-xl mx-auto px-4 py-8 sm:py-16 flex flex-col items-center justify-center text-center space-y-8">
      {/* 1. 상단 스위치 듀얼 네온 배지 */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border shadow-xs select-none">
        {/* 레드 & 블루 조이콘 도트 */}
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-primary animate-pulse" />
          <span className="size-2.5 rounded-full bg-accent animate-pulse" />
        </div>
        {/* 뱃지 텍스트 */}
        <span className="text-xs font-bold text-foreground">
          아이디어를 코드로 연결하는 링크인바이오
        </span>
      </div>

      {/* 2. 대형 헤드라인 2줄 및 부제 영역 */}
      <div className="space-y-3">
        {/* 큰 헤드라인 2줄 */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight break-keep">
          내 모든 링크를 하나로, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-accent">
            나만의 스위치 네온 마이링크
          </span>
        </h1>
        {/* 부제 문구 */}
        <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-md mx-auto leading-relaxed break-keep">
          GitHub, 블로그, 포트폴리오를 한 페이지에 모아 나만의 주소로 세상과 공유해보세요.
        </p>
      </div>

      {/* 3. 구글 로그인 CTA 액션 버튼 */}
      <div className="w-full max-w-xs flex flex-col items-center gap-2">
        <GoogleLoginButton variant="landing" className="w-full" />
        <span className="text-[11px] text-muted-foreground">
          별도 가입 없이 Google 계정으로 즉시 시작하세요
        </span>
      </div>

      {/* 4. 서비스 핵심 기능 안내 박스 (가이드 요구 안내 카드) */}
      <Card className="w-full bg-card rounded-3xl p-6 sm:p-7 border border-border shadow-md text-left space-y-4">
        {/* 안내 카드 상단 헤더 */}
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
            <Sparkles className="size-4.5 stroke-[2.5]" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            로그인하면 이런 것들을 할 수 있어요
          </h3>
        </div>

        {/* 3가지 핵심 기능 안내 리스트 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* 포인트 1: 링크 모아보기 */}
          <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/50 space-y-1.5">
            <LinkIcon className="size-4 text-primary" />
            <h4 className="text-xs font-bold text-foreground">원클릭 링크 모음</h4>
            <p className="text-[11px] text-muted-foreground leading-normal break-keep">
              깃허브, 블로그 등 내 모든 링크를 깔끔하게 추가·수정할 수 있어요.
            </p>
          </div>

          {/* 포인트 2: 안전한 분리 저장 */}
          <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/50 space-y-1.5">
            <ShieldCheck className="size-4 text-accent" />
            <h4 className="text-xs font-bold text-foreground">안전한 내 계정 보관</h4>
            <p className="text-[11px] text-muted-foreground leading-normal break-keep">
              링크와 프로필은 내 구글 계정에만 안전하게 따로 저장돼요.
            </p>
          </div>

          {/* 포인트 3: 공유 주소 */}
          <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/50 space-y-1.5">
            <Zap className="size-4 text-amber-500" />
            <h4 className="text-xs font-bold text-foreground">나만의 고유 주소</h4>
            <p className="text-[11px] text-muted-foreground leading-normal break-keep">
              이메일 아이디 기반의 고유한 공개 링크(/{`내아이디`})를 제공해요.
            </p>
          </div>
        </div>

        {/* 하단 요약 문구 */}
        <p className="text-xs text-muted-foreground pt-1 border-t border-border/60">
          🔒 로그인하면 깃허브·블로그 같은 내 링크를 한 페이지에 모아 추가·수정·삭제할 수 있어요. 링크는 내 계정에만 따로 저장돼요.
        </p>
      </Card>
    </div>
  );
}
