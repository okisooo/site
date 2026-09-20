import { NextRequest, NextResponse } from 'next/server';

/**
 * GET Handler for Too Lost OAuth 2.0 redirect URI callback.
 * Route: /api/auth/callback
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const state = searchParams.get('state');

  // 1. Handle any authorization error (e.g. if the user denied access)
  if (error) {
    console.error('OAuth authorization error returned from Too Lost:', {
      error,
      errorDescription,
      state,
    });

    // You can redirect to an error page or return a JSON error
    return NextResponse.json(
      {
        success: false,
        message: 'Authorization denied or failed.',
        error,
        error_description: errorDescription,
      },
      { status: 400 }
    );
  }

  // 2. Ensure the code parameter exists
  if (!code) {
    return NextResponse.json(
      {
        success: false,
        message: 'Missing authorization code from redirect.',
      },
      { status: 400 }
    );
  }

  // Optional: CSRF mitigation - verify that state matches the state generated before redirecting
  // const savedState = request.cookies.get('oauth_state')?.value;
  // if (!state || state !== savedState) {
  //   return NextResponse.json({ success: false, message: 'Invalid state parameter.' }, { status: 400 });
  // }

  try {
    const clientId = process.env.TOOLOST_CLIENT_ID;
    const clientSecret = process.env.TOOLOST_CLIENT_SECRET;
    
    const redirectUri = process.env.TOOLOST_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';

    // 3. Check if credentials are set. If not, bypass the exchange step and return the code for testing.
    if (!clientId || !clientSecret) {
      console.warn('Too Lost OAuth credentials (TOOLOST_CLIENT_ID, TOOLOST_CLIENT_SECRET) are not configured in environment variables. Skipping token exchange step.');
      return NextResponse.json({
        success: true,
        message: 'Authorization code successfully extracted! To enable the token exchange, configure TOOLOST_CLIENT_ID and TOOLOST_CLIENT_SECRET in your environment variables (.env.local).',
        code: code,
        state: state,
        redirect_uri_used: redirectUri,
      });
    }

    // 4. Perform the actual token exchange
    const tokenUrl = process.env.TOOLOST_TOKEN_URL || 'https://toolost.com/oauth/token';
    
    console.log(`Exchanging authorization code for token at ${tokenUrl}...`);
    
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      let errorResponse;
      try {
        errorResponse = JSON.parse(errorText);
      } catch {
        errorResponse = { message: errorText };
      }
      throw new Error(`Token exchange failed with status ${tokenResponse.status}: ${JSON.stringify(errorResponse)}`);
    }

    const tokenData = await tokenResponse.json();
    
    // The response will typically contain:
    // {
    //   access_token: string;
    //   token_type: string;
    //   expires_in: number;
    //   refresh_token?: string;
    //   scope?: string;
    // }
    
    console.log('Successfully acquired access token from Too Lost API.');
    
    // TODO: Store tokenData securely (e.g. in your database or session)
    
    // For now, return a successful response with token details
    return NextResponse.json({
      success: true,
      message: 'Successfully exchanged authorization code for access tokens!',
      token_data: tokenData,
      state: state,
    });
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Error during Too Lost token exchange:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to complete OAuth token exchange.',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
