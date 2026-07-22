import assert from 'node:assert/strict';
import test from 'node:test';
import { exchangeTooLostAuthorizationCode, refreshTooLostAccessToken } from './tooLostOAuth';

const tokenResponse = {
  access_token: 'access-token-value-that-is-long-enough',
  refresh_token: 'rotated-refresh-token',
  expires_in: 1_296_000,
};

test('refreshes a public PKCE client without basic authentication', async () => {
  const token = await refreshTooLostAccessToken({
    clientId: 'public-client-id',
    refreshToken: 'current-refresh-token',
    fetcher: async (_input, init) => {
      const headers = new Headers(init?.headers);
      const body = new URLSearchParams(init?.body?.toString());

      assert.equal(headers.get('authorization'), null);
      assert.equal(body.get('grant_type'), 'refresh_token');
      assert.equal(body.get('client_id'), 'public-client-id');
      assert.equal(body.get('refresh_token'), 'current-refresh-token');
      return new Response(JSON.stringify(tokenResponse), { status: 200 });
    },
  });

  assert.deepEqual(token, {
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token,
    expiresIn: tokenResponse.expires_in,
  });
});

test('keeps basic authentication support for confidential clients', async () => {
  await exchangeTooLostAuthorizationCode({
    clientId: 'confidential-client-id',
    clientSecret: 'client-secret',
    code: 'authorization-code',
    redirectUri: 'https://example.com/callback',
    codeVerifier: 'pkce-verifier',
    fetcher: async (_input, init) => {
      const headers = new Headers(init?.headers);
      const expected = Buffer.from('confidential-client-id:client-secret').toString('base64');
      assert.equal(headers.get('authorization'), `Basic ${expected}`);
      return new Response(JSON.stringify(tokenResponse), { status: 200 });
    },
  });
});
