// 6~7주차 화면 개발을 위한 목업(샘플) 링크 데이터
// 9주차에 Firebase Firestore 가 연동되면 이 파일은 삭제됩니다.
import type { Link } from "./types";

export const sampleLinks: Link[] = [
  {
    id: "link-1",
    title: "GitHub 저장소",
    url: "https://github.com/sehwa0605",
    updatedAt: Date.now() - 1000 * 60 * 60 * 24, // 1일 전
    clickCount: 12,
  },
  {
    id: "link-2",
    title: "기술 및 프로젝트 영상 (YouTube)",
    url: "https://youtube.com/@sehwa-tech",
    updatedAt: Date.now() - 1000 * 60 * 60 * 48,
    clickCount: 8,
  },
  {
    id: "link-3",
    title: "공학 공부 기록 블로그 (velog)",
    url: "https://velog.io/@sehwa0605",
    updatedAt: Date.now() - 1000 * 60 * 60 * 72,
    clickCount: 15,
  },
  {
    id: "link-4",
    title: "이메일로 문의하기",
    url: "mailto:ysh8436@gmail.com",
    updatedAt: Date.now() - 1000 * 60 * 60 * 96,
    clickCount: 4,
  },
  {
    id: "link-5",
    title: "한양대학교 유기나노공학과",
    url: "https://organic.hanyang.ac.kr",
    updatedAt: Date.now() - 1000 * 60 * 60 * 120,
    clickCount: 6,
  },
];
