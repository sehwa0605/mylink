// Firestore 데이터베이스 조작 메서드 및 타임스탬프 유틸리티 임포트
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
// 싱글톤 Firestore 인스턴스 임포트
import { db } from "@/lib/firebase";
// 링크 데이터 인터페이스 임포트
import type { Link } from "@/lib/types";

// 새 링크 생성 시 필요한 입력 타입 정의 (id 및 서버 생성 필드 제외)
export type LinkInput = {
  // 링크 제목
  title: string;
  // 대상 링크 URL 주소
  url: string;
};

// 특정 사용자(uid)의 links 서브컬렉션 참조를 생성하는 도우미 함수
export function getLinksCollectionRef(uid: string) {
  // users/{uid}/links 경로 참조 반환
  return collection(db, "users", uid, "links");
}

// 새 링크를 Firestore에 저장하는 함수 (9주차: 임시로 uid="anonymous" 사용)
export async function saveLink(uid: string, input: LinkInput): Promise<string> {
  // 대상 컬렉션 참조 획득
  const colRef = getLinksCollectionRef(uid);
  // 현재 서버 시각 타임스탬프 획득
  const now = serverTimestamp();

  // Firestore 문서 추가 실행
  const docRef = await addDoc(colRef, {
    // 공백 제거된 링크 제목
    title: input.title.trim(),
    // 정규화된 대상 URL
    url: input.url.trim(),
    // 생성 시각
    createdAt: now,
    // 마지막 수정 시각
    updatedAt: now,
    // 누적 클릭 수 초기값 0
    clickCount: 0,
  });

  // 생성된 문서의 고유 ID 반환
  return docRef.id;
}

// 특정 사용자(uid)의 모든 링크를 최신순(createdAt 내림차순)으로 조회하는 함수
export async function fetchLinks(uid: string): Promise<Link[]> {
  // 대상 컬렉션 참조 획득
  const colRef = getLinksCollectionRef(uid);
  // 생성 시각(createdAt) 기준 최신순 정렬 쿼리 생성
  const q = query(colRef, orderBy("createdAt", "desc"));
  // 쿼리 결과 스냅샷 가져오기
  const snapshot = await getDocs(q);

  // 문서 목록을 Link 객체 배열로 변환
  const links: Link[] = snapshot.docs.map((doc) => {
    // 문서 데이터 추출
    const data = doc.data();

    // createdAt 필드가 Firestore Timestamp 객체인지 확인하고 밀리초 숫자로 변환
    const createdAt = data.createdAt instanceof Timestamp
      ? data.createdAt.toMillis()
      : typeof data.createdAt === "number"
      ? data.createdAt
      : undefined;

    // updatedAt 필드가 Firestore Timestamp 객체인지 확인하고 밀리초 숫자로 변환
    const updatedAt = data.updatedAt instanceof Timestamp
      ? data.updatedAt.toMillis()
      : typeof data.updatedAt === "number"
      ? data.updatedAt
      : undefined;

    // 변환된 Link 인터페이스 형태의 객체 반환
    return {
      // 문서 고유 ID
      id: doc.id,
      // 링크 제목
      title: data.title || "",
      // 대상 URL
      url: data.url || "",
      // 생성 시각 (밀리초)
      createdAt,
      // 수정 시각 (밀리초)
      updatedAt,
      // 누적 클릭 횟수
      clickCount: typeof data.clickCount === "number" ? data.clickCount : 0,
    };
  });

  // 최종 링크 목록 반환
  return links;
}
