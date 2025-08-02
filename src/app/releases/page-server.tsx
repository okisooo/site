import { fetchSpotifyReleases } from '@/lib/fetchSpotifyReleases';
import ReleasesPageClient from './ReleasesPageClient';

export default async function ReleasesPage() {
    // Fetch releases at build time (server-side)
    const releases = await fetchSpotifyReleases();

    return <ReleasesPageClient releases={releases} />;
}