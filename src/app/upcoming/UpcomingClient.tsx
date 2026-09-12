import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { staticReleases } from "@/data/releases";

export default function UpcomingClient() {
  const latest = staticReleases[0];
  return <div className="ed-page" data-premid-page="upcoming">
    <header className="ed-page-heading"><div><span className="ed-label">what comes next</span><h1>upcoming.</h1><p>new music announcements will appear here.</p></div></header>
    <div className="ed-upcoming"><div className="ed-empty"><span className="ed-label">no release announced</span><h2>nothing on<br />the calendar.<br />yet.</h2><p>in the meantime, there’s a whole archive to get lost in. demos and alternate versions live in the vault.</p><Link className="ed-button" href="/vault">open the vault <ArrowUpRight size={16} /></Link></div>
      <Link href={`/releases/${latest.slug}`} className="ed-upcoming-art"><div className="ed-panel-label"><span>out now / {latest.title}</span><ArrowUpRight size={18} /></div><img src={latest.img} alt={`${latest.title} cover`} width="560" height="560" /></Link></div>
  </div>;
}
