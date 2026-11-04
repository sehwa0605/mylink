"use client";

import React, { useState } from "react";

// 4주차: 스위치 네온(Switch Neon) 스타일로 단장한 메인 프로필 페이지
export default function Home() {
  // 공유 완료 토스트 메시지 표시 상태
  const [copied, setCopied] = useState(false);

  // 공유 버튼 클릭 핸들러 (모바일 네이티브 공유 및 링크 복사)
  const handleShare = async () => {
    // Web Share API 가 지원되는 환경(모바일 등)인 경우
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "양세화 | mylink",
          text: "유기나노공학을 공부하며 아이디어를 코드로 만듭니다.",
          url: window.location.href,
        });
      } catch (e) {
        // 사용자가 공유 창을 취소(AbortError)한 경우 아무것도 하지 않고 조용히 종료
        if (e instanceof DOMException && e.name === "AbortError") {
          return;
        }
        // 공유 실패 시 클립보드에 주소 복사
        copyToClipboard();
      }
    } else {
      // 데스크톱 브라우저 등 미지원 환경에서는 클립보드 복사
      copyToClipboard();
    }
  };

  // 클립보드 복사 함수
  const copyToClipboard = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 임시 미리보기용 샘플 링크 목록 (스위치 네온 디자인 확인용)
  const previewLinks = [
    {
      id: "github",
      title: "GitHub 저장소 둘러보기",
      url: "https://github.com/sehwa0605",
      badge: "Code",
      accentColor: "bg-[#E60012]", // 좌측 조이콘 레드
    },
    {
      id: "email",
      title: "이메일로 연락하기",
      url: "mailto:ysh8436@gmail.com",
      badge: "Contact",
      accentColor: "bg-[#00BDFF]", // 우측 조이콘 블루
    },
    {
      id: "portfolio",
      title: "연구 및 프로젝트 포트폴리오",
      url: "https://github.com/sehwa0605/mylink",
      badge: "About",
      accentColor: "bg-[#1A1D20]", // 콘솔 다크
    },
  ];

  return (
    // 전체 페이지 배경: 깔끔한 스위치 펄 화이트/연그레이(#F8F9FA)
    <main className="min-h-screen bg-[#F8F9FA] text-[#1A1D20] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      {/* 프로필 전체 카드 컨테이너: 최대폭 448px, 조이콘 스타일의 둥근 모서리(2xl)와 입체감 있는 그림자 */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-black/5 border border-[#E2E8F0] relative overflow-hidden">
        {/* 상단 스위치 콘솔 데코레이션 바: 좌측 네온 레드 & 우측 네온 블루 */}
        <div className="absolute top-0 left-0 right-0 h-2 flex">
          <div className="w-1/2 bg-[#E60012]" />
          <div className="w-1/2 bg-[#00BDFF]" />
        </div>

        {/* 상단 조이콘 미니 뱃지 (스위치 테마 상징) */}
        <div className="flex items-center justify-between mb-6 pt-1">
          {/* 좌측 레드 인디케이터 */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#E60012] bg-[#E60012]/10 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#E60012] animate-pulse" />
            JOY-CON (L)
          </div>
          {/* 우측 블루 인디케이터 */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#00BDFF] bg-[#00BDFF]/10 px-2.5 py-1 rounded-full">
            JOY-CON (R)
            <span className="w-2 h-2 rounded-full bg-[#00BDFF] animate-pulse" />
          </div>
        </div>

        {/* 프로필 아바타: 닌텐도 레드 링이 감싸는 원형 아바타 */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#E60012] to-[#FF4D5E] text-white flex items-center justify-center text-3xl font-extrabold shadow-md ring-4 ring-[#E60012]/15">
              양
            </div>
            {/* 조이콘 아날로그 스틱 느낌의 미니 링 포인트 */}
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#00BDFF] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
              +
            </span>
          </div>

          {/* 사용자 이름 및 영문 표기 */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1D20] mb-1">
            양세화
          </h1>
          <p className="text-sm font-semibold text-[#64748B] mb-3 tracking-wide">
            Sehwa Yang
          </p>

          {/* 한 줄 소개글 (1단계에서 채택한 추천 문구) */}
          <p className="text-sm sm:text-base text-[#334155] font-medium leading-relaxed max-w-xs break-keep bg-[#F8F9FA] px-4 py-2.5 rounded-2xl border border-[#E2E8F0] mb-6">
            유기나노공학을 공부하며 아이디어를 코드로 만듭니다.
          </p>
        </div>

        {/* 링크 버튼 목록 영역 (4주차: Tailwind 클래스로 조이콘 스타일 구현) */}
        <div className="flex flex-col gap-3 mb-6">
          {previewLinks.map((link) => (
            // 주의: 바깥에만 <a> 태그를 두고 내부에는 절대 <a> 태그를 중첩하지 않음 (하이드레이션 오류 방지)
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between w-full p-4 rounded-2xl bg-white hover:bg-[#F8F9FA] border-2 border-[#E2E8F0] hover:border-[#1A1D20] shadow-sm hover:shadow-md transition-all duration-200 -translate-y-0 hover:-translate-y-0.5 active:translate-y-0"
            >
              {/* 좌측 조이콘 컬러 인디케이터 바 */}
              <span
                className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full ${link.accentColor}`}
              />

              {/* 링크 제목 및 뱃지 */}
              <div className="flex items-center gap-3 pl-2 min-w-0 flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-md">
                  {link.badge}
                </span>
                <span className="text-sm sm:text-base font-bold text-[#1A1D20] truncate group-hover:text-[#E60012] transition-colors">
                  {link.title}
                </span>
              </div>

              {/* 우측 닌텐도 화살표 아이콘 */}
              <span className="text-[#00BDFF] group-hover:translate-x-1 transition-transform font-bold text-lg pl-2">
                &gt;
              </span>
            </a>
          ))}
        </div>

        {/* 공유하기 버튼 (스위치 콘솔 푸시 버튼 스타일) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleShare}
            className="w-full py-3 rounded-2xl bg-[#1A1D20] hover:bg-black text-white font-bold text-sm tracking-wide shadow-md transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🔗</span>
            <span>{copied ? "주소가 복사되었습니다! 🎉" : "내 프로필 공유하기"}</span>
          </button>
        </div>

        {/* 하단 저작권 및 서비스명 */}
        <p className="text-center text-xs font-medium text-[#94A3B8] mt-6">
          mylink • Nintendo Switch Neon Style
        </p>
      </div>
    </main>
  );
}
