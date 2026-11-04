import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  name: string;
  username?: string | null;
  bio?: string;
  photoURL?: string | null;
  className?: string;
}

// 6주차: 프로필 상단 헤더 컴포넌트 (아바타, 이름, 영문 표기, 한 줄 소개)
export function ProfileHeader({
  name,
  username,
  bio,
  photoURL,
  className,
}: ProfileHeaderProps) {
  // 아바타 대체 텍스트 (이름의 첫 글자)
  const initial = (name || "양").slice(0, 1);

  return (
    <header className={cn("flex flex-col items-center text-center w-full", className)}>
      {/* 상단 닌텐도 스위치 조이콘 미니 뱃지 장식 */}
      <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-full select-none">
          <span className="size-2 rounded-full bg-primary" />
          JOY-CON (L)
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-accent bg-accent/15 px-2.5 py-1 rounded-full select-none">
          JOY-CON (R)
          <span className="size-2 rounded-full bg-accent" />
        </div>
      </div>

      {/* shadcn Avatar 컴포넌트: 스위치 네온 스타일 링 적용 */}
      <div className="relative mb-4">
        <Avatar className="size-24 rounded-full ring-4 ring-primary/20 shadow-md">
          {photoURL ? (
            <AvatarImage
              src={photoURL}
              alt={name}
              referrerPolicy="no-referrer"
              className="rounded-full object-cover"
            />
          ) : null}
          <AvatarFallback className="bg-gradient-to-tr from-primary to-red-400 text-white font-extrabold text-3xl">
            {initial}
          </AvatarFallback>
        </Avatar>

        {/* 조이콘 아날로그 스틱 느낌의 포인트 링 */}
        <span
          className="absolute bottom-0 right-0 size-6 rounded-full bg-accent border-2 border-card flex items-center justify-center text-[10px] text-white font-black shadow-xs select-none"
          aria-hidden="true"
        >
          +
        </span>
      </div>

      {/* 사용자 이름 */}
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-1">
        {name}
      </h1>

      {/* 사용자 아이디 / 영문 이름 */}
      {username ? (
        <p className="text-sm font-semibold text-muted-foreground mb-3 tracking-wide">
          {username}
        </p>
      ) : null}

      {/* 한 줄 소개글 */}
      {bio ? (
        <p className="text-sm sm:text-base text-foreground/80 font-medium leading-relaxed max-w-xs break-keep bg-secondary px-4 py-2.5 rounded-2xl border border-border mb-6">
          {bio}
        </p>
      ) : null}
    </header>
  );
}
