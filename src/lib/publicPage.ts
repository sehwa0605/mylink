// 사용자 조회 함수 임포트
import { findUserByDisplayName } from "@/lib/usersFirestore";
// 링크 목록 조회 함수 임포트
import { fetchLinks } from "@/lib/linksFirestore";
// 공개 페이지 반환 데이터 타입 임포트
import type { PublicPage } from "@/lib/types";

// 공개 주소명(displayName)으로 사용자의 프로필과 링크 목록을 조회하는 함수 (서버/클라이언트 공용)
export async function fetchPublicPage(
  displayName: string
): Promise<PublicPage | null> {
  // displayName을 이용해 Firestore에서 사용자 프로필 단건 조회
  const profile = await findUserByDisplayName(displayName);

  // 일치하는 사용자가 존재하지 않는 경우 null 반환
  if (!profile) {
    return null;
  }

  // 사용자가 존재하는 경우 해당 사용자의 uid로 최신순 링크 목록 조회
  const links = await fetchLinks(profile.uid);

  // 공개 페이지에 필요한 사용자 UID, 프로필 객체, 링크 배열 반환
  return {
    uid: profile.uid,
    profile,
    links,
  };
}
