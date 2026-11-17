import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { jsonLd, pageMetadata, SITE_URL } from '@/lib/seo';
import { plush } from '@/data/plush';
import PlushStatus from './PlushStatus';
import PlushVideo from './PlushVideo';
import PlushShare from './PlushShare';

export const metadata = pageMetadata(
  'OKISO Plushie — pre-order',
  'A sitting OKISO plush with a tiny Takoling and built-in sound effects. Pre-order it on Gimme Swag from Nov 18 to Dec 18, 2026: it is only made if it reaches 100 pre-orders.',
  '/plush',
);

const BASE = '/plush';
// Photos of the finished sample by Gimme Swag, supplied for promotion.
const closeUps = [
  { file: 'front', label: 'front', alt: 'The OKISO plushie from the front: white hair, red eyes, a white outfit with red cuffs' },
  { file: 'face', label: 'embroidered face', alt: 'Close-up of the plushie’s embroidered red eyes and small smile' },
  { file: 'side', label: 'side', alt: 'The plushie from the side, sitting, with Takoling at its feet' },
  { file: 'back', label: 'back', alt: 'The plushie from behind, showing the long white hair' },
  { file: 'takoling', label: 'takoling', alt: 'Takoling, a small red-orange octopus plush with spiral eyes' },
];

const productData = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: plush.name,
  url: plush.url,
  image: [`${SITE_URL}${BASE}/plush-takoling.webp`, ...closeUps.map(({ file }) => `${SITE_URL}${BASE}/${file}.webp`)],
  description: 'A sitting OKISO plush with a tiny Takoling, the mascot for OKISO’s chat, and built-in sound effects.',
  brand: { '@type': 'Brand', name: 'OKISO' },
  offers: { '@type': 'Offer', url: plush.store, price: '39.99', priceCurrency: 'USD', availability: 'https://schema.org/PreOrder' },
};

export default function PlushPage() {
  return <article className="ed-page ed-plush">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(productData) }} />
    <header className="ed-plush-heading">
      <div>
        <span className="ed-label ed-plush-kicker"><span>pre-order</span><span>{plush.price}</span><span>ships worldwide</span></span>
        <h1>okiso<span> plushie</span></h1>
        <p>a tiny sitting me, with an even tinier takoling, the mascot for my chat. it has sound effects, too. it only gets made if <strong>100 of you</strong> pre-order it.</p>
        <PlushStatus builtAt={Date.now()} />
        <dl className="ed-plush-stats">
          <div><dt>price</dt><dd>{plush.price}</dd></div>
          <div><dt>needs</dt><dd>{plush.goal} pre‑orders</dd></div>
          <div><dt>ships</dt><dd>spring 2027</dd></div>
        </dl>
      </div>
      <figure className="ed-plush-hero">
        <div className="ed-plush-stage">
          <img src={`${BASE}/plush-takoling.webp`} alt="The OKISO plushie sitting next to Takoling, a small red-orange octopus" width="1200" height="1200" fetchPriority="high" />
          <span className="ed-plush-bubble" aria-hidden="true">i talk!</span>
        </div>
        <figcaption className="ed-label"><span>{plush.short}</span><span>photo by gimme swag</span></figcaption>
      </figure>
    </header>

    <section className="ed-plush-watch" aria-labelledby="plush-watch">
      <div className="ed-plush-section-heading"><h2 id="plush-watch">the trailer</h2><Link className="ed-label" href="/releases/prodigy">music: PRODIGY <ArrowUpRight size={13} aria-hidden="true" /></Link></div>
      <PlushVideo builtAt={Date.now()} />
    </section>

    <section className="ed-plush-closeups" aria-labelledby="plush-closeups">
      <div className="ed-plush-section-heading"><h2 id="plush-closeups">up close</h2><span className="ed-label">the finished sample</span></div>
      <ul>
        {closeUps.map(({ file, label, alt }) => <li key={file}>
          <img src={`${BASE}/${file}.webp`} alt={alt} width="800" height="800" loading="lazy" decoding="async" />
          <span>{label}</span>
        </li>)}
      </ul>
    </section>

    <section className="ed-plush-how" aria-labelledby="plush-how">
      <h2 id="plush-how">how it works</h2>
      <ol>
        <li><strong>pre-order on gimme swag</strong> between nov 18 and dec 18, 2026.</li>
        <li><strong>at 100 pre-orders</strong> the plushie goes into production.</li>
        <li><strong>under 100, everyone gets a full refund</strong> to their original payment method.</li>
        <li><strong>it ships worldwide</strong> about 3–5 months after the campaign ends, so around spring 2027.</li>
      </ol>
      <div className="ed-plush-faq">
        <details>
          <summary className="ed-label">does it really talk?</summary>
          <p>yes, it has built-in sound effects.</p>
        </details>
        <details>
          <summary className="ed-label">who’s the octopus?</summary>
          <p>that’s takoling, the mascot for my chat and everyone in it. every plushie comes with one.</p>
        </details>
        <details>
          <summary className="ed-label">where does it ship, and what does shipping cost?</summary>
          <p>worldwide, including japan, the us, the uk and europe. shipping is calculated at checkout on gimme swag.</p>
        </details>
        <details>
          <summary className="ed-label">will it arrive before christmas?</summary>
          <p>no. production starts after the campaign, so it ships around spring 2027.</p>
        </details>
        <details>
          <summary className="ed-label">who makes it?</summary>
          <p>gimme swag produces and ships it, and handles orders and support. questions about an order go to <a href="mailto:orders@gimmeswag.com">orders@gimmeswag.com</a>.</p>
        </details>
      </div>
    </section>

    <PlushShare />
    <div className="ed-links-footnote">
      <Link href="/">back to the homepage <ArrowUpRight size={13} aria-hidden="true" /></Link>
      <Link href="/releases">all my music <ArrowUpRight size={13} aria-hidden="true" /></Link>
    </div>
  </article>;
}
