"use client";

// 리액트 기본 훅 임포트
import React, { useState } from "react";
// 링크 데이터 인터페이스 임포트
import type { Link } from "@/lib/types";
// 개별 링크 버튼 컴포넌트 임포트
import { LinkButton } from "./LinkButton";
// 10주차 인라인 수정 폼 컴포넌트 임포트
import { EditLinkForm } from "./EditLinkForm";
// 10주차 삭제 확인 다이얼로그 모달 컴포넌트 임포트
import { DeleteLinkDialog } from "./DeleteLinkDialog";
// shadcn 빈 상태 표시 컴포넌트 임포트
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
// 로딩 스켈레톤 컴포넌트 임포트
import { Skeleton } from "@/components/ui/skeleton";
// 루시드 링크 아이콘 및 스피너 로더 아이콘 임포트
import { Link2, Loader2 } from "lucide-react";
// 클래스 유틸리티 함수 임포트
import { cn } from "@/lib/utils";

// LinkList 컴포넌트 Props 인터페이스 정의 (10주차: ownerUid 및 수정/삭제 핸들러 추가)
export interface LinkListProps {
  // 렌더링할 링크 목록 배열
  links: Link[];
  // 링크가 없을 때 표시할 커스텀 안내 문구
  emptyMessage?: string;
  // Firestore 또는 쿼리 페칭 진행 여부 플래그
  loading?: boolean;
  // 소유자 모드 식별자 (있을 경우 수정/삭제 버튼 및 폼 활성화)
  ownerUid?: string;
  // 링크 수정 실행 콜백 함수
  onUpdateLink?: (id: string, input: { title: string; url: string }) => Promise<void> | void;
  // 링크 삭제 실행 콜백 함수
  onDeleteLink?: (id: string) => Promise<void> | void;
  // 링크 클릭 시 실행할 부모 콜백
  onLinkClick?: (link: Link) => void;
  // 컨테이너 추가 스타일 클래스명
  className?: string;
}

// 링크 버튼 세로 목록 컴포넌트 (가이드 10주차: 인라인 수정 폼 및 삭제 확인 모달 연동)
export function LinkList({
  links,
  emptyMessage = "아직 등록된 링크가 없어요.",
  loading = false,
  ownerUid,
  onUpdateLink,
  onDeleteLink,
  onLinkClick,
  className,
}: LinkListProps) {
  // 현재 인라인 수정 폼이 활성화된 링크 ID 상태 (한 번에 하나만 수정 가능)
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  // 현재 삭제 확인 모달에 전달할 대상 링크 객체 상태
  const [deletingLink, setDeletingLink] = useState<Link | null>(null);

  // 1. 데이터가 완전히 비어 있고 로딩 중일 때: 회색 자리표시(스켈레톤) 3줄 노출
  if (loading && (!links || links.length === 0)) {
    return (
      <div className={cn("flex flex-col gap-3 w-full", className)} role="status" aria-busy="true">
        {/* 상단 도는 스피너 + 불러오는 중 안내 바 */}
        <div className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-muted-foreground animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
          <span>링크를 불러오는 중…</span>
        </div>
        {/* 1번째 링크 스켈레톤 박스 */}
        <Skeleton className="w-full h-14 rounded-2xl" />
        {/* 2번째 링크 스켈레톤 박스 */}
        <Skeleton className="w-full h-14 rounded-2xl" />
        {/* 3번째 링크 스켈레톤 박스 */}
        <Skeleton className="w-full h-14 rounded-2xl" />
        {/* 스크린 리더 안내용 문구 */}
        <span className="sr-only">링크 목록을 불러오는 중...</span>
      </div>
    );
  }

  // 2. 로딩이 아니면서 링크가 0개일 때: Empty 컴포넌트로 비어 있음 안내 표시
  if (!loading && (!links || links.length === 0)) {
    return (
      <Empty className={cn("border-2 border-dashed border-border rounded-2xl py-8 my-2", className)}>
        {/* 빈 상태 아이콘 영역 */}
        <EmptyMedia variant="icon">
          <Link2 className="size-4 text-muted-foreground" />
        </EmptyMedia>
        {/* 빈 상태 헤더 */}
        <EmptyHeader>
          {/* 빈 상태 제목 */}
          <EmptyTitle>링크가 비어 있습니다</EmptyTitle>
          {/* 빈 상태 설명 문구 */}
          <EmptyDescription>{emptyMessage}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  // 3. 링크 데이터가 존재하는 경우 (수정/삭제 모달 및 리스트 렌더링)
  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      {/* 다시 불러오는 중일 때 상단에 작은 스피너 알림 표시 */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-1 text-xs font-semibold text-muted-foreground animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
          <span>링크를 불러오는 중…</span>
        </div>
      )}

      {/* 로딩 중이면 opacity-50 및 pointer-events-none 적용 */}
      <div
        className={cn(
          "flex flex-col gap-3 w-full transition-opacity duration-200",
          loading && "opacity-50 pointer-events-none"
        )}
      >
        {/* 링크 목록 순회 렌더링 */}
        {links.map((link) => {
          // 해당 링크가 현재 인라인 수정 중인 상태인지 확인
          const isEditing = editingLinkId === link.id;

          // 수정 중이면 카드를 EditLinkForm 인라인 수정 폼으로 교체 렌더링
          if (isEditing) {
            return (
              <EditLinkForm
                key={link.id}
                link={link}
                onSave={async (input) => {
                  // 부모 수정 핸들러 실행
                  await onUpdateLink?.(link.id, input);
                  // 수정 모드 종료
                  setEditingLinkId(null);
                }}
                onCancel={() => setEditingLinkId(null)}
              />
            );
          }

          // 기본 상태이면 LinkButton 렌더링 (ownerUid가 있으면 수정/삭제 버튼 포함)
          return (
            <LinkButton
              key={link.id}
              link={link}
              ownerUid={ownerUid}
              onEdit={() => setEditingLinkId(link.id)}
              onDelete={() => setDeletingLink(link)}
              onClick={() => onLinkClick?.(link)}
            />
          );
        })}
      </div>

      {/* 목록 전체가 공유하는 단일 삭제 확인 다이얼로그 모달 */}
      <DeleteLinkDialog
        link={deletingLink}
        open={Boolean(deletingLink)}
        onOpenChange={(open) => {
          // 모달 닫힐 때 선택된 삭제 대상 링크 초기화
          if (!open) {
            setDeletingLink(null);
          }
        }}
        onConfirmDelete={async (linkId) => {
          // 부모 삭제 핸들러 실행
          await onDeleteLink?.(linkId);
          // 삭제 대상 링크 상태 초기화
          setDeletingLink(null);
        }}
      />
    </div>
  );
}
