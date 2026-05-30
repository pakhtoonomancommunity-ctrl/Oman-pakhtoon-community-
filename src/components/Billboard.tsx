import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Award, Trophy, Sparkles, Flame, Coins, ShieldAlert, Heart, Calendar } from 'lucide-react';

interface BillboardProps {
  memberCount: number;
  donationTotal: number;
  reportCount: number;
}

export default function Billboard({ memberCount, donationTotal, reportCount }: BillboardProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides = [
    {
      badge: 'COMMUNITY PRIDE',
      title: 'پښتانه د عُمان ټولنه',
      subtitle: 'HONORING OUR ROOTS, SUPPORTING OUR SUCCESS',
      description: 'The premier welfare and solidarity council for Khyber diaspora workers, professionals, and students across the Sultanate of Oman.',
      statLabel: 'ACTIVE MEMBERS',
      statValue: `${memberCount + 450} +`,
      bgGradient: 'from-[#002211] via-[#004d26] to-[#011c0e]',
      icon: Award,
      badgeColor: 'bg-[#003318] text-[#D4AF37] border-[#D4AF37]/35',
      accentColor: 'text-[#D4AF37]'
    },
    {
      badge: 'WELFARE EMERGENCY',
      title: 'ACTIVE REPATRIATION DRIVE',
      subtitle: 'STAND HAND-IN-HAND WITH BROTHERS',
      description: 'Every Rial counts. We finance emergency medical travel, legal status settlements, and standard worker repatriation. Contribute securely today.',
      statLabel: 'TOTAL CONTRIBUTED',
      statValue: `OMR ${donationTotal + 1950}`,
      bgGradient: 'from-[#3a2003] via-[#522a00] to-[#120000]',
      icon: Coins,
      badgeColor: 'bg-amber-950 text-[#D4AF37] border-[#D4AF37]/35',
      accentColor: 'text-[#D4AF37] font-mono animate-pulse'
    },
    {
      badge: 'DEMOCRATIC SOLIDARITY',
      title: 'LIVE CABINET ELECTIONS',
      subtitle: 'YOUR COMMUNITY, YOUR DIRECT VOTE',
      description: 'Check active candidates for Cabinet positions. One verified standard vote is allowed per role. Shape the leadership transparently.',
      statLabel: 'ELECTION ROADMAP',
      statValue: '2026 ELECTION',
      bgGradient: 'from-[#011425] via-[#043d6b] to-[#011c2a]',
      icon: Trophy,
      badgeColor: 'bg-blue-950 text-[#D4AF37] border-[#D4AF37]/35',
      accentColor: 'text-[#D4AF37]'
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const SlideIcon = slides[currentSlide].icon;

  return (
    <div className="w-full bg-slate-950 p-2 sm:p-3 border-b-4 border-[#D4AF37] shadow-2xl relative overflow-hidden" id="times-square-billboard">
      
      {/* Structural Times Square Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-2 sm:gap-3">
        
        {/* Left Side Column Panel Screen */}
        <div className="hidden lg:flex col-span-3 bg-gradient-to-b from-slate-950 via-[#003318] to-slate-950 border border-[#004d26] p-4 rounded-xl flex-col justify-between items-center text-center relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none"></div>
          
          <div className="w-full">
            <span className="text-[10px] border border-[#D4AF37]/30 text-[#D4AF37] font-extrabold uppercase px-2.5 py-0.5 rounded tracking-widest block mx-auto w-max mb-3 animate-pulse bg-emerald-950/80">
              ⚡ LIVE NEWS
            </span>
            <div className="w-12 h-12 rounded-full bg-[#004d26]/50 border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-xl mb-2">
              🇵🇰
            </div>
            <h4 className="text-white font-extrabold text-xs tracking-wide uppercase">PESHAWAR FLIGHTS</h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-normal">Oman Air resuming direct Swat charter consultation services has been discussed in Muscat.</p>
          </div>

          <div className="w-full border-t border-[#004d26] pt-4 mt-4">
            <p className="text-[10px] text-[#D4AF37] font-mono tracking-widest uppercase mb-1">REPORTER STATUS</p>
            <div className="text-white font-extrabold text-sm flex items-center justify-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-650 block animate-ping"></span>
              <span>{reportCount} EMERGENCY REPORTS</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Active in dispatch centers</p>
          </div>
        </div>

        {/* Center Mega Stage LED Billboard Screen */}
        <div className="col-span-12 lg:col-span-6 bg-slate-900 rounded-xl border-2 border-[#D4AF37]/60 p-4 sm:p-6 md:p-8 relative overflow-hidden min-h-[320px] sm:min-h-[380px] flex flex-col justify-between shadow-[0_0_20px_rgba(212,175,55,0.1)]">
          
          {/* LED Monitor Grid/Scannline Effect overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.18)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,6px_100%] pointer-events-none z-10"></div>
          
          {/* Background Ambient Glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].bgGradient} opacity-95 transition-all duration-700 ease-in-out`}></div>

          {/* Top Ticker Row */}
          <div className="relative z-20 flex justify-between items-center border-b border-white/10 pb-3 flex-shrink-0">
            <span className={`text-[10px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${slides[currentSlide].badgeColor}`}>
              👑 {slides[currentSlide].badge}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/50 tracking-widest hidden sm:inline">MULTISCREEN PORTAL II</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
          </div>

          {/* Main Slide Carousel Body */}
          <div className="relative z-20 my-auto py-4">
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-3 rounded-lg border border-white/10 hidden sm:block">
                <SlideIcon className={`w-8 h-8 ${slides[currentSlide].accentColor}`} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3.5xl font-black text-white tracking-tight leading-none drop-shadow-md">
                  {slides[currentSlide].title}
                </h2>
                <h3 className={`text-xs sm:text-sm font-bold tracking-wider ${slides[currentSlide].accentColor}`}>
                  {slides[currentSlide].subtitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl font-medium">
                  {slides[currentSlide].description}
                </p>
              </div>
            </div>
          </div>

          {/* Slider Statistics & Controls Area */}
          <div className="relative z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-t border-white/10 pt-3 flex-shrink-0">
            <div>
              <p className="text-[10px] text-white/50 lowercase tracking-widest font-mono">
                {slides[currentSlide].statLabel}
              </p>
              <p className={`text-xl sm:text-2xl font-black ${slides[currentSlide].accentColor} tracking-tight leading-none mt-1`}>
                {slides[currentSlide].statValue}
              </p>
            </div>

            {/* Slider Buttons */}
            <div className="flex items-center gap-1.5 self-end">
              <button
                onClick={prevSlide}
                className="p-1 px-1.5 bg-black/40 hover:bg-black/85 text-white border border-white/10 rounded transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 px-1.5 bg-black/40 hover:bg-black/85 text-white border border-white/10 rounded transition-all active:scale-95 text-xs flex items-center gap-1"
                title={isPlaying ? "Pause rotation" : "Play rotation"}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <button
                onClick={nextSlide}
                className="p-1 px-1.5 bg-black/40 hover:bg-black/85 text-white border border-white/10 rounded transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Side Column Panel Screen */}
        <div className="hidden lg:flex col-span-3 bg-gradient-to-b from-slate-950 via-[#3a2003] to-slate-950 border border-[#6b5010] p-4 rounded-xl flex-col justify-between items-center text-center relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none"></div>

          <div className="w-full">
            <span className="text-[10px] border border-[#D4AF37]/35 text-[#D4AF37] font-extrabold uppercase px-2.5 py-0.5 rounded tracking-widest block mx-auto w-max mb-3 bg-slate-950/80">
              🇴🇲 SOLIDARITY
            </span>
            <div className="w-12 h-12 rounded-full bg-amber-950/50 border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-xl mb-2">
              🇴🇲
            </div>
            <h4 className="text-white font-extrabold text-xs tracking-wide uppercase">SULTANATE HARMONY</h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-normal">Celebrating our shared ties with our Omani hosts who welcome the hard-working Pashtun people.</p>
          </div>

          <div className="w-full border-t border-amber-900/60 pt-4 mt-4">
            <p className="text-[10px] text-[#D4AF37] font-mono tracking-widest uppercase mb-1">MEMBERSHIP DATA</p>
            <div className="text-white font-extrabold text-sm flex items-center justify-center gap-1.5 animate-pulse">
              <span>{memberCount + 448}</span>
              <span className="text-[#D4AF37] text-xs">APPROVED</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Ready standard digital cards</p>
          </div>
        </div>

      </div>
    </div>
  );
}
