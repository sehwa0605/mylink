// 링크 데이터 타입 정의 (Firestore 및 로컬 상태 공용)
export interface Link {
  // 링크 고유 ID (Firestore 문서 ID)
  id: string;
  // 링크 제목 (1~100자)
  title: string;
  // 대상 URL 주소
  url: string;
  // 생성 시각 타임스탬프 (밀리초)
  createdAt?: number;
  // 마지막 수정 시각 타임스탬프 (밀리초)
  updatedAt?: number;
  // 클릭 수 누적 카운트
  clickCount?: number;
}

// 사용자 프로필 정보 타입 정의 (Firestore users/{uid} 문서)
export interface UserProfile {
  // Firebase 사용자 고유 번호
  uid: string;
  // 이메일 @ 앞자리 = 공개 주소 핸들 (/{displayName}, 불변)
  displayName: string;
  // 구글 계정 실명 또는 사용자 지정 이름
  username?: string | null;
  // 구글 계정 이메일
  email?: string | null;
  // 구글 프로필 사진 URL
  photoURL?: string | null;
  // 한 줄 소개글 (기본값: "한 줄 소개를 입력해주세요.")
  bio: string;
}

// 프로필 수정 폼 입력값 타입 정의
export interface ProfileUpdate {
  // 수정할 실명/이름 (최대 30자)
  name: string;
  // 수정할 한 줄 소개 (최대 60자)
  bio: string;
}

// 인증된 현재 로그인 사용자 상태 타입 정의 (Zustand AuthUser)
export interface AuthUser {
  // 사용자 고유 UID
  uid: string;
  // 이메일 @ 앞자리 (공개 displayName과 동일)
  name: string;
  // 이메일 주소
  email?: string | null;
  // 프로필 사진 URL
  photoURL?: string | null;
  // 구글 계정 실명
  username?: string | null;
}

// 공개 프로필 페이지 통합 데이터 인터페이스 (12주차)
export interface PublicPage {
  // 페이지 소유자의 Firebase UID
  uid: string;
  // 페이지 소유자의 프로필 정보
  profile: UserProfile;
  // 공개 페이지에 표시될 링크 목록
  links: Link[];
}
