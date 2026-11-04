"use client";

// 리액트 및 sonner 라이브러리 컴포넌트 임포트
import { Toaster as Sonner, type ToasterProps } from "sonner";
// 테마(라이트/다크) 감지를 위한 훅 임포트
import { useTheme } from "next-themes";
// 알림 타입별 직관적인 루시드 아이콘 임포트
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react";

// 전역 토스트 알림창 컴포넌트 정의
const Toaster = ({ ...props }: ToasterProps) => {
  // 현재 활성화된 시스템 테마 정보 가져오기
  const { theme = "system" } = useTheme();

  return (
    // Sonner 기본 토스터 설정
    <Sonner
      // 테마 설정 전달
      theme={theme as ToasterProps["theme"]}
      // 화면 상단 중앙에 토스트 표시
      position="top-center"
      // 상단 여백 (헤더 높이 고려 약 60px)
      offset={60}
      // 닫기 X 버튼 항상 표시
      closeButton={true}
      // 토스트 기본 유지 시간 3초(3000ms)
      duration={3000}
      // 전체 토스터 클래스명
      className="toaster group"
      // 알림 종류별 아이콘 커스텀
      icons={{
        // 성공 토스트 아이콘 (초록색 원형 체크)
        success: <CircleCheckIcon className="size-4 text-emerald-500" />,
        // 정보 토스트 아이콘 (네온 블루 정보)
        info: <InfoIcon className="size-4 text-accent" />,
        // 경고 토스트 아이콘 (주황색 삼각형 경고)
        warning: <TriangleAlertIcon className="size-4 text-amber-500" />,
        // 오류 토스트 아이콘 (닌텐도 레드 팔각형 X)
        error: <OctagonXIcon className="size-4 text-primary" />,
        // 로딩 토스트 아이콘 (회전하는 스피너)
        loading: <Loader2Icon className="size-4 animate-spin text-muted-foreground" />,
      }}
      // 세부 토스트 옵션 커스텀 (15px 굵은 글자 및 왼쪽 색 띠 스타일링)
      toastOptions={{
        classNames: {
          // 모든 토스트 공통 기본 스타일 (15px 굵게, 부드러운 그림자, 둥근 모서리)
          toast: "group toast font-semibold text-[15px] border border-border bg-card text-card-foreground shadow-lg rounded-2xl flex items-center gap-3 p-4",
          // 성공 토스트: 왼쪽 굵은 초록색 띠
          success: "!border-l-4 !border-l-emerald-500",
          // 오류 토스트: 왼쪽 굵은 닌텐도 레드 띠
          error: "!border-l-4 !border-l-primary",
          // 경고 토스트: 왼쪽 굵은 주황색 띠
          warning: "!border-l-4 !border-l-amber-500",
          // 정보 토스트: 왼쪽 굵은 네온 시안 블루 띠
          info: "!border-l-4 !border-l-accent",
        },
      }}
      // 외부에서 전달된 추가 props 병합
      {...props}
    />
  );
};

// 다른 곳에서 사용할 수 있도록 컴포넌트 내보내기
export { Toaster };
