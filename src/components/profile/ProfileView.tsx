"use client";

// 리액트 기본 훅 임포트
import React from "react";
// Next.js 라우팅용 Link 컴포넌트 임포트
import Link from "next/link";
// React Query 공개 페이지 조회 훅 임포트
import { usePublicPageQuery } from "@/lib/queries";
// 링크 클릭 수 증가 API 임포트
import { incrementClickCount } from "@/lib/linksFirestore";
// 기본 소개글 상수 임포트
import { DEFAULT_BIO } from "@/lib/usersFirestore";
// 공개 페이지 타입 정의 임포트
import type { PublicPage } from "@/lib/types";
// 링크 세로 목록 컴포넌트 임포트
import { LinkList } from "@/components/link/LinkList";
// shadcn Card 컴포넌트 임포트
import { Card } from "@/components/ui/card";
// shadcn Avatar 컴포넌트 임포트
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// 로딩 스켈레톤 컴포넌트 임포트
import { Skeleton } from "@/components/ui/skeleton";
// Lucide 아이콘 임포트
import { Share2 } from "lucide-react";

// ProfileView 컴포넌트 Props 인터페이스 정의
export interface ProfileViewProps {
  // 공개 주소명(displayName)
  handle: string;
  // 서버 컴포넌트에서 전달받은 초기 데이터 (깜빡임 방지)
  initialPage?: PublicPage | null;
}

// 누구나 접속할 수 있는 퍼블릭 사용자 프로필 화면 컴포넌트 (12주차)
export function ProfileView({ handle, initialPage }: ProfileViewProps) {
  // React Query를 통해 공개 페이지 데이터 조회 (서버 초기 데이터 initialData 제공)
  const { data: page, isLoading } = usePublicPageQuery(handle, initialPage);

  // 로딩 중이고 캐시된 데이터가 전혀 없을 때 스켈레톤 자리표시 렌더링
  if (isLoading && !page) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-8 space-y-6">
        {/* 상단 프로필 카드 스켈레톤 */}
        <Card className="w-full bg-card rounded-3xl p-6 border border-border shadow-md space-y-4 text-center">
          <div className="flex flex-col items-center space-y-3">
            <Skeleton className="size-24 rounded-full" />
            <Skeleton className="h-6 w-36 rounded-lg" />
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-48 rounded-md" />
          </div>
        </Card>
        {/* 링크 목록 스켈레톤 3줄 */}
        <div className="space-y-3">
          <Skeleton className="w-full h-14 rounded-2xl" />
          <Skeleton className="w-full h-14 rounded-2xl" />
          <Skeleton className="w-full h-14 rounded-2xl" />
        </div>
      </div>
    );
  }

  // 표시할 프로필 객체 추출
  const profile = page?.profile;
  // 표시할 링크 목록 배열 추출
  const links = page?.links ?? [];
  // 표시할 사용자 이름 (실명 또는 displayName)
  const profileName = profile?.username || profile?.displayName || handle;
  // 사용자 정의 소개글 작성 여부 확인 (기본 문구인 경우 방문자에게 노출하지 않음)
  const isCustomBio = Boolean(profile?.bio && profile.bio !== DEFAULT_BIO);

  // 방문자가 링크를 클릭했을 때 실행되는 핸들러 (12/13주차)
  const handleLinkClick = (linkId: string) => {
    if (!page?.uid) return;
    // Firestore의 클릭 수 원자적 증가 함수를 비동기로 호출 (새 탭 이동을 방해하지 않음)
    incrementClickCount(page.uid, linkId).catch((err) => {
      console.error("클릭 수 증가 실패:", err);
    });
  };

  return (
    // 중앙 정렬 공개 페이지 컨테이너
    <div className="w-full max-w-md mx-auto px-4 py-8 space-y-6 text-center">
      {/* 1. 상단 프로필 헤더 카드 */}
      <Card className="w-full bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-md space-y-4">
        {/* 아바타 중앙 배치 */}
        <div className="flex justify-center">
          <Avatar className="size-24 rounded-full border-4 border-primary/20 shadow-sm">
            {profile?.photoURL && (
              <AvatarImage
                src={profile.photoURL}
                alt={profileName}
                referrerPolicy="no-referrer"
              />
            )}
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground font-extrabold">
              {handle.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* 이름 및 고유 핸들명 */}
        <div className="space-y-1">
          {/* 사용자 실명 또는 닉네임 */}
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight break-words">
            {profileName}
          </h1>
          {/* 공개 주소 핸들 (@아이디) */}
          <p className="text-xs font-mono font-semibold text-accent">
            @{handle}
          </p>
        </div>

        {/* 한 줄 소개 (기본 문구가 아닌 사용자가 직접 작성한 경우에만 노출) */}
        {isCustomBio && (
          <p className="text-sm text-muted-foreground font-medium pt-1 break-words">
            {profile?.bio}
          </p>
        )}
      </Card>

      {/* 2. 링크 목록 영역 (수정/삭제 권한 없는 순수 보기 전용 모드) */}
      <div className="w-full space-y-3">
        <LinkList
          links={links}
          emptyMessage="아직 등록된 링크가 없어요."
          onLinkClick={(link) => handleLinkClick(link.id)}
        />
      </div>

      {/* 3. 하단 mylink 브랜딩 푸터 */}
      <footer className="pt-6 pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors border border-border/50"
        >
          {/* 네온 도트 */}
          <span className="size-2 rounded-full bg-primary" />
          <span>나만의 마이링크 만들기</span>
          <Share2 className="size-3 text-accent" />
        </Link>
      </footer>
    </div>
  );
}
