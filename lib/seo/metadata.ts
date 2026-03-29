import type { Metadata } from "next";

const BASE_URL = "https://yaverim.io";
const SITE_NAME = "Yaverim";
const DEFAULT_DESCRIPTION =
  "Hedeflerine, bütçene ve çalışma düzenine uygun yapay zekâ araçlarını ve uygulanabilir çözüm planlarını keşfet.";

interface PageMetaInput {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}

/**
 * Generates consistent page-level metadata.
 * Use in each route's `export const metadata` or `generateMetadata`.
 */
export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = `${BASE_URL}${path}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    metadataBase: new URL(BASE_URL),
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/** Generates JSON-LD structured data for a tool page. */
export function buildToolJsonLd(tool: {
  name: string;
  description: string;
  url: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: tool.url,
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/tools/${tool.slug}`,
    },
  };
}
