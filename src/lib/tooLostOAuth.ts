const DEFAULT_TOOLOST_TOKEN_URL = 'https://toolost.com/oauth/token';

export interface TooLostTokenSet {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

interface TooLostOAuthClient {
  clientId: string;
  clientSecret?: string;
  fetcher?: typeof fetch;
}

interface AuthorizationCodeGrant extends TooLostOAuthClient {
  code: string;
  redirectUri: string;
  codeVerifier: string;
}

interface RefreshTokenGrant extends TooLostOAuthClient {
  refreshToken: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function numericSeconds(value: unknown): number | undefined {
  const parsed = typeof value === 'number'
    ? value
    : typeof value === 'string' && value.trim() !== ''
      ? Number(value)
      : Number.NaN;

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

async function requestToken(
  client: TooLostOAuthClient,
  parameters: URLSearchParams,
): Promise<TooLostTokenSet> {
  parameters.set('client_id', client.clientId);

  const headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  });
  if (client.clientSecret) {
    headers.set('Authorization', `Basic ${Buffer.from(`${client.clientId}:${client.clientSecret}`).toString('base64')}`);
  }

  const tokenUrl = process.env.TOOLOST_TOKEN_URL || DEFAULT_TOOLOST_TOKEN_URL;
  const response = await (client.fetcher || fetch)(tokenUrl, {
    method: 'POST',
    headers,
    body: parameters,
  });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const providerError = isRecord(payload) && typeof payload.error === 'string' ? ` (${payload.error})` : '';
    throw new Error(`Too Lost token request failed with HTTP ${response.status}${providerError}.`);
  }
  if (!isRecord(payload) || typeof payload.access_token !== 'string' || payload.access_token.length < 20) {
    throw new Error('Too Lost token response did not contain a usable access token.');
  }

  return {
    accessToken: payload.access_token,
    refreshToken: typeof payload.refresh_token === 'string' ? payload.refresh_token : undefined,
    expiresIn: numericSeconds(payload.expires_in),
  };
}

export function exchangeTooLostAuthorizationCode(grant: AuthorizationCodeGrant): Promise<TooLostTokenSet> {
  return requestToken(grant, new URLSearchParams({
    grant_type: 'authorization_code',
    code: grant.code,
    redirect_uri: grant.redirectUri,
    code_verifier: grant.codeVerifier,
  }));
}

export function refreshTooLostAccessToken(grant: RefreshTokenGrant): Promise<TooLostTokenSet> {
  return requestToken(grant, new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: grant.refreshToken,
  }));
}
