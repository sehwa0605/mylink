import React from "react";
// 링크 데이터 인터페이스 임포트
import type { Link } from "@/lib/types";
// 개별 링크 버튼 컴포넌트 임포트
import { LinkButton } from "./LinkButton";
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

// LinkList 컴포넌트 Props 인터페이스 정의
export interface LinkListProps {
  // 렌더링할 링크 목록 배열
  links: Link[];
  // 링크가 없을 때 표시할 커스텀 안내 문구
  emptyMessage?: string;
  // Firestore 또는 쿼리 페칭 진행 여부 플래그
  loading?: boolean;
  // 링크 클릭 시 실행할 부모 콜백
  onLinkClick?: (link: Link) => void;
  // 컨테이너 추가 스타일 클래스명
  className?: string;
}

// 링크 버튼 세로 목록 컴포넌트 (가이드 9주차: 스피너 및 비활성화 로딩 상태 지원)
export function LinkList({
  links,
  emptyMessage = "아직 등록된 링크가 없어요.",
  loading = false,
  onLinkClick,
  className,
}: LinkListProps) {
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

  // 3. 링크 데이터가 존재하는 경우 (로딩 중이면 흐리게 + 클릭 차단 처리)
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
        {links.map((link) => (
          <LinkButton
            key={link.id}
            link={link}
            onClick={() => onLinkClick?.(link)}
          />
        ))}
      </div>
    </div>
  );
}
