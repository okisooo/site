const socialCards = {
  '/': ['home-v1', 'OKISO illustrated by suyosuyo and ykhs9 — music, art and more'],
  '/about': ['about-v1', 'OKISO portrait by he_know_lee — VTuber, virtual artist and VOCALOID producer'],
  '/releases': ['releases-v1', 'Selected OKISO release covers — music archive'],
  '/upcoming': ['upcoming-v1', 'OKISO upcoming music and announcements, with chibi art by 7mmchan'],
  '/gallery': ['gallery-v1', 'OKISO gallery — commissioned illustrations by he_know_lee, sobu and ykhs9'],
  '/vault': ['vault-v1', 'The Vault — OKISO demos, alternate versions and unfinished tracks'],
  '/rouge-noir': ['rouge-noir-v1', 'Rouge & Noir title artwork with a red and black roulette wheel'],
} as const;

export function socialImage(pathname = '/') {
  const [file, alt] = socialCards[pathname as keyof typeof socialCards] ?? socialCards['/'];
  return { url: `https://okiso.net/social/${file}.jpg`, alt, width: 1200, height: 630, type: 'image/jpeg' };
}
