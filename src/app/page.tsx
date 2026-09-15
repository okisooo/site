import EditorialHome from "@/Components/Editorial/EditorialHome";
import { artistStructuredData, jsonLd } from "@/lib/seo";
import { getEditorialHomeData } from "@/lib/releasePresentation";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [artistStructuredData, { "@type": "WebSite", "@id": "https://okiso.net/#website", url: "https://okiso.net", name: "OKISO" }],
};
export default function Home() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} /><EditorialHome {...getEditorialHomeData()} /></>;
}
