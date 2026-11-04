"use client";

// 리액트 및 상태 관리 훅 임포트
import React, { useState } from "react";
// 재사용 가능한 프로필 헤더 컴포넌트 임포트
import { ProfileHeader } from "@/components/profile/ProfileHeader";
// 재사용 가능한 링크 목록 컴포넌트 임포트
import { LinkList } from "@/components/link/LinkList";
// 7주차 링크 추가 모달 다이얼로그 컴포넌트 임포트
import { AddLinkDialog } from "@/components/link/AddLinkDialog";
// 5주차에 작성한 샘플 목업 링크 데이터 임포트
import { sampleLinks } from "@/lib/sampleLinks";
// shadcn Button 컴포넌트 임포트
import { Button } from "@/components/ui/button";
// shadcn Card 컴포넌트 임포트
import { Card } from "@/components/ui/card";
// 링크 데이터 타입 임포트
import type { Link } from "@/lib/types";
// 루시드 공유 및 체크 아이콘 임포트
import { Share2, Check } from "lucide-react";

// 메인 홈 화면 뷰 컴포넌트 (가이드 4장 4-5 위치: src/components/home/HomeView.tsx)
export function HomeView() {
  // 화면 안에서 추가된 링크를 관리하기 위한 React State (초기값: sampleLinks)
  const [links, setLinks] = useState<Link[]>(sampleLinks);
  // 프로필 주소 클립보드 복사 여부 상태
  const [copied, setCopied] = useState(false);

  // 새 링크를 목록 맨 위에 추가하는 핸들러 (7주차: 화면 상태로만 유지)
  const handleAddLink = (newLink: Omit<Link, "id">) => {
    // 고유한 임시 ID와 생성 시각을 부여한 새 링크 객체 생성
    const linkItem: Link = {
      // 임시 고유 ID로 현재 밀리초 타임스탬프 활용
      id: `link-${Date.now()}`,
      // 입력받은 링크 제목
      title: newLink.title,
      // 정규화된 링크 URL
      url: newLink.url,
      // 생성 시각 타임스탬프
      createdAt: Date.now(),
    };
    // 기존 목록 맨 앞에 새 링크를 배치(최신순)
    setLinks((prev) => [linkItem, ...prev]);
  };

  // 프로필 공유 버튼 클릭 핸들러 (모바일 네이티브 공유 및 데스크톱 클립보드 복사 폴백)
  const handleShare = async () => {
    // navigator.share API 지원 여부 확인
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        // 모바일 시스템 공유 다이얼로그 호출
        await navigator.share({
          title: "양세화 | mylink",
          text: "유기나노공학을 공부하며 아이디어를 코드로 만듭니다.",
          url: window.location.href,
        });
      } catch (e) {
        // 사용자가 공유 창을 직접 닫거나 취소한 경우 조용히 무시
        if (e instanceof DOMException && e.name === "AbortError") {
          return;
        }
        // 공유 API 실패 시 클립보드 복사로 폴백
        copyToClipboard();
      }
    } else {
      // API 미지원 브라우저는 클립보드 복사 실행
      copyToClipboard();
    }
  };

  // 현재 브라우저 주소를 클립보드에 복사하는 함수
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

        {/* 2. 7주차: 링크 추가 버튼 (모달 다이얼로그 호출) */}
        <div className="w-full mb-4">
          <AddLinkDialog onAdd={handleAddLink} />
        </div>

        {/* 3. 재사용 가능한 링크 버튼 세로 목록 컴포넌트 (상태 links 연동) */}
        <div className="w-full mb-6">
          <LinkList links={links} />
        </div>

        {/* 4. shadcn Button 부품 기반의 프로필 공유 버튼 */}
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
