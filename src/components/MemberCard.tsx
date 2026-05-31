import React, { useRef, useState } from 'react';
import { Download, ShieldCheck, User, Sparkles, MapPin, Phone, ShieldX, Palette, Check } from 'lucide-react';
import { Member } from '../types';

interface MemberCardProps {
  member: Partial<Member>;
  isDraft?: boolean;
}

interface ColorTheme {
  id: 'emerald' | 'gold' | 'blue' | 'red' | 'dark';
  name: string;
  cssBackground: string;
  borderColor: string;
  accentColor: string;
  accentText: string;
  badgeBg: string;
  bgGradStart: string;
  bgGradMid: string;
  bgGradEnd: string;
  accentHex: string;
}

const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'emerald',
    name: 'Emerald Pakistan',
    cssBackground: 'bg-gradient-to-b from-[#004d26] via-[#006633] to-[#011a0d]',
    borderColor: 'border-[#D4AF37]',
    accentColor: 'text-[#D4AF37]',
    accentText: 'text-emerald-300',
    badgeBg: 'bg-emerald-950 text-[#D4AF37] border-emerald-900',
    bgGradStart: '#004d26',
    bgGradMid: '#006633',
    bgGradEnd: '#011a0d',
    accentHex: '#D4AF37'
  },
  {
    id: 'gold',
    name: 'Deluxe VIP Gold',
    cssBackground: 'bg-gradient-to-b from-[#1c180e] via-[#322812] to-slate-950',
    borderColor: 'border-[#D4AF37]',
    accentColor: 'text-[#D4AF37]',
    accentText: 'text-[#b38f36]',
    badgeBg: 'bg-amber-950 text-[#D4AF37] border-amber-900',
    bgGradStart: '#1c180e',
    bgGradMid: '#322812',
    bgGradEnd: '#0a0d14',
    accentHex: '#D4AF37'
  },
  {
    id: 'blue',
    name: 'Royal Navy Blue',
    cssBackground: 'bg-gradient-to-b from-[#0a1c2a] via-[#103554] to-slate-950',
    borderColor: 'border-blue-400/80',
    accentColor: 'text-blue-300',
    accentText: 'text-blue-400',
    badgeBg: 'bg-blue-950 text-blue-300 border-blue-900',
    bgGradStart: '#0a1c2a',
    bgGradMid: '#103554',
    bgGradEnd: '#070a0f',
    accentHex: '#60a5fa'
  },
  {
    id: 'red',
    name: 'Solidarity Ruby Red',
    cssBackground: 'bg-gradient-to-b from-[#2d0a0a] via-[#521313] to-slate-950',
    borderColor: 'border-red-400/80',
    accentColor: 'text-red-300',
    accentText: 'text-red-400',
    badgeBg: 'bg-red-950 text-red-300 border-red-900',
    bgGradStart: '#2d0a0a',
    bgGradMid: '#521313',
    bgGradEnd: '#0a0505',
    accentHex: '#f17474'
  },
  {
    id: 'dark',
    name: 'Obsidian Charcoal',
    cssBackground: 'bg-gradient-to-b from-[#111827] via-[#1f2937] to-[#030712]',
    borderColor: 'border-stone-400',
    accentColor: 'text-stone-300',
    accentText: 'text-stone-400',
    badgeBg: 'bg-stone-900 text-stone-200 border-stone-850',
    bgGradStart: '#111827',
    bgGradMid: '#1f2937',
    bgGradEnd: '#030712',
    accentHex: '#d6d3d1'
  }
];

export default function MemberCard({ member, isDraft = false }: MemberCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloading, setDownloading] = useState(false);
  
  // Choose initial theme: VIP gets gold, others get default Emerald
  const [selectedThemeId, setSelectedThemeId] = useState<'emerald' | 'gold' | 'blue' | 'red' | 'dark'>(
    member.cardType === 'VIP' ? 'gold' : 'emerald'
  );

  const activeTheme = COLOR_THEMES.find(t => t.id === selectedThemeId) || COLOR_THEMES[0];

  // Fallbacks for profile values
  const name = member.name || 'Your Full Name';
  const fatherName = member.fatherName || 'Father Name';
  const phone = member.phone || '+968 XXXX XXXX';
  const cardType = member.cardType || 'Standard';
  const regNo = member.registrationNo || (isDraft ? 'POC-M-DRAFT' : 'POC-M-PENDING');
  const omanId = member.omanId || 'XXXXXXXXX';
  const regionOman = member.regionOman || 'Muscat';
  const regionPak = member.regionPak || 'Khyber Pakhtunkhwa';
  const bloodGroup = member.bloodGroup || 'O+';
  const joinDate = member.joinDate || new Date().toISOString().split('T')[0];

  const handleDownload = () => {
    if (isDraft) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setDownloading(false);
      return;
    }

    // Official Vertical Card high resolution (400 x 600)
    canvas.width = 400;
    canvas.height = 600;

    // 1. Draw solid background gradient
    const grad = ctx.createLinearGradient(0, 0, 400, 600);
    grad.addColorStop(0, activeTheme.bgGradStart);
    grad.addColorStop(0.5, activeTheme.bgGradMid);
    grad.addColorStop(1, activeTheme.bgGradEnd);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 600);

    // 2. Draw outer decorative gold/silver border
    ctx.strokeStyle = activeTheme.accentHex;
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 390, 590);

    // Inner white border pin-stripe
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(13, 13, 374, 574);

    // 3. Header branding strings
    ctx.textAlign = 'center';
    
    // Arabic name
    ctx.fillStyle = activeTheme.accentHex;
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('پښتانه د عُمان ټولنه', 200, 38);

    // English brand Name
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 13px system-ui, sans-serif';
    ctx.fillText('PAKHTOON OMAN COMMUNITY', 200, 60);

    // Card Badge type sub-text
    ctx.fillStyle = activeTheme.accentHex;
    ctx.font = '900 8.5px monospace';
    const cardTitle = cardType === 'VIP' ? 'EXECUTIVE VIP GOLD CARD' : 'STANDARD ACTIVE MEMBER BADGE';
    ctx.fillText(cardTitle, 200, 78);

    // Divider line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 92);
    ctx.lineTo(370, 92);
    ctx.stroke();

    // 4. Draw profile photo or fallback placeholder
    const drawDetailsAndSave = () => {
      ctx.textAlign = 'center';

      // 5. Card registration number banner
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(110, 235, 180, 26);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(110, 235, 180, 26);

      ctx.fillStyle = activeTheme.accentHex;
      ctx.font = 'bold 12px monospace';
      ctx.fillText(regNo, 200, 252);

      // 6. Draw member values stacked vertically
      ctx.textAlign = 'left';

      // Values left alignment start coordinates
      const startX = 40;
      const col2X = 220;

      // Full Name
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = 'bold 8.5px system-ui, sans-serif';
      ctx.fillText('MEMBER EXPATRIATE:', startX, 290);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText(name.toUpperCase(), startX, 306);

      // Father's Name
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = 'bold 8.5px system-ui, sans-serif';
      ctx.fillText("FATHER'S NAME:", startX, 335);
      ctx.fillStyle = '#f3f4f6';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText(fatherName.toUpperCase(), startX, 350);

      // Civil ID & Phone
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = 'bold 8.5px system-ui, sans-serif';
      ctx.fillText('OMAN CIVIL ID:', startX, 380);
      ctx.fillText('CONTACT PHONE:', col2X, 380);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(omanId, startX, 395);
      ctx.fillText(phone, col2X, 395);

      // Region in Oman & Pakistan Region
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = 'bold 8.5px system-ui, sans-serif';
      ctx.fillText('RESIDENCY (OMAN):', startX, 425);
      ctx.fillText('HOME DISTRICT (PAK):', col2X, 425);

      ctx.fillStyle = '#f3f4f6';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText(regionOman.toUpperCase(), startX, 440);
      ctx.fillText(regionPak.toUpperCase(), col2X, 440);

      // Blood group & registration date
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = 'bold 8.5px system-ui, sans-serif';
      ctx.fillText('BLOOD GROUP:', startX, 470);
      ctx.fillText('JOIN DATE:', col2X, 470);

      // Draw red card badge for blood drop
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(startX, 478, 45, 18);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.fillText(bloodGroup, startX + 22, 491);

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText(joinDate, col2X, 492);

      // 7. Footer details (Y = 525 onwards)
      ctx.textAlign = 'center';

      // Giant background decorative watermark star
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.font = '90px sans-serif';
      ctx.fillText('⭐', 200, 480);

      // Monospace sub-captions
      ctx.fillStyle = activeTheme.accentHex;
      ctx.font = '900 8.5px monospace';
      ctx.fillText('OFFICIAL DIGITAL POC IDENTITY BADGE', 200, 542);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '700 8px monospace';
      ctx.fillText('ISSUED BY PAKHTOON EXECUTIVE COUNCIL • SULTANATE OF OMAN', 200, 558);

      // Download file action
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `POC_Badge_Vertical_${name.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      setDownloading(false);
    };

    if (member.photoUrl) {
      const img = new Image();
      img.src = member.photoUrl;
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(200, 155, 50, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 150, 105, 100, 100);
        ctx.restore();

        // High gloss border around photo circle
        ctx.strokeStyle = activeTheme.accentHex;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(200, 155, 50, 0, Math.PI * 2);
        ctx.stroke();

        setTimeout(drawDetailsAndSave, 200);
      };
      img.onerror = () => {
        // Fallback drawing of avatar
        drawPlaceholderAvatar(ctx, activeTheme.accentHex);
        setTimeout(drawDetailsAndSave, 200);
      };
    } else {
      drawPlaceholderAvatar(ctx, activeTheme.accentHex);
      setTimeout(drawDetailsAndSave, 200);
    }
  };

  const drawPlaceholderAvatar = (ctx: CanvasRenderingContext2D, accentColor: string) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
    ctx.beginPath();
    ctx.arc(200, 155, 50, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Shoulder/Head drawing
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.arc(200, 146, 17, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(200, 195, 28, Math.PI, 0);
    ctx.fill();
  };

  const isVip = cardType === 'VIP';

  return (
    <div className="flex flex-col items-center w-full max-w-[340px] mx-auto">
      {/* Target canvas for image generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Theme Presets Row */}
      <div className="flex items-center gap-1.5 justify-center mb-4 bg-slate-900/60 border border-slate-800 p-2 rounded-lg w-full">
        <span className="text-[10px] font-bold text-stone-300 mr-1 flex items-center gap-1">
          <Palette className="w-3.5 h-3.5 text-[#D4AF37]" /> Card Theme:
        </span>
        <div className="flex gap-1.5">
          {COLOR_THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => setSelectedThemeId(theme.id)}
              className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                theme.id === 'emerald' ? 'bg-[#006633]' :
                theme.id === 'gold' ? 'bg-[#987621]' :
                theme.id === 'blue' ? 'bg-[#103554]' :
                theme.id === 'red' ? 'bg-[#521313]' : 'bg-[#1f2937]'
              } ${selectedThemeId === theme.id ? 'scale-110 ring-2 ring-white border-white' : 'border-slate-700 hover:scale-105'}`}
              title={theme.name}
            >
              {selectedThemeId === theme.id && <Check className="w-3 h-3 text-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Live Mobile ID Card Container (VERTICAL LAYOUT) */}
      <div 
        className={`w-full aspect-[1/1.5] rounded-3xl relative p-5 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-305 ${activeTheme.cssBackground} border-2 ${activeTheme.borderColor}`}
        id={`vertical-card-${isDraft ? 'draft' : 'live'}`}
      >
        {/* Transparent hologram line overlay for deluxe card feel */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.01)_0%,rgba(218,165,32,0.06)_50%,rgba(255,255,255,0)_100%)] pointer-events-none"></div>

        {/* Visual Watermarked overlays for unapproved templates */}
        {isDraft && (
          <div className="absolute inset-0 bg-stone-950/80 z-20 flex flex-col items-center justify-center text-center p-4 select-none">
            <ShieldX className="w-12 h-12 text-rose-500 animate-bounce mb-2" />
            <span className="bg-red-950 border border-red-800 text-rose-400 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest leading-none">
              Pending Admin Approval
            </span>
            <p className="text-[10px] text-stone-400 mt-2 max-w-[200px] leading-relaxed">
              Standard lifetime cards and horizontal certificates are issued only after verification of registration details and OMR 5 fee status.
            </p>
          </div>
        )}

        {/* Header section with logos */}
        <div className="flex flex-col items-center border-b border-white/10 pb-2">
          <div className="flex justify-between items-center w-full">
            <span className="text-[10px] font-black tracking-tighter text-stone-100 flex items-center gap-1">
              🇵🇰 POC MEMBERSHIP 🇴🇲
            </span>
            <span className="text-[9px] font-mono opacity-50 text-stone-300">Sultanate of Oman</span>
          </div>
          <h4 className="text-center font-bold font-urdu text-[14px] text-yellow-400 mt-1" dir="rtl">
            پښتانه د عُمان ټولنه
          </h4>
          <span className={`text-[8.5px] tracking-widest font-black uppercase ${activeTheme.accentColor} mt-0.5`}>
            {isVip ? 'Executive VIP Cabinet Card' : 'Standard Active Member Badge'}
          </span>
        </div>

        {/* Central Circular Photo Frame */}
        <div className="flex flex-col items-center my-2 relative">
          <div className="relative">
            <div className={`w-28 h-28 rounded-full overflow-hidden border-2 bg-slate-950 flex items-center justify-center shadow-lg relative z-10 ${activeTheme.borderColor}`}>
              {member.photoUrl ? (
                <img src={member.photoUrl} alt="Face Photo" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-stone-600">
                  <User className="w-9 h-9" />
                  <span className="text-[8px] uppercase tracking-wider font-extrabold mt-1">NO PHOTO</span>
                </div>
              )}
            </div>
            {isVip && (
              <div className="absolute -bottom-1 -right-1 bg-[#D4AF37] text-slate-950 p-1.5 rounded-full z-20 ring-2 ring-slate-950 shadow-md">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
              </div>
            )}
          </div>

          {/* Registration Code Badge */}
          <div className={`mt-3 px-3 py-1 rounded-sm text-[10px] font-mono font-black uppercase text-center border ${activeTheme.badgeBg}`}>
            {regNo}
          </div>
        </div>

        {/* Data details list vertically stacked */}
        <div className="space-y-2 text-[10px] text-stone-100 mt-1 max-h-[190px] overflow-hidden">
          {/* Member Name */}
          <div className="border-b border-white/5 pb-1">
            <span className="text-[8px] opacity-45 uppercase font-bold block tracking-wider leading-none">Registered Expatriate</span>
            <span className="font-extrabold text-white uppercase text-xs truncate block mt-0.5">{name}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-0.5">
            <div>
              <span className="text-[8px] opacity-45 uppercase font-bold block leading-none">Father's Name</span>
              <span className="font-bold text-stone-300 truncate block mt-0.5 uppercase">{fatherName}</span>
            </div>
            <div>
              <span className="text-[8px] opacity-45 uppercase font-bold block leading-none">Oman Civil ID</span>
              <span className="font-mono font-bold text-stone-300 block mt-0.5">{omanId}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-0.5">
            <div>
              <span className="text-[8px] opacity-45 uppercase font-bold block leading-none">Residency Oman</span>
              <span className="font-bold text-stone-300 truncate block mt-0.5 flex items-center gap-0.5 uppercase">
                <MapPin className="w-2.5 h-2.5 shrink-0 text-red-400" /> {regionOman}
              </span>
            </div>
            <div>
              <span className="text-[8px] opacity-45 uppercase font-bold block leading-none">Contact Phone</span>
              <span className="font-mono font-bold text-stone-300 block mt-0.5 flex items-center gap-0.5 truncate">
                <Phone className="w-2.5 h-2.5 shrink-0 text-emerald-400" /> {phone}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-0.5">
            <div>
              <span className="text-[8px] opacity-45 uppercase font-bold block leading-none">Home District (Pak)</span>
              <span className="font-bold text-stone-300 truncate block mt-0.5 uppercase">{regionPak}</span>
            </div>
            <div>
              <span className="text-[8px] opacity-45 uppercase font-bold block leading-none">Status Profile</span>
              <span className="font-bold text-stone-100 block mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 drop-shadow" />
                <span className="text-[9px] font-mono uppercase bg-emerald-950/60 border border-emerald-900 px-1 py-0.2 rounded text-emerald-300">
                  {isDraft ? 'DRAFT' : 'VERIFIED'}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Micro-Footer with Blood badge */}
        <div className="border-t border-white/10 pt-2 flex justify-between items-center mt-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[7.5px] opacity-45 uppercase font-bold">Blood Group</span>
            <span className="bg-red-700 text-white font-extrabold text-[8.5px] px-1.5 py-0.5 rounded">{bloodGroup}</span>
          </div>
          <div className="text-[8px] opacity-50 font-semibold text-right">
            Joined: {joinDate}
          </div>
        </div>

        {/* Watermark Logo */}
        <div className="absolute right-4 bottom-4 text-5xl opacity-[0.03] select-none pointer-events-none">
          ⭐
        </div>
      </div>

      {/* Primary Download trigger */}
      <button
        onClick={handleDownload}
        disabled={downloading || isDraft}
        className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-lg font-extrabold text-xs uppercase tracking-wider shadow transition-all ${
          isDraft
            ? 'bg-stone-850 text-stone-500 border border-stone-800 cursor-not-allowed'
            : selectedThemeId === 'gold'
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#8E6E17] hover:brightness-110 text-slate-950'
              : 'bg-[#006633] hover:bg-[#004d26] text-white hover:brightness-105'
        }`}
        id="btn-download-vertical-card"
      >
        <Download className="w-4 h-4" />
        {isDraft 
          ? 'Download Locked' 
          : downloading 
            ? 'Generating Live Vertical Badge...' 
            : `Download Vertical Badge`}
      </button>
      {isDraft && (
        <span className="text-[10px] text-stone-500 mt-2 text-center leading-tight">
          🔒 Verification of standard OMR 5 registration is audited before badge download.
        </span>
      )}
    </div>
  );
}
