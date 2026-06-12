import { metadata } from "./metadata";
import UpcomingClient from "./UpcomingClient";

export { metadata };

export default function Page() {
  const siteUrl = "https://okiso.net";

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
        "name": "Upcoming",
        "item": `${siteUrl}/upcoming`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <UpcomingClient />
    </>
  );
}
