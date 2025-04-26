"use client";
import Link from 'next/link';
import ContentCard from '@/Components/ContentCard';
import Iridescence from '@/Backgrounds/Iridescence/Iridescence';

export default function UpcomingPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden text-white p-3 sm:p-6">
      <div className="fixed top-0 left-0 w-[100vw] h-[100vh] overflow-hidden z-[-1]">
        <Iridescence
          color={[0.8, 0.8, 0.8]} 
          speed={0.7} 
          amplitude={0.08} 
        />
      </div>
      
      {/* Semi-transparent overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>
          
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
        </header>

        <ContentCard>
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold text-shadow-md mb-4">Coming Soon</h2>
            <p className="text-gray-200 text-shadow-sm text-center max-w-md">
              No upcoming releases at the moment. Check back later or follow OKISO on social media for announcements.
            </p>
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