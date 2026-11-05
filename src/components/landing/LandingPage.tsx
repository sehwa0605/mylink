"use client";

// 리액트 기본 및 상태 훅 임포트
import React, { useState } from "react";
// shadcn Card 컴포넌트 임포트
import { Card } from "@/components/ui/card";
// shadcn Button 컴포넌트 임포트
import { Button } from "@/components/ui/button";
// shadcn Input 컴포넌트 임포트
import { Input } from "@/components/ui/input";
// shadcn Avatar 컴포넌트 임포트
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// 구글 소셜 로그인 버튼 임포트
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
// URL 기반 자동 브랜드 아이콘 컴포넌트 임포트
import { LinkIcon } from "@/components/link/LinkIcon";
// 클래스 병합 유틸리티 함수 임포트
import { cn } from "@/lib/utils";
// 루시드 아이콘 모음 임포트
import {
  Sparkles,
  Link as LinkIconLucide,
  ShieldCheck,
  Zap,
  BarChart3,
  Gamepad2,
  MousePointerClick,
} from "lucide-react";

// 랜딩 페이지 인터랙티브 미리보기용 데모 링크 데이터 인터페이스
interface DemoLinkItem {
  // 데모 링크 고유 식별자
  id: string;
  // 데모 링크 제목
  title: string;
  // 브랜드 아이콘 자동 매핑용 URL
  url: string;
  // 누적 클릭 횟수
  clicks: number;
  // 통계 막대 너비 비율 클래스
  barWidthClass: string;
}

// 초기 데모 링크 3개 상수 정의
const INITIAL_DEMO_LINKS: DemoLinkItem[] = [
  {
    // 첫 번째 데모 링크: GitHub
    id: "demo-github",
    // 링크 제목
    title: "GitHub 프로젝트 저장소",
    // GitHub URL
    url: "https://github.com/sehwa0605",
    // 초기 클릭 수
    clicks: 42,
    // 차트 막대 폭 클래스
    barWidthClass: "w-full",
  },
  {
    // 두 번째 데모 링크: Velog 블로그
    id: "demo-velog",
    // 링크 제목
    title: "유기나노공학 & 코딩 기록 블로그",
    // Velog URL
    url: "https://velog.io/@sehwa",
    // 초기 클릭 수
    clicks: 28,
    // 차트 막대 폭 클래스
    barWidthClass: "w-3/4",
  },
  {
    // 세 번째 데모 링크: YouTube 채널
    id: "demo-youtube",
    // 링크 제목
    title: "바이브코딩 포트폴리오 영상",
    // YouTube URL
    url: "https://youtube.com/@sehwa",
    // 초기 클릭 수
    clicks: 19,
    // 차트 막대 폭 클래스
    barWidthClass: "w-1/2",
  },
];

// 비로그인 사용자가 메인(/) 접속 시 노출되는 스위치 네온 감성의 랜딩 페이지 컴포넌트 (11주차)
export function LandingPage() {
  // 미리보기 카드에서 체험해볼 수 있는 사용자 공개 주소 아이디 상태
  const [previewHandle, setPreviewHandle] = useState("ysh8436");
  // 미리보기 영역 모드 전환 상태 ('profile': 링크 클릭 체험, 'stats': 실시간 통계 차트)
  const [previewMode, setPreviewMode] = useState<"profile" | "stats">("profile");
  // 클릭 체험용 데모 링크 목록 상태
  const [demoLinks, setDemoLinks] = useState<DemoLinkItem[]>(INITIAL_DEMO_LINKS);
  // 방금 클릭한 데모 링크 강조 표시용 상태
  const [activeLinkId, setActiveLinkId] = useState<string | null>(null);

  // 빈 문자열 입력 시 기본 핸들명 폴백 처리
  const displayHandle = previewHandle.trim() || "my_id";
  // 데모 링크 총 클릭 수 합산
  const totalClicks = demoLinks.reduce((sum, item) => sum + item.clicks, 0);

  // 데모 링크 클릭 시 클릭 수를 1 증가시키는 핸들러
  const handleDemoClick = (id: string) => {
    // 클릭된 항목의 clicks 값을 +1 업데이트
    setDemoLinks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, clicks: item.clicks + 1 } : item
      )
    );
    // 방금 클릭한 링크 ID 기록
    setActiveLinkId(id);
  };

  return (
    // 랜딩 페이지 중앙 정렬 반응형 컨테이너 (모바일~데스크톱 자연스러운 폭 확장)
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-14 flex flex-col items-center justify-center text-center space-y-8">
      {/* 1. 상단 스위치 듀얼 네온 배지 (기존 히어로 유지) */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border shadow-xs select-none">
        {/* 레드 & 블루 조이콘 도트 */}
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-primary animate-pulse" />
          <span className="size-2.5 rounded-full bg-accent animate-pulse" />
        </div>
        {/* 뱃지 텍스트 */}
        <span className="text-xs font-bold text-foreground">
          아이디어를 코드로 연결하는 링크인바이오
        </span>
      </div>

      {/* 2. 대형 헤드라인 2줄 및 부제 영역 (기존 히어로 유지) */}
      <div className="space-y-3">
        {/* 큰 헤드라인 2줄 */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight break-keep">
          내 모든 링크를 하나로, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-accent">
            나만의 스위치 네온 마이링크
          </span>
        </h1>
        {/* 부제 문구 */}
        <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-md mx-auto leading-relaxed break-keep">
          GitHub, 블로그, 포트폴리오를 한 페이지에 모아 나만의 주소로 세상과 공유해보세요.
        </p>
      </div>

      {/* 3. 구글 로그인 CTA 액션 버튼 (기존 히어로 유지) */}
      <div className="w-full max-w-xs flex flex-col items-center gap-2">
        {/* 구글 로그인 대형 버튼 */}
        <GoogleLoginButton variant="landing" className="w-full" />
        {/* 보조 안내 텍스트 */}
        <span className="text-[11px] text-muted-foreground">
          별도 가입 없이 Google 계정으로 즉시 시작하세요
        </span>
      </div>

      {/* 4. 인터랙티브 미리보기 카드 (히어로 및 기능 카드와 동일한 디자인 시스템 통일) */}
      <Card className="w-full bg-card rounded-3xl p-6 sm:p-7 border border-border shadow-md text-left space-y-4">
        {/* 카드 상단 헤더: 아이콘 배지 + 제목 + 모드 전환 버튼 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* 좌측 아이콘 및 섹션 타이틀 */}
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Gamepad2 className="size-4.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                미리 체험해보는 나만의 마이링크
              </h3>
              <p className="text-[11px] text-muted-foreground">
                아이디를 입력하고 샘플 링크를 직접 눌러 통계를 확인해보세요
              </p>
            </div>
          </div>

          {/* 우측 프로필/통계 전환 탭 버튼 */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60 self-start sm:self-auto">
            {/* 공개 프로필 보기 버튼 */}
            <Button
              type="button"
              size="sm"
              variant={previewMode === "profile" ? "default" : "ghost"}
              onClick={() => setPreviewMode("profile")}
              className={cn(
                "h-7 px-2.5 rounded-lg text-xs font-bold cursor-pointer transition-all",
                previewMode === "profile"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              공개 프로필
            </Button>
            {/* 실시간 통계 보기 버튼 */}
            <Button
              type="button"
              size="sm"
              variant={previewMode === "stats" ? "default" : "ghost"}
              onClick={() => setPreviewMode("stats")}
              className={cn(
                "h-7 px-2.5 rounded-lg text-xs font-bold cursor-pointer transition-all",
                previewMode === "stats"
                  ? "bg-accent text-accent-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              클릭 통계 ({totalClicks})
            </Button>
          </div>
        </div>

        {/* 반응형 2단 프리뷰 본문 (모바일 1열, 태블릿 이상 좌우 5:7 분할) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 pt-1">
          {/* 좌측(5칸): 내 공개 주소 입력 체험 및 미니 프로필 박스 */}
          <div className="md:col-span-5 p-4 rounded-2xl bg-muted/50 border border-border/50 flex flex-col justify-between space-y-3">
            {/* 미니 프로필 아바타 및 핸들 표시 */}
            <div className="flex items-center gap-3">
              <Avatar className="size-12 rounded-full ring-2 ring-primary/20 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground font-black text-base">
                  {displayHandle.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">
                  양세화 (Sehwa Yang)
                </p>
                <p className="text-xs font-mono font-bold text-accent truncate">
                  @{displayHandle}
                </p>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                  아이디어를 코드로 만듭니다.
                </p>
              </div>
            </div>

            {/* 내 공개 주소 직접 입력해보기 인풋 박스 */}
            <div className="space-y-1.5 pt-2 border-t border-border/60">
              <label
                htmlFor="landing-handle-input"
                className="text-[11px] font-bold text-muted-foreground block"
              >
                내 공개 주소 아이디 입력해보기
              </label>
              <div className="flex items-center gap-1 bg-card rounded-xl px-2.5 py-1 border border-border">
                <span className="text-xs font-mono font-bold text-muted-foreground select-none">
                  /
                </span>
                <Input
                  id="landing-handle-input"
                  type="text"
                  value={previewHandle}
                  onChange={(e) => setPreviewHandle(e.target.value.replace(/\s+/g, ""))}
                  maxLength={20}
                  placeholder="내아이디"
                  className="h-7 border-0 bg-transparent px-1 font-mono font-bold text-xs text-foreground focus-visible:ring-0 shadow-none"
                />
              </div>
            </div>
          </div>

          {/* 우측(7칸): 샘플 링크 클릭 체험 또는 실시간 통계 막대 차트 */}
          <div className="md:col-span-7 p-4 rounded-2xl bg-muted/50 border border-border/50 space-y-2.5">
            {previewMode === "profile" ? (
              // 공개 프로필 모드: 클릭 가능한 데모 링크 3개
              <>
                <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground px-0.5">
                  <span>👇 링크를 눌러 클릭 수를 올려보세요</span>
                  <span className="text-primary font-mono">총 {totalClicks}회 클릭</span>
                </div>
                <div className="space-y-2">
                  {demoLinks.map((item) => {
                    // 방금 클릭한 링크인지 확인
                    const isJustClicked = activeLinkId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleDemoClick(item.id)}
                        className={cn(
                          "w-full p-2.5 rounded-xl bg-card border transition-all hover:-translate-y-0.5 flex items-center justify-between gap-2.5 text-left cursor-pointer group shadow-xs",
                          isJustClicked ? "border-primary" : "border-border/80"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <LinkIcon url={item.url} className="size-7 rounded-lg" />
                          <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                            {item.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {item.clicks}회
                          </span>
                          <span className="text-accent font-bold text-sm group-hover:translate-x-0.5 transition-transform">
                            &gt;
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              // 클릭 통계 모드: 데모 링크 클릭 순위 및 가로 막대 바
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground px-0.5">
                  <span className="flex items-center gap-1">
                    <MousePointerClick className="size-3.5 text-primary" />
                    <span>실시간 링크 클릭 순위 미리보기</span>
                  </span>
                  <span className="text-accent font-mono">누적 {totalClicks}회</span>
                </div>
                <div className="space-y-2.5 pt-1">
                  {demoLinks
                    .slice()
                    .sort((a, b) => b.clicks - a.clicks)
                    .map((item, idx) => (
                      <div key={item.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-foreground truncate">
                            {idx + 1}위 · {item.title}
                          </span>
                          <span className="font-mono font-bold text-primary shrink-0">
                            {item.clicks}회
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-card border border-border/60 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              idx === 0 ? "bg-primary" : "bg-accent",
                              item.barWidthClass
                            )}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 5. 서비스 핵심 기능 안내 박스 (기존 카드 스타일과 100% 동일한 톤앤매너 + 반응형 2x2/4열) */}
      <Card className="w-full bg-card rounded-3xl p-6 sm:p-7 border border-border shadow-md text-left space-y-4">
        {/* 안내 카드 상단 헤더 */}
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
            <Sparkles className="size-4.5 stroke-[2.5]" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            로그인하면 이런 것들을 할 수 있어요
          </h3>
        </div>

        {/* 4가지 핵심 기능 안내 반응형 그리드 (모바일 1열, 태블릿 이상 2열) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* 포인트 1: 링크 모아보기 */}
          <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/50 space-y-1.5">
            <LinkIconLucide className="size-4 text-primary" />
            <h4 className="text-xs font-bold text-foreground">원클릭 링크 모음 & 자동 아이콘</h4>
            <p className="text-[11px] text-muted-foreground leading-normal break-keep">
              깃허브, 블로그, 유튜브 등 내 모든 링크를 깔끔하게 추가·수정하고 아이콘도 자동으로 맞춰줘요.
            </p>
          </div>

          {/* 포인트 2: 안전한 분리 저장 */}
          <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/50 space-y-1.5">
            <ShieldCheck className="size-4 text-accent" />
            <h4 className="text-xs font-bold text-foreground">안전한 내 계정 보관</h4>
            <p className="text-[11px] text-muted-foreground leading-normal break-keep">
              링크와 프로필은 내 구글 계정에만 안전하게 따로 분리되어 저장돼요.
            </p>
          </div>

          {/* 포인트 3: 공유 주소 */}
          <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/50 space-y-1.5">
            <Zap className="size-4 text-amber-500" />
            <h4 className="text-xs font-bold text-foreground">나만의 고유 주소</h4>
            <p className="text-[11px] text-muted-foreground leading-normal break-keep">
              이메일 아이디 기반의 고유한 공개 링크(/{`내아이디`})를 즉시 제공해요.
            </p>
          </div>

          {/* 포인트 4: 클릭 수 및 통계 대시보드 */}
          <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/50 space-y-1.5">
            <BarChart3 className="size-4 text-primary" />
            <h4 className="text-xs font-bold text-foreground">실시간 클릭 통계 & 순위표</h4>
            <p className="text-[11px] text-muted-foreground leading-normal break-keep">
              방문자가 어떤 링크를 가장 많이 눌렀는지 차트와 순위표로 한눈에 파악할 수 있어요.
            </p>
          </div>
        </div>

        {/* 하단 요약 문구 */}
        <p className="text-xs text-muted-foreground pt-1 border-t border-border/60">
          🔒 로그인하면 깃허브·블로그 같은 내 링크를 한 페이지에 모아 추가·수정·삭제할 수 있어요. 링크는 내 계정에만 따로 저장돼요.
        </p>
      </Card>

      {/* 6. 3단계 시작 가이드 카드 (동일한 Card + bg-muted/50 디자인 통일성 유지) */}
      <Card className="w-full bg-card rounded-3xl p-6 sm:p-7 border border-border shadow-md text-left space-y-4">
        {/* 가이드 카드 상단 헤더 */}
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <MousePointerClick className="size-4.5 stroke-[2.5]" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            1분 만에 완성하는 3단계 시작 방법
          </h3>
        </div>

        {/* 3단계 반응형 그리드 (모바일 1열, 태블릿 이상 3열) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* STEP 1 */}
          <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/50 space-y-1.5">
            <span className="inline-block text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
              STEP 01
            </span>
            <h4 className="text-xs font-bold text-foreground">Google 3초 로그인</h4>
            <p className="text-[11px] text-muted-foreground leading-normal break-keep">
              별도 가입 없이 구글 계정으로 로그인하면 내 고유 주소가 바로 준비돼요.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/50 space-y-1.5">
            <span className="inline-block text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-accent/15 text-accent">
              STEP 02
            </span>
            <h4 className="text-xs font-bold text-foreground">프로필 & 새 링크 추가</h4>
            <p className="text-[11px] text-muted-foreground leading-normal break-keep">
              마이페이지에서 한 줄 소개를 적고 버튼 하나로 공유할 링크들을 등록해요.
            </p>
          </div>

          {/* STEP 3 */}
          <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/50 space-y-1.5">
            <span className="inline-block text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
              STEP 03
            </span>
            <h4 className="text-xs font-bold text-foreground">공유 & 클릭 통계 확인</h4>
            <p className="text-[11px] text-muted-foreground leading-normal break-keep">
              완성된 내 주소를 어디서든 공유하고 통계 탭에서 방문자 클릭 수를 확인해요.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
