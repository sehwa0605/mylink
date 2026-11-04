"use client";

// 리액트 useEffect 훅 임포트
import { useEffect } from "react";
// Zustand 상태 저장소 생성 함수 임포트
import { create } from "zustand";
// Firebase 인증 관련 함수 임포트
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
// 싱글톤 auth 및 구글 프로바이더 인스턴스 임포트
import { auth, googleProvider } from "@/lib/firebase";
// 사용자 프로필 생성 유틸리티 임포트
import { ensureUserProfile } from "@/lib/usersFirestore";
// React Query 클라이언트 및 쿼리 키 임포트
import { getQueryClient } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queries";
// 인증 사용자 타입 임포트
import type { AuthUser } from "@/lib/types";
// sonner 토스트 알림 임포트
import { toast } from "sonner";

// 인증 스토어 상태 및 메서드 인터페이스 정의
export interface AuthState {
  // 현재 로그인된 사용자 정보 (비로그인 시 null)
  user: AuthUser | null;
  // Firebase Auth 초기화 완료 여부 (새로고침 시 깜빡임 방지용 플래그)
  authReady: boolean;
  // 구글 로그인 팝업 진행 중 여부 플래그
  signingIn: boolean;
  // 구글 팝업 로그인 실행 함수
  signInWithGoogle: () => Promise<void>;
  // 로그아웃 실행 함수
  signOutUser: () => Promise<void>;
}

// Zustand 전역 인증 상태 스토어 생성
export const useAuthStore = create<AuthState>((set, get) => ({
  // 초기 사용자 상태: null
  user: null,
  // 초기 인증 준비 상태: false
  authReady: false,
  // 초기 로그인 팝업 상태: false
  signingIn: false,

  // 구글 계정으로 팝업 로그인 실행
  signInWithGoogle: async () => {
    // 이미 팝업이 떠 있는 경우 중복 실행 방지
    if (get().signingIn) return;
    // 팝업 진행 플래그 활성화
    set({ signingIn: true });

    try {
      // Firebase 팝업 로그인 실행
      const result = await signInWithPopup(auth, googleProvider);
      // 구글 이메일의 @ 앞자리를 고유 displayName(name)으로 추출
      const email = result.user.email || "";
      const handleName = email.split("@")[0] || result.user.displayName || "사용자";

      // 버튼을 직접 눌러 로그인 성공했을 때만 환영 토스트 노출
      toast.success(`${handleName}님, 환영해요`);
    } catch (err: unknown) {
      // 에러 코드 추출
      const errorCode = (err as { code?: string })?.code;

      // 사용자가 팝업을 직접 닫거나 취소한 경우는 오류 토스트 없이 조용히 종료
      if (
        errorCode === "auth/popup-closed-by-user" ||
        errorCode === "auth/cancelled-popup-request"
      ) {
        return;
      }

      // 브라우저가 팝업을 차단한 경우 안내 문구 출력
      if (errorCode === "auth/popup-blocked") {
        toast.error("브라우저가 로그인 팝업을 막았어요. 팝업을 허용한 뒤 다시 눌러 주세요.");
      } else if (errorCode === "auth/operation-not-allowed") {
        toast.error("Firebase 콘솔에서 Google 로그인을 사용 설정해 주세요.");
      } else if (errorCode === "auth/unauthorized-domain") {
        toast.error("Firebase 콘솔 승인된 도메인에 현재 주소를 추가해 주세요.");
      } else {
        // 그 외 일반 로그인 실패 오류 알림 (상세 메시지 포함)
        console.error("구글 로그인 실패:", err);
        const errorMsg = (err as { message?: string })?.message;
        toast.error(errorMsg ? `로그인 실패: ${errorMsg}` : "로그인하지 못했어요. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      // 팝업 진행 플래그 해제
      set({ signingIn: false });
    }
  },

  // 로그아웃 실행
  signOutUser: async () => {
    try {
      // 현재 로그인되어 있던 사용자의 UID 보관
      const prevUid = get().user?.uid;
      // 전역 React Query 클라이언트 획득
      const qc = getQueryClient();

      // Firebase 로그아웃 호출
      await signOut(auth);

      // 계정 캐시 정리: 이전 계정의 링크 및 프로필 데이터 캐시 완전 삭제
      if (prevUid) {
        qc.removeQueries({ queryKey: queryKeys.links(prevUid) });
        qc.removeQueries({ queryKey: queryKeys.profile(prevUid) });
      }

      // 스토어 사용자 정보 null로 초기화
      set({ user: null });
      // 로그아웃 성공 토스트 알림
      toast.success("로그아웃했어요");
    } catch (err) {
      console.error("로그아웃 실패:", err);
      toast.error("로그아웃하지 못했어요.");
    }
  },
}));

// Firebase 인증 상태 변경 구독 리스너 중복 실행 방지 변수 (앱 전체에서 1회만 구독)
let listening = false;

// Firebase 인증 상태 변화를 전역 구독하는 커스텀 훅 (Header에서 호출)
export function useAuthListener(): void {
  useEffect(() => {
    // 이미 리스너가 동작 중이면 중복 등록 방지
    if (listening) return;
    listening = true;

    // onAuthStateChanged 리스너 연결
    const unsubscribe = onAuthStateChanged(auth, (fu: FirebaseUser | null) => {
      // 이전 로그인 사용자 UID 획득
      const prevUid = useAuthStore.getState().user?.uid;
      // React Query 클라이언트 가져오기
      const qc = getQueryClient();

      // FirebaseUser 객체를 우리 앱 규격의 AuthUser로 정규화
      const user: AuthUser | null = fu
        ? {
            // 고유 식별자 UID
            uid: fu.uid,
            // 이메일의 @ 앞자리를 고유 displayName(name)으로 사용
            name: fu.email?.split("@")[0] || fu.displayName || "사용자",
            // 이메일
            email: fu.email,
            // 프로필 사진 URL
            photoURL: fu.photoURL,
            // 구글 계정 실명
            username: fu.displayName,
          }
        : null;

      // 이전 계정과 다른 계정으로 바뀌었거나 로그아웃된 경우 캐시 제거
      if (prevUid && prevUid !== user?.uid) {
        qc.removeQueries({ queryKey: queryKeys.links(prevUid) });
        qc.removeQueries({ queryKey: queryKeys.profile(prevUid) });
      }

      // 스토어에 사용자 정보 저장 및 authReady(준비 완료) 플래그 켜기
      useAuthStore.setState({ user, authReady: true });

      // 유효한 사용자 로그인 시 Firestore users/{uid} 문서 존재 확인 및 프로필 캐시 무효화
      if (user) {
        ensureUserProfile(user)
          .then(() => qc.invalidateQueries({ queryKey: queryKeys.profile(user.uid) }))
          .catch((err) => console.error("유저 정보 확인 및 저장 실패:", err));
      }
    });

    // 클린업 함수
    return () => {
      unsubscribe();
      listening = false;
    };
  }, []);
}
