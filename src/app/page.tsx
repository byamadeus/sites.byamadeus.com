'use client';

import { Nav } from '@/components/Nav';
import BlitzText from '@/components/BlitzText';
import { SiteCard } from '@/components/SiteCard';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';
import { YarndingBox } from '@/components/YarndingBox';

export default function Home() {
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
            {/* <p>I have one requirement, though...</p> */}
          </div>
          </div>
        </header>

        {/* Expressive Brand Moment*/}
        {/* <section className="flex w-full min-h-[90vh] place-items-center max-w-[800px] flex-col gap px-6 py-16">
          <div className="">
            
            <p className="text-4xl text-white/80 uppercase">Every site must be</p>
            <p className="text-[144pt] lg:text-[16vw] font-[900] leading-none text-white/80 uppercase">Cool <br />as <br />shit</p>
          </div>
        </section> */}

        {/* Sites Section */}
        <section className="flex w-full max-w-[800px] flex-col gap-8 px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SiteCard 
            href="https://www.blaiscameron.com/"
              title="Blais Cameron Films"
              description="Portfolio site for a film studio."
              variant="default"
            />
            <SiteCard 
            href="#"
              title="Sam's Cybersecurity"
              description="A site for a small cybersecurity business."
              variant="wip"
            />
            <SiteCard
              href="https://launch-comotion2024.byamadeus.com/"
              title="2024 SCAD CoMotion"
              description="An event site for CoMotion 2024."
              variant="default"
            />
            
            <SiteCard
              href="https://2024-startup.byamadeus.com/"
              title="2024 SCAD StartUp"
              description="An event site for StartUp 2024."
              variant="default"
            />
            <SiteCard
              href="https://comotion-2023.vercel.app/"
              title="2023 SCAD CoMotion"
              description="An event site for CoMotion 2023."
              variant="default"
            />
            <SiteCard
              href="https://2023-startup.byamadeus.com/"
              title="2023 SCAD StartUp"
              description="An event site for StartUp 2023."
              variant="default"
            />
          </div>
        </section>

        {/* Contact Section */}
        <section className="flex w-full max-w-[800px] flex-col gap-8 px-6 py-16">
          <h2 className="text-2xl text-center text-white/90">What could your site be?</h2>
          <YarndingBox />
          
          {/* <div className="rounded-xl border border-white/20 bg-white/5 p-8 backdrop-blur-sm">
            <ContactForm />
          </div> */}
        </section>

        <Footer />
      </div>
    </main>
    </>
  );
}
