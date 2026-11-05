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
  CheckCircle2,
  ArrowRight,
  User,
} from "lucide-react";

// 랜딩 페이지 인터랙티브 미리보기용 데모 링크 데이터 타입 정의
interface DemoLinkItem {
  // 데모 링크 고유 ID
  id: string;
  // 데모 링크 제목
  title: string;
  // 데모 링크 URL (LinkIcon 자동 매핑용)
  url: string;
  // 데모 클릭 횟수 초기값
  clicks: number;
  // 막대 차트 너비 클래스 (Tailwind 토큰)
  barWidthClass: string;
}

// 초기 데모 링크 목록 상수 정의
const INITIAL_DEMO_LINKS: DemoLinkItem[] = [
  {
    // 첫 번째 데모 링크: GitHub
    id: "demo-github",
    // 링크 제목
    title: "GitHub 프로젝트 저장소",
    // GitHub 브랜드 아이콘 매핑용 URL
    url: "https://github.com/sehwa0605",
    // 기본 클릭 수
    clicks: 42,
    // 차트 막대 길이 클래스
    barWidthClass: "w-full",
  },
  {
    // 두 번째 데모 링크: Velog
    id: "demo-velog",
    // 링크 제목
    title: "유기나노공학 & 코딩 개발 일지",
    // Velog 브랜드 아이콘 매핑용 URL
    url: "https://velog.io/@sehwa",
    // 기본 클릭 수
    clicks: 28,
    // 차트 막대 길이 클래스
    barWidthClass: "w-3/4",
  },
  {
    // 세 번째 데모 링크: YouTube
    id: "demo-youtube",
    // 링크 제목
    title: "바이브코딩 시연 영상 채널",
    // YouTube 브랜드 아이콘 매핑용 URL
    url: "https://youtube.com/@sehwa",
    // 기본 클릭 수
    clicks: 19,
    // 차트 막대 길이 클래스
    barWidthClass: "w-1/2",
  },
];

// 비로그인 사용자가 메인(/) 접속 시 노출되는 스위치 네온 감성의 반응형 랜딩 페이지 컴포넌트
export function LandingPage() {
  // 사용자가 직접 입력해볼 수 있는 내 공개 주소 핸들 미리보기 상태
  const [previewHandle, setPreviewHandle] = useState("ysh8436");
  // 콘솔 프리뷰 카드 내부 탭 상태 ('profile': 공개 프로필 화면, 'stats': 클릭 통계 화면)
  const [previewTab, setPreviewTab] = useState<"profile" | "stats">("profile");
  // 데모 링크 클릭 시 실시간으로 숫자가 올라가는 체험용 링크 상태
  const [demoLinks, setDemoLinks] = useState<DemoLinkItem[]>(INITIAL_DEMO_LINKS);
  // 방금 클릭한 데모 링크 ID (클릭 피드백 효과용)
  const [justClickedId, setJustClickedId] = useState<string | null>(null);

  // 화면에 표시할 안전한 핸들 문자열 (빈 칸일 경우 기본값 표시)
  const activeHandle = previewHandle.trim() || "my_id";

  // 데모 링크 전체 클릭 수 합계 계산
  const totalDemoClicks = demoLinks.reduce((acc, item) => acc + item.clicks, 0);

  // 데모 링크 클릭 시 클릭 수를 +1 증가시키는 체험 핸들러
  const handleDemoLinkClick = (id: string) => {
    // 클릭한 링크의 클릭 수 +1 갱신
    setDemoLinks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, clicks: item.clicks + 1 } : item
      )
    );
    // 방금 클릭한 링크 강조 상태 설정
    setJustClickedId(id);
  };

  return (
    // 랜딩 페이지 전체 반응형 래퍼 (모바일~데스크톱 최대 폭 확장 및 여백 설정)
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-10 lg:py-14 space-y-10 sm:space-y-14">
      {/* 1. 히어로 섹션: 좌측 소개 & 주소 체험기 + 우측 인터랙티브 스위치 콘솔 목업 (반응형 1열 -> 12열 그리드) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
        {/* 좌측 히어로 텍스트 및 액션 영역 (데스크톱 7칸 차지, 모바일 중앙 정렬 / 데스크톱 좌측 정렬) */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          {/* 상단 스위치 듀얼 네온 배지 */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border shadow-xs select-none">
            {/* 레드 & 블루 조이콘 도트 */}
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-primary animate-pulse" />
              <span className="size-2.5 rounded-full bg-accent animate-pulse" />
            </div>
            {/* 배지 텍스트 */}
            <span className="text-xs font-extrabold text-foreground tracking-tight">
              SWITCH NEON · 아이디어를 코드로 연결하는 링크인바이오
            </span>
          </div>

          {/* 대형 헤드라인 2줄 및 부제 영역 */}
          <div className="space-y-3">
            {/* 큰 헤드라인 2줄 (화면 크기에 따라 폰트 크기 반응형 조절) */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight break-keep">
              내 모든 링크를 하나로, <br />
              <span className="text-primary">나만의 스위치 네온</span>{" "}
              <span className="text-accent">마이링크</span>
            </h1>
            {/* 부제 문구 */}
            <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed break-keep">
              GitHub, 기술 블로그, 유튜브, 포트폴리오까지 흩어진 내 링크를 한 페이지에 모으고,
              실시간 클릭 통계까지 콘솔 감성으로 관리해보세요.
            </p>
          </div>

          {/* 나만의 공개 주소 실시간 체험 바 (입력 시 우측 프리뷰 카드와 즉시 연동) */}
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-2.5 shadow-sm space-y-1.5">
            {/* 체험 안내 라벨 */}
            <div className="flex items-center justify-between px-1 text-[11px] font-bold text-muted-foreground">
              <span className="flex items-center gap-1">
                <Gamepad2 className="size-3.5 text-primary" />
                <span>내 공개 주소 미리 만들어보기</span>
              </span>
              <span className="text-accent font-mono">실시간 미리보기 연동</span>
            </div>
            {/* 도메인 접두사 + 아이디 입력 인풋 */}
            <div className="flex items-center gap-1.5 bg-muted/60 rounded-xl px-3 py-1 border border-border/60">
              {/* 고정 도메인 텍스트 */}
              <span className="text-xs sm:text-sm font-mono font-bold text-muted-foreground select-none shrink-0">
                mylink.app/
              </span>
              {/* 아이디 체험 입력창 */}
              <Input
                type="text"
                value={previewHandle}
                onChange={(e) => setPreviewHandle(e.target.value.replace(/\s+/g, ""))}
                maxLength={20}
                aria-label="미리보기 아이디 입력"
                placeholder="내아이디"
                className="h-8 border-0 bg-transparent px-1 font-mono font-extrabold text-sm text-foreground focus-visible:ring-0 shadow-none"
              />
              {/* 완성 배지 */}
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-primary/10 text-primary shrink-0">
                @{activeHandle}
              </span>
            </div>
          </div>

          {/* 구글 로그인 CTA 액션 버튼 및 체크 포인트 */}
          <div className="w-full max-w-md flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-3 pt-1">
            {/* Google로 계속하기 메인 CTA 버튼 */}
            <GoogleLoginButton variant="landing" className="w-full sm:w-auto" />
            {/* 보조 안내 문구 */}
            <span className="text-xs text-muted-foreground font-medium">
              별도 가입 없이 Google 계정으로 3초 만에 시작하세요
            </span>
          </div>
        </div>

        {/* 우측 인터랙티브 스위치 네온 콘솔 프리뷰 영역 (데스크톱 5칸 차지) */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          {/* 조이콘 좌(레드)/우(블루) 상단 포인트가 들어간 콘솔 목업 카드 */}
          <Card className="w-full bg-card rounded-3xl p-0 border-2 border-border shadow-lg overflow-hidden">
            {/* 콘솔 상단 상태 바: 좌측 레드 도트 + 모드 전환 탭 + 우측 블루 도트 */}
            <div className="bg-muted/70 border-b border-border px-4 py-3 flex items-center justify-between gap-2">
              {/* 좌측 조이콘 레드 포인트 */}
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-primary" />
                <span className="text-[11px] font-extrabold font-mono text-muted-foreground hidden sm:inline">
                  LIVE DEMO
                </span>
              </div>

              {/* 공개 프로필 vs 클릭 통계 미리보기 전환 버튼 그룹 */}
              <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border">
                {/* 프로필 미리보기 탭 버튼 */}
                <Button
                  type="button"
                  size="sm"
                  variant={previewTab === "profile" ? "default" : "ghost"}
                  onClick={() => setPreviewTab("profile")}
                  className={cn(
                    "h-7 px-2.5 rounded-lg text-xs font-bold cursor-pointer transition-all",
                    previewTab === "profile"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <User className="size-3 mr-1" />
                  <span>공개 프로필</span>
                </Button>
                {/* 통계 미리보기 탭 버튼 */}
                <Button
                  type="button"
                  size="sm"
                  variant={previewTab === "stats" ? "default" : "ghost"}
                  onClick={() => setPreviewTab("stats")}
                  className={cn(
                    "h-7 px-2.5 rounded-lg text-xs font-bold cursor-pointer transition-all",
                    previewTab === "stats"
                      ? "bg-accent text-accent-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <BarChart3 className="size-3 mr-1" />
                  <span>통계 ({totalDemoClicks})</span>
                </Button>
              </div>

              {/* 우측 조이콘 블루 포인트 */}
              <span className="size-3 rounded-full bg-accent" />
            </div>

            {/* 콘솔 화면 본문 영역 */}
            <div className="p-5 space-y-4 text-left">
              {previewTab === "profile" ? (
                // [탭 1] 공개 프로필 미리보기 화면
                <>
                  {/* 미니 프로필 헤더 */}
                  <div className="flex items-center gap-3.5">
                    {/* 아바타 아이콘 */}
                    <Avatar className="size-14 rounded-full ring-4 ring-primary/15 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg font-black">
                        {activeHandle.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* 이름, 핸들, 소개글 */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-extrabold text-foreground truncate">
                          양세화 (Sehwa Yang)
                        </h3>
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-accent/15 text-accent shrink-0">
                          PRO
                        </span>
                      </div>
                      <p className="text-xs font-mono font-bold text-accent truncate">
                        @{activeHandle}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        유기나노공학을 공부하며 아이디어를 코드로 만듭니다.
                      </p>
                    </div>
                  </div>

                  {/* 인터랙티브 체험 안내 배너 */}
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-muted/60 text-[11px] font-semibold text-muted-foreground">
                    <span>👇 아래 샘플 링크를 직접 클릭해 보세요!</span>
                    <span className="font-mono font-bold text-primary">
                      총 {totalDemoClicks}회 클릭
                    </span>
                  </div>

                  {/* 데모 링크 버튼 리스트 (클릭 시 카운트 +1 체험) */}
                  <div className="space-y-2.5">
                    {demoLinks.map((item) => {
                      // 방금 클릭된 링크인지 확인
                      const isClicked = justClickedId === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleDemoLinkClick(item.id)}
                          className={cn(
                            "w-full p-3 rounded-2xl border bg-card hover:bg-muted/50 transition-all hover:-translate-y-0.5 shadow-xs flex items-center justify-between gap-3 text-left cursor-pointer group",
                            isClicked ? "border-primary ring-2 ring-primary/20" : "border-border"
                          )}
                        >
                          {/* 좌측 브랜드 아이콘 + 링크 제목 */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <LinkIcon url={item.url} />
                            <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                              {item.title}
                            </span>
                          </div>
                          {/* 우측 실시간 클릭 수 배지 및 화살표 */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {item.clicks}회
                            </span>
                            <span className="text-accent font-bold group-hover:translate-x-0.5 transition-transform">
                              &gt;
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                // [탭 2] 클릭 통계 대시보드 미리보기 화면
                <div className="space-y-4">
                  {/* 총 클릭 수 요약 박스 */}
                  <div className="p-3.5 rounded-2xl bg-muted/60 border border-border flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground">
                        실시간 누적 링크 클릭
                      </p>
                      <p className="text-2xl font-black text-foreground">
                        {totalDemoClicks}
                        <span className="text-xs font-bold text-muted-foreground ml-1">회</span>
                      </p>
                    </div>
                    <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <MousePointerClick className="size-5" />
                    </div>
                  </div>

                  {/* 링크별 미니 가로 막대 차트 및 순위 */}
                  <div className="space-y-3">
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
                          {/* 막대 게이지 바 */}
                          <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
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

                  {/* 다시 프로필 탭으로 돌아가기 안내 버튼 */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewTab("profile")}
                    className="w-full h-9 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    프로필 탭으로 돌아가서 더 클릭해보기
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* 2. 서비스 핵심 기능 4가지 안내 섹션 (반응형 1열 -> 2열 -> 4열 그리드) */}
      <Card className="w-full bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-md text-left space-y-5">
        {/* 안내 카드 상단 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
              <Sparkles className="size-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-foreground">
                로그인하면 이런 것들을 할 수 있어요
              </h2>
              <p className="text-xs text-muted-foreground">
                복잡한 설정 없이 꼭 필요한 링크 관리와 통계 기능만 담았습니다
              </p>
            </div>
          </div>
          {/* 콘솔 스타일 포인트 배지 */}
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
            <CheckCircle2 className="size-3.5" />
            <span>4가지 핵심 기능 기본 제공</span>
          </span>
        </div>

        {/* 4가지 핵심 기능 반응형 그리드 (모바일 1열, 태블릿 2열, 데스크톱 4열) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {/* 포인트 1: 원클릭 링크 모음 & 자동 아이콘 */}
          <div className="p-4 rounded-2xl bg-muted/50 border border-border/60 hover:border-primary/40 hover:-translate-y-0.5 transition-all space-y-2">
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <LinkIconLucide className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">원클릭 링크 모음</h3>
            <p className="text-xs text-muted-foreground leading-relaxed break-keep">
              깃허브, 벨로그, 유튜브 등 URL만 입력하면 브랜드 아이콘이 자동으로 매핑돼요.
            </p>
          </div>

          {/* 포인트 2: 안전한 내 계정 분리 저장 */}
          <div className="p-4 rounded-2xl bg-muted/50 border border-border/60 hover:border-accent/40 hover:-translate-y-0.5 transition-all space-y-2">
            <div className="size-8 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <ShieldCheck className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">안전한 내 계정 보관</h3>
            <p className="text-xs text-muted-foreground leading-relaxed break-keep">
              링크와 프로필은 내 구글 계정 전용 공간에 안전하게 분리되어 저장돼요.
            </p>
          </div>

          {/* 포인트 3: 나만의 고유 주소 */}
          <div className="p-4 rounded-2xl bg-muted/50 border border-border/60 hover:border-primary/40 hover:-translate-y-0.5 transition-all space-y-2">
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Zap className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">나만의 고유 주소</h3>
            <p className="text-xs text-muted-foreground leading-relaxed break-keep">
              이메일 아이디 기반의 깔끔한 공개 프로필 링크(/{`내아이디`})가 즉시 생성돼요.
            </p>
          </div>

          {/* 포인트 4: 실시간 클릭 통계 대시보드 */}
          <div className="p-4 rounded-2xl bg-muted/50 border border-border/60 hover:border-accent/40 hover:-translate-y-0.5 transition-all space-y-2">
            <div className="size-8 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <BarChart3 className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">클릭 수 & 통계 차트</h3>
            <p className="text-xs text-muted-foreground leading-relaxed break-keep">
              방문자가 어떤 링크를 가장 많이 눌렀는지 막대 차트와 순위표로 한눈에 확인해요.
            </p>
          </div>
        </div>

        {/* 하단 요약 안내 문구 */}
        <p className="text-xs text-muted-foreground pt-2 border-t border-border/60">
          🔒 로그인하면 깃허브·블로그 같은 내 링크를 한 페이지에 모아 추가·수정·삭제할 수 있어요. 링크는 내 계정에만 따로 저장돼요.
        </p>
      </Card>

      {/* 3. 3단계 게임 스테이지 방식의 시작 가이드 섹션 (반응형 1열 -> 3열 그리드) */}
      <section className="space-y-4 text-left">
        {/* 섹션 타이틀 */}
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono font-extrabold text-primary uppercase tracking-wider">
              HOW TO PLAY
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
              3단계로 끝나는 나만의 프로필 페이지
            </h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
            <span>약 1분 소요</span>
            <ArrowRight className="size-3.5 text-accent" />
          </span>
        </div>

        {/* STAGE 1 ~ 3 반응형 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* STAGE 01 */}
          <Card className="bg-card rounded-3xl p-5 border border-border shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-lg bg-primary text-primary-foreground font-mono text-xs font-extrabold">
                STAGE 01
              </span>
              <span className="text-xs font-bold text-muted-foreground">계정 연동</span>
            </div>
            <h3 className="text-base font-extrabold text-foreground">
              Google 계정으로 로그인
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed break-keep">
              복잡한 회원가입 없이 구글 로그인 한 번이면 내 이메일 아이디로 전용 주소가 즉시 만들어집니다.
            </p>
          </Card>

          {/* STAGE 02 */}
          <Card className="bg-card rounded-3xl p-5 border border-border shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-lg bg-accent text-accent-foreground font-mono text-xs font-extrabold">
                STAGE 02
              </span>
              <span className="text-xs font-bold text-muted-foreground">프로필 & 링크 구성</span>
            </div>
            <h3 className="text-base font-extrabold text-foreground">
              소개글 작성 & 새 링크 추가
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed break-keep">
              마이페이지에서 한 줄 소개를 적고 [+ 새로운 링크 추가하기] 버튼으로 공유할 주소를 등록하세요.
            </p>
          </Card>

          {/* STAGE 03 */}
          <Card className="bg-card rounded-3xl p-5 border border-border shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-lg bg-foreground text-background font-mono text-xs font-extrabold">
                STAGE 03
              </span>
              <span className="text-xs font-bold text-muted-foreground">공유 & 분석</span>
            </div>
            <h3 className="text-base font-extrabold text-foreground">
              내 주소 공유 & 클릭 통계 확인
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed break-keep">
              완성된 내 페이지 주소를 인스타그램·이력서에 공유하고 통계 탭에서 방문자 반응을 확인하세요.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
