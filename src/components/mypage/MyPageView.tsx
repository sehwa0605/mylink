"use client";

// 리액트 기본 임포트
import React from "react";
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
// 프로필 수정 다이얼로그 모달 컴포넌트 임포트
import { ProfileEditDialog } from "@/components/profile/ProfileEditDialog";
// 7주차 인라인 링크 추가 폼 컴포넌트 임포트
import { AddLinkForm } from "@/components/link/AddLinkForm";
// 링크 세로 목록 컴포넌트 임포트
import { LinkList } from "@/components/link/LinkList";
// shadcn Card 컴포넌트 임포트
import { Card } from "@/components/ui/card";
// shadcn Avatar 컴포넌트 임포트
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// 기본 소개글 상수 임포트
import { DEFAULT_BIO } from "@/lib/usersFirestore";
// 링크 데이터 및 입력 타입 임포트
import type { Link } from "@/lib/types";
import type { LinkInput } from "@/lib/linksFirestore";

// 로그인한 소유자가 링크와 프로필을 총괄 관리하는 마이페이지 뷰 컴포넌트 (11주차)
export function MyPageView() {
  // 현재 로그인된 사용자 정보와 프로필 가져오기
  const { user, profile, displayName } = useUser();
  // 전역 React Query 클라이언트 인스턴스 획득
  const queryClient = useQueryClient();
  // 사용자의 UID (없으면 빈 문자열)
  const uid = user?.uid || "";

  // 현재 사용자 전용 링크 목록 조회 쿼리 (users/{uid}/links)
  const linksQuery = useLinksQuery(uid);
  // 새 링크 추가 뮤테이션 훅
  const addLinkMutation = useAddLinkMutation(uid);
  // 기존 링크 수정 뮤테이션 훅
  const updateLinkMutation = useUpdateLinkMutation(uid);
  // 기존 링크 삭제 뮤테이션 훅
  const deleteLinkMutation = useDeleteLinkMutation(uid);

  // 링크 추가 핸들러 (AddLinkForm과 연동)
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

  // 링크 클릭 핸들러 (마이페이지에서 직접 클릭 시에도 조회수 증가 및 캐시 즉시 갱신)
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

  // 사용자 정의 소개글 작성 여부 확인
  const isCustomBio = Boolean(profile?.bio && profile.bio !== DEFAULT_BIO);

  return (
    // 중앙 정렬 마이페이지 컨테이너
    <div className="w-full max-w-md mx-auto px-4 py-6 space-y-6">
      {/* 1. 상단 마이페이지 타이틀 및 프로필 카드 */}
      <Card className="w-full bg-card rounded-3xl p-6 border border-border shadow-md space-y-4 text-left">
        {/* 헤더 타이틀 및 프로필 수정 버튼 */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">
            마이페이지
          </h2>
          {/* 프로필 수정 모달 호출 버튼 */}
          <ProfileEditDialog profile={profile} />
        </div>

        {/* 프로필 정보 섹션: 아바타, 이름, 핸들, 소개글 */}
        <div className="flex items-start gap-4">
          {/* 아바타 이미지 */}
          <Avatar className="size-16 rounded-full border-2 border-primary/20 shrink-0">
            {profile?.photoURL && (
              <AvatarImage
                src={profile.photoURL}
                alt={displayName}
                referrerPolicy="no-referrer"
              />
            )}
            <AvatarFallback className="text-lg bg-primary text-primary-foreground font-bold">
              {displayName.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* 프로필 상세 텍스트 */}
          <div className="flex flex-col min-w-0 flex-1 space-y-1">
            {/* 실명 또는 닉네임 */}
            <h3 className="text-lg font-bold text-foreground truncate">
              {profile?.username || displayName}
            </h3>
            {/* 고유 핸들명 */}
            <p className="text-xs font-mono font-semibold text-accent truncate">
              @{displayName}
            </p>
            {/* 한 줄 소개글 (미작성 시 흐린 기울임꼴 안내 문구 노출) */}
            <p className="text-xs text-muted-foreground pt-1 break-words">
              {isCustomBio ? (
                <span className="font-semibold text-foreground">{profile?.bio}</span>
              ) : (
                <span className="italic text-muted-foreground/75 font-normal">
                  {DEFAULT_BIO}
                </span>
              )}
            </p>
          </div>
        </div>
      </Card>

      {/* 2. 페이지 안에 바로 삽입되는 링크 추가 폼 (AddLinkForm) */}
      <div className="w-full">
        <AddLinkForm onAdd={handleAddLink} />
      </div>

      {/* 3. 내 링크 목록 및 관리 섹션 (수정/삭제 지원) */}
      <div className="w-full space-y-3 text-left">
        {/* 섹션 헤더: 링크 개수 요약 */}
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-foreground">
            내 링크 {linksQuery.data ? `${linksQuery.data.length}개` : ""}
          </h3>
          <span className="text-[11px] text-muted-foreground">
            위에서부터 공개 페이지에 보이는 순서
          </span>
        </div>

        {/* 주인 모드(ownerUid)가 활성화된 링크 목록 컴포넌트 */}
        <LinkList
          links={linksQuery.data ?? []}
          loading={linksQuery.isFetching}
          ownerUid={uid}
          onUpdateLink={handleUpdateLink}
          onDeleteLink={handleDeleteLink}
          onLinkClick={handleLinkClick}
          emptyMessage="아직 링크가 없어요. 위에서 추가해 보세요."
        />
      </div>
    </div>
  );
}
