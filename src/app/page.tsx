// 메인 프로필 페이지 컴포넌트
export default function Home() {
  return (
    // 전체 화면 중앙 정렬 및 배경 스타일
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* 프로필 카드 컨테이너: 최대 가로폭 제한, 부드러운 모서리와 그림자 */}
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-sm border border-zinc-200 dark:border-zinc-800 text-center flex flex-col items-center">
        {/* 아바타 원형 아이콘 (이름 첫 글자) */}
        <div className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center text-2xl font-bold shadow-inner mb-5">
          양
        </div>

        {/* 이름과 영문 표기 */}
        <h1 className="text-2xl font-bold tracking-tight mb-1">양세화</h1>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">
          Sehwa Yang
        </p>

        {/* 한 줄 소개글 */}
        <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed break-keep">
          저는 유기나노공학과 양세화입니다.
        </p>
      </div>
    </main>
  );
}
