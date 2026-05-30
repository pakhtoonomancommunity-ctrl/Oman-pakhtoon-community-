import React from 'react';
import { Phone, Mail, MapPin, Globe, Clock, ShieldCheck, Heart, Award } from 'lucide-react';

export default function Footer() {
  const embassyServices = [
    { name: 'Machine Readable Passport Renewal', description: 'Requires physical presence, online slot booking' },
    { name: 'NICOP / CNIC Identity Card Updates', description: 'Processed by NADRA desk at the Embassy' },
    { name: 'Foreign Attestation & Notary Services', description: 'Available Sunday to Thursday morning' },
    { name: 'Emergency Repatriation / Welfare Desk', description: '24/7 dedicated support for emergency cases' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t-4 border-[#006633]" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        
        {/* Community Pillar & Slogan */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏔️</span>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">پښتانه د عُمان ټولنه</h3>
              <p className="text-sm font-bold text-[#D4AF37]">Pakhtoon Community Muscat & Salalah</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-400 font-medium">
            A unified structural welfare platform offering support, solidarity, legal guidance, and emergency response services for the Pakhtoon diaspora living and working hard in the Sultanate of Oman. Founded on principles of Khyber hospitality and Omani harmony.
          </p>
          <div className="flex items-center gap-2.5 text-slate-100 text-xs font-bold bg-[#003318] border border-[#004d26] rounded-lg p-3 max-w-sm">
            <span className="text-lg">🤝</span>
            <span>Supporting Omani National Vision & Celebrating Pashtun Heritage</span>
          </div>
        </div>

        {/* Official Embassy Contact Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
            <Globe className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-md font-bold text-white tracking-tight uppercase">Pakistan Embassy Oman</h3>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
              <span>Way No. 2107, Diplomatic Quarter, Ruwi, Muscat, Sultanate of Oman</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
              <span>+968 2469 6141 / Urgent: +968 2469 6143</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
              <span>parepmuscat@mofa.gov.pk</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-bold text-xs uppercase tracking-wider">Working Hours:</p>
                <p>Sunday - Thursday (08:00 AM - 02:00 PM)</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Consular Services List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
            <Award className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-md font-bold text-white tracking-tight uppercase">Key Consular Help</h3>
          </div>
          <div className="space-y-3">
            {embassyServices.map((service, index) => (
              <div key={index} className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60 hover:border-[#006633] transition-colors">
                <p className="text-xs font-bold text-slate-200">{service.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 text-center text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 font-medium">
          © {new Date().getFullYear()} Pakhtoon Community Oman (پښتانه د عُمان ټولنه). Authorized by community council.
        </p>
        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Authorized Portal</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer transition-colors">Emergency Helplines</span>
          <span>•</span>
          <span className="text-amber-500 font-mono">Password: admin123</span>
        </div>
      </div>
    </footer>
  );
}
