"use client";

// 리액트 기본 훅 임포트
import React, { useState } from "react";
// shadcn Dialog 컴포넌트 임포트
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
// 입력창 컴포넌트 임포트
import { Input } from "@/components/ui/input";
// 라벨 컴포넌트 임포트
import { Label } from "@/components/ui/label";
// 프로필 수정 낙관적 업데이트 훅 임포트
import { useUpdateProfileMutation } from "@/lib/queries";
// 기본 소개글 상수 임포트
import { DEFAULT_BIO } from "@/lib/usersFirestore";
// sonner 토스트 알림 임포트
import { toast } from "sonner";
// 사용자 프로필 타입 인터페이스 임포트
import type { UserProfile } from "@/lib/types";
// 연필 아이콘 임포트
import { Pencil } from "lucide-react";

// ProfileEditDialog 컴포넌트 Props 인터페이스 정의
export interface ProfileEditDialogProps {
  // 현재 사용자 프로필 데이터
  profile: UserProfile | null;
  // 외부 제어용 모달 열림 여부
  open?: boolean;
  // 외부 제어용 열림 변경 콜백 함수
  onOpenChange?: (open: boolean) => void;
  // 커스텀 트리거 요소 (생략 시 기본 [✏️ 프로필 수정] 버튼 제공)
  trigger?: React.ReactElement;
}

// 마이페이지 프로필 수정 다이얼로그 모달 컴포넌트 (11주차: 낙관적 업데이트 적용)
export function ProfileEditDialog({
  profile,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
}: ProfileEditDialogProps) {
  // 내부 모달 열림 상태
  const [internalOpen, setInternalOpen] = useState(false);
  // 외부 제어 여부
  const isControlled = controlledOpen !== undefined;
  // 실제 열림 상태
  const isOpen = isControlled ? controlledOpen : internalOpen;

  // 이름(실명) 입력 상태 (최대 30자)
  const [name, setName] = useState("");
  // 한 줄 소개 입력 상태 (최대 60자)
  const [bio, setBio] = useState("");
  // 이름 유효성 검사 에러 메시지 상태
  const [nameError, setNameError] = useState<string | undefined>();

  // 낙관적 업데이트 Mutation 훅 연동
  const updateProfileMutation = useUpdateProfileMutation(profile?.uid || "");

  // 열림/닫힘 통합 핸들러 (모달이 열릴 때 기존 프로필 데이터로 입력창 초기화)
  const handleOpenChange = (nextOpen: boolean) => {
    // 창이 열리는 순간(nextOpen === true) 기존 프로필 데이터로 입력창 채우기
    if (nextOpen && profile) {
      // 실명 또는 프로필 이름 세팅
      setName(profile.username || profile.displayName || "");
      // 소개글이 기본 안내문구이면 빈 칸으로 시작, 있으면 기존 글 세팅
      const initialBio = profile.bio === DEFAULT_BIO ? "" : profile.bio;
      setBio(initialBio || "");
      // 에러 메시지 초기화
      setNameError(undefined);
    }
    if (controlledOnOpenChange) {
      controlledOnOpenChange(nextOpen);
    }
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
  };

  // 폼 제출 이벤트 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    // 기본 전송 방지
    e.preventDefault();

    // 1. 이름 필수 검증 (앞뒤 공백 제거)
    const cleanedName = name.trim();
    if (!cleanedName) {
      setNameError("이름을 입력해주세요.");
      return;
    }

    // 2. 변경 여부 확인 (바뀐 내용이 없으면 저장하지 않고 창 닫기)
    const currentName = profile?.username || profile?.displayName || "";
    const currentBio = profile?.bio === DEFAULT_BIO ? "" : (profile?.bio || "");
    const cleanedBio = bio.trim();

    if (cleanedName === currentName && cleanedBio === currentBio) {
      handleOpenChange(false);
      return;
    }

    // 3. 낙관적 업데이트: 창을 바로 닫고 화면에 먼저 새 값 반영 (가이드 11-B 규칙)
    handleOpenChange(false);

    try {
      // Firestore batch 쓰기 실행
      await updateProfileMutation.mutateAsync({
        name: cleanedName,
        bio: cleanedBio,
      });
      // 성공 토스트 알림
      toast.success("프로필을 저장했어요");
    } catch (err) {
      // 실패 시 롤백 토스트 알림
      console.error("프로필 저장 실패:", err);
      toast.error("프로필을 저장하지 못해 원래대로 되돌렸어요");
    }
  };

  return (
    // 다이얼로그 루트
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* 트리거 렌더링 */}
      {trigger ? (
        <DialogTrigger render={trigger} />
      ) : !isControlled ? (
        <DialogTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={updateProfileMutation.isPending}
              className="h-8 px-3 rounded-xl border-border bg-card hover:bg-muted font-bold text-xs gap-1.5 shadow-xs cursor-pointer"
            >
              <Pencil className="size-3.5 text-primary" />
              <span>프로필 수정</span>
            </Button>
          }
        />
      ) : null}

      {/* 모달 본문 */}
      <DialogContent className="sm:max-w-md rounded-2xl p-6 bg-card text-card-foreground border border-border shadow-xl">
        {/* 폼 영역 */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* 헤더 */}
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-xl font-bold text-foreground">
              프로필 수정
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              이름과 소개글을 고칠 수 있어요.
            </DialogDescription>
          </DialogHeader>

          {/* 1. Username (읽기 전용 필드) */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="profile-username" className="text-xs font-semibold text-muted-foreground">
              Username (공개 아이디)
            </Label>
            <Input
              id="profile-username"
              value={profile?.displayName || ""}
              disabled={true}
              className="h-10 rounded-xl bg-muted/50 border-border text-muted-foreground cursor-not-allowed font-mono text-sm"
            />
            {/* 변경 불가 사유 안내 문구 */}
            <p className="text-[11px] text-muted-foreground">
              공개 페이지 주소(/{profile?.displayName})라서 바꿀 수 없어요.
            </p>
          </div>

          {/* 2. 이름 (실명 입력 필드, 필수, 최대 30자) */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-name" className="text-xs font-semibold text-foreground">
                이름 (실명) <span className="text-primary">*</span>
              </Label>
              {/* 글자 수 카운터 (글자수/30) */}
              <span className="text-[11px] text-muted-foreground">
                {name.length}/30
              </span>
            </div>
            <Input
              id="profile-name"
              value={name}
              maxLength={30}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(undefined);
              }}
              placeholder="예: 양세화"
              aria-invalid={!!nameError}
              className="h-10 rounded-xl bg-background border-border focus-visible:ring-primary"
            />
            {/* 필수 입력 에러 문구 */}
            {nameError && (
              <p className="text-xs font-semibold text-destructive mt-1">
                {nameError}
              </p>
            )}
          </div>

          {/* 3. 한 줄 소개 (선택, 최대 60자) */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-bio" className="text-xs font-semibold text-foreground">
                한 줄 소개
              </Label>
              {/* 글자 수 카운터 (글자수/60) */}
              <span className="text-[11px] text-muted-foreground">
                {bio.length}/60
              </span>
            </div>
            <Input
              id="profile-bio"
              value={bio}
              maxLength={60}
              onChange={(e) => setBio(e.target.value)}
              placeholder="나를 표현하는 한 줄 소개글을 작성해보세요."
              className="h-10 rounded-xl bg-background border-border focus-visible:ring-primary"
            />
            <p className="text-[11px] text-muted-foreground">
              비워두고 저장하면 기본 문구(&apos;{DEFAULT_BIO}&apos;)로 저장됩니다.
            </p>
          </div>

          {/* 하단 액션 버튼 */}
          <DialogFooter className="flex sm:justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="h-10 px-4 rounded-xl border-border hover:bg-muted font-medium cursor-pointer"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow transition-all cursor-pointer"
            >
              저장
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
