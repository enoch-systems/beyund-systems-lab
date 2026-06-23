import Navbar from "@/components/layout/Navbar";
import SocialSidebar from "@/components/layout/SocialSidebar";
import PricingBadge from "@/components/ui/PricingBadge";
import ProblemHook from "@/components/sections/ProblemHook";
import VisionOutcome from "@/components/sections/VisionOutcome";
import Layers from "@/components/sections/Layers";
import WhatYouBecome from "@/components/sections/WhatYouBecome";
import MeetTheMentor from "@/components/sections/MeetTheMentor";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ScrollToTop from "@/components/layout/ScrollToTop";


export default function Home() {
  return (
    <main className="relative min-h-screen bg-black pt-5">
      <ScrollToTop />
      {/* Fixed background covering entire page */}
      <div className="fixed inset-0 bg-black/90" />
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/djdbcoyot/image/upload/v1779492891/luiuteuxzssb1yhzwggr.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          filter: "blur(4px)",
          opacity: 0.4,
          transform: "scale(1.05)",
        }}
      />

    
      {/* Fixed gradient overlay */}
    <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />

      <div className="relative z-10">
        <Navbar />
        <SocialSidebar />
        <PricingBadge />

        {/* Outcome-first flow: Problem → Proof → Curriculum → Identity → Mentor → CTA */}
        <ProblemHook />
        <VisionOutcome />
        <Layers />
        <WhatYouBecome />
        <MeetTheMentor />
        <Contact />
        <Footer />
        <WhatsAppButton />
      </div>
    </main>
  );
}

