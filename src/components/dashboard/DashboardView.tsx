"use client";

// 리액트 기본 임포트
import React from "react";
// Next.js Link 컴포넌트 임포트 (NextLink 별칭 사용)
import NextLink from "next/link";
// React Query 클라이언트 훅 임포트
import { useQueryClient } from "@tanstack/react-query";
// 사용자 상태 훅 임포트
import { useUser } from "@/hooks/useUser";
// TanStack Query 링크 조회 및 뮤테이션 훅, 쿼리 키 임포트
import {
  useLinksQuery,
  useAddLinkMutation,
  useUpdateLinkMutation,
  useDeleteLinkMutation,
  queryKeys,
} from "@/lib/queries";
// 링크 클릭 수 증가 API 임포트
import { incrementClickCount } from "@/lib/linksFirestore";
// 링크 추가 모달 다이얼로그 컴포넌트 임포트
import { AddLinkDialog } from "@/components/link/AddLinkDialog";
// 링크 세로 목록 컴포넌트 임포트
import { LinkList } from "@/components/link/LinkList";
// shadcn Card 컴포넌트 임포트
import { Card } from "@/components/ui/card";
// shadcn Button 및 buttonVariants 임포트
import { buttonVariants } from "@/components/ui/button";
// 클래스 병합 유틸리티 함수 임포트
import { cn } from "@/lib/utils";
// 루시드 아이콘 임포트
import { ExternalLink, Layers } from "lucide-react";
// 링크 데이터 및 입력 타입 임포트
import type { Link } from "@/lib/types";
import type { LinkInput } from "@/lib/linksFirestore";

// 대시보드 화면 뷰 컴포넌트 (가이드 11주차: /dashboard)
export function DashboardView() {
  // 전역 React Query 클라이언트 획득
  const queryClient = useQueryClient();
  // 현재 로그인 사용자 정보 및 경로 획득
  const { user, pagePath } = useUser();
  // 사용자의 UID
  const uid = user?.uid || "";

  // 현재 사용자 전용 링크 목록 조회
  const linksQuery = useLinksQuery(uid);
  // 뮤테이션 훅들
  const addLinkMutation = useAddLinkMutation(uid);
  const updateLinkMutation = useUpdateLinkMutation(uid);
  const deleteLinkMutation = useDeleteLinkMutation(uid);

  // 링크 추가 핸들러
  const handleAddLink = async (newLink: Omit<Link, "id">) => {
    await addLinkMutation.mutateAsync({
      title: newLink.title,
      url: newLink.url,
    });
  };

  // 링크 수정 핸들러
  const handleUpdateLink = async (id: string, input: LinkInput) => {
    await updateLinkMutation.mutateAsync({ id, input });
  };

  // 링크 삭제 핸들러
  const handleDeleteLink = async (id: string) => {
    await deleteLinkMutation.mutateAsync(id);
  };

  // 링크 클릭 핸들러 (대시보드에서 클릭 시에도 조회수 증가 및 캐시 즉시 갱신)
  const handleLinkClick = async (link: Link) => {
    if (!uid) return;
    try {
      await incrementClickCount(uid, link.id);
      // 화면에 즉시 반영되도록 캐시 무효화
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.links(uid) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.publicPageAll }),
      ]);
    } catch (err) {
      console.error("클릭 수 증가 실패:", err);
    }
  };

  return (
    // 중앙 정렬 대시보드 컨테이너
    <div className="w-full max-w-md mx-auto px-4 py-6 space-y-5 text-left">
      {/* 1. 대시보드 헤더 영역: 제목 및 내 페이지 바로가기 버튼 */}
      <div className="flex items-center justify-between">
        {/* 화면 제목 */}
        <div className="flex items-center gap-2">
          <Layers className="size-5 text-primary" />
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">
            대시보드
          </h2>
        </div>

        {/* 내 공개 페이지 바로보기 링크 버튼 */}
        <NextLink
          href={pagePath}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-8 px-3 rounded-xl border-border hover:bg-muted text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          )}
        >
          <span>내 페이지 보기</span>
          <ExternalLink className="size-3 text-muted-foreground" />
        </NextLink>
      </div>

      {/* 2. 내 링크 관리 대시보드 카드 */}
      <Card className="w-full bg-card rounded-3xl p-5 sm:p-6 border border-border shadow-md space-y-4">
        {/* 카드 헤더 및 [링크 추가] 모달 호출 버튼 */}
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div>
            <h3 className="text-base font-bold text-foreground">
              내 링크 ({linksQuery.data?.length ?? 0}개)
            </h3>
            <p className="text-[11px] text-muted-foreground">
              위에서부터 공개 페이지에 보이는 순서
            </p>
          </div>

          {/* 링크 추가 모달 다이얼로그 */}
          <AddLinkDialog onAdd={handleAddLink} />
        </div>

        {/* 주인 모드 링크 목록 컴포넌트 */}
        <LinkList
          links={linksQuery.data ?? []}
          loading={linksQuery.isFetching}
          ownerUid={uid}
          onUpdateLink={handleUpdateLink}
          onDeleteLink={handleDeleteLink}
          onLinkClick={handleLinkClick}
          emptyMessage="아직 링크가 없어요. '링크 추가'를 눌러 보세요."
        />
      </Card>
    </div>
  );
}
