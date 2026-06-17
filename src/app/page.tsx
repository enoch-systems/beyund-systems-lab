import Navbar from "@landing/components/Navbar";
import SocialSidebar from "@landing/components/SocialSidebar";
import PricingBadge from "@landing/components/PricingBadge";
import ProblemHook from "@landing/components/ProblemHook";
import VisionOutcome from "@landing/components/VisionOutcome";
import Layers from "@landing/components/Layers";
import WhatYouBecome from "@landing/components/WhatYouBecome";
import MeetTheMentor from "@landing/components/MeetTheMentor";
import Contact from "@landing/components/Contact";
import Footer from "@landing/components/Footer";
import WhatsAppButton from "@landing/components/WhatsAppButton";
import ScrollToTop from "@landing/components/ScrollToTop";

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
