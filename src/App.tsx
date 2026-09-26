import { MotionConfig } from "framer-motion";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/hero/Hero";
import { Services } from "./components/sections/services/Services";
import { Process } from "./components/sections/Process";
import { Team } from "./components/sections/team/Team";
import { Faq } from "./components/sections/Faq";
import { Contact } from "./components/sections/contact/Contact";
import { BackToTop } from "./components/ui/BackToTop";

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main id="contenido" className="relative z-10">
        <Hero />
        <Services />
        <Process />
        <Team />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </MotionConfig>
  );
}
