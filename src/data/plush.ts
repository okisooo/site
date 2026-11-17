/** The OKISO Plushie pre-order campaign on Gimme Swag (Nov 18 – Dec 18, 2026). */
export const plush = {
  name: 'OKISO Plushie',
  store: 'https://www.gimmeswag.com/products/okiso-plushie',
  short: 'oki.so/plush',
  url: 'https://okiso.net/plush',
  // 8:30 AM EST = 10:30 PM JST on Nov 18. The campaign closes Dec 18 at 11:59 PM EST.
  opens: Date.parse('2026-11-18T13:30:00Z'),
  closes: Date.parse('2026-12-19T04:59:59Z'),
  price: '$39.99',
  goal: 100,
  // Pre-orders as reported by Gimme Swag. Leave null until there is a real count to show.
  orders: null as number | null,
} as const;

export type PlushPhase = 'soon' | 'open' | 'closed';

export function plushPhase(now: number): PlushPhase {
  if (now < plush.opens) return 'soon';
  return now <= plush.closes ? 'open' : 'closed';
}

/** "1d 4h 12m" until a moment; minutes are dropped once days exceed two. */
export function countdown(to: number, now: number): string {
  const total = Math.max(0, Math.floor((to - now) / 60000));
  const days = Math.floor(total / 1440), hours = Math.floor((total % 1440) / 60), minutes = total % 60;
  if (days > 2) return `${days}d ${hours}h`;
  return days ? `${days}d ${hours}h ${minutes}m` : hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}
