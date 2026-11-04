// Firebase 핵심 모듈에서 앱 초기화 및 기존 인스턴스 조회 함수 임포트
import { getApp, getApps, initializeApp } from "firebase/app";
// Firestore 데이터베이스 인스턴스 생성 함수 임포트
import { getFirestore } from "firebase/firestore";
// Firebase 인증(Auth) 모듈 및 구글 로그인 프로바이더 임포트
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// 환경 변수(.env.local)에서 Firebase 웹 앱 설정값들을 안전하게 로드
// 빌드 타임 사전 렌더링(SSG) 시 환경 변수 미설정으로 인한 auth/invalid-api-key 크래시 방지용 폴백 제공
const firebaseConfig = {
  // Firebase 웹 API 키
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForStaticPrerender00000",
  // 인증 도메인 주소
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mylink-demo.firebaseapp.com",
  // 프로젝트 고유 ID
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mylink-demo",
  // 스토리지 버킷 경로
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mylink-demo.appspot.com",
  // 클라우드 메시징 발신자 번호
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  // 등록된 웹 앱 ID
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  // 구글 애널리틱스 측정 ID (선택 사항)
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// 개발 환경 핫 리로드 시 Firebase 앱 인스턴스가 중복 생성되지 않도록 기존 앱 재사용
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
// 앱 전역에서 사용할 Firestore 데이터베이스 싱글톤 인스턴스 내보내기
export const db = getFirestore(app);
// 앱 전역에서 사용할 Firebase Auth 인증 싱글톤 인스턴스 내보내기
export const auth = getAuth(app);
// 구글 로그인을 위한 기본 OAuth 인증 프로바이더 인스턴스 내보내기
export const googleProvider = new GoogleAuthProvider();
