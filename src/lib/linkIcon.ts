// 4장 4-7: URL 패턴에 따른 아이콘 종류 및 브랜드 식별 로직

export type LinkIconKind =
  | "mail"
  | "github"
  | "youtube"
  | "instagram"
  | "x"
  | "velog"
  | "blog"
  | "external";

export interface LinkIconInfo {
  kind: LinkIconKind;
  isBrand: boolean;
  domain?: string;
  bgClass: string;
}

// URL 을 분석하여 적절한 아이콘 종류와 배경색 클래스를 반환
export function getLinkIconInfo(url: string): LinkIconInfo {
  const lowerUrl = (url || "").trim().toLowerCase();

  // 1. 메일 주소 (mailto:)
  if (lowerUrl.startsWith("mailto:")) {
    return {
      kind: "mail",
      isBrand: false,
      bgClass: "bg-logo-mail text-white",
    };
  }

  // 도메인 추출 시도
  let domain = "";
  try {
    const parsed = new URL(lowerUrl.startsWith("http") ? lowerUrl : `https://${lowerUrl}`);
    domain = parsed.hostname;
  } catch {
    domain = lowerUrl;
  }

  // 2. GitHub
  if (domain.includes("github.com")) {
    return {
      kind: "github",
      isBrand: true,
      domain,
      bgClass: "bg-logo-github text-white",
    };
  }

  // 3. YouTube
  if (domain.includes("youtube.com") || domain.includes("youtu.be")) {
    return {
      kind: "youtube",
      isBrand: true,
      domain,
      bgClass: "bg-logo-youtube text-white",
    };
  }

  // 4. Instagram
  if (domain.includes("instagram.com")) {
    return {
      kind: "instagram",
      isBrand: true,
      domain,
      bgClass: "bg-logo-instagram text-white",
    };
  }

  // 5. X (Twitter) - 도메인이 x.com 이거나 twitter.com 포함
  if (domain === "x.com" || domain.endsWith(".x.com") || domain.includes("twitter.com")) {
    return {
      kind: "x",
      isBrand: true,
      domain,
      bgClass: "bg-logo-x text-white",
    };
  }

  // 6. velog
  if (domain.includes("velog.io")) {
    return {
      kind: "velog",
      isBrand: true,
      domain,
      bgClass: "bg-logo-velog text-white",
    };
  }

  // 7. 블로그 키워드 포함 사이트
  if (domain.includes("blog") || lowerUrl.includes("blog")) {
    return {
      kind: "blog",
      isBrand: false,
      domain,
      bgClass: "bg-white border border-border text-foreground",
    };
  }

  // 8. 그 밖의 일반 외부 사이트
  return {
    kind: "external",
    isBrand: false,
    domain,
    bgClass: "bg-white border border-border text-foreground",
  };
}
