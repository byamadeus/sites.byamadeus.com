'use client';

import { Nav } from '@/components/Nav';
import BlitzText from '@/components/BlitzText';
import { SiteCarousel } from '@/components/SiteCarousel';
import { Footer } from '@/components/Footer';
import { YarndingBox } from '@/components/YarndingBox';
import { ContactDrawer } from '@/components/ContactDrawer';
import { sites } from '@sites';

export default function Home() {
  const visibleSites = sites.filter((s) => s.status === "done");

  return (
    <>
    <main>
      <Nav />
      <div className="flex min-h-screen flex-col items-center font-sans">
        {/* Hero Section */}
        <header className="flex w-full flex-col  items-center gap-12 px-6 pt-24 pb-16">
          <div className="flex w-full min-h-[40vh] items-end">
            <div className="flex w-full max-h-[100px] pt-3">
              <BlitzText text="Amadeus" />
            </div>
          </div>
          <div className='min-h-[40vh]'>
          <div className="w-full flex flex-col items-center text-center text-2xl max-w-[800px] leading-relaxed text-white/80 gap-4">
            <p>I make websites for <em>people.</em></p>
          </div>
          </div>
        </header>

        {/* Sites Section — full viewport width so peeking cards aren't clipped */}
        <section className="flex w-full flex-col gap-8 py-16 overflow-hidden">
          <SiteCarousel sites={visibleSites} />
        </section>

        {/* Contact Section */}
        <section className="flex w-full max-w-[800px] flex-col gap-8 px-6 py-16">
          <h2 className="text-2xl text-center text-white/90">What could your site be?</h2>
          <YarndingBox />
        </section>

        <Footer />
      </div>
      <ContactDrawer />
    </main>
    </>
  );
}
