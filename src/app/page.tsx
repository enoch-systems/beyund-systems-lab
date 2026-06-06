import Navbar from "@/components/Navbar";
import SocialSidebar from "@/components/SocialSidebar";
import ProblemHook from "@/components/ProblemHook";
import VisionOutcome from "@/components/VisionOutcome";
import Layers from "@/components/Layers";
import WhatYouBecome from "@/components/WhatYouBecome";
import MeetTheMentor from "@/components/MeetTheMentor";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black pt-5">
      <ScrollToTop />
      {/* Fixed background covering entire page */}
      <div className="fixed inset-0 bg-black/80" />
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/djdbcoyot/image/upload/v1779492891/luiuteuxzssb1yhzwggr.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          filter: "blur(4px)",
          opacity: 0.6,
          transform: "scale(1.05)",
        }}
      />
      {/* Fixed gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      <div className="relative z-10">
        <Navbar />
        <SocialSidebar />

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