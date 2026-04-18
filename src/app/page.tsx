import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Campaigns } from "@/components/sections/Campaigns";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { getSiteContent } from "@/lib/content-repository";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <main className="flex min-h-screen flex-col">
      <Hero content={content} />
      <Stats content={content} />
      <Services content={content} />
      <Campaigns content={content} />
      <Testimonials content={content} />
      
      {/* Newsletter or Contact Mini Section */}
      <section id="contact" className="py-24 px-4 bg-slate-900 overflow-hidden relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary-ocean/5 blur-3xl rounded-full" />
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Hala Kararsız mısınız?</h2>
            <p className="text-slate-400 text-lg mb-10">
              Hemen bizi arayın veya WhatsApp&apos;tan mesaj atın, ekibimiz size en uygun randevu saatini planlasın.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href={`tel:${content.contact.phone.replace(/\s/g, "")}`} 
                className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-xl hover:bg-slate-100 transition-all"
              >
                {content.contact.phone}
              </a>
              <a 
                 href={`https://wa.me/${content.contact.whatsapp}`}
                 className="px-10 py-5 bg-primary-ocean text-white rounded-2xl font-bold text-xl shadow-2xl shadow-primary-ocean/20 hover:scale-105 active:scale-95 transition-all"
              >
                Ücretsiz Teklif Al
              </a>
            </div>
         </div>
      </section>
    </main>
  );
}
