import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { staticReleases } from "@/data/releases";

export default function UpcomingClient() {
  const latest = staticReleases[0];
  return <div className="ed-page" data-premid-page="upcoming">
    <header className="ed-page-heading"><div><h1>upcoming</h1></div></header>
    <div className="ed-upcoming"><div className="ed-empty"><h2>nothing announced yet</h2><Link className="ed-button" href="/vault">demos in the vault <ArrowUpRight size={16} /></Link></div>
      <Link href={`/releases/${latest.slug}`} className="ed-upcoming-art"><div className="ed-panel-label"><span>out now / {latest.title}</span><ArrowUpRight size={18} /></div><img src={latest.img} alt={`${latest.title} cover`} width="560" height="560" /></Link></div>
  </div>;
}
