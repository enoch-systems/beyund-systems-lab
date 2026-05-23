import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialSidebar from "@/components/SocialSidebar";
import LogoStrip from "@/components/LogoStrip";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <Navbar />
      <Hero>
        <SocialSidebar />
        <LogoStrip />
      </Hero>
      <About />
      <Skills />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
