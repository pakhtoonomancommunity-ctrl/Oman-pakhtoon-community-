import React, { useRef, useState } from 'react';
import { Download, Award, ShieldCheck, Printer, Calendar, AwardIcon, Sparkles } from 'lucide-react';
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
  const isVip = member.cardType === 'VIP';

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setDownloading(false);
      return;
    }

    // High resolution Certificate canvas (1200 x 850)
    canvas.width = 1200;
    canvas.height = 850;

    // Draw rich, elegant background
    const bgGrad = ctx.createRadialGradient(600, 425, 200, 600, 425, 700);
    bgGrad.addColorStop(0, '#fafaf9'); // very light stone white central highlight
    bgGrad.addColorStop(1, '#f5f5f4'); // slightly deeper warm ivory
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 850);

    // Thick Royal Emerald Border
    ctx.strokeStyle = '#006633'; // Pakistan Green
    ctx.lineWidth = 24;
    ctx.strokeRect(12, 12, 1176, 826);

    // Inner Elegant Gold Border
    ctx.strokeStyle = '#D4AF37'; // Renaissance Gold
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, 1128, 778);

    // Filigree Thin Border Accent
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(44, 44, 1112, 762);

    // Corner Ornament Drawings
    const drawCornerOrnament = (cx: number, cy: number, rot: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(0, 0, 20, 4);
      ctx.fillRect(0, 0, 4, 20);
      ctx.beginPath();
      ctx.arc(4, 4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawCornerOrnament(48, 48, 0);
    drawCornerOrnament(1152, 48, Math.PI / 2);
    drawCornerOrnament(1152, 802, Math.PI);
    drawCornerOrnament(48, 802, -Math.PI / 2);

    // Certificate Title & Headers
    ctx.textAlign = 'center';
    
    // Arabic heading
    ctx.fillStyle = '#006633';
    ctx.font = '900 24px system-ui, sans-serif';
    ctx.fillText('پښتانه د عُمان ټولنه', 600, 110);

    // Main English Banner header
    ctx.fillStyle = '#1c1917';
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.fillText('PAKHTOON OMAN COMMUNITY', 600, 160);

    ctx.fillStyle = '#8e6e17';
    ctx.font = '800 14px "JetBrains Mono", monospace';
    ctx.fillText('SULTANATE OF OMAN • ACTIVE WELFARE REGISTRY', 600, 190);

    // Separator line
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(400, 215);
    ctx.lineTo(800, 215);
    ctx.stroke();

    // Central Title "CERTIFICATE OF MEMBERSHIP"
    ctx.fillStyle = '#006633';
    ctx.font = '900 42px Georgia, serif';
    ctx.fillText('CERTIFICATE OF MEMBERSHIP', 600, 275);

    // Introductory text
    ctx.fillStyle = '#44403c';
    ctx.font = 'italic 18px Georgia, serif';
    ctx.fillText('This official credential is standardly issued to certify that the registered individual:', 600, 330);

    // Name container & bold stylized text
    ctx.fillStyle = '#1c1917';
    ctx.font = 'bold 34px "Space Grotesk", sans-serif';
    ctx.fillText(name.toUpperCase(), 600, 395);

    // Father Name s/o Swat Swabi, KP Line
    ctx.fillStyle = '#57534e';
    ctx.font = 'bold italic 20px Georgia, serif';
    ctx.fillText(`Son of Mr. ${fatherName.toUpperCase()}`, 600, 435);

    // Certificate Body Description
    ctx.fillStyle = '#1c1917';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText(
      `is officially registered and verified as an Active Lifetime Standard Community Member of Pakhtoon Community Oman.`,
      600,
      495
    );
    ctx.fillText(
      `Holder of Oman Civil ID No. ${omanId} | Pakistan Blood Group: ${bloodGroup} | Join Date: ${joinDate}`,
      600,
      525
    );

    // Golden Box for registration license details
    ctx.fillStyle = '#fef08a'; // custom gold backdrop
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.fillRect(450, 560, 300, 42);
    ctx.strokeRect(450, 560, 300, 42);

    ctx.fillStyle = '#854d0e';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`ID NO: ${regNo}`, 600, 587);

    // Footnote & legal guidelines
    ctx.fillStyle = '#78716c';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('This credential verifies representation within the Pakhtoon Welfare Council of Oman coordinates.', 600, 635);
    ctx.fillText('Administered in full liaison under Pakhtoon Community registration regulations.', 600, 652);

    // Dynamic member photo if available (Left Side)
    if (member.photoUrl) {
      const img = new Image();
      img.src = member.photoUrl;
      img.onload = () => {
        // Draw photo on canvas (Left column) at circular frame
        ctx.save();
        ctx.beginPath();
        ctx.arc(170, 480, 80, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 90, 400, 160, 160);
        ctx.restore();

        // Overlay small gold circle around photo
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(170, 480, 80, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#57534e';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillText('REGISTERED FACE ID', 170, 585);
        finalizeDownload();
      };
      img.onerror = () => {
        finalizeDownload();
      };
    } else {
      finalizeDownload();
    }

    function finalizeDownload() {
      // Signatures on sides (Bottom Left / Bottom Right)
      ctx.fillStyle = '#1c1917';
      ctx.font = 'bold 15px Georgia, serif';
      ctx.fillText('Sher Zaman Swati Swati', 300, 740); // President
      ctx.fillText('Haji Ameer Khan Swati', 900, 740); // Patron

      ctx.strokeStyle = '#44403c';
      ctx.lineWidth = 1;
      // President signature line
      ctx.beginPath();
      ctx.moveTo(180, 745);
      ctx.lineTo(420, 745);
      // Patron signature line
      ctx.beginPath();
      ctx.moveTo(780, 745);
      ctx.lineTo(1020, 745);
      ctx.stroke();

      ctx.fillStyle = '#78716c';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText('PRESIDENT, OMAN CABINET', 300, 765);
      ctx.fillText('PATRON-IN-CHIEF, GENERAL AFFAIRS', 900, 765);

      // Gold Seal decoration in the bottom middle 
      ctx.beginPath();
      ctx.arc(600, 740, 40, 0, Math.PI * 2);
      ctx.fillStyle = '#D4AF37';
      ctx.fill();
      ctx.strokeStyle = '#8e6e17';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Small stars in seal
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 17px system-ui, sans-serif';
      ctx.fillText('✦', 600, 746);

      // Trigger immediate browser download
      setTimeout(() => {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `POC_Certificate_${name.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
        setDownloading(false);
      }, 500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-stone-950/90 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-md animate-fadeIn">
      {/* Hidden canvas used to draw and download */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="bg-stone-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Certificate Dialog Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-display font-extrabold text-white text-md tracking-wider">PAKHTOON OMAN COMMUNITY</h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white font-mono hover:scale-110 transition-transform font-bold text-sm bg-stone-800 px-3 py-1.5 rounded-md"
          >
            ✕ ClOSE
          </button>
        </div>

        {/* Visual Certificate Frame */}
        <div className="p-6 md:p-10 overflow-y-auto flex-1 flex justify-center items-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-stone-950 to-slate-900">
          <div className="shadow-2xl rounded-lg p-8 border-12 border-[#006633] outline-4 outline-[#D4AF37] outline-double max-w-3xl w-full text-center bg-stone-50 text-stone-900 relative">
            
            {/* Corner Filigree Borders */}
            <div className="absolute top-2 left-2 border-t-2 border-l-2 border-[#D4AF37] w-6 h-6"></div>
            <div className="absolute top-2 right-2 border-t-2 border-r-2 border-[#D4AF37] w-6 h-6"></div>
            <div className="absolute bottom-2 left-2 border-b-2 border-l-2 border-[#D4AF37] w-6 h-6"></div>
            <div className="absolute bottom-2 right-2 border-b-2 border-r-2 border-[#D4AF37] w-6 h-6"></div>

            {/* Inner Gold Line */}
            <div className="border border-[#D4AF37]/30 p-6 md:p-8">
              
              {/* Islamic Calligraphy Styling / Headers */}
              <div className="text-emerald-800 font-extrabold text-sm mb-1 tracking-widest font-display">پښتانه د عُمان ټولنه</div>
              <h1 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight font-display">PAKHTOON COMMUNITY OMAN</h1>
              <span className="text-[10px] font-mono font-extrabold text-amber-700 tracking-wider block mb-4">SULTANATE OF OMAN • PAKHTOON EXECUTIVE COUNCIL</span>

              <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mb-6"></div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-emerald-800 tracking-wide mb-6">CERTIFICATE OF MEMBERSHIP</h2>

              <p className="italic text-xs md:text-sm text-stone-600 mb-6 font-serif">
                This official credential is standardly issued to certify that the registered individual:
              </p>

              {/* Member Photo (if present) */}
              {member.photoUrl && (
                <div className="mb-4 flex justify-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-md bg-stone-200">
                    <img src={member.photoUrl} alt="Member Photo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>
              )}

              {/* Name */}
              <h3 className="text-2xl md:text-3xl font-sans font-black text-[#006633] tracking-tight uppercase mb-1">{name}</h3>
              <p className="text-sm italic font-serif text-stone-700 font-semibold mb-6">Son of Mr. {fatherName.toUpperCase()}</p>

              {/* Description body */}
              <div className="text-stone-800 text-xs md:text-sm leading-relaxed max-w-xl mx-auto space-y-2 mb-8 font-sans">
                <p>
                  is officially registered and verified as an active, lifetime <strong className="font-extrabold text-stone-900">Standard Active Member</strong> within the Sultanate of Oman Pakhtoon Community Welfare Org.
                </p>
                <div className="flex flex-wrap justify-center gap-3 text-[10px] sm:text-xs font-mono bg-stone-100 py-2 px-3 rounded text-stone-700 font-bold border border-stone-200 mt-4">
                  <span>CIVIL ID: <strong className="text-emerald-800 font-black">{omanId}</strong></span>
                  <span>•</span>
                  <span>BLOOD GROUP: <strong className="text-red-600 font-black">{bloodGroup}</strong></span>
                  <span>•</span>
                  <span>JOIN DATE: <strong className="text-stone-900">{joinDate}</strong></span>
                </div>
              </div>

              {/* Unique Number Badge */}
              <div className="inline-block bg-[#006633] text-white border border-[#D4AF37] text-xs font-mono px-6 py-2 rounded-md font-bold shadow-md hover:scale-105 transition-transform mb-8">
                SERIAL ID: {regNo}
              </div>

              {/* Signature Fields */}
              <div className="grid grid-cols-2 gap-8 items-end border-t border-stone-200 pt-6 mt-4">
                <div className="text-center">
                  <div className="font-cursive text-amber-950 font-semibold italic text-sm border-b border-stone-300 pb-1 font-serif">Sher Zaman Swati Swati</div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mt-1">President, Oman Cabinet</span>
                </div>
                <div className="text-center">
                  <div className="font-cursive text-amber-950 font-semibold italic text-sm border-b border-stone-300 pb-1 font-serif">Haji Ameer Khan Swati</div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mt-1">Patron-in-Chief</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Certificate Actions Bar */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs text-stone-400 font-mono">Status: Verified Official Registration</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-extrabold uppercase px-4 py-2.5 rounded-lg border border-stone-700 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" /> Print Certificate
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="bg-[#D4AF37] hover:brightness-110 text-slate-950 text-xs font-extrabold uppercase px-5 py-2.5 rounded-lg flex items-center gap-1.5 shadow transition-all"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Engraving PNG certificate...' : 'Download Certificate (PNG)'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
