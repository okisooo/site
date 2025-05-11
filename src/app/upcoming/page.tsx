"import Link from 'next/link';
import Image from 'next/image';
import ContentCard from '@/Components/ContentCard';
import UpcomingBalatroWrapper from '../../Components/UpcomingBalatroWrapper';client";
import Link from 'next/link';
import Image from 'next/image';
import ContentCard from '@/Components/ContentCard';
import UpcomingBalatroWrapper from '../../../Components/UpcomingBalatroWrapper';

export default function UpcomingPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden text-white p-3 sm:p-6">      {/* Use Balatro background with white theme for RESURRECTION album */}
      <UpcomingBalatroWrapper />      {/* Lighter semi-transparent overlay - reduced opacity for the white background */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>

      {/* Vignette effect overlay */}
      <div className="absolute inset-0 bg-vignette z-[1] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-shadow-lg mb-4">
            OKISO Upcoming Releases
          </h1>
          <p className="text-xl text-shadow-md text-gray-200 mb-6">
            Get a preview of what is coming next from OKISO. Check back later for updates.
          </p>
        </header>        <ContentCard>
          <div className="flex flex-col lg:flex-row items-center gap-8 py-8 px-4">
            {/* Album Cover */}
            <div className="w-full max-w-[300px] aspect-square relative rounded-lg overflow-hidden shadow-2xl">
              <a href="https://open.spotify.com/prerelease/0MAU5F8CQeuBQ4bC9N3SDi?si=4dde829272c14f12" target="_blank" rel="noopener noreferrer">                <Image
                src="/images/resurrection-cover.jpg"
                alt="RESURRECTION Album Cover"
                width={300}
                height={300}
                className="object-cover hover:scale-105 transition-transform"
                priority
              />
              </a>
            </div>

            {/* Album Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-shadow-lg mb-3">RESURRECTION</h2>
              <div className="mb-6">
                <span className="inline-block bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-full mb-3">Coming Soon</span>
                <p className="text-xl text-shadow-md mb-4">
                  The next evolution of OKISO's sound is approaching.
                </p>
                <p className="text-gray-200 text-shadow-sm mb-6">
                  Experience the rebirth through sound with the upcoming RESURRECTION album.
                  A journey through atmospheric landscapes and dynamic rhythms that pushes boundaries.
                </p>
              </div>

              <a
                href="https://open.spotify.com/prerelease/0MAU5F8CQeuBQ4bC9N3SDi?si=4dde829272c14f12"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg inline-flex items-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Pre-save on Spotify
              </a>
            </div>
          </div>
        </ContentCard>

        {/* Back to Home button with fixed position */}
        <div className="fixed bottom-6 left-6 z-20">
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition-colors bg-black/40 backdrop-blur-card px-4 py-2 rounded-full inline-flex items-center text-base min-h-[44px] text-shadow-sm border border-white/10 shadow-lg"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}