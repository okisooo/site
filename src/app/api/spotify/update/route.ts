import { NextRequest, NextResponse } from 'next/server';
import { updateReleasesData } from '@/lib/fetchSpotifyReleases';

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication for security
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.API_UPDATE_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting releases update...');
    await updateReleasesData();
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Releases updated successfully',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating releases:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update releases',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check status
export async function GET() {
  return NextResponse.json({
    message: 'Releases update endpoint is active',
    timestamp: new Date().toISOString()
  });
}
