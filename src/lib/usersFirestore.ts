// Firestore 문서 참조 및 배치 쓰기 함수 임포트
import {
  doc,
  getDoc,
  setDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
// 싱글톤 Firestore 데이터베이스 인스턴스 임포트
import { db } from "@/lib/firebase";
// 사용자 프로필 및 수정 입력 인터페이스 임포트
import type { UserProfile, ProfileUpdate, AuthUser } from "@/lib/types";

// 기본 프로필 한 줄 소개 문구 상수 정의
export const DEFAULT_BIO = "한 줄 소개를 입력해주세요.";

// 로그인한 사용자의 Firestore users/{uid} 문서가 존재하는지 확인하고 없으면 최초 생성하는 함수
export async function ensureUserProfile(user: AuthUser): Promise<void> {
  // users/{uid} 경로의 문서 참조 생성
  const userDocRef = doc(db, "users", user.uid);
  // 현재 문서 데이터 조회
  const snapshot = await getDoc(userDocRef);

  // 문서가 아직 존재하지 않는 신규 첫 로그인 사용자인 경우
  if (!snapshot.exists()) {
    // 최초 프로필 데이터 문서 생성 (displayName은 이메일 앞자리로 고정)
    await setDoc(userDocRef, {
      // 고유 UID
      uid: user.uid,
      // 이메일 @ 앞자리 = 공개 주소 핸들 (영구 불변)
      displayName: user.name,
      // 구글 실명 또는 닉네임
      username: user.username || user.name,
      // 이메일 주소
      email: user.email || null,
      // 프로필 이미지 URL
      photoURL: user.photoURL || null,
      // 기본 한 줄 소개글
      bio: DEFAULT_BIO,
      // 가입 시각
      createdAt: serverTimestamp(),
    });
  }
}

// 특정 사용자(uid)의 프로필 문서(users/{uid})를 단발성으로 조회하는 함수
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  // users/{uid} 경로 참조 생성
  const userDocRef = doc(db, "users", uid);
  // 문서 데이터 1회 가져오기
  const snapshot = await getDoc(userDocRef);

  // 문서가 존재하지 않는 경우 null 반환
  if (!snapshot.exists()) {
    return null;
  }

  // 문서 데이터를 UserProfile 타입으로 변환하여 반환
  const data = snapshot.data();
  return {
    uid: data.uid || uid,
    displayName: data.displayName || "",
    username: data.username || null,
    email: data.email || null,
    photoURL: data.photoURL || null,
    bio: data.bio || DEFAULT_BIO,
  };
}

// 사용자의 이름과 한 줄 소개를 users/{uid} 및 users/{uid}/profile/main에 원자적(writeBatch)으로 동시 저장하는 함수
export async function updateProfile(
  uid: string,
  next: ProfileUpdate
): Promise<void> {
  // Firestore 배치 쓰기 인스턴스 생성 (All or Nothing 트랜잭션)
  const batch = writeBatch(db);
  // 사용자 기본 문서 참조 (users/{uid})
  const userDocRef = doc(db, "users", uid);
  // 프로필 상세 히스토리 문서 참조 (users/{uid}/profile/main)
  const profileMainRef = doc(db, "users", uid, "profile", "main");
  // 서버 타임스탬프 생성
  const now = serverTimestamp();

  // 정리된 이름 (공백 제거)
  const cleanedName = next.name.trim();
  // 정리된 소개글 (비워둘 경우 기본 문구로 복원)
  const cleanedBio = next.bio.trim() || DEFAULT_BIO;

  // 1. users/{uid} 문서의 username 및 bio 필드 업데이트 (displayName은 절대 수정하지 않음)
  batch.update(userDocRef, {
    username: cleanedName,
    bio: cleanedBio,
  });

  // 2. users/{uid}/profile/main 문서에 저장 히스토리 덮어쓰기
  batch.set(profileMainRef, {
    name: cleanedName,
    bio: cleanedBio,
    updatedAt: now,
  });

  // 배치 커밋 실행 (동시 반영)
  await batch.commit();
}
