import React from "react";
import { Globe, Share2, Phone, Mail, MapPin } from "lucide-react";
import { SiteContent } from "@/types";
import { siteContent as fallbackContent } from "@/data/siteContent";

export const Footer = ({ content }: { content?: SiteContent }) => {
  const data = content || fallbackContent;

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-ocean rounded-lg flex items-center justify-center text-white font-bold">
              {data.brand.name.charAt(0)}
            </div>
            <span className="font-bold text-xl text-white">{data.brand.name}</span>
          </div>
          <p className="text-sm leading-relaxed">
            {data.footer.about}
          </p>
          <div className="flex gap-4">
            {data.contact.instagram && (
              <a 
                href={data.contact.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram sayfamız" 
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-ocean hover:text-white transition-all"
              >
                <Globe size={20} />
              </a>
            )}
            {data.contact.facebook && (
              <a 
                href={data.contact.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook sayfamız" 
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-ocean hover:text-white transition-all"
              >
                <Share2 size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-6">Hızlı Menü</h3>
          <ul className="space-y-4">
            {data.navigation.map((item : any) => (
              <li key={item.label}>
                <a href={item.href} className="text-sm hover:text-primary-ocean transition-colors">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-bold mb-6">İletişim</h3>
          <address className="not-italic">
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={18} className="text-primary-ocean shrink-0" />
                <span>{data.contact.address}, {data.contact.district}/{data.contact.city}</span>
              </li>
              <li className="flex flex-col gap-3 text-sm">
                {data.contact.phone.map((num) => (
                  <div key={num} className="flex items-center gap-3">
                    <Phone size={18} className="text-primary-ocean shrink-0" />
                    <a href={`tel:${num.replace(/\s/g, "")}`} className="hover:text-primary-ocean transition-colors">
                      {num}
                    </a>
                  </div>
                ))}
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={18} className="text-primary-ocean shrink-0" />
                <a href={`mailto:${data.contact.email}`} className="hover:text-primary-ocean transition-colors">
                  {data.contact.email}
                </a>
              </li>
            </ul>
          </address>
        </div>

        {/* Working Hours */}
        <div>
          <h3 className="text-white font-bold mb-6">Çalışma Saatleri</h3>
          <p className="text-sm italic mb-4">Pazar günü kapalıyız.</p>
          <div className="bg-slate-800 p-4 rounded-xl border border-white/5">
            <p className="text-white font-medium text-sm mb-1">Mesai Saatleri:</p>
            <p className="text-xs">{data.contact.workingHours}</p>
          </div>
          {data.contact.googleMapsUrl && (
            <a 
              href={data.contact.googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-6 inline-block text-xs text-primary-ocean font-bold hover:underline"
            >
              Haritada Görüntüle →
            </a>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs">{data.footer.copyright}</p>
        <div className="flex gap-6">
          {data.footer.links.map((link : any) => (
            <a key={link.label} href={link.href} className="text-xs hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
