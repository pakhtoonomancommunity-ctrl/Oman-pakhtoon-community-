import React from 'react';
import { Menu, X, ShieldAlert, Award, FileText, Vote, Coins, Scale, Building2, LayoutDashboard, HeartHandshake, UserPlus, Users, ChevronRight } from 'lucide-react';
import { Announcement } from '../types';

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
  announcements: Announcement[];
  isAdmin: boolean;
  setIsAdminMode: (admin: boolean) => void;
}

export default function Header({
  activePage,
  setActivePage,
  announcements,
  isAdmin,
  setIsAdminMode,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const activeAnnouncements = announcements.filter((a) => a.active);

  const navItems = [
    { id: 'home', label: 'Home', icon: HeartHandshake },
    { id: 'join', label: 'Join Us', icon: UserPlus },
    { id: 'cabinet', label: 'Cabinet', icon: Award },
    { id: 'reports', label: 'Emergency Reports', icon: ShieldAlert },
    { id: 'donate', label: 'Donate Welfare', icon: Coins },
    { id: 'law', label: 'Oman Labor Law', icon: Scale },
    { id: 'elections', label: 'Live Elections', icon: Vote },
    { id: 'press', label: 'Press Releases', icon: FileText },
    { id: 'embassy', label: 'Embassy Info', icon: Building2 },
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#006633] text-white shadow-md relative z-50 border-b-4 border-[#D4AF37]">
      {/* Dynamic Announcement Ticker */}
      {activeAnnouncements.length > 0 && (
        <div className="bg-slate-900 text-white overflow-hidden font-medium text-xs py-2 px-4 shadow-inner border-b border-slate-700">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="bg-red-650 text-white font-extrabold text-[10px] sm:text-xs uppercase px-2.5 py-0.5 rounded mr-3 tracking-wider flex-shrink-0 animate-pulse flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Breaking
            </span>
            <div className="w-full overflow-hidden relative">
              <div className="whitespace-nowrap flex gap-12 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer text-xs uppercase tracking-wide font-mono opacity-90">
                {activeAnnouncements.map((ann, idx) => (
                  <span key={ann.id} className="inline-flex items-center gap-2">
                    <span className="font-extrabold text-[#D4AF37] flex items-center gap-1.5">
                      [{ann.category}] 
                    </span>
                    <span className="font-normal">{ann.text}</span>
                    <span className="text-[#D4AF37] font-black">★</span>
                  </span>
                ))}
                {/* Duplicate for infinite effect */}
                {activeAnnouncements.map((ann, idx) => (
                  <span key={`dup-${ann.id}`} className="inline-flex items-center gap-2">
                    <span className="font-extrabold text-[#D4AF37] flex items-center gap-1.5">
                      [{ann.category}] 
                    </span>
                    <span className="font-normal">{ann.text}</span>
                    <span className="text-[#D4AF37] font-black">★</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Brand Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo & Bilingual Brand */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-3 cursor-pointer group"
            id="brand-logo"
          >
            <div className="bg-gradient-to-br from-[#D4AF37] via-yellow-400 to-[#D4AF37] p-2 rounded-full shadow-lg border border-[#D4AF37] ring-2 ring-[#004d26] flex items-center justify-center">
              {/* Crescent & Star Styled Icon */}
              <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-[#006633] font-extrabold text-lg">
                🇵🇰
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-stone-100 to-[#D4AF37] bg-clip-text text-transparent">
                  Pakhtoon Community Oman
                </h1>
                <span className="text-[10px] bg-[#004d26] text-[#D4AF37] border border-[#D4AF37]/40 px-1.5 py-0.5 rounded font-mono hidden sm:inline">OMAN 🇴🇲</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 font-medium tracking-wide flex items-center gap-1">
                <span className="text-[#D4AF37] font-bold font-serif" dir="rtl">پښتانه د عُمان ټولنه</span>
                <span className="opacity-40">|</span>
                <span>Welfare & Solidarity Platform</span>
              </p>
            </div>
          </div>

          {/* Quick Support & Admin Controls */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('donate')}
              className="bg-[#D4AF37] hover:bg-[#b9982f] text-slate-950 font-extrabold text-xs uppercase tracking-wider px-3.5 py-2 rounded shadow-lg transition-all border border-[#D4AF37]/40 flex items-center gap-1.5 transform hover:-translate-y-0.5"
              id="header-donate-btn"
            >
              <Coins className="w-4 h-4 text-[#006633]" /> Support Welfare
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className={`text-xs uppercase tracking-wider px-3.5 py-2 rounded-md font-bold transition-all border flex items-center gap-1.5 ${
                activePage === 'admin' 
                  ? 'bg-slate-100 text-slate-900 border-slate-200 shadow-md' 
                  : 'bg-[#004d26] hover:bg-[#003318] text-[#D4AF37] border-[#D4AF37]/30'
              }`}
              id="header-admin-btn"
            >
              <LayoutDashboard className="w-4 h-4" /> Admin Controls
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-md transition-all border ${
                activePage === 'admin' 
                  ? 'bg-[#D4AF37] text-[#006633] border-[#D4AF37]' 
                  : 'bg-[#004d26] text-[#D4AF37] border-[#004d26]'
              }`}
              title="Admin Panel"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 px-1.5 bg-[#004d26] text-[#D4AF37] border border-[#D4AF37]/40 rounded"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          </div>
        </div>

      {/* Desktop Main Navigation Bar */}
      <nav className="hidden lg:block bg-[#004d26] border-t border-[#003318] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center space-x-1 py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3.5 py-2 rounded-md text-xs uppercase tracking-wider font-bold transition-all duration-150 flex items-center gap-2 ${
                      isActive 
                        ? 'bg-[#006633] text-[#D4AF37] border border-[#D4AF37]/30 shadow-inner' 
                        : 'text-slate-300 hover:text-[#D4AF37] hover:bg-[#003318]'
                    }`}
                    id={`nav-${item.id}`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Responsive Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#003318] border-t border-[#00220f] animate-fadeIn">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 text-stone-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold uppercase tracking-wider ${
                    isActive 
                      ? 'bg-[#006633] text-[#D4AF37] border-l-4 border-[#D4AF37]' 
                      : 'hover:bg-[#004d26] hover:text-[#D4AF37]'
                  }`}
                  id={`m-nav-${item.id}`}
                >
                  <Icon className="w-5 h-5 text-[#D4AF37]" />
                  <span className="flex-grow text-left">{item.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>
              );
            })}
            <div className="pt-3 border-t border-slate-800 flex justify-between gap-2 px-2">
              <button
                onClick={() => handleNavClick('donate')}
                className="flex-1 bg-[#D4AF37] text-slate-950 font-black text-center py-2.5 rounded text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2"
              >
                <Coins className="w-4 h-4" /> Support Welfare
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Keyframes for Marquee & Transitions inside CSS */}
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </header>
  );
}
