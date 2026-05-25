import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialSidebar from "@/components/SocialSidebar";
import Layers from "@/components/Layers";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Full-page background spanning Hero to Footer */}
      <div className="absolute inset-0 h-full bg-black/80" />
      <div
        className="absolute inset-0 h-full"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/djdbcoyot/image/upload/v1779492891/tvchvy2zbigbduggdlmi.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          filter: "blur(4px)",
          opacity: 0.6,
          transform: "scale(1.05)",
        }}
      />
      {/* Gradient overlay spanning entire page */}
      <div className="absolute inset-0 h-full bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      <div className="relative z-10">
        <Navbar />
        <Hero>
          <SocialSidebar />
        </Hero>
        <Layers />
        <About />
        <Skills />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
