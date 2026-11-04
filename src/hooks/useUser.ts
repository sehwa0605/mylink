"use client";

// Zustand 인증 스토어 임포트
import { useAuthStore } from "@/store/useAuthStore";
// React Query 프로필 조회 훅 임포트
import { useProfileQuery } from "@/lib/queries";
// 기본 소개글 상수 임포트
import { DEFAULT_BIO } from "@/lib/usersFirestore";
// 사용자 프로필 및 인증 사용자 타입 임포트
import type { UserProfile, AuthUser } from "@/lib/types";

// 사용자 인증 정보와 프로필 데이터를 통합 반환하는 커스텀 훅 반환 타입
export interface UseUserReturn {
  // 현재 로그인된 인증 사용자 객체 (비로그인 시 null)
  user: AuthUser | null;
  // Firebase Auth 로딩 완료 여부
  authReady: boolean;
  // 로그인 팝업 진행 여부
  signingIn: boolean;
  // 로그인 여부 불리언 플래그
  isAuthenticated: boolean;
  // Firestore 사용자 프로필 데이터 (첫 로그인 직후 캐시 지연 시 구글 계정 정보로 폴백)
  profile: UserProfile | null;
  // 프로필 데이터 페칭 진행 중 여부
  profileLoading: boolean;
  // 공개 주소 핸들명 (이메일 @ 앞자리)
  displayName: string;
  // 내 공개 페이지 상대 경로 (/{displayName})
  pagePath: string;
}

// 사용자 정보 및 상태를 컴포넌트에서 쉽게 사용할 수 있도록 묶어 제공하는 커스텀 훅 (11주차)
export function useUser(): UseUserReturn {
  // 인증 스토어에서 로그인 사용자 정보 구독
  const user = useAuthStore((state) => state.user);
  // 인증 스토어에서 초기화 완료 여부 구독
  const authReady = useAuthStore((state) => state.authReady);
  // 인증 스토어에서 팝업 진행 여부 구독
  const signingIn = useAuthStore((state) => state.signingIn);

  // Firestore에서 프로필 문서 조회 쿼리 실행 (user.uid가 있을 때만 활성화)
  const profileQuery = useProfileQuery(user?.uid);

  // 첫 로그인 직후 문서 생성 중일 때 화면이 비어 보이지 않도록 구글 계정 정보로 임시 폴백 프로필 구성
  const fallbackProfile: UserProfile | null = user
    ? {
        uid: user.uid,
        displayName: user.name,
        username: user.username || user.name,
        email: user.email || null,
        photoURL: user.photoURL || null,
        bio: DEFAULT_BIO,
      }
    : null;

  // 쿼리 데이터가 있으면 우선 사용하고, 없으면 폴백 프로필 적용
  const profile: UserProfile | null = profileQuery.data ?? fallbackProfile;
  // 공개 주소용 displayName (이메일 앞부분)
  const displayName = user?.name || "";
  // 공개 페이지 접근 URL 경로 생성 (한글/특수문자 인코딩 적용)
  const pagePath = displayName ? `/${encodeURIComponent(displayName)}` : "/";

  return {
    user,
    authReady,
    signingIn,
    isAuthenticated: Boolean(user),
    profile,
    profileLoading: profileQuery.isLoading,
    displayName,
    pagePath,
  };
}
