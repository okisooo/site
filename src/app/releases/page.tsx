import { metadata } from "./metadata";
import ReleasesClient from "./ReleasesClient";
import { staticReleases } from "@/data/releases";
import { jsonLd } from "@/lib/seo";
import { releaseCard } from "@/lib/releasePresentation";

export { metadata };

export default function Page() {
  const siteUrl = "https://okiso.net";

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": staticReleases.map((r, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${siteUrl}/releases/${r.slug || encodeURIComponent(r.title.toLowerCase().replace(/\s+/g, '-'))}`
    }))
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Releases",
        "item": `${siteUrl}/releases`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [itemListLd, breadcrumbLd] }) }}
      />
      <ReleasesClient catalog={staticReleases.map(releaseCard)} />
    </>
  );
}
