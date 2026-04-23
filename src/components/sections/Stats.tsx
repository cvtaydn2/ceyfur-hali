// Stats — server component, animasyon yok, DOM minimal
import { SiteContent, StatItem } from "@/types";
import { siteContent as fallbackContent } from "@/data/siteContent";

export const Stats = ({ content }: { content?: SiteContent }) => {
  const data = content ?? fallbackContent;

  return (
    <section className="py-20 px-4 bg-primary-ocean text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {data.stats.map((stat: StatItem, i: number) => (
            <div key={i} className="text-center">
              <div className="text-4xl lg:text-5xl font-black mb-2 tabular-nums">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-blue-100/70 font-semibold uppercase tracking-widest text-[10px] md:text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
