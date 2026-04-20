import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { getSiteContent } from "@/lib/content-repository";

const Stats = dynamic(() => import("@/components/sections/Stats").then(mod => mod.Stats));
const Services = dynamic(() => import("@/components/sections/Services").then(mod => mod.Services));
const Pricing = dynamic(() => import("@/components/sections/Pricing").then(mod => mod.Pricing), {
  loading: () => <div className="h-96 animate-pulse bg-slate-50 rounded-3xl m-8" />
});
const Campaigns = dynamic(() => import("@/components/sections/Campaigns").then(mod => mod.Campaigns));
const LeadForm = dynamic(() => import("@/components/sections/LeadForm").then(mod => mod.LeadForm));
const About = dynamic(() => import("@/components/sections/About").then(mod => mod.About));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials").then(mod => mod.Testimonials));

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
