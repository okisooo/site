import Link from "next/link";

export default function NotFound() {
  return <div className="ed-page">
    <header className="ed-page-heading"><div><span className="ed-label">page not found / 404</span><h1>lost the link?</h1><p>this page isn’t here. the music still is.</p></div></header>
    <div className="ed-quick-actions"><Link href="/" className="ed-button">back home ↗</Link><Link href="/releases" className="ed-text-link">explore the releases ↗</Link></div>
  </div>;
}
