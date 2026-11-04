// 링크 유효성 검사 결과 인터페이스 정의
export interface ValidationResult {
  // 검사 통과 여부 플래그
  ok: boolean;
  // 제목 입력값 오류 메시지 (오류 없을 시 undefined)
  titleError?: string;
  // URL 입력값 오류 메시지 (오류 없을 시 undefined)
  urlError?: string;
  // 스킴(https://) 자동 보정 등이 완료된 정규화 URL
  normalizedUrl?: string;
}

// 링크 추가 및 수정 시 입력값을 검증하는 순수 함수
export function validateLink(rawTitle: string, rawUrl: string): ValidationResult {
  // 제목의 앞뒤 공백 제거
  const trimmedTitle = rawTitle.trim();
  // URL의 앞뒤 공백 제거
  const trimmedUrl = rawUrl.trim();
  // 제목 오류 메시지 보관 변수
  let titleError: string | undefined;
  // URL 오류 메시지 보관 변수
  let urlError: string | undefined;
  // 정규화된 최종 URL 보관 변수
  let normalizedUrl: string | undefined;

  // 1. 제목 검사: 빈 문자열인지 확인
  if (!trimmedTitle) {
    // 제목이 비어 있을 때 표시할 에러 문구
    titleError = "제목을 입력해 주세요";
  // 1. 제목 검사: 최대 글자 수 100자 초과 여부 확인
  } else if (trimmedTitle.length > 100) {
    // 100자를 초과했을 때 표시할 에러 문구
    titleError = "제목은 100자까지 쓸 수 있어요";
  }

  // 2. URL 검사: 빈 문자열인지 확인
  if (!trimmedUrl) {
    // URL이 비어 있을 때 표시할 에러 문구
    urlError = "URL을 입력해 주세요";
  // 2. URL 검사: 중간에 공백 문자가 포함되어 있는지 확인
  } else if (/\s/.test(trimmedUrl)) {
    // 공백이 포함된 경우 표준 URL 형식 안내 문구 표시
    urlError = "올바른 URL 형식이 아닙니다 (예: https://example.com).";
  // 2. URL 검사: mailto: 프로토콜로 시작하는 이메일 링크인 경우
  } else if (/^mailto:/i.test(trimmedUrl)) {
    // mailto:이름@도메인.영문2자이상 정규식 패턴 검사
    const mailtoRegex = /^mailto:[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/i;
    // 정규식 형식에 부합하는지 확인
    if (mailtoRegex.test(trimmedUrl)) {
      // 정상이면 소문자 mailto 스킴을 포함한 원래 URL 유지
      normalizedUrl = trimmedUrl;
    } else {
      // 형식이 올바르지 않으면 메일 전용 오류 문구 표시
      urlError = "메일 주소 형식이 올바르지 않아요 (예: mailto:me@example.com)";
    }
  // 2. URL 검사: 일반 웹 링크(http/https 등)인 경우
  } else {
    // 프로토콜(스킴) 접두어가 이미 붙어 있는지 확인하는 정규식
    const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmedUrl);
    // 정규화 후보가 될 URL 문자열 초기화
    let candidateUrl = trimmedUrl;

    // 프로토콜이 생략된 경우 자동으로 https:// 접두어 부여
    if (!hasScheme) {
      // https:// 붙이기
      candidateUrl = "https://" + trimmedUrl;
    // 프로토콜이 있지만 http나 https가 아닌 다른 스킴(ftp, javascript 등)인 경우 거절
    } else if (!/^https?:\/\//i.test(trimmedUrl)) {
      // 올바르지 않은 스킴 오류 문구 지정
      urlError = "올바른 URL 형식이 아닙니다 (예: https://example.com).";
    }

    // 스킴 단계에서 오류가 없었을 때 호스트 및 도메인 정밀 검사 진행
    if (!urlError) {
      try {
        // 브라우저 표준 URL 파서로 1차 유효성 파싱 시도 (https:// 만 있는 경우 등 걸러냄)
        const parsed = new URL(candidateUrl);
        // 프로토콜이 정상적인 http/https 인지 확인
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          // 일치하지 않으면 에러 문구 지정
          urlError = "올바른 URL 형식이 아닙니다 (예: https://example.com).";
        } else {
          // 브라우저 URL 파서는 "1234444" 같은 숫자를 IP 주소로 자동 변환하므로 원본 입력값으로 도메인 검증
          const withoutScheme = candidateUrl.replace(/^https?:\/\//i, "");
          // 슬래시, 쿼리, 해시, 포트번호 이전의 순수 호스트 문자열만 추출
          const rawHost = withoutScheme.split(/[/?#:]/)[0];
          // 마침표(.)를 기준으로 호스트를 도메인 단위 조각들로 분할
          const domainParts = rawHost.split(".");

          // 점으로 나뉜 조각이 최소 2개 이상이어야 유효 (예: abc, 1234444 거절)
          const hasMinTwoParts = domainParts.length >= 2;
          // 빈 조각이 없어야 함 (예: abc., .example.com, example..com 거절)
          const hasNoEmptyParts = domainParts.every((part) => part.length > 0);
          // 맨 마지막 조각(최상위 도메인 TLD) 추출
          const lastPart = domainParts[domainParts.length - 1];
          // TLD는 영문 알파벳 2글자 이상이어야 유효 (예: example.c, 1.2.3.4 거절)
          const isTldValid = /^[a-zA-Z]{2,}$/.test(lastPart);

          // 도메인 조건 중 하나라도 만족하지 못하면 형식 오류 처리
          if (!hasMinTwoParts || !hasNoEmptyParts || !isTldValid) {
            // 표준 에러 문구 설정
            urlError = "올바른 URL 형식이 아닙니다 (예: https://example.com).";
          } else {
            // 모든 도메인 검증을 통과하면 최종 정규화 URL 확정
            normalizedUrl = candidateUrl;
          }
        }
      } catch {
        // new URL 파싱 실패 시 형식 오류 처리
        urlError = "올바른 URL 형식이 아닙니다 (예: https://example.com).";
      }
    }
  }

  // 제목과 URL 모두 에러가 없으면 검사 통과(ok: true)
  const ok = !titleError && !urlError;

  // 검증 결과 객체 반환
  return {
    // 통과 여부
    ok,
    // 제목 오류 메시지
    titleError,
    // URL 오류 메시지
    urlError,
    // 정규화된 URL (검증 통과 시에만 유효)
    normalizedUrl: ok ? normalizedUrl : undefined,
  };
}
