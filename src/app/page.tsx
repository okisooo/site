import EditorialHome from "@/Components/Editorial/EditorialHome";
import { ARTIST_ID, jsonLd } from "@/lib/seo";
import { getEditorialHomeData } from "@/lib/releasePresentation";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [{
    "@type": "MusicGroup", "@id": ARTIST_ID, name: "OKISO",
    url: "https://okiso.net", image: "https://okiso.net/og_image.png",
    description: "OKISO is a virtual artist and VOCALOID producer creating hyperpop and electronic music.",
    sameAs: ["https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm", "https://www.instagram.com/okisooo_/", "https://github.com/okisooo", "https://x.com/okisooo_", "https://www.youtube.com/@okiso7", "https://discord.gg/okiso", "https://okiso.bandcamp.com/"],
  }, { "@type": "WebSite", url: "https://okiso.net", name: "OKISO" }],
};
export default function Home() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} /><EditorialHome {...getEditorialHomeData()} /></>;
}
