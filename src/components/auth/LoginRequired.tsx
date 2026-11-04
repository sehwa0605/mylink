"use client";

// 리액트 기본 임포트
import React from "react";
// shadcn Card 컴포넌트 임포트
import { Card } from "@/components/ui/card";
// 구글 소셜 로그인 버튼 임포트
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
// 자물쇠 아이콘 임포트
import { Lock } from "lucide-react";

// 비로그인 상태에서 보호된 페이지 접근 시 노출하는 로그인 안내 컴포넌트 (11주차)
export function LoginRequired() {
  return (
    // 중앙 정렬 안내 컨테이너
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col items-center justify-center">
      {/* 안내 카드 박스 */}
      <Card className="w-full bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-lg text-center space-y-5">
        {/* 자물쇠 원형 아이콘 영역 */}
        <div className="size-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-inner">
          <Lock className="size-8 stroke-[2.2]" />
        </div>

        {/* 텍스트 메시지 영역 */}
        <div className="space-y-2">
          {/* 타이틀 */}
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">
            로그인이 필요해요
          </h2>
          {/* 상세 안내 문구 */}
          <p className="text-sm text-muted-foreground leading-relaxed break-keep">
            Google 계정으로 로그인하면 나만의 링크를 추가·수정·삭제할 수 있어요.
            링크는 내 계정에만 따로 저장되어 다른 사람의 링크와 섞이지 않아요.
          </p>
        </div>

        {/* 대형 구글 로그인 버튼 */}
        <div className="pt-2 w-full flex justify-center">
          <GoogleLoginButton variant="landing" className="w-full" />
        </div>
      </Card>
    </div>
  );
}
