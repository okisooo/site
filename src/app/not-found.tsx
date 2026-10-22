import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { staticReleases } from "@/data/releases";
import { coverArt, coverSrcSet } from "@/lib/coverArt";
import { formatReleaseDate } from "@/lib/releasePresentation";

export const metadata: Metadata = { title: "page not found — OKISO" };

export default function NotFound() {
  return <div className="ed-page">
    <header className="ed-page-heading"><div><span className="ed-label">page not found / 404</span><h1>lost the link?</h1><p>this page isn’t here. the music still is.</p></div></header>
    <div className="ed-quick-actions"><Link href="/" className="ed-button">back home <ArrowUpRight size={16} aria-hidden="true" /></Link><Link href="/releases" className="ed-text-link">explore the releases <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    <section className="ed-section" aria-labelledby="latest-releases">
      <header className="ed-section-heading"><div><h2 id="latest-releases">latest releases</h2></div><Link href="/releases" className="ed-text-link">all {staticReleases.length} releases <ArrowUpRight size={18} aria-hidden="true" /></Link></header>
      <div className="ed-release-grid">{staticReleases.slice(0, 4).map((release) => <article className="ed-release-card" key={release.id}>
        <Link href={`/releases/${release.slug}`}><div className="ed-release-image"><img src={coverArt(release.img, 300)} srcSet={coverSrcSet(release.img)} sizes="(max-width: 700px) calc(50vw - 40px), (max-width: 1380px) 21vw, 290px" alt="" width="360" height="360" loading="lazy" /><ArrowUpRight className="ed-art-arrow" /></div>
          <div className="ed-release-meta"><span>{release.albumType}</span><time dateTime={release.releaseDate}>{formatReleaseDate(release.releaseDate)}</time></div><h3>{release.title}</h3></Link>
      </article>)}</div>
    </section>
  </div>;
}
