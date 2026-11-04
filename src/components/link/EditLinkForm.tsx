"use client";

// 리액트 기본 훅 임포트
import React, { useState, useEffect } from "react";
// 버튼 컴포넌트 임포트
import { Button } from "@/components/ui/button";
// 입력창 컴포넌트 임포트
import { Input } from "@/components/ui/input";
// 라벨 컴포넌트 임포트
import { Label } from "@/components/ui/label";
// 링크 유효성 검사 함수 임포트
import { validateLink } from "@/lib/validateLink";
// sonner 토스트 알림 임포트
import { toast } from "sonner";
// 링크 데이터 타입 임포트
import type { Link } from "@/lib/types";
// 스피너 로더 아이콘 임포트
import { Loader2 } from "lucide-react";

// EditLinkForm 컴포넌트 Props 인터페이스 정의
export interface EditLinkFormProps {
  // 수정 대상 링크 데이터 객체
  link: Link;
  // 수정 저장 콜백 함수 (비동기 처리)
  onSave: (input: { title: string; url: string }) => Promise<void> | void;
  // 수정 취소 콜백 함수 (인라인 폼 닫기)
  onCancel: () => void;
}

// 링크 카드 자리에서 바로 수정할 수 있는 인라인 폼 컴포넌트 (10주차)
export function EditLinkForm({ link, onSave, onCancel }: EditLinkFormProps) {
  // 기존 링크 제목으로 초기화된 제목 상태
  const [title, setTitle] = useState(link.title);
  // 기존 링크 URL로 초기화된 URL 상태
  const [url, setUrl] = useState(link.url);
  // 제목 검사 에러 메시지 상태
  const [titleError, setTitleError] = useState<string | undefined>();
  // URL 검사 에러 메시지 상태
  const [urlError, setUrlError] = useState<string | undefined>();
  // Firestore 저장 실패 시 폼 에러 메시지 상태
  const [serverError, setServerError] = useState<string | undefined>();
  // 저장 중 플래그 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Esc 키를 누르면 즉시 수정을 취소하고 원래 상태로 복귀
  useEffect(() => {
    // 키보드 이벤트 핸들러 정의
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape 키 감지 시
      if (e.key === "Escape" && !isSubmitting) {
        // 취소 함수 호출
        onCancel();
      }
    };
    // 윈도우 키 이벤트 리스너 등록
    window.addEventListener("keydown", handleKeyDown);
    // 컴포넌트 언마운트 시 클린업
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onCancel]);

  // 폼 제출 이벤트 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    // 브라우저 기본 전송 방지
    e.preventDefault();
    // 기존 에러 초기화
    setServerError(undefined);

    // 공통 validateLink 유효성 검사 수행
    const result = validateLink(title, url);
    // 검사 미통과 시
    if (!result.ok) {
      // 제목 에러 메시지 설정
      setTitleError(result.titleError);
      // URL 에러 메시지 설정
      setUrlError(result.urlError);
      return;
    }

    // 에러 상태 클리어
    setTitleError(undefined);
    setUrlError(undefined);
    // 저장 중 상태 진입
    setIsSubmitting(true);

    try {
      // 부모 저장 비동기 함수 호출
      await onSave({
        title: title.trim(),
        url: result.normalizedUrl!,
      });
      // 성공 토스트 알림 노출
      toast.success("링크를 수정했어요");
      // 인라인 폼 닫기
      onCancel();
    } catch (err) {
      // 에러 로그 출력
      console.error("링크 수정 실패 원인:", err);
      // 인라인 에러 문구 설정
      setServerError("링크를 수정하지 못했어요. 잠시 후 다시 시도해 주세요.");
      // 실패 토스트 알림 노출
      toast.error("링크를 수정하지 못했어요");
    } finally {
      // 저장 중 플래그 해제
      setIsSubmitting(false);
    }
  };

  return (
    // 브라우저 기본 말풍선 대신 커스텀 문구 표시를 위해 noValidate 지정
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full rounded-2xl border-2 border-primary/30 bg-card p-4 sm:p-5 shadow-md space-y-3 transition-all"
    >
      {/* 폼 헤더 문구 */}
      <div className="flex items-center justify-between">
        {/* 수정 모드 안내 */}
        <span className="text-xs font-bold text-primary">링크 수정 중</span>
        {/* Esc 단축키 힌트 */}
        <span className="text-[11px] text-muted-foreground">Esc 키를 누르면 취소됩니다</span>
      </div>

      {/* 제목 입력 영역 */}
      <div className="space-y-1 text-left">
        {/* 라벨 (화면 내 고유 id 부여: edit-title-${link.id}) */}
        <Label htmlFor={`edit-title-${link.id}`} className="text-xs font-semibold text-foreground">
          링크 제목
        </Label>
        {/* 인풋 */}
        <Input
          id={`edit-title-${link.id}`}
          value={title}
          disabled={isSubmitting}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: GitHub"
          autoFocus={true}
          aria-invalid={!!titleError}
          className="h-10 rounded-xl bg-background border-border focus-visible:ring-primary"
        />
        {/* 제목 검사 에러 메시지 */}
        {titleError && (
          <p className="text-xs font-semibold text-destructive mt-1">
            {titleError}
          </p>
        )}
      </div>

      {/* URL 입력 영역 */}
      <div className="space-y-1 text-left">
        {/* 라벨 (화면 내 고유 id 부여: edit-url-${link.id}) */}
        <Label htmlFor={`edit-url-${link.id}`} className="text-xs font-semibold text-foreground">
          URL 주소
        </Label>
        {/* 인풋 */}
        <Input
          id={`edit-url-${link.id}`}
          type="text"
          inputMode="url"
          disabled={isSubmitting}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="예: https://github.com/내아이디"
          aria-invalid={!!urlError}
          className="h-10 rounded-xl bg-background border-border focus-visible:ring-primary"
        />
        {/* URL 검사 에러 메시지 */}
        {urlError && (
          <p className="text-xs font-semibold text-destructive mt-1">
            {urlError}
          </p>
        )}
      </div>

      {/* 서버 수정 실패 에러 메시지 */}
      {serverError && (
        <p className="text-xs font-semibold text-destructive mt-1">
          {serverError}
        </p>
      )}

      {/* 하단 버튼 영역 */}
      <div className="flex justify-end gap-2 pt-1">
        {/* 취소 버튼 */}
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={onCancel}
          className="h-9 px-3.5 rounded-xl border-border hover:bg-muted text-xs font-medium cursor-pointer"
        >
          취소
        </Button>
        {/* 저장 버튼 */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>저장 중…</span>
            </>
          ) : (
            <span>저장</span>
          )}
        </Button>
      </div>
    </form>
  );
}
