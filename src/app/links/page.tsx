import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FaBandcamp, FaDiscord, FaGithub, FaInstagram, FaSpotify, FaTwitch, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { pageMetadata } from '@/lib/seo';
import { commissionArt } from '@/data/commissionArt';

export const metadata = pageMetadata(
  'OKISO / links & contact',
  'My official music, videos, social profiles and contact details, all in one place.',
  '/links',
);

const profiles = [
  { name: 'youtube', detail: '@okiso7', href: 'https://www.youtube.com/@okiso7', icon: FaYoutube },
  { name: 'spotify', detail: 'listen to my music', href: 'https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm', icon: FaSpotify },
  { name: 'instagram', detail: '@okisooo_', href: 'https://www.instagram.com/okisooo_/', icon: FaInstagram },
  { name: 'x', detail: '@okisooo_', href: 'https://x.com/okisooo_', icon: FaXTwitter },
  { name: 'twitch', detail: '@okiso7', href: 'https://www.twitch.tv/okiso7/', icon: FaTwitch },
  { name: 'discord', detail: 'join the server', href: 'https://discord.gg/okiso', icon: FaDiscord },
  { name: 'bandcamp', detail: 'support the music', href: 'https://okiso.bandcamp.com/', icon: FaBandcamp },
  { name: 'github', detail: 'projects & code', href: 'https://github.com/okisooo', icon: FaGithub },
];

export default function LinksPage() {
  const portrait = commissionArt[2];
  return <article className="ed-page ed-links-page">
    <header className="ed-links-heading">
      <Image src={portrait.small} alt={portrait.description}
        width={portrait.width} height={portrait.height} sizes="80px" className="ed-links-portrait" />
      <div><span className="ed-label">oki.so</span><h1>okiso</h1><p>music, videos & keeping in touch.</p></div>
    </header>
    <nav className="ed-links-features" aria-label="Music and art">
      <Link href="/releases">all my music <ArrowUpRight size={18} aria-hidden="true" /></Link>
      <Link href="/gallery">art gallery <ArrowUpRight size={18} aria-hidden="true" /></Link>
    </nav>
    <section aria-labelledby="links-profiles">
      <h2 id="links-profiles" className="ed-label">find me</h2>
      <ul className="ed-links-grid">
        {profiles.map(({ name, detail, href, icon: Icon }) => <li key={name}>
          <a href={href} target="_blank" rel="noopener noreferrer" className="ed-links-profile">
            <Icon size={21} aria-hidden="true" />
            <span><strong>{name}</strong><small>{detail}</small></span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </li>)}
      </ul>
    </section>
    <section className="ed-links-contact" aria-labelledby="links-contact">
      <h2 id="links-contact" className="ed-label">business & collabs</h2>
      {/* Keep the current working public address intact through Cloudflare's email rewrite. */}
      <div dangerouslySetInnerHTML={{ __html: '<!--email_off--><a class="ed-links-email" href="mailto:oxo@okiso.net">oxo@okiso.net<span aria-hidden="true">↗</span></a><!--/email_off-->' }} />
      <p>discord <span className="ed-links-handle">.oxo</span></p>
    </section>
    <div className="ed-links-footnote">
      <Link href="/">back to the homepage <ArrowUpRight size={13} aria-hidden="true" /></Link>
      <Link href="/gallery">art by {portrait.artist}</Link>
    </div>
  </article>;
}
