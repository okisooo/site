export interface TooLostSmartLink {
  spotifyReleaseId: string;
  tooLostReleaseId: string;
  upc: string;
  url: string;
}

// Imported from Too Lost's Release Links dashboard. The public API does not
// currently expose too.fm URLs.
export const tooLostSmartLinks: TooLostSmartLink[] = [
  {
    spotifyReleaseId: '1n3y33L9KIRz3oYxbWLlOf',
    tooLostReleaseId: '1186045',
    upc: '0672896830421',
    url: 'https://too.fm/v0mnd0p',
  },
  {
    spotifyReleaseId: '7s1rccJu49nMstJfnwfTTH',
    tooLostReleaseId: '1197877',
    upc: '0672896929460',
    url: 'https://too.fm/de90n0p',
  },
  {
    spotifyReleaseId: '5fUrozDWE08pZHsFNmJa1j',
    tooLostReleaseId: '1148553',
    upc: '0672896707983',
    url: 'https://too.fm/3pb8zyr',
  },
  {
    spotifyReleaseId: '7j3Weq7F6KZCOLK7IucH8t',
    tooLostReleaseId: '1096870',
    upc: '0672896289656',
    url: 'https://too.fm/dd8app4',
  },
  {
    spotifyReleaseId: '3EYCF4DQCNVxsHq6Ep9FWl',
    tooLostReleaseId: '967652',
    upc: '0609360670511',
    url: 'https://too.fm/nlebyep',
  },
  {
    spotifyReleaseId: '1uOe2jivJX1Z4ZEz1DHKdp',
    tooLostReleaseId: '971898',
    upc: '0609360578909',
    url: 'https://too.fm/kkn5bpk',
  },
];
