// 링크 데이터 타입 정의 (Firestore 및 로컬 상태 공용)
export interface Link {
  id: string;               // 링크 고유 ID (Firestore 문서 ID)
  title: string;            // 링크 제목 (1~100자)
  url: string;              // 대상 URL 주소
  createdAt?: number;       // 생성 시각 타임스탬프 (밀리초)
  updatedAt?: number;       // 마지막 수정 시각 타임스탬프 (밀리초)
  clickCount?: number;      // 클릭 수 누적 카운트
}

// 사용자 프로필 정보 타입 정의
export interface UserProfile {
  uid: string;              // Firebase 사용자 고유 번호
  displayName: string;      // 이메일 @ 앞자리 = 공개 주소 핸들 (/{displayName})
  username?: string | null; // 구글 실명 또는 프로필 이름
  email?: string | null;    // 구글 계정 이메일
  photoURL?: string | null; // 구글 프로필 사진 URL
  bio: string;              // 한 줄 소개글
}
