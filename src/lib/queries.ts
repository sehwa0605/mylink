"use client";

// TanStack Query 핵심 훅 임포트
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Firestore 링크 관련 API 함수 및 입력 타입 임포트
import {
  fetchLinks,
  saveLink,
  updateLink,
  deleteLink,
  type LinkInput,
} from "@/lib/linksFirestore";
// Firestore 사용자 프로필 조회 및 수정 API 임포트
import {
  fetchUserProfile,
  updateProfile,
} from "@/lib/usersFirestore";
// 링크 및 프로필 데이터 인터페이스 임포트
import type { Link, UserProfile, ProfileUpdate } from "@/lib/types";

// 쿼리 캐시 키 정의 객체: uid별, 화면별로 독립된 캐시 선반을 유지
export const queryKeys = {
  // 특정 사용자의 링크 목록 쿼리 키 (["links", uid])
  links: (uid: string) => ["links", uid] as const,
  // 특정 사용자의 프로필 정보 쿼리 키 (["profile", uid])
  profile: (uid: string) => ["profile", uid] as const,
  // 전체 공개 페이지 관련 캐시 선반 키
  publicPageAll: ["publicPage"] as const,
  // 특정 핸들명(displayName)의 공개 페이지 캐시 키
  publicPage: (displayName: string) => ["publicPage", displayName] as const,
};

// 특정 사용자(uid)의 링크 목록을 Firestore에서 조회하는 React Query 훅
export function useLinksQuery(uid: string | undefined) {
  return useQuery<Link[]>({
    // uid를 포함한 캐시 키 지정
    queryKey: queryKeys.links(uid ?? ""),
    // Firestore에서 실제 링크 배열을 페칭하는 비동기 함수
    queryFn: () => fetchLinks(uid!),
    // uid가 유효한 문자열일 때만 쿼리 실행 활성화
    enabled: !!uid,
  });
}

// 특정 사용자(uid)의 프로필 정보를 Firestore에서 조회하는 React Query 훅 (11주차)
export function useProfileQuery(uid: string | undefined) {
  return useQuery<UserProfile | null>({
    // uid를 포함한 프로필 캐시 키 지정
    queryKey: queryKeys.profile(uid ?? ""),
    // Firestore users/{uid} 문서 1회 조회 함수
    queryFn: () => fetchUserProfile(uid!),
    // uid가 있을 때만 쿼리 실행
    enabled: !!uid,
  });
}

// 특정 사용자(uid)의 새 링크를 Firestore에 추가하는 Mutation 훅
export function useAddLinkMutation(uid: string) {
  // 전역 React Query 클라이언트 접근자 획득
  const queryClient = useQueryClient();

  return useMutation({
    // 실제 Firestore에 새 링크를 저장하는 함수
    mutationFn: (link: LinkInput) => saveLink(uid, link),
    // 저장 성공 시 관련 캐시들을 무효화하여 최신 목록을 다시 불러옴 (return 해야 isPending이 완료 시점까지 유지됨)
    onSuccess: () => {
      return Promise.all([
        // 해당 사용자의 링크 목록 캐시 무효화 및 자동 리페치
        queryClient.invalidateQueries({ queryKey: queryKeys.links(uid) }),
        // 공개 프로필 페이지 관련 캐시도 함께 무효화
        queryClient.invalidateQueries({ queryKey: queryKeys.publicPageAll }),
      ]);
    },
  });
}

// 특정 사용자(uid)의 기존 링크를 Firestore에서 수정하는 Mutation 훅 (10주차)
export function useUpdateLinkMutation(uid: string) {
  // 전역 React Query 클라이언트 접근자 획득
  const queryClient = useQueryClient();

  return useMutation({
    // 대상 링크 ID와 수정 데이터(title, url)로 Firestore updateDoc 호출
    mutationFn: ({ id, input }: { id: string; input: LinkInput }) =>
      updateLink(uid, id, input),
    // 수정 완료 시 쿼리 캐시 무효화로 최신 데이터 재조회
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.links(uid) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.publicPageAll }),
      ]);
    },
  });
}

// 특정 사용자(uid)의 기존 링크를 Firestore에서 영구 삭제하는 Mutation 훅 (10주차)
export function useDeleteLinkMutation(uid: string) {
  // 전역 React Query 클라이언트 접근자 획득
  const queryClient = useQueryClient();

  return useMutation({
    // 대상 링크 ID로 Firestore deleteDoc 호출
    mutationFn: (linkId: string) => deleteLink(uid, linkId),
    // 삭제 완료 시 쿼리 캐시 무효화로 목록에서 제거 반영
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.links(uid) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.publicPageAll }),
      ]);
    },
  });
}

// 특정 사용자(uid)의 프로필을 낙관적 업데이트(Optimistic Update)로 수정하는 Mutation 훅 (11주차)
export function useUpdateProfileMutation(uid: string) {
  // 전역 React Query 클라이언트 접근자 획득
  const queryClient = useQueryClient();
  // 프로필 캐시 키
  const key = queryKeys.profile(uid);

  return useMutation({
    // Firestore writeBatch로 users/{uid} 및 users/{uid}/profile/main 동시 저장
    mutationFn: (next: ProfileUpdate) => updateProfile(uid, next),
    // 저장 요청 직전에 UI를 즉시 새 데이터로 반영 (낙관적 업데이트)
    onMutate: async (next) => {
      // 진행 중인 이전 프로필 쿼리가 있으면 취소하여 덮어쓰기 방지
      await queryClient.cancelQueries({ queryKey: key });
      // 롤백을 위해 수정 직전의 기존 프로필 캐시 백업
      const previous = queryClient.getQueryData<UserProfile | null>(key);

      // 캐시를 즉시 새로운 값(이름, 소개)으로 낙관적 갱신
      queryClient.setQueryData<UserProfile | null>(key, (old) =>
        old
          ? {
              ...old,
              username: next.name,
              bio: next.bio,
            }
          : old
      );

      // 롤백용 이전 데이터 컨텍스트 반환
      return { previous };
    },
    // 저장 실패 시 이전 캐시 데이터로 원상 복구
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },
    // 완료 시(성공/실패 무관) 최종 최신 데이터로 캐시 재동기화
    onSettled: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: key }),
        queryClient.invalidateQueries({ queryKey: queryKeys.publicPageAll }),
      ]);
    },
  });
}
