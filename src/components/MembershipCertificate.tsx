import React, { useRef, useState } from 'react';
import { Download, Award, ShieldCheck, Printer, Calendar, ShieldAlert, BadgeCheck, Sparkles, BookOpen } from 'lucide-react';
import { Member } from '../types';

interface MembershipCertificateProps {
  member: Member;
  onClose?: () => void;
}

export default function MembershipCertificate({ member, onClose }: MembershipCertificateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloading, setDownloading] = useState(false);

  const name = member.name || 'Your Full Name';
  const fatherName = member.fatherName || 'Father Name';
  const regNo = member.registrationNo || 'POC-M-PEND';
  const omanId = member.omanId || 'XXXXXXXXX';
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

    // High resolution Horizontal Landscape Certificate canvas (1200 x 850)
    canvas.width = 1200;
    canvas.height = 850;

    // 1. Warm traditional elegant ivory/cream background with smooth vignette glow
    const bgGrad = ctx.createRadialGradient(600, 425, 100, 600, 425, 750);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.3, '#fbfbf9');
    bgGrad.addColorStop(1, '#f4f3ea'); // rich classic ivory hue
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 850);

    // 2. Thick elegant Royal Pakistan Emerald Green outer border
    ctx.strokeStyle = '#00552b';
    ctx.lineWidth = 26;
    ctx.strokeRect(13, 13, 1174, 824);

    // 3. Ornate Double Gold borders inside
    ctx.strokeStyle = '#C5A02B'; // Renaissance Gold sheen color
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 1120, 770);

    ctx.strokeStyle = '#E2C258'; // Thinner highlight line
    ctx.lineWidth = 1;
    ctx.strokeRect(48, 48, 1104, 754);

    // 4. Intricate Corner Flourishes (Ornate Canva-Style corner frames)
    const drawCornerGraphics = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      ctx.fillStyle = '#C5A02B';
      // Ornate bracket corner tips
      ctx.fillRect(0, 0, 45, 5);
      ctx.fillRect(0, 0, 5, 45);
      
      // Little offset ornaments
      ctx.fillRect(8, 8, 25, 2);
      ctx.fillRect(8, 8, 2, 25);
      
      // Decorative corner circle dot
      ctx.beginPath();
      ctx.arc(4, 4, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Additional premium diamonds inside corners
      ctx.beginPath();
      ctx.moveTo(15, 15);
      ctx.lineTo(20, 10);
      ctx.lineTo(25, 15);
      ctx.lineTo(20, 20);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    drawCornerGraphics(53, 53, 0); // Top-Left
    drawCornerGraphics(1147, 53, Math.PI / 2); // Top-Right
    drawCornerGraphics(1147, 797, Math.PI); // Bottom-Right
    drawCornerGraphics(53, 797, -Math.PI / 2); // Bottom-Left

    // 5. Traditional Top Headers - Centered Alignment
    ctx.textAlign = 'center';

    // Bilingual Arabic/Urdu Script Title
    ctx.fillStyle = '#00552b';
    ctx.font = 'bold 23px system-ui, sans-serif';
    ctx.fillText('پښتانه د عُمان ټولنه', 600, 105);

    // Main Engraved Title
    ctx.fillStyle = '#1c1917';
    ctx.font = '900 32px "Space Grotesk", system-ui, sans-serif';
    ctx.fillText('PAKHTOON OMAN COMMUNITY', 600, 150);

    ctx.fillStyle = '#856404';
    ctx.font = '900 12px monospace';
    ctx.fillText('SULTANATE OF OMAN • ACTIVE EXPATRIATE WELFARE REGISTRY', 600, 178);

    // Elegant Divider with center Gold Star emblem
    ctx.strokeStyle = 'rgba(197, 160, 43, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(380, 202);
    ctx.lineTo(550, 202);
    ctx.moveTo(650, 202);
    ctx.lineTo(820, 202);
    ctx.stroke();

    ctx.fillStyle = '#C5A02B';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('✦ ⭐ ✦', 600, 207);

    // 6. Certificate central Title Lettering
    ctx.fillStyle = '#00552b';
    ctx.font = '900 44px Georgia, serif';
    ctx.fillText('CERTIFICATE OF MEMBERSHIP', 600, 265);

    ctx.fillStyle = '#57534e';
    ctx.font = 'italic 16.5px Georgia, serif';
    ctx.fillText('This official credential is heavy issued to certify that the registered professional:', 600, 315);

    // 7. Member Name display in high display style
    ctx.fillStyle = '#0b130e';
    ctx.font = '900 36px "Space Grotesk", sans-serif';
    ctx.fillText(name.toUpperCase(), 600, 375);

    // Father Name line
    ctx.fillStyle = '#44403c';
    ctx.font = 'bold italic 20px Georgia, serif';
    ctx.fillText(`Son of Mr. ${fatherName.toUpperCase()}`, 600, 412);

    // 8. Certification body sentences
    ctx.fillStyle = '#1c1917';
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillText('is officially designated, registered and verified as an Active Lifetime Standard Community Member', 600, 470);
    ctx.fillText('within the Sultanate of Oman Pakhtoon Welfare Council Coordinates & General Assembly Registry.', 600, 492);

    // Row of verified credentials (Oman Civil ID, Blood, Joined Date)
    ctx.fillStyle = '#57534e';
    ctx.font = '700 13px system-ui, sans-serif';
    ctx.fillText(`Holder of Oman Civil ID: ${omanId}   |   Pakistan Blood Group: ${bloodGroup}   |   Date of Admission: ${joinDate}`, 600, 528);

    // 9. Premium gold registration identifier card box
    ctx.fillStyle = '#fef9c3'; // Light golden backdrop
    ctx.fillRect(450, 558, 300, 40);
    ctx.strokeStyle = '#C5A02B';
    ctx.lineWidth = 2;
    ctx.strokeRect(450, 558, 300, 40);

    ctx.fillStyle = '#713f12';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`OFFICIAL SERIAL ID: ${regNo}`, 600, 583);

    // Regulatory footnotes in light small text
    ctx.fillStyle = '#78716c';
    ctx.font = 'italic 10.5px system-ui, sans-serif';
    ctx.fillText('This document verifies legal registration with general affairs of the representative council.', 600, 626);
    ctx.fillText('Subject to local regulations and code of conduct governing expatriate communities inside Oman.', 600, 642);

    // 10. Draw circular profile ID picture on Left-hand side (x = 180, y = 440)
    const finalizeCanvasAndTrigger = () => {
      // 11. Draw bottom signatures (President / Secretary)
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1c1917';
      ctx.font = 'bold 15px Georgia, serif';
      ctx.fillText('Sher Zaman Swati Swati', 300, 735); // President
      ctx.fillText('Haji Ameer Khan Swati', 900, 735); // Patron-in-Chief

      // Thin signature horizontal lines
      ctx.strokeStyle = '#a8a29e';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(180, 742);
      ctx.lineTo(420, 742);
      ctx.moveTo(780, 742);
      ctx.lineTo(1020, 742);
      ctx.stroke();

      ctx.fillStyle = '#78716c';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText('PRESIDENT, OMAN CABINET', 300, 760);
      ctx.fillText('PATRON-IN-CHIEF, GENERAL AFFAIRS', 900, 760);

      // 12. Dynamic Gold Seal Ornament on the Bottom Center
      ctx.save();
      ctx.translate(600, 725);
      
      // Outer golden sunburst teeth
      ctx.fillStyle = '#C5A02B';
      for (let i = 0; i < 30; i++) {
        ctx.rotate((Math.PI * 2) / 30);
        ctx.beginPath();
        ctx.moveTo(0, -35);
        ctx.lineTo(5, -42);
        ctx.lineTo(-5, -42);
        ctx.fill();
      }

      // Main circular seal body
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, Math.PI * 2);
      ctx.fill();

      // Shiny center ring
      ctx.strokeStyle = '#fffbeb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 27, 0, Math.PI * 2);
      ctx.stroke();

      // Golden center emblem
      ctx.fillStyle = '#713f12';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('POC', 0, -2);
      ctx.font = '900 10.5px system-ui, sans-serif';
      ctx.fillText('SEAL', 0, 11);

      ctx.restore();

      // Giant background watermarks
      ctx.fillStyle = 'rgba(0, 85, 43, 0.04)';
      ctx.font = 'bold 150px system-ui';
      ctx.fillText('🇵🇰', 1010, 480);

      // Trigger actual image file down-trigger
      setTimeout(() => {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `POC_Certificate_Horizontal_${name.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
        setDownloading(false);
      }, 400);
    };

    if (member.photoUrl) {
      const img = new Image();
      img.src = member.photoUrl;
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(175, 470, 75, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 100, 395, 150, 150);
        ctx.restore();

        // High contrast gold ring frame border
        ctx.strokeStyle = '#C5A02B';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(175, 470, 75, 0, Math.PI * 2);
        ctx.stroke();

        // Label above photo
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#856404';
        ctx.fillText('REGISTERED FACE FILE ID', 175, 565);

        finalizeCanvasAndTrigger();
      };
      img.onerror = () => {
        // Fallback drawing placeholder seal
        drawPlaceholderShield(ctx);
        finalizeCanvasAndTrigger();
      };
    } else {
      drawPlaceholderShield(ctx);
      finalizeCanvasAndTrigger();
    }
  };

  const drawPlaceholderShield = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'rgba(0, 85, 43, 0.06)';
    ctx.beginPath();
    ctx.arc(175, 470, 70, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#C5A02B';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('OFFICIAL DIGITAL BADGE', 175, 475);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-stone-950/95 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-md animate-fadeIn">
      {/* Hidden browser canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main landscape dialog wrapper */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-5xl flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Modal Top heading panel */}
        <div className="flex justify-between items-center p-5 border-b border-stone-850 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <Award className="w-5.5 h-5.5 text-yellow-500" />
            <div>
              <h3 className="font-display font-extrabold text-white text-sm tracking-widest">PAKHTOON OMAN SOVEREIGN REGISTRY</h3>
              <p className="text-[10px] text-stone-500 font-mono">Bilingual Expatriate Welfare Credentials Cabinet Approved</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white font-mono hover:scale-105 transition-all font-bold text-xs bg-stone-800 hover:bg-stone-750 px-4 py-2 border border-stone-700/80 rounded-md"
          >
            ✕ CLOSE PORTAL
          </button>
        </div>

        {/* Outer landscape canvas window (Canva design styling horizontally) */}
        <div className="p-6 md:p-10 overflow-x-auto flex-1 flex justify-center items-center bg-gradient-to-b from-stone-950 to-slate-950">
          
          {/* Certificate Board Horizontal */}
          <div 
            className="shadow-2xl rounded-2xl p-6 md:p-10 border-12 border-[#00552b] outline-4 outline-[#D4AF37] outline-double w-full max-w-4xl text-center bg-stone-50 text-stone-900 relative aspect-[1.414/1] flex flex-col justify-between shrink-0"
            id="horizontal-certificate-frame"
          >
            {/* Corner Ornaments */}
            <div className="absolute top-3 left-3 border-t-2 border-l-2 border-[#D4AF37] w-8 h-8"></div>
            <div className="absolute top-3 right-3 border-t-2 border-r-2 border-[#D4AF37] w-8 h-8"></div>
            <div className="absolute bottom-3 left-3 border-b-2 border-l-2 border-[#D4AF37] w-8 h-8"></div>
            <div className="absolute bottom-3 right-3 border-b-2 border-r-2 border-[#D4AF37] w-8 h-8"></div>

            <div className="border border-[#D4AF37]/35 p-6 md:p-8 flex flex-col justify-between h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-stone-50/50 to-stone-100/30">
              
              {/* Header Details */}
              <div className="space-y-1">
                <div className="text-emerald-800 font-extrabold text-md tracking-widest font-heading">پښتانه د عُمان ټولنه</div>
                <h1 className="text-xl md:text-2xl font-black text-stone-950 tracking-wide font-display">PAKHTOON COMMUNITY OMAN</h1>
                <span className="text-[9px] font-mono font-extrabold text-amber-700 uppercase tracking-widest block">
                  SULTANATE OF OMAN • PAKHTOON WELFARE REGULATION COMMITTEE
                </span>
                <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-2.5"></div>
              </div>

              {/* Title Content */}
              <div className="my-[5px] space-y-2">
                <h2 className="text-2xl md:text-3xl font-serif font-black text-emerald-800 tracking-wider">
                  CERTIFICATE OF MEMBERSHIP
                </h2>
                <p className="italic text-xs text-stone-550 max-w-lg mx-auto leading-relaxed">
                  This official credential is standardly issued to certify that the registered individual:
                </p>
              </div>

              {/* Member Core Info with photo side by side */}
              <div className="flex gap-6 items-center justify-center max-w-2xl mx-auto my-1.5">
                {member.photoUrl && (
                  <div className="relative shrink-0 w-20 h-20 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow bg-stone-100 self-center">
                    <img 
                      src={member.photoUrl} 
                      alt="Member ID Photo" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                )}
                <div className="text-center md:text-left space-y-1 flex-1">
                  <h3 className="text-xl md:text-2xl font-black text-[#00552b] tracking-tight uppercase leading-none">
                    {name}
                  </h3>
                  <p className="text-xs italic font-serif text-stone-600 font-semibold uppercase">
                    Son of Mr. {fatherName}
                  </p>
                  <p className="text-[11px] text-stone-700 leading-relaxed font-sans max-w-md">
                    Is verified as an active, lifetime <strong className="font-extrabold text-[#00552b]">Standard Active Member</strong> within the general welfare coordinates representing the Sultanate of Oman expatriate directory.
                  </p>
                </div>
              </div>

              {/* Stats badges bar metadata */}
              <div className="flex justify-center gap-2 max-w-xl mx-auto py-1 font-mono text-[10px] sm:text-xs">
                <div className="bg-stone-100 border border-stone-200/85 px-3 py-1 rounded-md text-stone-700 font-bold block flex items-center gap-1">
                  Civil ID No: <strong className="text-emerald-800 font-black">{omanId}</strong>
                </div>
                <div className="bg-stone-100 border border-stone-200/85 px-3 py-1 rounded-md text-stone-700 font-bold block flex items-center gap-1">
                  Blood Group: <strong className="text-rose-600 font-black">{bloodGroup}</strong>
                </div>
                <div className="bg-stone-100 border border-stone-200/85 px-3 py-1 rounded-md text-stone-700 font-bold block flex items-center gap-1">
                  Admission Date: <strong className="text-stone-900">{joinDate}</strong>
                </div>
              </div>

              {/* Middle License Tag */}
              <div>
                <div className="inline-block bg-[#00552b] text-white border border-[#D4AF37] text-[10.5px] font-mono px-5 py-1.5 rounded font-black shadow-md">
                  POC VERIFIED LICENSE: {regNo}
                </div>
              </div>

              {/* Outer bottom layout (seal + signatures) */}
              <div className="grid grid-cols-12 gap-2 items-end border-t border-stone-200/80 pt-4 mt-1">
                {/* Signatures Left */}
                <div className="col-span-4 text-center">
                  <div className="font-serif text-amber-950 font-medium italic text-[11px] border-b border-stone-300 pb-0.5">
                    Sher Zaman Swati Swati
                  </div>
                  <span className="text-[8.5px] font-black text-stone-500 uppercase tracking-wider block mt-0.5">
                    President, Oman Cabinet
                  </span>
                </div>

                {/* Seal Center */}
                <div className="col-span-4 flex justify-center pb-1">
                  <div className="w-11 h-11 rounded-full bg-[#D4AF37] border-2 border-[#fffbeb] shadow flex items-center justify-center relative transform hover:rotate-12 transition-transform cursor-pointer">
                    <span className="text-[7.5px] text-yellow-950 font-black tracking-tighter leading-none block text-center uppercase">
                      Official<br/>P.O.C
                    </span>
                  </div>
                </div>

                {/* Signatures Right */}
                <div className="col-span-4 text-center">
                  <div className="font-serif text-amber-950 font-medium italic text-[11px] border-b border-stone-300 pb-0.5">
                    Haji Ameer Khan Swati
                  </div>
                  <span className="text-[8.5px] font-black text-stone-500 uppercase tracking-wider block mt-0.5">
                    Patron-in-Chief
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom actionable controls strip */}
        <div className="p-5 border-t border-stone-850 bg-slate-950/80 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-emerald-400 font-mono font-bold tracking-tight uppercase flex items-center gap-1">
              <BadgeCheck className="w-4 h-4 text-emerald-400" /> Cabinet Authorized Expatriate Registry
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-white text-xs font-black uppercase px-4.5 py-2.5 rounded-lg border border-stone-700/80 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" /> Print PDF / Sheets
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="bg-[#D4AF37] text-slate-950 hover:brightness-105 text-xs font-black uppercase px-5 py-2.5 rounded-lg flex items-center gap-1.5 shadow transition-all"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Engraving Horizontal Template...' : 'Download Certificate (PNG)'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
