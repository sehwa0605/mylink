"use client";

import React, { useState } from "react";
import { Mail, Link as LinkIconLucide, NotebookPen } from "lucide-react";
import {
  siGithub,
  siYoutube,
  siInstagram,
  siX,
  siVelog,
} from "simple-icons";
import { getLinkIconInfo } from "@/lib/linkIcon";
import { cn } from "@/lib/utils";

interface LinkIconProps {
  url: string;
  className?: string;
}

// 4장 4-7: URL에 따른 브랜드 로고 또는 파비콘 렌더링 컴포넌트
export function LinkIcon({ url, className }: LinkIconProps) {
  // 파비콘 로드 실패 시 폴백 아이콘 노출 상태
  const [faviconError, setFaviconError] = useState(false);

  const iconInfo = getLinkIconInfo(url);

  // Simple Icons 브랜드 SVG 렌더링 함수
  const renderSimpleIcon = (icon: { path: string }) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className="size-4 fill-current"
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );

  // 1. 메일 아이콘
  if (iconInfo.kind === "mail") {
    return (
      <div
        className={cn(
          "size-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs",
          iconInfo.bgClass,
          className
        )}
        aria-hidden="true"
      >
        <Mail className="size-4" />
      </div>
    );
  }

  // 2. 브랜드 로고 (simple-icons)
  if (iconInfo.isBrand) {
    let brandSvg: React.ReactNode = null;
    switch (iconInfo.kind) {
      case "github":
        brandSvg = renderSimpleIcon(siGithub);
        break;
      case "youtube":
        brandSvg = renderSimpleIcon(siYoutube);
        break;
      case "instagram":
        brandSvg = renderSimpleIcon(siInstagram);
        break;
      case "x":
        brandSvg = renderSimpleIcon(siX);
        break;
      case "velog":
        brandSvg = renderSimpleIcon(siVelog);
        break;
    }

    return (
      <div
        className={cn(
          "size-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs",
          iconInfo.bgClass,
          className
        )}
        aria-hidden="true"
      >
        {brandSvg}
      </div>
    );
  }

  // 3. 일반 웹사이트: Google Favicon API (실패 시 Lucide 폴백)
  if (iconInfo.domain && !faviconError) {
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${iconInfo.domain}&sz=64`;
    return (
      <div
        className={cn(
          "size-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-white border border-border shadow-xs",
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={faviconUrl}
          alt=""
          className="size-4 object-contain"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFaviconError(true)}
        />
      </div>
    );
  }

  // 4. 폴백: 블로그는 NotebookPen, 그 외는 Link
  return (
    <div
      className={cn(
        "size-8 rounded-lg flex items-center justify-center shrink-0 bg-muted text-muted-foreground border border-border shadow-xs",
        className
      )}
      aria-hidden="true"
    >
      {iconInfo.kind === "blog" ? (
        <NotebookPen className="size-4" />
      ) : (
        <LinkIconLucide className="size-4" />
      )}
    </div>
  );
}
