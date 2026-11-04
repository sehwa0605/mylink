import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProfileSkeletonProps {
  className?: string;
}

// 6주차: 프로필 로딩 시 노출되는 스켈레톤 자리표시 컴포넌트
export function ProfileSkeleton({ className }: ProfileSkeletonProps) {
  return (
    <div
      className={cn("flex flex-col items-center text-center w-full max-w-md mx-auto p-6 sm:p-8", className)}
      role="status"
      aria-busy="true"
    >
      {/* 상단 뱃지 자리표시 */}
      <div className="flex justify-between w-full mb-6">
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>

      {/* 아바타 원형 자리표시 */}
      <Skeleton className="size-24 rounded-full mb-4" />

      {/* 이름 및 아이디 자리표시 */}
      <Skeleton className="w-36 h-8 rounded-lg mb-2" />
      <Skeleton className="w-24 h-4 rounded-md mb-4" />

      {/* 한 줄 소개 상자 자리표시 */}
      <Skeleton className="w-64 h-12 rounded-2xl mb-8" />

      {/* 링크 목록 자리표시 (3줄) */}
      <div className="flex flex-col gap-3 w-full">
        <Skeleton className="w-full h-14 rounded-2xl" />
        <Skeleton className="w-full h-14 rounded-2xl" />
        <Skeleton className="w-full h-14 rounded-2xl" />
      </div>

      <span className="sr-only">프로필을 불러오는 중...</span>
    </div>
  );
}
