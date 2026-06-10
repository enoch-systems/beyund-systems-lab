import Navbar from "@/client/components/common/Navbar";
import SocialSidebar from "@/client/components/common/SocialSidebar";
import PricingBadge from "@/client/components/landing/PricingBadge";
import ProblemHook from "@/client/components/landing/ProblemHook";
import VisionOutcome from "@/client/components/landing/VisionOutcome";
import Layers from "@/client/components/landing/Layers";
import WhatYouBecome from "@/client/components/landing/WhatYouBecome";
import MeetTheMentor from "@/client/components/landing/MeetTheMentor";
import Contact from "@/client/components/landing/Contact";
import Footer from "@/client/components/common/Footer";
import WhatsAppButton from "@/client/components/common/WhatsAppButton";
import ScrollToTop from "@/client/components/common/ScrollToTop";

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
