"use client";

import React, { useState } from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { LinkList } from "@/components/link/LinkList";
import { sampleLinks } from "@/lib/sampleLinks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Check } from "lucide-react";

// 6주차: shadcn/ui 컴포넌트와 토큰 기반 디자인으로 리팩터링된 메인 프로필 화면
export default function Home() {
  // 링크 주소 복사 여부 상태
  const [copied, setCopied] = useState(false);

  // 공유 버튼 클릭 핸들러 (모바일 네이티브 공유 및 클립보드 복사 폴백)
  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "양세화 | mylink",
          text: "유기나노공학을 공부하며 아이디어를 코드로 만듭니다.",
          url: window.location.href,
        });
      } catch (e) {
        // 사용자가 공유 창을 닫은 경우 조용히 종료
        if (e instanceof DOMException && e.name === "AbortError") {
          return;
        }
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  // 클립보드 복사 실행
  const copyToClipboard = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    // 모바일 우선 레이아웃: 배경 토큰(bg-background)과 중앙 정렬, 좌우 여백(px-4)
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      {/* 프로필 카드 컨테이너: 최대 가로폭 max-w-md(448px), 토큰 기반 모서리와 테두리 */}
      <Card className="w-full max-w-md bg-card rounded-3xl p-6 sm:p-8 shadow-lg border border-border relative overflow-hidden">
        {/* 상단 스위치 콘솔 데코레이션 바: 좌측 닌텐도 레드(bg-primary) & 우측 네온 블루(bg-accent) */}
        <div className="absolute top-0 left-0 right-0 h-2 flex" aria-hidden="true">
          <div className="w-1/2 bg-primary" />
          <div className="w-1/2 bg-accent" />
        </div>

        {/* 1. 재사용 가능한 프로필 상단 헤더 컴포넌트 */}
        <ProfileHeader
          name="양세화"
          username="Sehwa Yang"
          bio="유기나노공학을 공부하며 아이디어를 코드로 만듭니다."
        />

        {/* 2. 재사용 가능한 링크 버튼 세로 목록 컴포넌트 (샘플 목업 데이터 5개 연동) */}
        <div className="w-full mb-6">
          <LinkList links={sampleLinks} />
        </div>

        {/* 3. shadcn Button 부품 기반의 프로필 공유 버튼 */}
        <div className="w-full pt-1">
          <Button
            type="button"
            variant="default"
            className="w-full h-12 rounded-2xl bg-foreground hover:bg-foreground/90 text-background font-bold text-sm tracking-wide shadow-md transition-all active:scale-[0.98] cursor-pointer"
            onClick={handleShare}
          >
            {copied ? (
              <>
                <Check className="size-4 mr-2" />
                <span>주소가 복사되었습니다!</span>
              </>
            ) : (
              <>
                <Share2 className="size-4 mr-2" />
                <span>내 프로필 공유하기</span>
              </>
            )}
          </Button>
        </div>

        {/* 하단 푸터 표기 */}
        <p className="text-center text-xs font-semibold text-muted-foreground mt-6 select-none">
          mylink • Nintendo Switch Neon Theme
        </p>
      </Card>
    </main>
  );
}
