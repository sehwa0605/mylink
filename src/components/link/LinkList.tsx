import React from "react";
import type { Link } from "@/lib/types";
import { LinkButton } from "./LinkButton";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkListProps {
  links: Link[];
  emptyMessage?: string;
  loading?: boolean;
  onLinkClick?: (link: Link) => void;
  className?: string;
}

// 6주차: 링크 버튼 세로 목록 컴포넌트
export function LinkList({
  links,
  emptyMessage = "아직 등록된 링크가 없어요.",
  loading = false,
  onLinkClick,
  className,
}: LinkListProps) {
  // 로딩 상태일 때: 스켈레톤 자리표시 3줄 노출
  if (loading) {
    return (
      <div className={cn("flex flex-col gap-3 w-full", className)} role="status" aria-busy="true">
        <Skeleton className="w-full h-14 rounded-2xl" />
        <Skeleton className="w-full h-14 rounded-2xl" />
        <Skeleton className="w-full h-14 rounded-2xl" />
        <span className="sr-only">링크 목록을 불러오는 중...</span>
      </div>
    );
  }

  // 등록된 링크가 0개일 때: shadcn Empty 컴포넌트로 안내 문구 표시
  if (!links || links.length === 0) {
    return (
      <Empty className={cn("border-2 border-dashed border-border rounded-2xl py-8 my-2", className)}>
        <EmptyMedia variant="icon">
          <Link2 className="size-4 text-muted-foreground" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>링크가 비어 있습니다</EmptyTitle>
          <EmptyDescription>{emptyMessage}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  // 링크 목록 렌더링
  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      {links.map((link) => (
        <LinkButton
          key={link.id}
          link={link}
          onClick={() => onLinkClick?.(link)}
        />
      ))}
    </div>
  );
}
