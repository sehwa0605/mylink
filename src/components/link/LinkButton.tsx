import React from "react";
import type { Link } from "@/lib/types";
import { LinkIcon } from "./LinkIcon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LinkButtonProps {
  link: Link;
  onClick?: () => void;
  className?: string;
}

// 6주차: 재사용 가능한 링크 버튼 단일 컴포넌트
export function LinkButton({ link, onClick, className }: LinkButtonProps) {
  return (
    // 진짜 <a> 태그에 shadcn buttonVariants 의 size="block" 클래스 적용
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn(
        buttonVariants({ size: "block" }),
        "group relative flex items-center justify-between gap-3 overflow-hidden cursor-pointer",
        className
      )}
    >
      {/* 좌측 아이콘 및 제목 영역 (긴 제목 줄바꿈 처리) */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* 아이콘 컴포넌트 */}
        <LinkIcon url={link.url} />

        {/* 링크 제목: 버튼 폭을 넘치지 않고 자연스럽게 줄바꿈(break-words) */}
        <span className="min-w-0 flex-1 break-words text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
          {link.title}
        </span>
      </div>

      {/* 우측 닌텐도 스위치 네온 화살표 인디케이터 */}
      <span
        className="text-accent group-hover:translate-x-1 transition-transform font-bold text-lg shrink-0 pl-1 select-none"
        aria-hidden="true"
      >
        &gt;
      </span>
    </a>
  );
}
