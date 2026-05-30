import React, { useRef, useState } from 'react';
import { Download, Award, ShieldCheck, Heart, User, Sparkles, MapPin, Phone } from 'lucide-react';
import { Member } from '../types';

interface MemberCardProps {
  member: Partial<Member>;
}

export default function MemberCard({ member }: MemberCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloading, setDownloading] = useState(false);

  // Fallbacks for draft/preview mode
  const name = member.name || 'Your Full Name';
  const fatherName = member.fatherName || 'Father Name';
  const phone = member.phone || '+968 XXXX XXXX';
  const cardType = member.cardType || 'Standard';
  const regNo = member.registrationNo || 'POC-M-DRAFT';
  const omanId = member.omanId || 'XXXXXXXXX';
  const regionOman = member.regionOman || 'Muscat, Oman';
  const regionPak = member.regionPak || 'Khyber Pakhtunkhwa';
  const bloodGroup = member.bloodGroup || 'O+';
  const joinDate = member.joinDate || new Date().toISOString().split('T')[0];

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setDownloading(false);
      return;
    }

    // Set resolution for high-quality card download
    canvas.width = 640;
    canvas.height = 400;

    // Draw card background
    if (cardType === 'VIP') {
      // Golden Metallic VIP Background
      const grad = ctx.createLinearGradient(0, 0, 640, 400);
      grad.addColorStop(0, '#111827'); // dark background
      grad.addColorStop(0.3, '#211802'); 
      grad.addColorStop(0.7, '#241a01');
      grad.addColorStop(1, '#0b0f19');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 640, 400);

      // Gold Borders
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 14;
      ctx.strokeRect(7, 7, 626, 386);

      ctx.strokeStyle = '#8E6E17';
      ctx.lineWidth = 2;
      ctx.strokeRect(17, 17, 606, 366);

      // Golden geometric lines inside card
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(17, 100);
      ctx.lineTo(623, 100);
      ctx.stroke();

      // VIP Gold Emblem / Header label
      ctx.fillStyle = '#D4AF37';
      ctx.font = '900 13px system-ui, sans-serif';
      ctx.fillText('پښتانه د عُمان ټولنه', 500, 45);

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 20px system-ui, sans-serif';
      ctx.fillText('PAKHTOON COMMUNITY OMAN', 40, 48);

      ctx.fillStyle = '#8E6E17';
      ctx.font = '900 11px system-ui, sans-serif';
      ctx.fillText('EXECUTIVE VIP CABINET CARD', 40, 72);

      // Label background for serial number
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(40, 95, 140, 24);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(regNo, 50, 111);
    } else {
      // Standard Emerald Green Background
      const grad = ctx.createLinearGradient(0, 0, 640, 400);
      grad.addColorStop(0, '#006633'); // Pakistan Emerald
      grad.addColorStop(0.6, '#004d26');
      grad.addColorStop(1, '#001a0d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 640, 400);

      // Green & white borders
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 14;
      ctx.strokeRect(7, 7, 626, 386);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(17, 17, 606, 366);

      // Header labels
      ctx.fillStyle = '#D4AF37';
      ctx.font = '900 13px system-ui, sans-serif';
      ctx.fillText('پښتانه د عُمان ټولنه', 500, 45);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px system-ui, sans-serif';
      ctx.fillText('PAKHTOON COMMUNITY OMAN', 40, 48);

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText('STANDARD ACTIVE MEMBERSHIP CARD', 40, 72);

      // Serial counter label 
      ctx.fillStyle = '#004d26';
      ctx.fillRect(40, 95, 140, 24);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(regNo, 50, 111);
    }

    // Common Text Fields (Name, ID, Blood, Regions etc.)
    ctx.fillStyle = '#9ca3af'; // dark text color for labels
    ctx.font = 'bold 11px system-ui, sans-serif';
    
    // Labels column 1
    ctx.fillText('MEMBER NAME:', 40, 155);
    ctx.fillText('FATHER NAME:', 40, 195);
    ctx.fillText('PASSPORT / OMAN ID:', 40, 235);
    ctx.fillText('CONTACT PHONE:', 40, 275);

    // Labels column 2
    ctx.fillText('REGION IN OMAN:', 340, 155);
    ctx.fillText('HOME REGION (PAK):', 340, 195);
    ctx.fillText('BLOOD GROUP:', 340, 235);
    ctx.fillText('REGISTRATION DATE:', 340, 275);

    // Values - White text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px system-ui, sans-serif';
    
    // Column 1 values
    ctx.fillText(name.toUpperCase(), 40, 175);
    ctx.fillText(fatherName.toUpperCase(), 40, 215);
    ctx.fillText(`${omanId}`, 40, 255);
    ctx.fillText(phone, 40, 295);

    // Column 2 values
    ctx.fillText(regionOman.toUpperCase(), 340, 175);
    ctx.fillText(regionPak.toUpperCase(), 340, 215);
    
    // Blood Badge background
    ctx.fillStyle = '#ef4444'; // Red Badge
    ctx.fillRect(340, 240, 50, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText(bloodGroup, 352, 255);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText(joinDate, 340, 295);

    // Footer Stamp / Watermark text
    ctx.fillStyle = cardType === 'VIP' ? '#D4AF37' : '#006633';
    ctx.font = '900 10px monospace';
    ctx.fillText('VERIFIED AUTHENTIC BY PAKHTOON COUNCIL OMAN', 40, 345);

    // Crescent/Star symbol representation (drawing it with basic shape or using Emoji)
    ctx.fillStyle = '#ffffff';
    ctx.font = '60-bold 50px system-ui, sans-serif';
    ctx.fillText('⭐', 520, 330);

    // Trigger immediate browser download
    setTimeout(() => {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `POC_Card_${name.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      setDownloading(false);
    }, 450);
  };

  const isVip = cardType === 'VIP';

  return (
    <div className="flex flex-col items-center">
      
      {/* Hidden canvas used to draw and download */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Visual Live Card Component with high fidelity CSS styling */}
      <div 
        className={`w-full max-w-[520px] aspect-[1.6/1] rounded-2xl relative p-6 overflow-hidden transition-all duration-300 shadow-2xl ${
          isVip 
            ? 'bg-gradient-to-br from-[#8E6E17] via-[#1c180e] to-slate-950 text-white border-2 border-[#D4AF37] shadow-[0_10px_30px_-5px_rgba(212,175,55,0.25)]' 
            : 'bg-gradient-to-br from-[#006633] via-[#004d26] to-[#011c0e] text-white border-2 border-[#D4AF37]/50 shadow-[0_10px_30px_-5px_rgba(0,102,51,0.25)]'
        }`}
        id={`card-preview-${isVip ? 'vip' : 'std'}`}
      >
        {/* Hologram metallic overlay for VIP */}
        {isVip && (
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.01)_0%,rgba(218,165,32,0.1)_50%,rgba(255,255,255,0.01)_100%)] pointer-events-none"></div>
        )}

        {/* Header Section */}
        <div className="flex justify-between items-start border-b border-white/10 pb-2 mb-4">
          <div>
            <h4 className="text-sm font-black tracking-tight flex items-center gap-1.5 text-white">
              {isVip ? <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" /> : <User className="w-4 h-4 text-[#D4AF37]" />}
              PAKHTOON COMMUNITY OMAN
            </h4>
            <p className={`text-[9px] font-extrabold uppercase tracking-widest ${isVip ? 'text-[#D4AF37]' : 'text-emerald-300'}`}>
              {isVip ? 'Executive VIP Cabinet Director' : 'Active Standard Council Member'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-black font-urdu text-yellow-400 drop-shadow block" dir="rtl">
              پښتانه د عُمان ټولنه
            </span>
            <span className="text-[9px] font-mono opacity-55 text-stone-300">Sultanate of Oman</span>
          </div>
        </div>

        {/* Member Details Columns */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[10px]">
          <div>
            <p className="opacity-40 uppercase font-black tracking-wider text-[8px]">FullName</p>
            <p className="font-extrabold text-white tracking-tight text-xs truncate uppercase">{name}</p>
          </div>
          <div>
            <p className="opacity-40 uppercase font-black tracking-wider text-[8px]">Father Name</p>
            <p className="font-extrabold text-stone-200 truncate uppercase">{fatherName}</p>
          </div>

          <div>
            <p className="opacity-40 uppercase font-black tracking-wider text-[8px]">Passport / Oman ID</p>
            <p className="font-mono font-bold text-stone-200">{omanId}</p>
          </div>
          <div>
            <p className="opacity-40 uppercase font-black tracking-wider text-[8px]">Contact Phone</p>
            <p className="font-mono font-bold text-stone-100 flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#D4AF37]" /> {phone}
            </p>
          </div>

          <div>
            <p className="opacity-40 uppercase font-black tracking-wider text-[8px]">Sponsor Region (Oman)</p>
            <p className="font-bold text-stone-200 flex items-center gap-1 truncate uppercase">
              <MapPin className="w-3 h-3 text-[#D4AF37]" /> {regionOman}
            </p>
          </div>
          <div>
            <p className="opacity-40 uppercase font-black tracking-wider text-[8px]">Home District (Pak)</p>
            <p className="font-bold text-stone-200 truncate uppercase">{regionPak}</p>
          </div>
        </div>

        {/* Bottom Bar badge codes */}
        <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center border-t border-white/5 pt-2 mb-1">
          <div className="flex items-center gap-3">
            <div className={`px-2 py-0.5 rounded text-[9px] font-mono font-black ${isVip ? 'bg-amber-950 text-[#D4AF37] border border-[#D4AF37]/30' : 'bg-emerald-950 text-[#D4AF37] border border-[#D4AF37]/30'}`}>
              {regNo}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="opacity-40 text-[8px] uppercase">Blood</span>
              <span className="bg-red-700 text-white font-extrabold text-[9px] px-1.5 rounded-sm">{bloodGroup}</span>
            </div>
          </div>
          <div className="flex gap-2 items-center text-[9px] opacity-60">
            <span>Joined: {joinDate}</span>
            <ShieldCheck className={`w-3.5 h-3.5 ${isVip ? 'text-[#D4AF37]' : 'text-[#D4AF37]'}`} />
          </div>
        </div>

        {/* Giant decorative watermark star background */}
        <div className="absolute right-4 bottom-4 text-7xl font-sans opacity-[0.06] select-none pointer-events-none">
          ⭐
        </div>
      </div>

      {/* Primary Download trigger */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className={`mt-4 w-full flex items-center justify-center gap-2 max-w-[520px] py-3 rounded-lg font-extrabold text-xs uppercase tracking-wider shadow transition-all ${
          isVip
            ? 'bg-gradient-to-r from-[#D4AF37] to-[#8E6E17] hover:brightness-110 text-slate-950'
            : 'bg-[#006633] hover:bg-[#004d26] text-white'
        }`}
        id="btn-download-card"
      >
        <Download className="w-4 h-4" />
        {downloading ? 'Compiling Security Card Image...' : `Download ${isVip ? 'VIP Gold' : 'Community'} Card`}
      </button>
    </div>
  );
}
