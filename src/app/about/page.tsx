import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { staticReleases } from '@/data/releases';
import { ARTIST_ID, ARTIST_DESCRIPTION, SITE_URL, artistStructuredData, jsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  'About OKISO | VTuber, Virtual Artist & VOCALOID Producer',
  'OKISO is a VTuber, virtual artist and VOCALOID producer making hyperpop and electronic music. Find music, artist profiles and contact details.',
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
    <header className="ed-page-heading"><div><h1>about me</h1></div></header>
    <div className="ed-about-body">
      <div className="ed-about-copy">
        <section aria-labelledby="about-music"><h2 id="about-music">hey, i’m okiso</h2>
          <p>i’m a VTuber, virtual artist and vocaloid producer making hyperpop and electronic music</p>
          <p>latest release: <Link href={`/releases/${latest.slug}`}>{latest.title}</Link></p>
          <Link className="ed-button" href="/releases">all releases <ArrowUpRight size={16} /></Link>
        </section>
        <section aria-labelledby="about-character"><h2 id="about-character">art</h2>
          <p>i also commission art of my character — <Link href="/gallery">here’s the gallery</Link></p>
        </section>
        <section aria-labelledby="about-contact"><h2 id="about-contact">contact</h2>
          {/* Keep this intentionally public business contact intact through Cloudflare's HTML rewrite. */}
          <p>business & collabs: <span dangerouslySetInnerHTML={{ __html: '<!--email_off--><a href="mailto:oxo@okiso.net">oxo@okiso.net</a><!--/email_off-->' }} /></p>
          <p><a href="https://discord.gg/okiso" target="_blank" rel="noopener noreferrer">join the discord</a></p>
        </section>
      </div>
      <aside className="ed-about-channels" aria-labelledby="about-channels"><h2 id="about-channels">links</h2>
        {channels.map(([name, detail, href]) => <a key={name} className="ed-contact-row" href={href} target="_blank" rel="noopener noreferrer"><span><strong>{name}</strong><small>{detail}</small></span><ArrowUpRight size={18} /></a>)}
      </aside>
    </div>
  </article>;
}
