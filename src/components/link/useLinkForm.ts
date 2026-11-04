"use client";

// 리액트 기본 상태 관리 훅 임포트
import { useState } from "react";
// 링크 입력값 유효성 검사 함수 임포트
import { validateLink } from "@/lib/validateLink";
// 토스트 경고 알림 출력을 위한 sonner toast 임포트
import { toast } from "sonner";
// 링크 타입 인터페이스 임포트
import type { Link } from "@/lib/types";

// 링크 폼 훅 반환 타입 및 옵션 정의
export interface UseLinkFormOptions {
  // 빈 칸 입력 시 인라인 오류 대신 상단 경고 토스트를 띄울지 여부 (AddLinkForm 전용)
  showToastOnEmpty?: boolean;
}

// 링크 추가 및 수정을 위한 공통 입력 폼 커스텀 훅
export function useLinkForm() {
  // 제목 입력 상태값 관리
  const [title, setTitle] = useState("");
  // URL 주소 입력 상태값 관리
  const [url, setUrl] = useState("");
  // 제목 관련 오류 메시지 상태
  const [titleError, setTitleError] = useState<string | undefined>();
  // URL 관련 오류 메시지 상태
  const [urlError, setUrlError] = useState<string | undefined>();
  // 현재 제출 처리 중인지 여부 플래그
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 입력값 및 오류 상태를 초기화하는 함수
  const reset = () => {
    // 제목 입력창 초기화
    setTitle("");
    // URL 입력창 초기화
    setUrl("");
    // 제목 오류 메시지 초기화
    setTitleError(undefined);
    // URL 오류 메시지 초기화
    setUrlError(undefined);
    // 제출 진행 플래그 초기화
    setIsSubmitting(false);
  };

  // 폼 제출 이벤트를 처리하고 검증을 통과하면 onAdd 콜백을 실행하는 함수
  const handleSubmit = async (
    // 폼 제출 이벤트 객체
    e: React.FormEvent,
    // 검증 통과 후 실행할 링크 추가/수정 비동기 콜백 함수
    onAdd: (link: Omit<Link, "id">) => Promise<void> | void,
    // 부가 옵션 (빈 칸 토스트 알림 등)
    options?: UseLinkFormOptions
  ): Promise<boolean> => {
    // 브라우저 기본 폼 제출(새로고침) 동작 방지
    e.preventDefault();

    // 1. 페이지 안 인라인 폼(AddLinkForm)의 경우 빈 칸일 때 토스트 먼저 출력 규칙 적용
    if (options?.showToastOnEmpty) {
      // 제목이 비어 있는 경우
      if (!title.trim()) {
        // 제목 입력 경고 토스트 띄우기
        toast.warning("제목을 입력해주세요");
        // 입력창 아래에도 인라인 에러 설정
        setTitleError("제목을 입력해 주세요");
        // 처리 중단
        return false;
      }
      // 주소가 비어 있는 경우
      if (!url.trim()) {
        // 주소 입력 경고 토스트 띄우기
        toast.warning("주소를 입력해주세요");
        // 입력창 아래에도 인라인 에러 설정
        setUrlError("URL을 입력해 주세요");
        // 처리 중단
        return false;
      }
    }

    // 2. 가이드 4장 4-6 규칙 기반의 링크 유효성 검사 수행
    const result = validateLink(title, url);

    // 유효성 검사를 통과하지 못한 경우
    if (!result.ok) {
      // 제목 검사 오류 메시지 상태 갱신
      setTitleError(result.titleError);
      // URL 검사 오류 메시지 상태 갱신
      setUrlError(result.urlError);
      // 실패 반환
      return false;
    }

    // 통과 시 기존 에러 메시지 초기화
    setTitleError(undefined);
    // 기존 URL 에러 메시지 초기화
    setUrlError(undefined);
    // 제출 진행 중 플래그 활성화
    setIsSubmitting(true);

    try {
      // 정규화된 URL과 제목으로 추가 콜백 함수 호출
      await onAdd({
        // 공백 제거된 링크 제목
        title: title.trim(),
        // 정규화(https:// 자동 보정 등)된 최종 대상 URL
        url: result.normalizedUrl!,
      });
      // 폼 입력창 초기화
      reset();
      // 성공 반환
      return true;
    } catch (err) {
      // 오류 발생 시 콘솔 로그 출력
      console.error("링크 처리 중 오류 발생:", err);
      // 오류 발생 시 제출 플래그 해제
      setIsSubmitting(false);
      // 실패 반환
      return false;
    }
  };

  // 컴포넌트에서 필요한 상태값과 핸들러 반환
  return {
    // 제목 값
    title,
    // 제목 변경 함수
    setTitle,
    // URL 값
    url,
    // URL 변경 함수
    setUrl,
    // 제목 에러 메시지
    titleError,
    // URL 에러 메시지
    urlError,
    // 제출 진행 중 상태
    isSubmitting,
    // 폼 초기화 함수
    reset,
    // 폼 제출 처리 함수
    handleSubmit,
  };
}
