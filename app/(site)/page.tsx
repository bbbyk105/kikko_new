import type { Metadata } from "next";
import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import Space from "@/app/components/Space";
import Feature from "@/app/components/Feature";
import Capacity from "@/app/components/Capacity";
import Pricing from "@/app/components/Pricing";
import Faq from "@/app/components/Faq";
import Access from "@/app/components/Access";
import Contact from "@/app/components/Contact";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { homeStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Space />
      <Feature />
      <Capacity />
      <Pricing />
      <Faq />
      <Access />
      <Contact />
      <JsonLd data={homeStructuredData()} />
    </>
  );
}
