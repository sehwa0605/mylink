"use client";

// 리액트 기본 임포트
import * as React from "react";
// 버튼 컴포넌트 임포트
import { Button } from "@/components/ui/button";
// 입력창 컴포넌트 임포트
import { Input } from "@/components/ui/input";
// 라벨 컴포넌트 임포트
import { Label } from "@/components/ui/label";
// 폼 상태 및 검증 관리 커스텀 훅 임포트
import { useLinkForm } from "@/components/link/useLinkForm";
// 토스트 알림 출력을 위한 sonner toast 임포트
import { toast } from "sonner";
// 클래스 병합 유틸리티 함수 임포트
import { cn } from "@/lib/utils";
// 링크 데이터 타입 정의 임포트
import type { Link } from "@/lib/types";
// 플러스 아이콘 임포트
import { PlusIcon } from "lucide-react";

// AddLinkForm 컴포넌트 Props 인터페이스 정의
export interface AddLinkFormProps {
  // 링크 추가 콜백 함수
  onAdd: (link: Omit<Link, "id">) => Promise<void> | void;
  // 부가적인 CSS 클래스명
  className?: string;
}

// 마이페이지(/mypage) 본문 등에 직접 삽입되는 인라인 링크 추가 폼 컴포넌트
export function AddLinkForm({ onAdd, className }: AddLinkFormProps) {
  // 공통 링크 폼 훅 사용
  const {
    title,
    setTitle,
    url,
    setUrl,
    titleError,
    urlError,
    isSubmitting,
    handleSubmit,
  } = useLinkForm();

  // 폼 제출 이벤트 핸들러
  const onSubmit = async (e: React.FormEvent) => {
    // 빈 칸 입력 시 토스트를 먼저 띄우는 옵션 활성화
    const success = await handleSubmit(
      e,
      async (linkData) => {
        // 부모의 링크 추가 로직 호출
        await onAdd(linkData);
        // 추가 성공 토스트 알림 표시
        toast.success("링크를 추가했어요");
      },
      { showToastOnEmpty: true }
    );

    // 검증 실패 시 아무것도 하지 않음
    if (!success) {
      return;
    }
  };

  return (
    // 브라우저 기본 툴팁 대신 커스텀 에러 문구 표시를 위해 noValidate 지정
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn(
        "rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-4",
        className
      )}
    >
      {/* 폼 안내 타이틀 */}
      <div className="flex items-center gap-2">
        {/* 플러스 아이콘 */}
        <PlusIcon className="w-4 h-4 text-primary stroke-[2.5]" />
        {/* 제목 텍스트 */}
        <h3 className="text-base font-bold text-foreground">새 링크 추가하기</h3>
      </div>

      {/* 링크 제목 입력 영역 */}
      <div className="space-y-1.5 text-left">
        {/* 라벨 */}
        <Label htmlFor="inline-add-title" className="text-xs font-semibold text-muted-foreground">
          링크 제목
        </Label>
        {/* 인풋 */}
        <Input
          id="inline-add-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: GitHub"
          aria-invalid={!!titleError}
          className="h-10 rounded-xl bg-background border-border focus-visible:ring-primary"
        />
        {/* 형식 오류 시 표시할 에러 문구 */}
        {titleError && (
          <p className="text-xs font-semibold text-destructive mt-1">
            {titleError}
          </p>
        )}
      </div>

      {/* 링크 URL 주소 입력 영역 */}
      <div className="space-y-1.5 text-left">
        {/* 라벨 */}
        <Label htmlFor="inline-add-url" className="text-xs font-semibold text-muted-foreground">
          URL 주소
        </Label>
        {/* 인풋 */}
        <Input
          id="inline-add-url"
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="예: https://github.com/내아이디"
          aria-invalid={!!urlError}
          className="h-10 rounded-xl bg-background border-border focus-visible:ring-primary"
        />
        {/* https 자동 보정 안내 */}
        <p className="text-xs text-muted-foreground">
          https:// 를 빼고 쓰면 자동으로 붙여요.
        </p>
        {/* 형식 오류 시 표시할 에러 문구 */}
        {urlError && (
          <p className="text-xs font-semibold text-destructive mt-1">
            {urlError}
          </p>
        )}
      </div>

      {/* 제출 버튼 영역 */}
      <div className="flex justify-end pt-1">
        {/* + 추가 버튼 */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow transition-all cursor-pointer"
        >
          {isSubmitting ? "추가 중..." : "+ 추가"}
        </Button>
      </div>
    </form>
  );
}
