"use client";

// 리액트 기본 훅 임포트
import { useState } from "react";
// shadcn Dialog 관련 컴포넌트 임포트 (Base UI 기반)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
// 버튼 컴포넌트 임포트
import { Button } from "@/components/ui/button";
// 텍스트 인풋 컴포넌트 임포트
import { Input } from "@/components/ui/input";
// 라벨 컴포넌트 임포트
import { Label } from "@/components/ui/label";
// 폼 상태 및 검증 관리 커스텀 훅 임포트
import { useLinkForm } from "@/components/link/useLinkForm";
// 추가 완료 알림 출력을 위한 sonner toast 임포트
import { toast } from "sonner";
// 링크 데이터 타입 정의 임포트
import type { Link } from "@/lib/types";
// 플러스 아이콘 임포트
import { PlusIcon } from "lucide-react";

// AddLinkDialog 컴포넌트 속성 인터페이스 정의
export interface AddLinkDialogProps {
  // 다이얼로그 열림 여부 (외부 제어용 옵션)
  open?: boolean;
  // 다이얼로그 열림/닫힘 변경 콜백 함수 (외부 제어용 옵션)
  onOpenChange?: (open: boolean) => void;
  // 링크 추가 확정 시 실행되는 부모 콜백 함수
  onAdd: (link: Omit<Link, "id">) => Promise<void> | void;
  // 커스텀 열기 트리거 요소 (생략 시 기본 [링크 추가] 버튼 제공)
  trigger?: React.ReactElement;
}

// 링크 추가 다이얼로그 모달 컴포넌트
export function AddLinkDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onAdd,
  trigger,
}: AddLinkDialogProps) {
  // 내부에서 자체 제어하기 위한 열림 상태
  const [internalOpen, setInternalOpen] = useState(false);

  // 외부 제어 여부 확인 (props로 전달받았는지)
  const isControlled = controlledOpen !== undefined;
  // 실제 현재 열림 상태값 (외부 제어 우선)
  const isOpen = isControlled ? controlledOpen : internalOpen;

  // 열림/닫힘 상태 변경 통합 핸들러
  const handleOpenChange = (nextOpen: boolean) => {
    // 닫힐 때 폼 입력값 및 에러 상태 초기화
    if (!nextOpen) {
      reset();
    }
    // 외부 핸들러가 있으면 호출
    if (controlledOnOpenChange) {
      controlledOnOpenChange(nextOpen);
    }
    // 내부 상태 갱신
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
  };

  // 공통 링크 폼 훅 사용
  const {
    title,
    setTitle,
    url,
    setUrl,
    titleError,
    urlError,
    isSubmitting,
    reset,
    handleSubmit,
  } = useLinkForm();

  // 폼 제출 이벤트 핸들러
  const onSubmit = async (e: React.FormEvent) => {
    // 공통 handleSubmit 함수 실행
    const success = await handleSubmit(e, async (linkData) => {
      // 부모 onAdd 콜백 호출
      await onAdd(linkData);
      // 추가 성공 토스트 알림 표시
      toast.success("링크를 추가했어요");
      // 다이얼로그 창 닫기
      handleOpenChange(false);
    });

    // 실패한 경우(유효성 검사 미통과) 아무 동작 안 함
    if (!success) {
      return;
    }
  };

  return (
    // 다이얼로그 루트 컴포넌트
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* 트리거가 제공되었거나, 외부 제어가 아닐 때 기본 트리거 버튼 렌더링 */}
      {trigger ? (
        // 사용자가 전달한 커스텀 트리거에 render 속성 매핑 (Base UI 규격)
        <DialogTrigger render={trigger} />
      ) : !isControlled ? (
        // 기본 닌텐도 레드 스타일의 [링크 추가] 버튼을 render 속성으로 전달
        <DialogTrigger
          render={
            <Button
              type="button"
              className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-2xl shadow-md hover:bg-primary/90 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              {/* 플러스 아이콘 */}
              <PlusIcon className="w-5 h-5 stroke-[2.5]" />
              {/* 버튼 텍스트 */}
              <span>링크 추가</span>
            </Button>
          }
        />
      ) : null}

      {/* 다이얼로그 모달 콘텐츠 */}
      <DialogContent className="sm:max-w-md rounded-2xl p-6 bg-card text-card-foreground border border-border shadow-xl">
        {/* 브라우저 기본 툴팁 대신 커스텀 에러 문구를 노출하기 위해 noValidate 지정 */}
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {/* 다이얼로그 상단 헤더 */}
          <DialogHeader className="space-y-1.5 text-left">
            {/* 다이얼로그 제목 */}
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              새 링크 추가
            </DialogTitle>
            {/* 다이얼로그 부가 설명 */}
            <DialogDescription className="text-sm text-muted-foreground">
              내 프로필 페이지에 방문자에게 공유할 새 링크를 추가합니다.
            </DialogDescription>
          </DialogHeader>

          {/* 링크 제목 입력 필드 영역 */}
          <div className="space-y-2 text-left">
            {/* 제목 라벨 */}
            <Label htmlFor="add-dialog-title" className="text-sm font-semibold text-foreground">
              링크 제목
            </Label>
            {/* 제목 텍스트 입력창 (창이 열리면 바로 포커스) */}
            <Input
              id="add-dialog-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: GitHub"
              autoFocus={true}
              aria-invalid={!!titleError}
              className="h-11 rounded-xl bg-background border-border focus-visible:ring-primary"
            />
            {/* 제목 유효성 검사 에러 메시지 */}
            {titleError && (
              <p className="text-xs font-semibold text-destructive mt-1">
                {titleError}
              </p>
            )}
          </div>

          {/* 링크 URL 주소 입력 필드 영역 */}
          <div className="space-y-2 text-left">
            {/* URL 라벨 */}
            <Label htmlFor="add-dialog-url" className="text-sm font-semibold text-foreground">
              URL 주소
            </Label>
            {/* URL 텍스트 입력창 (모바일 URL 전용 키패드 안내) */}
            <Input
              id="add-dialog-url"
              type="text"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="예: https://github.com/내아이디"
              aria-invalid={!!urlError}
              className="h-11 rounded-xl bg-background border-border focus-visible:ring-primary"
            />
            {/* https:// 생략 가능 안내 문구 */}
            <p className="text-xs text-muted-foreground">
              https:// 를 빼고 쓰면 자동으로 붙여요.
            </p>
            {/* URL 유효성 검사 에러 메시지 */}
            {urlError && (
              <p className="text-xs font-semibold text-destructive mt-1">
                {urlError}
              </p>
            )}
          </div>

          {/* 하단 버튼 액션 영역 */}
          <DialogFooter className="flex sm:justify-end gap-2 pt-2">
            {/* 취소 버튼 (클릭 시 모달 닫기) */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="h-10 px-4 rounded-xl border-border hover:bg-muted font-medium cursor-pointer"
            >
              취소
            </Button>
            {/* 추가하기 확인 버튼 */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow transition-all cursor-pointer"
            >
              {isSubmitting ? "추가 중..." : "추가하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
