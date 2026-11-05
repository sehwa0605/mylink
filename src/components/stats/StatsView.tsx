"use client";

// 리액트 기본 훅 임포트
import React, { useEffect } from "react";
// Next.js 라우터 훅 임포트
import { useRouter } from "next/navigation";
// 사용자 상태 훅 임포트
import { useUser } from "@/hooks/useUser";
// TanStack Query 링크 목록 조회 훅 임포트
import { useLinksQuery } from "@/lib/queries";
// shadcn Card 컴포넌트 임포트
import { Card } from "@/components/ui/card";
// 로딩 스켈레톤 컴포넌트 임포트
import { Skeleton } from "@/components/ui/skeleton";
// 링크 브랜드 및 파비콘 아이콘 컴포넌트 임포트
import { LinkIcon } from "@/components/link/LinkIcon";
// shadcn Chart 컴포넌트 및 설정 타입 임포트
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
// Recharts 시각화 차트 컴포넌트 임포트
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
// Lucide 아이콘 임포트
import {
  BarChart3,
  MousePointerClick,
  Trophy,
  Hash,
  Calculator,
  ExternalLink,
  Sparkles,
} from "lucide-react";
// 클래스 병합 유틸리티 함수 임포트
import { cn } from "@/lib/utils";

// 차트 색상 및 라벨 설정 (스위치 네온 primary 컬러 매핑)
const chartConfig = {
  clickCount: {
    label: "클릭 수",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

// 로그인한 사용자만 볼 수 있는 링크 클릭 통계 뷰 컴포넌트 (13주차)
export function StatsView() {
  // 라우터 인스턴스 획득
  const router = useRouter();
  // 현재 로그인 사용자 및 인증 준비 상태 확인
  const { user, authReady } = useUser();

  // 비로그인 사용자 리다이렉트 처리 (새로고침 깜빡임 방지를 위해 authReady 대기 후 이동)
  useEffect(() => {
    // 인증 확인이 끝났는데 로그인된 유저가 없으면 홈으로 replace 이동 (뒤로 가기 기록 방지)
    if (authReady && !user) {
      router.replace("/");
    }
  }, [authReady, user, router]);

  // 마이페이지와 동일한 쿼리 캐시를 사용하여 링크 목록 페칭
  const linksQuery = useLinksQuery(user?.uid);
  // 링크 데이터 배열 추출 (없으면 빈 배열)
  const links = linksQuery.data ?? [];

  // 인증 상태 확인 중이거나 쿼리 초기 로딩 중인 경우 스켈레톤 자리표시 노출
  if (!authReady || !user || linksQuery.isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* 상단 타이틀 스켈레톤 */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-4 w-60 rounded-md" />
        </div>
        {/* 요약 카드 스켈레톤 */}
        <Skeleton className="w-full h-44 rounded-3xl" />
        {/* 차트 카드 스켈레톤 */}
        <Skeleton className="w-full h-72 rounded-3xl" />
        {/* 순위표 카드 스켈레톤 */}
        <Skeleton className="w-full h-56 rounded-3xl" />
      </div>
    );
  }

  // 1. 통계 데이터 계산
  // 총 링크 수
  const totalLinks = links.length;
  // 전체 링크의 누적 클릭 수 합계
  const totalClicks = links.reduce((sum, link) => sum + (link.clickCount ?? 0), 0);
  // 링크당 평균 클릭 수 (소수 첫째 자리까지 표기)
  const avgClicks = totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : "0.0";

  // 클릭 수 기준 내림차순(많이 눌린 순서) 정렬된 링크 배열 생성
  const sortedLinks = [...links].sort((a, b) => (b.clickCount ?? 0) - (a.clickCount ?? 0));
  // 가장 많이 눌린 1위 링크 (클릭이 전혀 없으면 없음 처리)
  const topLink = totalClicks > 0 && sortedLinks.length > 0 ? sortedLinks[0] : null;

  // 2. 가로 막대 차트용 데이터 배열 생성 (이름이 8자 초과 시 말줄임 처리)
  const chartData = sortedLinks.map((link) => ({
    id: link.id,
    fullName: link.title,
    // 8글자 초과 시 말줄임표 처리
    displayName: link.title.length > 8 ? `${link.title.slice(0, 8)}…` : link.title,
    clickCount: link.clickCount ?? 0,
  }));

  // 차트 동적 높이 계산: 링크 수 × 40px + 기본 패딩 28px (최소 180px)
  const chartHeight = Math.max(180, chartData.length * 40 + 28);

  return (
    // 통계 대시보드 메인 레이아웃 컨테이너
    <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* 상단 페이지 헤더 */}
      <div className="space-y-1 text-left">
        {/* 닌텐도 스위치 듀얼 컬러 네온 도트 데코 */}
        <div className="flex items-center gap-1.5 pb-1" aria-hidden="true">
          <span className="size-2 rounded-full bg-primary" />
          <span className="size-2 rounded-full bg-accent" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Analytics
          </span>
        </div>
        {/* 대시보드 타이틀 */}
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
          <span>통계</span>
          <BarChart3 className="size-6 text-primary" />
        </h1>
        {/* 부제 안내 문구 */}
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          내 링크가 얼마나 눌렸는지 한눈에 분석해 보세요.
        </p>
      </div>

      {/* ① 총 클릭 수 및 주요 지표 판 */}
      <Card className="w-full bg-card rounded-3xl p-6 border border-border shadow-md space-y-6 text-left">
        {/* 총 클릭 수 대형 숫자 헤더 */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <MousePointerClick className="size-3.5 text-primary" />
            <span>총 클릭수</span>
          </div>
          {/* 세 자리 쉼표가 적용된 대형 숫자 */}
          <div className="text-4xl sm:text-5xl font-black text-foreground tracking-tight tabular-nums">
            {totalClicks.toLocaleString("ko-KR")}
            <span className="text-lg font-bold text-muted-foreground ml-1">회</span>
          </div>
        </div>

        {/* 하단 3개 보조 지표 칸 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/60">
          {/* 1. 전체 등록 링크 수 */}
          <div className="bg-muted/50 rounded-2xl p-3.5 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              <Hash className="size-3.5 text-primary" />
              <span>등록된 링크</span>
            </div>
            <p className="text-lg font-extrabold text-foreground tabular-nums">
              {totalLinks}
              <span className="text-xs font-medium text-muted-foreground ml-0.5">개</span>
            </p>
          </div>

          {/* 2. 1위 링크 제목 */}
          <div className="bg-muted/50 rounded-2xl p-3.5 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              <Trophy className="size-3.5 text-amber-500" />
              <span>가장 인기 있는 링크</span>
            </div>
            <p className="text-sm font-extrabold text-foreground truncate">
              {topLink ? topLink.title : "—"}
            </p>
          </div>

          {/* 3. 링크당 평균 클릭 수 */}
          <div className="bg-muted/50 rounded-2xl p-3.5 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              <Calculator className="size-3.5 text-accent" />
              <span>링크당 평균</span>
            </div>
            <p className="text-lg font-extrabold text-foreground tabular-nums">
              {avgClicks}
              <span className="text-xs font-medium text-muted-foreground ml-0.5">회</span>
            </p>
          </div>
        </div>
      </Card>

      {/* ② 링크별 클릭 수 가로 막대 차트 판 */}
      <Card className="w-full bg-card rounded-3xl p-6 border border-border shadow-md space-y-4 text-left">
        {/* 차트 헤더 타이틀 */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
              <span>링크별 클릭수</span>
              <Sparkles className="size-4 text-primary" />
            </h2>
            <p className="text-xs text-muted-foreground">
              가장 많이 눌린 링크부터 순서대로 표시돼요.
            </p>
          </div>
        </div>

        {/* 차트 영역 분기: 링크가 없거나 클릭이 0인 경우 빈 안내 표시 */}
        {totalLinks === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">아직 등록된 링크가 없어요.</p>
            <p>마이페이지에서 새 링크를 추가해 보세요.</p>
          </div>
        ) : totalClicks === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">아직 클릭된 링크가 없어요.</p>
            <p>내 페이지 주소를 친구들에게 공유해 보세요!</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="w-full overflow-hidden"
            style={{ height: `${chartHeight}px` }}
          >
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 35, left: 10, bottom: 5 }}
            >
              {/* X축: 정수 눈금만 허용 */}
              <XAxis type="number" allowDecimals={false} hide />
              {/* Y축: 8자 초과 말줄임 라벨 */}
              <YAxis
                dataKey="displayName"
                type="category"
                tickLine={false}
                axisLine={false}
                width={85}
                tick={{ fontSize: 12, fill: "var(--foreground)", fontWeight: 600 }}
              />
              {/* 마우스 오버 말풍선 툴팁 */}
              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.35 }}
                content={
                  <ChartTooltipContent
                    formatter={(val, _name, item) => (
                      <div className="flex items-center justify-between gap-4 w-full">
                        <span className="text-muted-foreground font-medium">
                          {item.payload.fullName}
                        </span>
                        <span className="font-extrabold text-foreground tabular-nums">
                          {Number(val).toLocaleString()}회
                        </span>
                      </div>
                    )}
                  />
                }
              />
              {/* 가로 막대 렌더링 (끝부분 둥글게, 라벨 표시) */}
              <Bar
                dataKey="clickCount"
                fill="var(--color-clickCount)"
                radius={[0, 8, 8, 0]}
                barSize={24}
              >
                {/* 막대 우측 끝에 클릭 수 숫자 표기 */}
                <LabelList
                  dataKey="clickCount"
                  position="right"
                  className="fill-foreground text-xs font-bold tabular-nums"
                  formatter={(val: unknown) => `${Number(val).toLocaleString()}회`}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </Card>

      {/* ③ 클릭 순위표 판 (링크가 1개 이상 존재할 때만 렌더링) */}
      {totalLinks > 0 && (
        <Card className="w-full bg-card rounded-3xl p-6 border border-border shadow-md space-y-4 text-left">
          {/* 순위표 헤더 */}
          <div className="space-y-0.5">
            <h2 className="text-base font-extrabold text-foreground tracking-tight">
              링크 순위표
            </h2>
            <p className="text-xs text-muted-foreground">
              각 링크의 클릭 점유율을 확인해 보세요.
            </p>
          </div>

          {/* 순위표 리스트 */}
          <div className="divide-y divide-border/60">
            {sortedLinks.map((link, index) => {
              // 1위 여부 판별
              const isFirst = index === 0 && (link.clickCount ?? 0) > 0;
              // 2위 및 3위 판별
              const isTopThree = index < 3 && (link.clickCount ?? 0) > 0;
              // 전체 중 클릭 점유율 퍼센트 계산
              const percentage =
                totalClicks > 0
                  ? Math.round(((link.clickCount ?? 0) / totalClicks) * 100)
                  : 0;

              return (
                <div
                  key={link.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs first:pt-1 last:pb-1"
                >
                  {/* 좌측 순위 뱃지 및 링크 정보 */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* 순위 뱃지 (1위: 스위치 네온 레드 배지) */}
                    <div
                      className={cn(
                        "size-6 rounded-full flex items-center justify-center font-extrabold text-[11px] shrink-0",
                        isFirst
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : isTopThree
                          ? "bg-accent/20 text-accent"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </div>

                    {/* 링크 아이콘 */}
                    <LinkIcon url={link.url} className="size-7" />

                    {/* 링크 제목 및 새 탭 링크 */}
                    <div className="min-w-0 flex-1">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-foreground hover:text-primary transition-colors truncate block flex items-center gap-1 group"
                      >
                        <span className="truncate">{link.title}</span>
                        <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* 우측 클릭 수 및 점유율 */}
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-foreground tabular-nums text-sm">
                      {(link.clickCount ?? 0).toLocaleString()}회
                    </span>
                    <span className="text-[11px] text-muted-foreground block font-medium tabular-nums">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
