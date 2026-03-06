import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import Space from "@/app/components/Space";
import Feature from "@/app/components/Feature";
import Capacity from "@/app/components/Capacity";
import Pricing from "@/app/components/Pricing";
import Faq from "@/app/components/Faq";
import Access from "@/app/components/Access";
import Contact from "@/app/components/Contact";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Space />
        <Feature />
        <Capacity />
        <Pricing />
        <Faq />
        <Access />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
