import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { staticReleases } from '@/data/releases';
import { ARTIST_ID, ARTIST_DESCRIPTION, SITE_URL, artistStructuredData, jsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  'About OKISO | Virtual Artist & VOCALOID Producer',
  'Meet OKISO, a virtual artist and VOCALOID producer making hyperpop and electronic music. Find the official discography, artist profiles and contact details.',
  '/about',
);

const channels = [
  ['spotify', 'listen to the discography', 'https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm'],
  ['bandcamp', 'support the music', 'https://okiso.bandcamp.com/'],
  ['youtube', 'music videos & more', 'https://www.youtube.com/@okiso7'],
  ['instagram', '@okisooo_', 'https://www.instagram.com/okisooo_/'],
  ['x', '@okisooo_', 'https://x.com/okisooo_'],
];

export default function AboutPage() {
  const latest = staticReleases[0];
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [artistStructuredData, {
      '@type': 'AboutPage', '@id': `${SITE_URL}/about#page`, url: `${SITE_URL}/about`,
      name: 'About OKISO', description: ARTIST_DESCRIPTION,
      mainEntity: { '@id': ARTIST_ID }, isPartOf: { '@id': `${SITE_URL}/#website` },
    }, {
      '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'About OKISO', item: `${SITE_URL}/about` },
      ],
    }],
  };
  return <article className="ed-page ed-about">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    <header className="ed-page-heading"><div><span className="ed-label">the artist / official profile</span><h1>about okiso.</h1><p>virtual artist. very real music.</p></div></header>
    <div className="ed-about-body">
      <div className="ed-about-copy">
        <section aria-labelledby="about-music"><h2 id="about-music">a world of sound.</h2>
          <p>okiso is a virtual artist and vocaloid producer creating hyperpop and electronic music.</p>
          <p>the <Link href="/releases">official discography</Link> brings together {staticReleases.length} releases, with track lists, release dates, listening links and lyrics where available. start with <Link href={`/releases/${latest.slug}`}>{latest.title}</Link>, or explore the archive from the beginning.</p>
          <Link className="ed-button" href="/releases">explore the music <ArrowUpRight size={16} /></Link>
        </section>
        <section aria-labelledby="about-character"><h2 id="about-character">sound meets character.</h2>
          <p>the white-haired, red-eyed character appears throughout this site alongside original commissioned illustrations. the <Link href="/gallery">art gallery</Link> collects those works, their alternate versions and the artists behind them.</p>
          <p>visit the <Link href="/">homepage</Link> to explore the interactive 3d character, watch videos and find the listening room.</p>
        </section>
        <section aria-labelledby="about-contact"><h2 id="about-contact">get in touch.</h2>
          {/* Keep this intentionally public business contact intact through Cloudflare's HTML rewrite. */}
          <p>for business inquiries and collaborations: <span dangerouslySetInnerHTML={{ __html: '<!--email_off--><a href="mailto:oxo@okiso.net">oxo@okiso.net</a><!--/email_off-->' }} />.</p>
          <p>for the community, <a href="https://discord.gg/okiso" target="_blank" rel="noopener noreferrer">join the discord</a>.</p>
        </section>
      </div>
      <aside className="ed-about-channels" aria-labelledby="about-channels"><h2 id="about-channels">official channels.</h2>
        {channels.map(([name, detail, href]) => <a key={name} className="ed-contact-row" href={href} target="_blank" rel="noopener noreferrer"><span><strong>{name}</strong><small>{detail}</small></span><ArrowUpRight size={18} /></a>)}
      </aside>
    </div>
  </article>;
}
