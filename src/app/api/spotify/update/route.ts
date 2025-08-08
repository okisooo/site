import { NextResponse } from 'next/server';

// Static export compatibility: this endpoint is disabled in static builds.
export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({
    message: 'Update endpoint disabled in static export build',
    docs: 'Use scripts/update-releases.mjs or a server deployment for POST updates.',
  });
}
