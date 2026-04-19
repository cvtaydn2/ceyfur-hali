import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Pricing } from "@/components/sections/Pricing";
import { About } from "@/components/sections/About";
import { Campaigns } from "@/components/sections/Campaigns";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { LeadForm } from "@/components/sections/LeadForm";
import { getSiteContent } from "@/lib/content-repository";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <main id="main-content" className="flex min-h-screen flex-col">
      <Hero content={content} />
      <Stats content={content} />
      <Services content={content} />
      <Pricing content={content} />
      <Campaigns content={content} />
      <LeadForm />
      <About content={content} />
      <Testimonials content={content} />
    </main>
  );
}
