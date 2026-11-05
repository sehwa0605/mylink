import React from "react";
// 링크 데이터 인터페이스 임포트
import type { Link } from "@/lib/types";
// 링크 브랜드 및 파비콘 아이콘 컴포넌트 임포트
import { LinkIcon } from "./LinkIcon";
// shadcn buttonVariants 및 Button 컴포넌트 임포트
import { buttonVariants, Button } from "@/components/ui/button";
// 클릭 수 커서 아이콘 임포트
import { MousePointerClick } from "lucide-react";
// 클래스 병합 유틸리티 함수 임포트
import { cn } from "@/lib/utils";

// LinkButton 컴포넌트 Props 인터페이스 정의 (10주차: ownerUid 및 수정/삭제 액션 추가)
export interface LinkButtonProps {
  // 개별 링크 데이터 객체
  link: Link;
  // 소유자 모드 식별자 (있을 경우 수정/삭제 버튼 노출)
  ownerUid?: string;
  // 수정 버튼 클릭 시 실행할 부모 핸들러
  onEdit?: (link: Link) => void;
  // 삭제 버튼 클릭 시 실행할 부모 핸들러
  onDelete?: (link: Link) => void;
  // 링크 클릭 이벤트 콜백
  onClick?: () => void;
  // 추가 CSS 클래스명
  className?: string;
}

// 재사용 가능한 링크 버튼 단일 컴포넌트 (가이드 10주차: 주인 모드 수정/삭제 및 마지막 수정 시각 지원)
export function LinkButton({
  link,
  ownerUid,
  onEdit,
  onDelete,
  onClick,
  className,
}: LinkButtonProps) {
  // 소유자 모드 활성화 여부 판별
  const isOwner = Boolean(ownerUid);

  return (
    // 전체 링크 카드 래퍼 컨테이너
    <div className="flex flex-col w-full">
      {/* 링크 본체와 우측 액션 버튼들을 가로로 배치 */}
      <div className="flex items-center gap-2 w-full">
        {/* 실제 링크 이동 <a> 태그 (새 탭 열림 및 buttonVariants block 크기 적용) */}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className={cn(
            buttonVariants({ size: "block" }),
            "group relative flex items-center justify-between gap-3 overflow-hidden cursor-pointer flex-1 min-w-0",
            className
          )}
        >
          {/* 좌측 아이콘 및 제목 영역 (긴 제목 줄바꿈 처리) */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* URL 기반 자동 아이콘 컴포넌트 */}
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

        {/* 소유자(owner) 모드인 경우 우측에 [✏️ 수정] / [🗑️ 삭제] 세로 버튼 표시 */}
        {isOwner && (
          <div className="flex flex-col gap-1 shrink-0">
            {/* 수정 버튼: 파란 바탕(네온 블루/accent) + 흰 글자 */}
            <Button
              type="button"
              size="sm"
              aria-label={`${link.title} 수정`}
              onClick={() => {
                // 실습 요구사항: 콘솔 출력
                console.log("수정 버튼 클릭:", link);
                // 부모 수정 핸들러 호출
                onEdit?.(link);
              }}
              className="h-7 px-2 bg-accent text-accent-foreground hover:bg-accent/90 text-[11px] font-bold rounded-lg shadow-xs cursor-pointer"
            >
              ✏️ 수정
            </Button>

            {/* 삭제 버튼: 빨간 바탕(destructive) + 흰 글자 */}
            <Button
              type="button"
              size="sm"
              variant="destructive"
              aria-label={`${link.title} 삭제`}
              onClick={() => {
                // 실습 요구사항: 콘솔 출력
                console.log("삭제 버튼 클릭:", link);
                // 부모 삭제 핸들러 호출
                onDelete?.(link);
              }}
              className="h-7 px-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-[11px] font-bold rounded-lg shadow-xs cursor-pointer"
            >
              🗑️ 삭제
            </Button>
          </div>
        )}
      </div>

      {/* 주인 모드 하단 메타 정보 (왼쪽: 누적 클릭 수, 오른쪽: 마지막 수정 시각) */}
      {isOwner && (
        <div className="flex items-center justify-between mt-1 px-1 text-[11px] text-muted-foreground">
          {/* 좌측 클릭 수 (커서 아이콘 + 숫자 + 스크린리더 안내) */}
          <div className="flex items-center gap-1 font-medium">
            <MousePointerClick className="size-3 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">클릭 수</span>
            <span>{(link.clickCount ?? 0).toLocaleString("ko-KR")}회 클릭</span>
          </div>

          {/* 우측 마지막 수정 시간 표시 (updatedAt 존재 시) */}
          {link.updatedAt ? (
            <div>
              <span>마지막 수정 </span>
              <time dateTime={new Date(link.updatedAt).toISOString()}>
                {new Date(link.updatedAt).toLocaleString("ko-KR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </time>
            </div>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
}
