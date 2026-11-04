// TanStack Query 클라이언트 클래스 임포트
import { QueryClient } from "@tanstack/react-query";

// QueryClient 기본 설정 옵션을 적용하여 새 인스턴스를 생성하는 팩토리 함수
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    // 기본 쿼리 옵션 지정
    defaultOptions: {
      queries: {
        // 데이터 캐시 유효 시간: 1분(60,000ms) 동안 신선한 상태로 유지
        staleTime: 60_000,
        // 다른 브라우저 탭으로 전환 후 돌아왔을 때 자동 리페치 비활성화 (실시간 느낌 배제)
        refetchOnWindowFocus: false,
        // 네트워크 또는 쿼리 실패 시 최대 1회만 재시도
        retry: 1,
      },
    },
  });
}

// 브라우저 클라이언트 환경에서 재사용할 단일 QueryClient 변수
let browserQueryClient: QueryClient | undefined = undefined;

// SSR(서버)과 클라이언트(브라우저) 환경을 고려하여 적절한 QueryClient를 반환하는 함수
export function getQueryClient(): QueryClient {
  // 서버 사이드 렌더링 시에는 매 요청마다 독립된 새로운 QueryClient 생성
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  // 브라우저 환경에서는 최초 한 번만 생성하고 이후 계속 동일한 인스턴스 재사용
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
