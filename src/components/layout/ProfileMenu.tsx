"use client";

// 리액트 기본 훅 임포트
import React, { useState } from "react";
// Next.js 라우터 훅 임포트
import { useRouter } from "next/navigation";
// shadcn DropdownMenu 관련 컴포넌트 임포트
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
// shadcn Avatar 컴포넌트 임포트
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// 버튼 컴포넌트 임포트
import { Button } from "@/components/ui/button";
// 사용자 상태 훅 임포트
import { useUser } from "@/hooks/useUser";
// 링크 목록 쿼리 훅 임포트 (링크 개수 조회용)
import { useLinksQuery } from "@/lib/queries";
// Zustand 인증 스토어 임포트
import { useAuthStore } from "@/store/useAuthStore";
// 7주차에 제작한 링크 추가 다이얼로그 임포트
import { AddLinkDialog } from "@/components/link/AddLinkDialog";
// 기본 소개글 상수 임포트
import { DEFAULT_BIO } from "@/lib/usersFirestore";
// sonner 토스트 알림 임포트
import { toast } from "sonner";
// 루시드 아이콘 모음 임포트
import {
  ChevronDown,
  User,
  Home,
  BarChart3,
  PlusCircle,
  ExternalLink,
  Copy,
  LogOut,
  Check,
} from "lucide-react";

// 헤더 우측에 위치하는 프로필 드롭다운 메뉴 컴포넌트 (11주차)
export function ProfileMenu() {
  // 라우터 객체 획득
  const router = useRouter();
  // 사용자 프로필 및 계정 정보 가져오기
  const { user, profile, displayName, pagePath } = useUser();
  // 로그아웃 함수 구독
  const signOutUser = useAuthStore((state) => state.signOutUser);
  // 현재 로그인된 사용자의 링크 목록 쿼리
  const linksQuery = useLinksQuery(user?.uid);
  // 메뉴 내부에서 링크 추가 다이얼로그를 열기 위한 모달 상태
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  // 링크 주소 복사 여부 상태
  const [copied, setCopied] = useState(false);

  // 로그인 상태가 아니면 렌더링하지 않음
  if (!user) return null;

  // 전체 공개 페이지 절대 URL 생성
  const fullPageUrl = typeof window !== "undefined"
    ? `${window.location.origin}${pagePath}`
    : pagePath;

  // 내 페이지 링크 클립보드 복사 핸들러
  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(fullPageUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        // 복사 성공 토스트 알림 (설명에 주소 포함)
        toast.success("내 페이지 주소를 복사했어요", {
          description: fullPageUrl,
        });
      } else {
        toast.error("주소를 복사하지 못했어요");
      }
    } catch {
      toast.error("주소를 복사하지 못했어요");
    }
  };

  // 로그아웃 처리 핸들러
  const handleSignOut = async () => {
    await signOutUser();
    // 로그아웃 후 랜딩 페이지(/)로 이동
    router.push("/");
  };

  // 사용자 프로필 소개글 유무 확인
  const hasCustomBio = Boolean(profile?.bio && profile.bio !== DEFAULT_BIO);

  return (
    <>
      {/* 프로필 드롭다운 메뉴 루트 */}
      <DropdownMenu>
        {/* 드롭다운 트리거 버튼: [사진 + {displayName}님 ▼] */}
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              className="h-10 px-2 rounded-xl flex items-center gap-2 hover:bg-muted font-bold text-sm cursor-pointer select-none"
            >
              {/* 작은 프로필 아바타 */}
              <Avatar className="size-7 rounded-full border border-border">
                {user.photoURL && (
                  <AvatarImage
                    src={user.photoURL}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                  />
                )}
                <AvatarFallback className="text-xs bg-primary text-primary-foreground font-bold">
                  {displayName.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* 사용자 핸들명 + 님 */}
              <span className="hidden sm:inline font-bold text-foreground">
                {displayName}님
              </span>

              {/* 아래 방향 화살표 */}
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          }
        />

        {/* 드롭다운 메뉴 팝업 본체 */}
        <DropdownMenuContent
          align="end"
          className="w-72 rounded-2xl p-2 bg-card text-card-foreground border border-border shadow-xl space-y-1"
        >
          {/* 1. 상단 프로필 요약 섹션 */}
          <div className="flex items-center gap-3 p-2">
            {/* 큰 아바타 */}
            <Avatar className="size-11 rounded-full border-2 border-primary/20 shrink-0">
              {user.photoURL && (
                <AvatarImage
                  src={user.photoURL}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                />
              )}
              <AvatarFallback className="text-base bg-primary text-primary-foreground font-bold">
                {displayName.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* 계정 텍스트 정보 */}
            <div className="flex flex-col min-w-0 flex-1">
              {/* displayName */}
              <span className="font-bold text-sm text-foreground truncate">
                {displayName}
              </span>
              {/* 구글 실명 */}
              <span className="text-xs text-muted-foreground truncate">
                {user.username || user.name}
              </span>
              {/* 구글 이메일 */}
              <span className="text-[11px] text-muted-foreground truncate">
                {user.email}
              </span>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-border" />

          {/* 2. 한 줄 소개 및 내 링크 개수 요약 */}
          <div className="px-2 py-1.5 space-y-1">
            {/* 한 줄 소개 */}
            <p className="text-xs text-muted-foreground break-words line-clamp-2">
              {hasCustomBio ? (
                <span className="font-medium text-foreground">{profile?.bio}</span>
              ) : (
                <span className="italic text-muted-foreground/80">
                  한 줄 소개를 아직 안 썼어요 · 마이페이지에서 수정
                </span>
              )}
            </p>

            {/* 내 링크 개수 */}
            <p className="text-[11px] font-semibold text-primary">
              {linksQuery.isLoading ? (
                "링크 수 불러오는 중…"
              ) : (
                `내 링크 ${linksQuery.data?.length ?? 0}개`
              )}
            </p>
          </div>

          <DropdownMenuSeparator className="bg-border" />

          {/* 3. 주요 이동 메뉴 링크들 */}
          <DropdownMenuItem
            onClick={() => router.push("/")}
            className="rounded-xl px-2.5 py-2 text-xs font-semibold hover:bg-muted cursor-pointer flex items-center gap-2"
          >
            <User className="size-4 text-primary" />
            <span>마이페이지</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push(pagePath)}
            className="rounded-xl px-2.5 py-2 text-xs font-semibold hover:bg-muted cursor-pointer flex items-center gap-2"
          >
            <Home className="size-4 text-accent" />
            <span>내 페이지로 이동</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/stats")}
            className="rounded-xl px-2.5 py-2 text-xs font-semibold hover:bg-muted cursor-pointer flex items-center gap-2"
          >
            <BarChart3 className="size-4 text-muted-foreground" />
            <span>통계</span>
          </DropdownMenuItem>

          {/* 링크 추가 모달 열기 메뉴 */}
          <DropdownMenuItem
            onClick={() => setAddDialogOpen(true)}
            className="rounded-xl px-2.5 py-2 text-xs font-semibold hover:bg-muted cursor-pointer flex items-center gap-2 text-primary"
          >
            <PlusCircle className="size-4 text-primary" />
            <span>링크 추가</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border" />

          {/* 4. 링크 미리보기 및 복사 */}
          <DropdownMenuItem
            onClick={() => window.open(fullPageUrl, "_blank")}
            className="rounded-xl px-2.5 py-2 text-xs font-medium hover:bg-muted cursor-pointer flex items-center gap-2"
          >
            <ExternalLink className="size-4 text-muted-foreground" />
            <span>내 페이지 미리보기 (새 탭)</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleCopyLink}
            className="rounded-xl px-2.5 py-2 text-xs font-medium hover:bg-muted cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Copy className="size-4 text-muted-foreground" />
              <span>내 페이지 링크 복사</span>
            </div>
            {copied && <Check className="size-3.5 text-emerald-500" />}
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border" />

          {/* 5. 계정 정보 및 로그아웃 */}
          <DropdownMenuLabel className="px-2.5 py-1 text-[11px] text-muted-foreground">
            Google 계정으로 로그인됨
          </DropdownMenuLabel>

          <DropdownMenuItem
            variant="destructive"
            onClick={handleSignOut}
            className="rounded-xl px-2.5 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 cursor-pointer flex items-center gap-2"
          >
            <LogOut className="size-4 text-destructive" />
            <span>로그아웃</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 메뉴에서 직접 새 링크를 추가할 수 있는 AddLinkDialog */}
      <AddLinkDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={async () => {
          // 추가 시 쿼리 자동 무효화됨
        }}
      />
    </>
  );
}
