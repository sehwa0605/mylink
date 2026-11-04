"use client";

// 리액트 기본 훅 임포트
import React, { useState } from "react";
// shadcn AlertDialog 부품 임포트
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
// 버튼 컴포넌트 임포트
import { Button } from "@/components/ui/button";
// sonner 토스트 알림 임포트
import { toast } from "sonner";
// 링크 데이터 타입 임포트
import type { Link } from "@/lib/types";
// 스피너 로더 아이콘 임포트
import { Loader2 } from "lucide-react";

// DeleteLinkDialog 컴포넌트 Props 인터페이스 정의
export interface DeleteLinkDialogProps {
  // 삭제 대상 링크 데이터 객체 (모달이 닫혀 있을 때는 null)
  link: Link | null;
  // 다이얼로그 모달 열림 여부
  open: boolean;
  // 열림/닫힘 상태 변경 콜백 함수
  onOpenChange: (open: boolean) => void;
  // 삭제 확인 시 호출할 비동기 삭제 함수
  onConfirmDelete: (linkId: string) => Promise<void> | void;
}

// 링크 영구 삭제 확인 다이얼로그 모달 컴포넌트 (10주차)
export function DeleteLinkDialog({
  link,
  open,
  onOpenChange,
  onConfirmDelete,
}: DeleteLinkDialogProps) {
  // 삭제 진행 중 여부 플래그
  const [isDeleting, setIsDeleting] = useState(false);

  // 모달 상태 변경 핸들러 (삭제 중에는 닫히지 않도록 보호)
  const handleOpenChange = (nextOpen: boolean) => {
    // 삭제 중에는 닫힘 차단
    if (isDeleting) {
      return;
    }
    // 상태 변경 통지
    onOpenChange(nextOpen);
  };

  // 삭제 확정 버튼 클릭 핸들러
  const handleDelete = async () => {
    // 대상 링크가 없는 경우 리턴
    if (!link) {
      return;
    }

    // 삭제 진행 중 상태 진입
    setIsDeleting(true);

    try {
      // 부모 삭제 비동기 함수 실행 (Firestore deleteDoc + 쿼리 무효화)
      await onConfirmDelete(link.id);
      // 성공 토스트 알림 노출
      toast.success("링크를 삭제했어요");
      // 삭제 완료 후 직접 모달 창 닫기 (Base UI 규격)
      onOpenChange(false);
    } catch (err) {
      // 에러 로그 출력
      console.error("링크 삭제 실패 원인:", err);
      // 실패 토스트 알림 노출
      toast.error("링크를 삭제하지 못했어요");
    } finally {
      // 삭제 중 상태 해제
      setIsDeleting(false);
    }
  };

  return (
    // 삭제 확인 Alert Dialog 루트
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {/* 모달 콘텐츠 박스 */}
      <AlertDialogContent className="sm:max-w-md rounded-2xl p-6 bg-card text-card-foreground border border-border shadow-xl">
        {/* 모달 상단 헤더 영역 */}
        <AlertDialogHeader className="space-y-2 text-left">
          {/* 모달 제목 */}
          <AlertDialogTitle className="text-lg font-bold text-foreground">
            정말 삭제하시겠습니까?
          </AlertDialogTitle>
          {/* 모달 본문 설명 및 경고 문구 */}
          <AlertDialogDescription className="text-sm text-muted-foreground space-y-1">
            {/* 삭제할 링크 제목 (굵은 글씨) */}
            <span className="block font-bold text-foreground break-words text-base">
              &quot;{link?.title}&quot;
            </span>
            {/* 영구 삭제 주의 문구 (빨간색) */}
            <span className="block font-semibold text-destructive">
              이 작업은 되돌릴 수 없습니다.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* 모달 하단 버튼 액션 영역 */}
        <AlertDialogFooter className="flex sm:justify-end gap-2 pt-2">
          {/* 취소 버튼 */}
          <AlertDialogCancel
            disabled={isDeleting}
            onClick={() => handleOpenChange(false)}
            className="h-10 px-4 rounded-xl border-border hover:bg-muted font-medium cursor-pointer"
          >
            취소
          </AlertDialogCancel>
          {/* 진한 빨강(destructive) 스타일의 삭제하기 확인 버튼 */}
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
            className="h-10 px-5 rounded-xl bg-destructive text-white hover:bg-destructive/85 font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>삭제 중…</span>
              </>
            ) : (
              <span>🗑️ 삭제하기</span>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
