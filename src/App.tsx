import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, UserPlus, Award, ShieldAlert, Coins, Scale, Vote, 
  FileText, Building2, ChevronRight, CheckCircle, Sparkles, AlertTriangle, 
  MapPin, Phone, HelpCircle, Calendar, ArrowRight, CornerDownRight, Landmark
} from 'lucide-react';
import { Member, CabinetMember, IncidentReport, Donation, LawArticle, Candidate, PressRelease, Announcement } from './types';
import { 
  INITIAL_ANNOUNCEMENTS, INITIAL_CABINET, INITIAL_MEMBERS, 
  INITIAL_DONATIONS, INITIAL_LAW_ARTICLES, INITIAL_CANDIDATES, 
  INITIAL_PRESS_RELEASES, INITIAL_REPORTS 
} from './data/mockData';

// Modular Components Imports
import Header from './components/Header';
import Footer from './components/Footer';
import Billboard from './components/Billboard';
import MemberCard from './components/MemberCard';
import MembershipCertificate from './components/MembershipCertificate';
import AdminPanel from './components/AdminPanel';
import { checkAuthFromUrl, appendMemberToSheet } from './utils/googleSheets';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  
  // Real-time Persistent States
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('poc_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });
  const [cabinet, setCabinet] = useState<CabinetMember[]>(() => {
    const saved = localStorage.getItem('poc_cabinet');
    return saved ? JSON.parse(saved) : INITIAL_CABINET;
  });
  const [reports, setReports] = useState<IncidentReport[]>(() => {
    const saved = localStorage.getItem('poc_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });
  const [donations, setDonations] = useState<Donation[]>(() => {
    const saved = localStorage.getItem('poc_donations');
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
  });
  const [lawArticles, setLawArticles] = useState<LawArticle[]>(() => {
    const saved = localStorage.getItem('poc_lawArticles');
    return saved ? JSON.parse(saved) : INITIAL_LAW_ARTICLES;
  });
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('poc_candidates');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });
  const [pressReleases, setPressReleases] = useState<PressRelease[]>(() => {
    const saved = localStorage.getItem('poc_pressReleases');
    return saved ? JSON.parse(saved) : INITIAL_PRESS_RELEASES;
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('poc_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  // Persist state updates to localStorage
  useEffect(() => {
    localStorage.setItem('poc_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('poc_cabinet', JSON.stringify(cabinet));
  }, [cabinet]);

  useEffect(() => {
    localStorage.setItem('poc_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('poc_donations', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('poc_lawArticles', JSON.stringify(lawArticles));
  }, [lawArticles]);

  useEffect(() => {
    localStorage.setItem('poc_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('poc_pressReleases', JSON.stringify(pressReleases));
  }, [pressReleases]);

  useEffect(() => {
    localStorage.setItem('poc_announcements', JSON.stringify(announcements));
  }, [announcements]);

  // Google Sheets credentials persistent states
  const [googleToken, setGoogleToken] = useState<string | null>(localStorage.getItem('google_oauth_token'));
  const [googleSheetId, setGoogleSheetId] = useState<string | null>(localStorage.getItem('google_sheet_id'));

  useEffect(() => {
    const { token, state } = checkAuthFromUrl();
    if (token) {
      // If this page is running inside an OAuth popup window, securely post back to parents and self-close!
      if (window.opener) {
        try {
          window.opener.postMessage({ type: 'GOOGLE_OAUTH_SUCCESS', token, state }, '*');
          window.close();
          return;
        } catch (e) {
          console.error('[OAuth Popup] Error sending token back to container:', e);
        }
      }
      setGoogleToken(token);
      localStorage.setItem('google_oauth_token', token);
      
      // If we authenticated from admin sheets tab, redirect there directly!
      if (state && state.includes('activePage=cabinet')) {
        setActivePage('admin');
      }
    }
  }, []);

  // Listen for popup messages to seamlessly grab tokens inside the iframe context
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      // Accept messages from our secure container domain or localhost
      if (event.data && event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
        const { token, state } = event.data;
        if (token) {
          setGoogleToken(token);
          localStorage.setItem('google_oauth_token', token);
          if (state && state.includes('activePage=cabinet')) {
            setActivePage('admin');
          }
        }
      }
    };
    window.addEventListener('message', handleOAuthMessage);
    return () => {
      window.removeEventListener('message', handleOAuthMessage);
    };
  }, []);

  // User Voting Memory
  const [votedPositions, setVotedPositions] = useState<string[]>([]);

  // Registration draft states (to build standard card live preview)
  const [regForm, setRegForm] = useState({
    name: '',
    fatherName: '',
    phone: '',
    passportNo: '',
    omanId: '',
    regionOman: 'Muscat',
    regionPak: '',
    bloodGroup: 'B+',
    photoUrl: ''
  });
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [newRegMemberRef, setNewRegMemberRef] = useState<Member | null>(null);

  // Status inquirer portal state variables
  const [joinSubTab, setJoinSubTab] = useState<'register' | 'lookup'>('register');
  const [showDraftPreviewMobile, setShowDraftPreviewMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<Member | null>(null);
  const [searchTried, setSearchTried] = useState(false);
  const [selectedCertMember, setSelectedCertMember] = useState<Member | null>(null);

  // Welfare Donation Draft states
  const [donForm, setDonForm] = useState({
    donorName: '',
    amount: '',
    isAnonymous: false,
    message: ''
  });
  const [donationSuccess, setDonationSuccess] = useState(false);

  // Emergency dispatch draft states
  const [repForm, setRepForm] = useState({
    reporterName: '',
    reporterPhone: '',
    incidentType: 'Injury' as any,
    personName: '',
    location: '',
    details: ''
  });
  const [reportSuccess, setReportSuccess] = useState(false);

  // Calculate live statistics
  const donationTotal = donations.reduce((sum, item) => sum + item.amount, 0);
  const acceptedMembersCount = members.filter(m => m.status === 'Approved').length;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.fatherName || !regForm.phone || !regForm.omanId) {
      alert('Please fill out all required fields');
      return;
    }

    const created: Member = {
      id: `mem-${Date.now()}`,
      name: regForm.name,
      fatherName: regForm.fatherName,
      phone: regForm.phone,
      passportNo: regForm.passportNo || 'ZP' + Math.floor(100000 + Math.random() * 900000),
      omanId: regForm.omanId,
      regionOman: regForm.regionOman,
      regionPak: regForm.regionPak || 'Khyber Pakhtunkhwa',
      bloodGroup: regForm.bloodGroup,
      cardType: 'Standard',
      status: 'Pending',
      joinDate: new Date().toISOString().split('T')[0],
      registrationNo: 'POC-M-PEND',
      photoUrl: regForm.photoUrl || '',
      feeAmount: 5,
      feeStatus: 'Unpaid'
    };

    setMembers(prev => [...prev, created]);
    setNewRegMemberRef(created);
    setRegisteredSuccess(true);

    // Auto append to Google Sheets if credentials and sheets are active
    if (googleToken && googleSheetId) {
      appendMemberToSheet(googleToken, googleSheetId, created)
        .then(() => {
          console.log('✅ Real-time Google Sheet registration row appended successfully!');
        })
        .catch((err) => {
          console.error('❌ Failed to append to Google Sheet in real-time:', err);
        });
    }

    setRegForm({
      name: '',
      fatherName: '',
      phone: '',
      passportNo: '',
      omanId: '',
      regionOman: 'Muscat',
      regionPak: '',
      bloodGroup: 'B+',
      photoUrl: ''
    });
  };

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmt = parseFloat(donForm.amount);
    if (isNaN(parsedAmt) || parsedAmt <= 0) {
      alert('Please specify a valid, positive donation amount (OMR).');
      return;
    }

    const created: Donation = {
      id: `don-${Date.now()}`,
      donorName: donForm.isAnonymous ? 'Anonymous Sister/Brother' : (donForm.donorName || 'Generous Donor'),
      amount: parsedAmt,
      isAnonymous: donForm.isAnonymous,
      message: donForm.message || 'Welfare Contribution',
      date: new Date().toISOString().split('T')[0]
    };

    setDonations(prev => [created, ...prev]);
    setDonationSuccess(true);
    setDonForm({ donorName: '', amount: '', isAnonymous: false, message: '' });
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repForm.reporterName || !repForm.personName || !repForm.details) {
      alert('Please complete dispatcher reporting parameters.');
      return;
    }

    const created: IncidentReport = {
      id: `rep-${Date.now()}`,
      reporterName: repForm.reporterName,
      reporterPhone: repForm.reporterPhone || '+968 XXXX XXXX',
      incidentType: repForm.incidentType,
      personName: repForm.personName,
      details: repForm.details,
      location: repForm.location || 'Sultanate Clinic',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };

    setReports(prev => [created, ...prev]);
    setReportSuccess(true);
    setRepForm({
      reporterName: '',
      reporterPhone: '',
      incidentType: 'Injury',
      personName: '',
      location: '',
      details: ''
    });
  };

  const castVote = (candidateId: string, position: string) => {
    if (votedPositions.includes(position)) {
      alert(`⚠️ Ballot error: You have already cast your ballot for the position of ${position}. Only one ballot allowed per role!`);
      return;
    }

    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c));
    setVotedPositions(prev => [...prev, position]);
    alert(`🎉 Vote registered! Thank you for supporting democratic leadership for the role of ${position}.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060c08] via-slate-950 to-[#020503] flex flex-col font-sans select-none antialiased">
      
      {/* Master Bilingual Header with public alert tickers */}
      <Header 
        activePage={activePage}
        setActivePage={setActivePage}
        announcements={announcements}
        isAdmin={true}
        setIsAdminMode={(admin) => setActivePage('admin')}
      />

      {/* Global Times Square Digital LED Billboard Container — Visible on specific home pages */}
      {activePage === 'home' && (
        <Billboard 
          memberCount={acceptedMembersCount}
          donationTotal={donationTotal}
          reportCount={reports.length}
        />
      )}

      {/* Inner Application Primary Stage */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-12">

          {/* ==================== 1. HOME VIEW ==================== */}
          {activePage === 'home' && (
            <div className="space-y-12 animate-fadeIn" id="page-home">
              
              {/* Slogan Intro */}
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                <span className="bg-[#006633]/20 text-[#D4AF37] font-extrabold text-[10px] sm:text-xs uppercase px-3 py-1.5 rounded-full border border-[#D4AF37]/20 tracking-wider">
                  ✦ Sultanate of Oman Secretariat ✦
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none text-center font-display">
                  پښتانه د عُمان ټولنه
                </h2>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-medium">
                  Welcome to the digital solidarity portal of the **Pakhtoon Community Oman**. Supporting construction workers, corporate technicians, legal advisors, and teachers from Swat, Peshawar, Khyber, Waziristan, and Lakki Marwat residing under Omani hospitality.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button onClick={() => setActivePage('join')} className="bg-gradient-to-r from-[#D4AF37] to-[#8E6E17] hover:brightness-110 text-slate-950 font-extrabold text-xs uppercase px-6 py-3.5 rounded-lg shadow-xl transition-all tracking-wider">
                    Register & Get Member Card
                  </button>
                  <button onClick={() => setActivePage('reports')} className="bg-[#006633] hover:bg-[#004d26] text-white font-extrabold text-xs uppercase px-6 py-3.5 rounded-lg shadow transition-all tracking-wider border border-emerald-900/40">
                    File Emergency Incident
                  </button>
                </div>
              </div>

              {/* Dynamic Live Statistics Board */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800/80 shadow-2xl space-y-3 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#006633] to-[#D4AF37]"></div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <p className="text-xs font-bold text-[#D4AF37] tracking-wider font-display">WELFARE ACCOUNTING</p>
                    <Coins className="w-5 h-5 text-[#D4AF37] animate-[bounce_3s_infinite]" />
                  </div>
                  <h3 className="text-2.5xl sm:text-3xl font-black text-white leading-none font-display">OMR {donationTotal}</h3>
                  <p className="text-xs text-stone-400">
                    Live welfare collection pool used for emergency flights, medical bills, and tragic repatriation expenses of community workers with zero insurance support.
                  </p>
                  <button onClick={() => setActivePage('donate')} className="text-xs text-[#D4AF37] font-bold hover:underline flex items-center gap-1.5 pt-2">
                    Contribute online <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800/80 shadow-2xl space-y-3 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#006633] to-[#D4AF37]"></div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <p className="text-xs font-bold text-emerald-400 tracking-wider font-display">VERIFIED COUNCIL MEMBERS</p>
                    <Award className="w-5 h-5 text-emerald-450" />
                  </div>
                  <h3 className="text-2.5xl sm:text-3xl font-black text-white leading-none font-display">{acceptedMembersCount + 448} Active</h3>
                  <p className="text-xs text-stone-400">
                    Registered, standard cataloged members holding valid membership cards complete with home district records in Khyber Pakhtunkhwa.
                  </p>
                  <button onClick={() => setActivePage('join')} className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1.5 pt-2">
                    Verify Registration form <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800/80 shadow-2xl space-y-3 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#006633] to-[#D4AF37]"></div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <p className="text-xs font-bold text-red-400 tracking-wider font-display">ACTIVE EMERGENCY CASES</p>
                    <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                  </div>
                  <h3 className="text-2.5xl sm:text-3xl font-black text-white leading-none font-display">{reports.length} Cases</h3>
                  <p className="text-xs text-stone-400">
                    Active death, injury, or passport loss incidents logged and handled directly by cabinet zone representatives in collaboration with Muscat Embassy.
                  </p>
                  <button onClick={() => setActivePage('reports')} className="text-xs text-red-400 font-bold hover:underline flex items-center gap-1.5 pt-2">
                    Track report indices <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Grid 2 Columns: Official Announcements list & News Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                
                {/* News & Official Press Releases on Left */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xl font-bold font-display text-white tracking-tight">Official Press Updates</h3>
                    <button onClick={() => setActivePage('press')} className="text-xs text-[#D4AF37] hover:underline font-extrabold tracking-wider uppercase">View All</button>
                  </div>
                  
                  <div className="space-y-4">
                    {pressReleases.slice(0, 2).map(pr => (
                      <div key={pr.id} className="bg-slate-900/60 p-5 rounded-xl border border-slate-800/80 hover:border-[#D4AF37]/30 transition-all duration-300 space-y-2">
                        <p className="text-[10px] text-[#D4AF37] font-mono flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {pr.date} • {pr.issuedBy}</p>
                        <h4 className="text-md font-bold text-stone-100 hover:text-[#D4AF37] cursor-pointer transition-colors duration-150">{pr.title}</h4>
                        <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed">{pr.content}</p>
                        <button onClick={() => setActivePage('press')} className="text-xs text-[#D4AF37]/80 font-bold hover:underline flex items-center gap-1 pt-1.5">
                          Read full cabinet release <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Oman Labor Advisory on Right */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xl font-bold font-display text-white tracking-tight">Oman Labor Advisory</h3>
                    <button onClick={() => setActivePage('law')} className="text-xs text-emerald-450 hover:underline font-extrabold tracking-wider uppercase">Advice Board</button>
                  </div>

                  <div className="space-y-3.5 text-xs text-stone-300">
                    {lawArticles.slice(0, 2).map(law => (
                      <div key={law.id} className="bg-slate-900/40 p-5 rounded-xl border border-slate-800/85 hover:border-[#D4AF37]/30 transition-all duration-300 relative overflow-hidden">
                        {law.isUrgent && (
                          <span className="absolute top-0 right-0 bg-red-900/80 border-b border-l border-red-800 text-white font-extrabold text-[9px] px-3 py-1 uppercase tracking-wider">
                            Urgent Advice
                          </span>
                        )}
                        <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-2 py-1 rounded border border-emerald-900/50">{law.category}</span>
                        <h4 className="text-sm font-bold text-white mt-3 mb-1 uppercase tracking-tight">{law.title}</h4>
                        <p className="text-stone-450 text-xs leading-relaxed line-clamp-2">{law.summary}</p>
                        <button onClick={() => setActivePage('law')} className="text-[#D4AF37] hover:underline text-xs mt-2.5 inline-block font-bold">
                          Read detailed advice article »
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================== 2. JOIN US VIEW ==================== */}
          {activePage === 'join' && (
            <div className="space-y-6 animate-fadeIn" id="page-join">
              <div className="border-b border-slate-850 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black text-white flex items-center gap-2 font-display">
                    <UserPlus className="w-8 h-8 text-[#D4AF37]" /> Member Portal
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Register for POC standard active membership, and securely retrieve your validated vertical card and horizontal certificate once central cabinet confirmation is approved.
                  </p>
                </div>

                {/* Subtab Navigation Buttons */}
                <div className="flex bg-slate-905 p-1 rounded-xl border border-slate-800/80 max-w-sm w-full md:w-auto self-start md:self-center">
                  <button
                    onClick={() => setJoinSubTab('register')}
                    className={`flex-1 md:flex-initial px-4 py-2 text-[10.5px] font-black uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1.5 ${
                      joinSubTab === 'register' ? 'bg-[#006633] text-[#D4AF37] border-b-2 border-[#D4AF37] font-extrabold shadow-md' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" /> 📝 Enroll Register
                  </button>
                  <button
                    onClick={() => setJoinSubTab('lookup')}
                    className={`flex-1 md:flex-initial px-4 py-2 text-[10.5px] font-black uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1.5 ${
                      joinSubTab === 'lookup' ? 'bg-[#006633] text-[#D4AF37] border-b-2 border-[#D4AF37] font-extrabold shadow-md' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" /> 🔍 Status & Downloads
                  </button>
                </div>
              </div>

              {/* TAB 1: REGISTER ENROLLMENT */}
              {joinSubTab === 'register' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Form column on Left */}
                  <div className="lg:col-span-6 bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800/80 shadow-2xl relative overflow-hidden space-y-6">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#006633] to-[#D4AF37]"></div>
                  
                    {registeredSuccess ? (
                      <div className="text-center py-8 space-y-4" id="success-registration">
                        <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-900/50 flex items-center justify-center mx-auto text-[#D4AF37]">
                          <CheckCircle className="w-8 h-8 animate-pulse" />
                        </div>
                        <h4 className="text-lg font-bold text-white font-display">Registration Slip Received!</h4>
                        <p className="text-xs text-stone-450 leading-relaxed max-w-sm mx-auto">
                          Excellent! Your expatriate file has been securely submitted into the Sultanate POC queue. Status will reflect as <strong className="text-yellow-400">Pending</strong> until the regional central coordinator verifies registration.
                        </p>
                        <div className="bg-emerald-950/20 p-4 rounded-lg border border-emerald-905 text-[11px] text-stone-300 max-w-sm mx-auto space-y-2">
                          <p className="font-bold text-white uppercase text-[10px] tracking-wider text-center border-b border-white/5 pb-1">Next Required Steps</p>
                          <p className="text-left font-sans">1. Hand-off the standard OMR 5 registration Logistics Fee in Ruwi/Seeb or Suhar/Salalah coordination desks.</p>
                          <p className="text-left font-sans">2. Switch to the <strong className="text-[#D4AF37]">"Status & Downloads"</strong> tab above and search your Civil ID to view your approved vertical badge & horizontal printable certificate!</p>
                        </div>
                        <div className="flex gap-3 justify-center pt-2">
                          <button 
                            onClick={() => {
                              if (newRegMemberRef) {
                                setSearchQuery(newRegMemberRef.omanId);
                                setSearchResult(newRegMemberRef);
                                setSearchTried(true);
                              }
                              setJoinSubTab('lookup');
                              setRegisteredSuccess(false);
                            }}
                            className="bg-[#D4AF37] hover:bg-[#bba335] text-slate-950 font-extrabold text-xs uppercase px-5 py-2.5 rounded transition-all flex items-center gap-1.5"
                          >
                            <FileText className="w-4 h-4" /> Go to Status
                          </button>
                          <button 
                            onClick={() => setRegisteredSuccess(false)}
                            className="border border-stone-700 hover:bg-stone-800 text-stone-300 font-extrabold text-xs uppercase px-5 py-2.5 rounded transition-all"
                          >
                            Submit Another
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                        <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest border-b border-slate-800/80 pb-2.5">Enrollment Registration Slip</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-stone-300 font-bold mb-1.5 uppercase">Full Name <span className="text-[#D4AF37]">*</span></label>
                            <input
                              type="text"
                              value={regForm.name}
                              onChange={(e) => setRegForm({...regForm, name: e.target.value})}
                              placeholder="e.g. Basit Ali Swati"
                              className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded px-2.5 py-2 outline-none text-white font-semibold focus:ring-1 focus:ring-[#D4AF37]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-stone-300 font-bold mb-1.5 uppercase">Father's Name <span className="text-[#D4AF37]">*</span></label>
                            <input
                              type="text"
                              value={regForm.fatherName}
                              onChange={(e) => setRegForm({...regForm, fatherName: e.target.value})}
                              placeholder="e.g. Sher Zaman Khattak"
                              className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded px-2.5 py-2 outline-none text-white font-semibold focus:ring-1 focus:ring-[#D4AF37]"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-stone-300 font-bold mb-1.5 uppercase">Oman Contact Phone <span className="text-[#D4AF37]">*</span></label>
                            <input
                              type="text"
                              value={regForm.phone}
                              onChange={(e) => setRegForm({...regForm, phone: e.target.value})}
                              placeholder="e.g. +968 9111 2233"
                              className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded px-2.5 py-2 outline-none text-white font-mono focus:ring-1 focus:ring-[#D4AF37]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-stone-300 font-bold mb-1.5 uppercase">Oman Civil ID Number <span className="text-[#D4AF37]">*</span></label>
                            <input
                              type="text"
                              value={regForm.omanId}
                              onChange={(e) => setRegForm({...regForm, omanId: e.target.value})}
                              placeholder="e.g. 10928374"
                              className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded px-2.5 py-2 outline-none text-white font-mono focus:ring-1 focus:ring-[#D4AF37]"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-stone-300 font-bold mb-1.5 uppercase">Oman Sponsor residency region <span className="text-[#D4AF37]">*</span></label>
                            <select
                              value={regForm.regionOman}
                              onChange={(e) => setRegForm({...regForm, regionOman: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded px-2.5 py-2 cursor-pointer outline-none text-white font-semibold focus:ring-1 focus:ring-[#D4AF37]"
                            >
                              <option value="Muscat">Muscat (Ruwi/Seeb)</option>
                              <option value="Suhar">Suhar (Al Batinah)</option>
                              <option value="Salalah">Salalah (Dhofar)</option>
                              <option value="Nizwa">Nizwa (Al Dakhiliyah)</option>
                              <option value="Ibri">Ibri (Al Dhahirah)</option>
                              <option value="Duqm">Duqm (Wustah)</option>
                              <option value="Sur">Sur (Ash Sharqiyah)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-stone-300 font-bold mb-1.5 uppercase">Home District in Pakistan <span className="text-[#D4AF37]">*</span></label>
                            <input
                              type="text"
                              value={regForm.regionPak}
                              onChange={(e) => setRegForm({...regForm, regionPak: e.target.value})}
                              placeholder="e.g. Swat Swabi or Khyber Agency"
                              className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded px-2.5 py-2 outline-none text-white font-semibold focus:ring-1 focus:ring-[#D4AF37]"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-stone-300 font-bold mb-1.5 uppercase">Blood Group <span className="text-[#D4AF37]">*</span></label>
                            <select
                              value={regForm.bloodGroup}
                              onChange={(e) => setRegForm({...regForm, bloodGroup: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded px-2.5 py-2 cursor-pointer outline-none text-white text-xs font-semibold focus:ring-1 focus:ring-[#D4AF37]"
                            >
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-stone-300 font-bold mb-1.5 uppercase">Pakistani Passport No (Optional)</label>
                            <input
                              type="text"
                              value={regForm.passportNo}
                              onChange={(e) => setRegForm({...regForm, passportNo: e.target.value})}
                              placeholder="e.g. XY123456"
                              className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded px-2.5 py-2 outline-none text-white font-mono focus:ring-1 focus:ring-[#D4AF37]"
                            />
                          </div>
                        </div>

                        {/* MEMBERSHIP PROFILE PHOTO SELECTOR */}
                        <div>
                          <label className="block text-stone-300 font-bold mb-1.5 uppercase">Membership Face Profile Photo <span className="text-stone-500 font-normal">(Highly Recommended)</span></label>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center shrink-0">
                              {regForm.photoUrl ? (
                                <img src={regForm.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                <UserPlus className="w-5 h-5 text-stone-600" />
                              )}
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setRegForm({...regForm, photoUrl: reader.result as string});
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded px-2.5 py-1.5 outline-none text-white text-[11px] font-mono focus:ring-1 focus:ring-[#D4AF37] file:mr-4 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-stone-800 file:text-stone-300 hover:file:bg-stone-750 file:cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* OMR 5 REGISTRATION FEE ADVISORY */}
                        <div className="bg-emerald-950/40 p-3.5 rounded-lg border border-emerald-900/45 text-stone-300 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-[#D4AF37]" />
                            <h4 className="font-extrabold text-white text-[11px] uppercase tracking-wider">Oman Cabinet hand-off policy</h4>
                          </div>
                          <p className="text-[10.5px] text-stone-400 leading-relaxed">
                            An official lifetime registration fee of <strong className="text-[#D4AF37] font-black">5 Omani Riyal (5 OMR)</strong> applies to all registrants for logistics coverage. Status remains <span className="text-amber-400 font-bold uppercase font-mono">Pending</span> until payment is verified by the registrar.
                          </p>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#006633] to-emerald-800 hover:brightness-110 text-white font-extrabold text-xs uppercase py-3.5 rounded-lg shadow-lg tracking-wider cursor-pointer transition-all"
                        >
                          Register for Membership Card
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Virtual Card Preview rendering column on Right (LOCKED FOR NEW APPLICANTS) */}
                  <div className="lg:col-span-6 space-y-4">
                    {/* Collapsible Header/Toggler on Mobile */}
                    <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between lg:border-0 lg:bg-transparent lg:p-0">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                          Card Compiler Draft Preview
                        </h3>
                        <p className="text-[10px] text-stone-550 mt-0.5 hidden sm:block">Details sync live on the vertical card below.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowDraftPreviewMobile(!showDraftPreviewMobile)}
                        className="lg:hidden text-[11.5px] font-black uppercase bg-[#006633] hover:bg-[#004d26] text-[#D4AF37] border border-[#D4AF37]/30 px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0"
                      >
                        {showDraftPreviewMobile ? '🙈 Hide Draft Card' : '👁️ Show Draft Card'}
                      </button>
                    </div>

                    {/* Content: always visible on lg, conditionally collapsed on mobile */}
                    <div className={`${showDraftPreviewMobile ? 'block' : 'hidden lg:block'} space-y-4 animate-fadeIn`}>
                      <div className="border-b border-stone-900 pb-2 hidden lg:block">
                        <p className="text-[11px] text-stone-550">As you type, details sync live on the vertical card below. Downloads are disabled until cabinet approval.</p>
                      </div>

                      {/* Render Card preview strictly marked as Draft (Locked) */}
                      <MemberCard 
                        isDraft={true}
                        member={
                          registeredSuccess && newRegMemberRef
                            ? newRegMemberRef
                            : {
                                name: regForm.name || 'YOUR FULL NAME',
                                fatherName: regForm.fatherName || 'FATHER NAME',
                                phone: regForm.phone || '+968 XXXX XXXX',
                                omanId: regForm.omanId || 'CIVIL ID NO',
                                regionOman: regForm.regionOman,
                                regionPak: regForm.regionPak || 'HOME DISTRICT',
                                bloodGroup: regForm.bloodGroup,
                                cardType: 'Standard',
                                registrationNo: 'POC-M-DRAFT'
                              }
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SECURE STATUS INQUIRY & PORTABLE DOWNLOADS */}
              {joinSubTab === 'lookup' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
                  
                  {/* Left Column search box */}
                  <div className="lg:col-span-6 bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800/80 shadow-2xl relative overflow-hidden space-y-5">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-emerald-700"></div>
                    <div className="space-y-1">
                      <h3 className="text-md font-black text-white uppercase tracking-wider flex items-center gap-1.5 text-[#D4AF37]">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> Status & Downloads Panel
                      </h3>
                      <p className="text-[11px] text-stone-400 leading-relaxed">
                        To download your official high-fidelity vertical card badge choose your theme and trigger download, or print your horizontal certification. Search using your Oman Civil ID or contact phone coordinate digits.
                      </p>
                    </div>

                    <div className="space-y-4 pt-1">
                      <div>
                        <label className="block text-stone-300 font-bold mb-1.5 uppercase tracking-wide text-[9px]">
                          Enter Oman Civil ID / Passport / Phone No
                        </label>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="e.g. 10928374 or +968 9111 2233"
                          className="w-full bg-slate-950 border border-slate-850 hover:border-slate-850 focus:border-[#D4AF37] rounded px-3.5 py-3 outline-none text-white font-mono text-xs focus:ring-1 focus:ring-[#D4AF37]"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              // Trigger search immediately
                              setSearchTried(true);
                              const cleaned = searchQuery.trim().toLowerCase().replace(/\s+/g, '');
                              if (!cleaned) {
                                setSearchResult(null);
                                return;
                              }
                              const matched = members.find(m => {
                                const omId = (m.omanId || '').trim().toLowerCase();
                                const ph = (m.phone || '').trim().toLowerCase().replace(/\s+/g, '');
                                const pNo = (m.passportNo || '').trim().toLowerCase();
                                return omId === cleaned || ph === cleaned || ph.includes(cleaned) || pNo === cleaned;
                              });
                              setSearchResult(matched || null);
                            }
                          }}
                        />
                      </div>

                      <button
                        onClick={() => {
                          setSearchTried(true);
                          const cleaned = searchQuery.trim().toLowerCase().replace(/\s+/g, '');
                          if (!cleaned) {
                            setSearchResult(null);
                            return;
                          }
                          const matched = members.find(m => {
                            const omId = (m.omanId || '').trim().toLowerCase();
                            const ph = (m.phone || '').trim().toLowerCase().replace(/\s+/g, '');
                            const pNo = (m.passportNo || '').trim().toLowerCase();
                            return omId === cleaned || ph === cleaned || ph.includes(cleaned) || pNo === cleaned;
                          });
                          setSearchResult(matched || null);
                        }}
                        className="w-full bg-gradient-to-r from-[#006633] to-emerald-800 hover:brightness-115 py-3 text-xs font-black uppercase text-white tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                      >
                        Check Approval State
                      </button>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900/60 text-[10.5px] text-stone-400 leading-relaxed font-sans mt-2">
                      <strong className="text-white">Note:</strong> Default database features a demo list of verified approved members for test queries. You can try searching <code className="bg-stone-900 text-yellow-400 font-mono px-1.5 py-0.5 rounded text-[10.5px]">10125433</code> (Sher Zaman Swati) or <code className="bg-stone-900 text-yellow-400 font-mono px-1.5 py-0.5 rounded text-[10.5px]">22334455</code> (Haji Ameer Khan) to see how approved credential download triggers work!
                    </div>
                  </div>

                  {/* Right Column showing result elements */}
                  <div className="lg:col-span-6 space-y-6 flex flex-col items-center justify-center">
                    
                    {!searchTried && (
                      <div className="bg-stone-900/20 p-8 rounded-2xl border border-dashed border-stone-850 text-center space-y-3 w-full py-16">
                        <FileText className="w-12 h-12 text-stone-800 mx-auto" />
                        <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest">Awaiting Verification Search</h4>
                        <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                          Enter your credentials in the inquiries field on the left. Certified active members unlock full vertical high gloss badges and horizontal printable diplomas immediately.
                        </p>
                      </div>
                    )}

                    {searchTried && !searchResult && (
                      <div className="bg-stone-900/40 p-8 rounded-2xl border border-stone-850/80 text-center space-y-4 w-full py-12">
                        <HelpCircle className="w-11 h-11 text-stone-600 mx-auto animate-bounce" />
                        <h4 className="text-sm font-black text-stone-200 uppercase tracking-widest">No Active Match Located</h4>
                        <p className="text-xs text-stone-400 leading-relaxed max-w-xs mx-auto">
                          We searched Muscat and Suhar cabinet rosters but couldn't locate any profile corresponding to "<strong>{searchQuery}</strong>".
                        </p>
                        <p className="text-[10px] text-stone-500 leading-normal max-w-xs mx-auto">
                          If you registered recently, please consult your regional central assembly desk or re-enroll under the <strong>📝 Enroll Register</strong> tab.
                        </p>
                      </div>
                    )}

                    {searchTried && searchResult && (
                      <div className="w-full">
                        {searchResult.status === 'Approved' ? (
                          <div className="space-y-6">
                            {/* Congratulations header */}
                            <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-4 text-center space-y-1">
                              <span className="bg-emerald-800/80 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">
                                verified approved profile
                              </span>
                              <h4 className="text-sm font-black text-emerald-400 mt-1.5 uppercase tracking-tight">
                                🎉 CONGRATULATIONS, {searchResult.name}!
                              </h4>
                              <p className="text-[10.5px] text-stone-300">
                                Your standard welfare active registration has been authorized by the central cabinet. Your Official Badge and Horizontal Certificate are now unlocked for immediate download.
                              </p>
                            </div>

                            {/* Render actual UNLOCKED MemberCard */}
                            <MemberCard 
                              member={searchResult}
                              isDraft={false}
                            />

                            {/* Horizontal Certificate Unlocked Trigger Box */}
                            <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-4 rounded-2xl border border-[#D4AF37]/30 flex items-center justify-between gap-4">
                              <div className="space-y-1">
                                <span className="text-[9px] bg-amber-950 border border-amber-900 text-[#D4AF37] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                                  Diploma Unlocked
                                </span>
                                <h4 className="text-xs font-black text-white uppercase mt-1">Horizontal Membership Certificate</h4>
                                <p className="text-[10px] text-stone-400 font-sans max-w-[200px] sm:max-w-none">
                                  Suitable for printing or framing, this high-fidelity horizontal layout contains certified serial id POC coordinates.
                                </p>
                              </div>
                              <button
                                onClick={() => setSelectedCertMember(searchResult)}
                                className="bg-[#D4AF37] hover:bg-[#b08c23] text-slate-950 py-3 px-4 rounded-lg font-extrabold text-xs uppercase tracking-wider shrink-0 transition-transform active:scale-95 flex items-center gap-1 shadow-lg font-display"
                              >
                                <Award className="w-4 h-4 text-slate-950" /> Get Certificate
                              </button>
                            </div>
                          </div>
                        ) : searchResult.status === 'Pending' ? (
                          <div className="bg-stone-900/50 p-6 rounded-2xl border border-stone-850 space-y-4 text-center w-full">
                            <div className="w-12 h-12 bg-yellow-950/60 border border-yellow-900 flex items-center justify-center rounded-full mx-auto text-yellow-400">
                              <Coins className="w-6 h-6 animate-pulse" />
                            </div>
                            <h4 className="text-sm font-black text-yellow-500 uppercase tracking-widest">🟡 REGISTRATION APPLIED • PENDING</h4>
                            <p className="text-xs text-stone-300 leading-relaxed max-w-sm mx-auto">
                              Your profile folder representing <strong>{searchResult.name}</strong> is securely entered in the database queue, but requires physical fee verification.
                            </p>
                            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-900 text-left text-[11px] text-stone-300 font-mono space-y-1 max-w-sm mx-auto">
                              <p className="text-white font-bold border-b border-white/5 pb-1 text-center uppercase text-[10px]">Registry Details</p>
                              <p>• EXPATRIATE ID: {searchResult.omanId}</p>
                              <p>• STATUS: AWAITING CENTRAL COMMISSION AUDIT</p>
                              <p>• LIFE FEE STATUS: <span className="text-yellow-400 font-bold">OMR 5 UNPAID</span></p>
                            </div>
                            <p className="text-[10.5px] text-stone-450 leading-relaxed max-w-sm mx-auto">
                              ⚠️ Once your regional coordinator confirms payment of the <strong>5 OMR logistics fee</strong>, the status updates to approved instantly, enabling both high-gloss vertical badges and Horizontal printable diplomas.
                            </p>
                          </div>
                        ) : (
                          <div className="bg-stone-900/50 p-6 rounded-2xl border border-stone-850 space-y-4 text-center w-full">
                            <div className="w-12 h-12 bg-red-950/60 border border-red-900 flex items-center justify-center rounded-full mx-auto text-red-500">
                              <ShieldAlert className="w-6 h-6 shrink-0" />
                            </div>
                            <h4 className="text-sm font-black text-rose-500 uppercase tracking-widest">🔴 REJECTED OR DISMISSED</h4>
                            <p className="text-xs text-stone-400 leading-relaxed max-w-xs mx-auto">
                              The application folder representing <strong>{searchResult.name}</strong> was dismissed by regional administrators.
                            </p>
                            <p className="text-[10px] text-stone-550 leading-normal max-w-xs mx-auto">
                              Please consult with the Central Central Cabinet Coordinators in Muscat or re-enroll.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== 3. CABINET VIEW ==================== */}
          {activePage === 'cabinet' && (
            <div className="space-y-8 animate-fadeIn" id="page-cabinet">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-1.5">
                  <span className="bg-emerald-950/40 text-[#D4AF37] font-extrabold text-[10px] uppercase border border-[#D4AF37]/30 px-2.5 py-0.5 rounded tracking-widest font-display">
                    ✦ Executive Division ✦
                  </span>
                </div>
                <h2 className="text-3xl font-black text-white flex items-center gap-2 mt-1.5 font-display">
                  <Award className="w-8 h-8 text-[#D4AF37]" /> VIP Gold Cabinet Members
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Official designated cabinet representatives and district coordinators in Oman holding lifetime VIP Gold cards issued by the Patron-in-chief.
                </p>
              </div>

              {/* Grid showcasing cabinet and VIP cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cabinet.map(cab => (
                  <div key={cab.id} className="bg-slate-900/40 p-5 rounded-2xl border border-stone-850 space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-16 h-16 rounded-xl border border-[#b38f36]/40 overflow-hidden bg-slate-950 flex-shrink-0">
                        <img 
                          src={cab.photoUrl} 
                          alt={cab.name} 
                          className="w-full h-full object-cover grayscale opacity-90"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black text-amber-400 font-mono tracking-widest uppercase">{cab.role}</p>
                        <h3 className="text-lg font-black text-white uppercase leading-tight">{cab.name}</h3>
                        <p className="text-xs text-stone-400">Join date: {cab.joinDate}</p>
                      </div>
                    </div>

                    {/* Member's individual downloadable card */}
                    <MemberCard 
                      member={{
                        name: cab.name,
                        fatherName: 'Cabinet Director',
                        phone: cab.phone,
                        omanId: cab.registrationNo,
                        regionOman: cab.regionOman,
                        regionPak: cab.regionPak,
                        bloodGroup: 'VIP',
                        cardType: 'VIP',
                        registrationNo: cab.registrationNo,
                        joinDate: cab.joinDate
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 4. INCIDENT REPORTS VIEW ==================== */}
          {activePage === 'reports' && (
            <div className="space-y-8 animate-fadeIn" id="page-reports">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-3xl font-black text-white flex items-center gap-2 font-display">
                  <ShieldAlert className="w-8 h-8 text-red-500" /> Emergency Incident Dispatch Board
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  If a community worker in Oman experiences a severe injury, workplace accident, passport confiscation, or passes away, file a direct dispatch report below. The cabinet will initiate emergency protocols and consult the embassy.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Dispatch Form column */}
                <div className="lg:col-span-5 bg-slate-900 p-5 sm:p-6 rounded-2xl border border-stone-850 shadow-xl space-y-4">
                  <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider border-b border-stone-800 pb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-500" /> New Incident Dispatch File
                  </h3>

                  {reportSuccess ? (
                    <div className="text-center py-8 space-y-3" id="success-report">
                      <div className="w-12 h-12 bg-red-950 text-red-500 border border-red-900 rounded-full flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <h4 className="text-md font-bold text-white">Emergency Dispatched!</h4>
                      <p className="text-xs text-stone-400">
                        The report has been written is currently designated as 'Pending Case Audit'. Cabinet dispatch managers are being updated immediately.
                      </p>
                      <button 
                        onClick={() => setReportSuccess(false)}
                        className="bg-transparent text-red-400 hover:text-red-300 border border-red-900 text-xs font-bold px-3 py-1.5 uppercase rounded"
                      >
                        File another dispatch
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-stone-300 font-bold mb-1">Your Name (Reporter) <span className="text-yellow-500">*</span></label>
                        <input
                          type="text"
                          value={repForm.reporterName}
                          onChange={(e) => setRepForm({...repForm, reporterName: e.target.value})}
                          placeholder="Your Name"
                          className="w-full bg-slate-950 border border-stone-800 rounded px-2.5 py-2 text-white font-medium"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-stone-300 font-bold mb-1">Reporter Phone <span className="text-yellow-500">*</span></label>
                          <input
                            type="text"
                            value={repForm.reporterPhone}
                            onChange={(e) => setRepForm({...repForm, reporterPhone: e.target.value})}
                            placeholder="+968 phone"
                            className="w-full bg-slate-950 border border-stone-800 rounded px-2.5 py-2 font-mono text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-stone-300 font-bold mb-1">Incident Type <span className="text-yellow-500">*</span></label>
                          <select
                            value={repForm.incidentType}
                            onChange={(e) => setRepForm({...repForm, incidentType: e.target.value as any})}
                            className="w-full bg-slate-950 border border-stone-800 rounded px-2.5 py-2 text-white font-semibold"
                          >
                            <option value="Death">Death / Repatriation</option>
                            <option value="Injury">Severe Personal Injury</option>
                            <option value="Lost Person">Lost Person / Missing</option>
                            <option value="Labor Dispute">Labor Dispute / Withheld passport</option>
                            <option value="Other">Other emergency support</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-stone-300 font-bold mb-1">Subject Name (Injured/Deceased/Lost Citizen) <span className="text-yellow-500">*</span></label>
                        <input
                          type="text"
                          value={repForm.personName}
                          onChange={(e) => setRepForm({...repForm, personName: e.target.value})}
                          placeholder="Name of subject citizen"
                          className="w-full bg-slate-950 border border-stone-800 rounded px-2.5 py-2 text-white font-semibold"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-stone-300 font-bold mb-1">Current Facility / Location <span className="text-yellow-500">*</span></label>
                        <input
                          type="text"
                          value={repForm.location}
                          onChange={(e) => setRepForm({...repForm, location: e.target.value})}
                          placeholder="e.g. Suhar Hospital, Room 22B"
                          className="w-full bg-slate-950 border border-stone-800 rounded px-2.5 py-2 text-white font-semibold"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-stone-300 font-bold mb-1">Detailed Description of Situation <span className="text-yellow-500">*</span></label>
                        <textarea
                          value={repForm.details}
                          onChange={(e) => setRepForm({...repForm, details: e.target.value})}
                          rows={4}
                          placeholder="Explain what happened, employer involvement, support needed, etc."
                          className="w-full bg-slate-950 border border-stone-800 rounded px-2.5 py-2 text-white"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-red-800 hover:bg-red-700 text-white font-bold text-xs uppercase py-2.5 rounded transition-all shadow-lg"
                      >
                        Submit Emergency Dispatch
                      </button>
                    </form>
                  )}
                </div>

                {/* Dashboard grid columns tracking active reports statuses */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="border-b border-stone-900 pb-2">
                    <h3 className="text-md font-bold text-white uppercase tracking-wider">Dynamic Incident Dispatches</h3>
                    <p className="text-[11px] text-stone-500 mt-0.5">Real-time status boards monitored closely by representative councils in Oman.</p>
                  </div>

                  <div className="space-y-4">
                    {reports.map(rep => (
                      <div key={rep.id} className="bg-slate-900/40 p-4 rounded-xl border border-stone-850 space-y-3 relative overflow-hidden">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-900 pb-2 ml-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-red-950 text-red-500 text-[9px] font-black border border-red-900/60 px-2 py-0.5 rounded uppercase">
                              {rep.incidentType}
                            </span>
                            <span className="text-stone-500 text-xs font-mono">{rep.date}</span>
                          </div>

                          <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase font-mono border ${
                            rep.status === 'Pending' ? 'bg-yellow-950 text-yellow-400 border-yellow-905' :
                            rep.status === 'Verified' ? 'bg-emerald-950 text-emerald-400 border-emerald-905' :
                            rep.status === 'Investigating' ? 'bg-amber-950/40 text-amber-400 border-amber-905' :
                            'bg-stone-900 text-stone-400 border-stone-800'
                          }`}>
                            🔴 STATUS: {rep.status}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs">
                          <p className="text-stone-500 font-bold uppercase text-[9px]">Subject Citizen:</p>
                          <h4 className="text-sm font-black text-white uppercase">{rep.personName}</h4>
                          <p className="text-stone-400 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-red-500" /> Location: <strong className="text-white uppercase">{rep.location}</strong>
                          </p>
                        </div>

                        <p className="text-xs text-stone-300 italic leading-relaxed bg-slate-950/40 p-2.5 rounded border border-stone-900/50">
                          "{rep.details}"
                        </p>

                        <div className="text-[10px] text-stone-500 flex items-center gap-1.5 pt-1 border-t border-stone-900/40">
                          <span>Reported by: <strong className="text-stone-400">{rep.reporterName}</strong></span>
                          <span>•</span>
                          <span>Phone: <strong className="text-stone-400 font-mono">{rep.reporterPhone}</strong></span>
                        </div>
                      </div>
                    ))}

                    {reports.length === 0 && (
                      <p className="text-center p-8 bg-slate-900/20 border border-stone-850 rounded text-stone-500 text-xs text-sans">
                        No active dispatch warnings. Complete harmony is registered!
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== 5. DONATE WELFARE VIEW ==================== */}
          {activePage === 'donate' && (
            <div className="space-y-8 animate-fadeIn" id="page-donate">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-3xl font-black text-white flex items-center gap-2 font-display">
                  <Coins className="w-8 h-8 text-[#D4AF37]" /> Welfare & Repatriation Fund
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Our general emergency fund provides repatriation of remains of brothers back to their home district cemeteries, assists injured construction site technicians with no employer liability insurance, and sponsors education inside Pakistani Community schools.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form and ledger statistics */}
                <div className="lg:col-span-5 bg-slate-900 p-5 sm:p-6 rounded-2xl border border-stone-850 space-y-6">
                  
                  <div className="p-4 rounded-xl bg-slate-950 border border-stone-800 text-center space-y-1">
                    <p className="text-stone-500 text-xs tracking-wider uppercase font-bold">TOTAL CAPITAL FUND RAISED</p>
                    <p className="text-3.5xl font-black text-white leading-tight">OMR {donationTotal}</p>
                    <p className="text-[11px] text-emerald-400 font-medium">Instantly compiled from {donations.length} transactions</p>
                  </div>

                  {donationSuccess ? (
                    <div className="text-center py-6 space-y-3" id="success-donation">
                      <div className="w-12 h-12 bg-emerald-950 border border-emerald-900 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-lg">
                        💚
                      </div>
                      <h4 className="text-md font-bold text-white">Blessing Registered!</h4>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Your welfare contribution has been instantly processed into the public ledger. Thank you Swat and Khyber families in Oman for your hospitality!
                      </p>
                      <button 
                        onClick={() => setDonationSuccess(false)}
                        className="bg-emerald-850 text-white font-bold text-xs px-3 py-1.5 rounded uppercase"
                      >
                        File another entry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleDonationSubmit} className="space-y-4 text-xs">
                      <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest border-b border-stone-850 pb-1.5">Contribution Slip</h3>
                      
                      <div>
                        <label className="block text-stone-300 font-bold mb-1">Donor Name (leave blank for Anonymous) </label>
                        <input
                          type="text"
                          value={donForm.donorName}
                          onChange={(e) => setDonForm({...donForm, donorName: e.target.value})}
                          placeholder="e.g. Haji Gul Khan Sinwari"
                          className="w-full bg-slate-950 border border-stone-800 rounded px-2.5 py-2 text-white font-medium"
                          disabled={donForm.isAnonymous}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-stone-300 font-bold mb-1 font-sans">OMR Amount <span className="text-yellow-500">*</span></label>
                          <input
                            type="number"
                            value={donForm.amount}
                            onChange={(e) => setDonForm({...donForm, amount: e.target.value})}
                            placeholder="e.g. 50"
                            className="w-full bg-slate-950 border border-stone-800 rounded px-2.5 py-2 font-mono text-white font-semibold"
                            required
                          />
                        </div>
                        <div className="flex flex-col justify-end py-1">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              id="isAnonSlip"
                              checked={donForm.isAnonymous}
                              onChange={(e) => setDonForm({...donForm, isAnonymous: e.target.checked})}
                              className="rounded bg-slate-950 border-stone-805"
                            />
                            <label htmlFor="isAnonSlip" className="text-stone-300 font-semibold cursor-pointer">Remain Anonymous</label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-stone-300 font-bold mb-1 font-sans">Blessing Message (Notes for accounting transparency)</label>
                        <input
                          type="text"
                          value={donForm.message}
                          onChange={(e) => setDonForm({...donForm, message: e.target.value})}
                          placeholder="e.g. repatriation helper"
                          className="w-full bg-slate-950 border border-stone-800 rounded px-2.5 py-2 text-stone-200"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-extrabold py-2.5 text-xs rounded tracking-wider uppercase shadow-md"
                      >
                        Write slip to Ledger
                      </button>
                    </form>
                  )}
                </div>

                {/* Left ledger listings */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="border-b border-stone-900 pb-2">
                    <h3 className="text-md font-bold text-white uppercase tracking-wider">Welfare Fund Accounting Ledger</h3>
                    <p className="text-[11px] text-stone-500 mt-0.5">Transparent public lists auditing all funds received and logged as Active.</p>
                  </div>

                  <div className="space-y-2.5">
                    {donations.map(don => (
                      <div key={don.id} className="bg-slate-900 p-4 rounded-xl border border-stone-850 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-stone-500 font-mono">Receipt: #{don.id.substring(don.id.length - 6)} • {don.date}</p>
                          <h4 className="text-sm font-black text-white hover:text-[#b38f36] uppercase leading-tight cursor-pointer">{don.donorName}</h4>
                          <p className="text-xs text-stone-400 italic">"{don.message}"</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-stone-500">Amount Given</p>
                          <p className="text-lg font-black text-[#b38f36] tracking-tight whitespace-nowrap font-mono">OMR {don.amount}</p>
                        </div>
                      </div>
                    ))}
                    {donations.length === 0 && (
                      <p className="text-center p-8 bg-slate-900/20 border border-stone-850 rounded text-stone-500 text-xs">No active donations recorded currently.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== 6. OMAN LABOR LAW VIEW ==================== */}
          {activePage === 'law' && (
            <div className="space-y-8 animate-fadeIn" id="page-law">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-3xl font-black text-white flex items-center gap-2 font-display">
                  <Scale className="w-8 h-8 text-[#D4AF37]" /> Oman Labor Law & Advice Board
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Official advisories updated regularly regarding residency cards, minimum wage, visa transfer, witholding passport legalities, and summer midday rest laws in the Sultanate. Stay updated on your legal rights.
                </p>
              </div>

              {/* Grid showcasing articles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lawArticles.map(art => (
                  <div key={art.id} className="bg-slate-900 p-6 rounded-2xl border border-stone-850 space-y-4 relative overflow-hidden flex flex-col justify-between">
                    
                    {art.isUrgent && (
                      <span className="absolute top-0 right-0 bg-red-800 text-white font-extrabold text-[9px] uppercase px-3 py-1 border-b border-l border-red-900 tracking-wider">
                        🚨 Urgent advisory
                      </span>
                    )}

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-950 text-emerald-300 text-[10px] font-black tracking-wide border border-emerald-900/60 px-2.5 py-0.5 rounded uppercase">
                          {art.category}
                        </span>
                        <span className="text-stone-500 text-xs font-mono">{art.date}</span>
                      </div>
                      
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">{art.title}</h3>
                      <p className="text-stone-400 text-xs leading-relaxed font-semibold">{art.summary}</p>
                    </div>

                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-stone-900 text-xs text-stone-300 leading-relaxed font-normal mt-4">
                      {art.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 7. ELECTIONS VIEW ==================== */}
          {activePage === 'elections' && (
            <div className="space-y-8 animate-fadeIn" id="page-elections">
              
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#006633]/20 border border-[#D4AF37]/25 text-[#D4AF37] font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded tracking-widest font-display">
                    ✦ Sultanate Council Session 21 ✦
                  </span>
                </div>
                <h2 className="text-3xl font-black text-white flex items-center gap-2 mt-1.5 font-display">
                  <Vote className="w-8 h-8 text-[#D4AF37]" /> Transparent Cabinet Ballot Board
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Cast standard, secure votes for community presidential, vice-presidential, and coordinator leadership seats. To ensure democratic integrity, you are allowed standardly 1 secure ballot cast per seat category.
                </p>
              </div>

              {/* Group candidates by position */}
              {['President', 'Vice President', 'General Secretary'].map((pos) => {
                const posCandidates = candidates.filter(c => c.position === pos);
                const posTotalVotes = posCandidates.reduce((sum, c) => sum + c.votes, 0);

                return (
                  <div key={pos} className="bg-slate-900/40 p-6 rounded-2xl border border-stone-850 space-y-4">
                    <h3 className="text-xl font-black text-white uppercase tracking-wider border-b border-stone-800 pb-3 flex items-center justify-between">
                      <span>Office seat: {pos}</span>
                      <span className="text-xs text-stone-500 font-mono">Ballots Cast: {posTotalVotes} votes</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {posCandidates.map(cand => {
                        const pct = posTotalVotes > 0 ? (cand.votes / posTotalVotes) * 100 : 0;
                        const hasVotedThisCat = votedPositions.includes(pos);

                        return (
                          <div key={cand.id} className="bg-slate-950 p-4 rounded-xl border border-stone-850 space-y-4 hover:border-emerald-990 transition-all flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-lg bg-emerald-950 border border-emerald-900 overflow-hidden flex-shrink-0">
                                  <img 
                                    src={cand.photoUrl} 
                                    className="w-full h-full object-cover grayscale opacity-90"
                                    alt={cand.name}
                                    referrerPolicy="referrer"
                                  />
                                </div>
                                <div className="space-y-0.5">
                                  <h4 className="text-md font-bold text-white uppercase">{cand.name}</h4>
                                  <p className="text-xs text-[#b38f36] font-mono uppercase">Region: {cand.regionOman}</p>
                                </div>
                              </div>
                              <p className="text-xs text-stone-400 font-medium leading-relaxed">
                                Manifesto: "{cand.description}"
                              </p>
                            </div>

                            {/* Progress bar tracking ballot percentage */}
                            <div className="space-y-2 mt-2">
                              <div className="flex justify-between items-center text-xs text-stone-300">
                                <span className="font-semibold text-emerald-400">{cand.votes} Votes registered</span>
                                <span className="font-mono font-bold text-white">{pct.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-stone-800">
                                <div 
                                  className="bg-emerald-600 h-full transition-all duration-750"
                                  style={{ width: `${pct}%` }}
                                ></div>
                              </div>

                              <button
                                onClick={() => castVote(cand.id, pos)}
                                disabled={hasVotedThisCat}
                                className={`w-full text-xs font-bold uppercase py-2 rounded transition-all flex items-center justify-center gap-1.5 ${
                                  hasVotedThisCat 
                                    ? 'bg-stone-900 text-stone-500 border border-stone-800 cursor-not-allowed' 
                                    : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                                }`}
                              >
                                {hasVotedThisCat ? 'Ballot registered for category' : 'Cast Vote Ballot'}
                              </button>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            </div>
          )}

          {/* ==================== 8. PRESS RELEASES VIEW ==================== */}
          {activePage === 'press' && (
            <div className="space-y-8 animate-fadeIn" id="page-press">
              <div className="border-b border-stone-900 pb-4">
                <h2 className="text-3xl font-black text-white flex items-center gap-2">
                  <FileText className="w-8 h-8 text-emerald-400" /> Official Cabinet Press Releases
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Official announcements issued directly by the Pakhtoon Council Oman media bureau outlining high-level embassy meetings, resolution approvals, and social welfare directives.
                </p>
              </div>

              <div className="space-y-6 max-w-4xl">
                {pressReleases.map(pr => (
                  <div key={pr.id} className="bg-slate-900 p-6 rounded-2xl border border-stone-850 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-2.5">
                      <div className="space-y-1">
                        <p className="text-[11px] text-[#b38f36] font-mono tracking-widest uppercase">OFFICIAL STATEMENT</p>
                        <h3 className="text-xl font-bold text-white tracking-tight">{pr.title}</h3>
                      </div>
                      <div className="text-left sm:text-right text-xs text-stone-500 font-mono flex-shrink-0">
                        <p>Issued: {pr.date}</p>
                        <p>Reads: {pr.reads + 45} views</p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
                      {pr.content}
                    </p>

                    <div className="text-[11px] text-stone-500 flex items-center gap-2 pt-2 border-t border-stone-800/40">
                      <span>Authority:</span>
                      <strong className="text-emerald-400 uppercase tracking-wider">{pr.issuedBy}</strong>
                      <span>•</span>
                      <span>Muscat Bureau, Sultanate of Oman</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 9. EMBASSY INFO VIEW ==================== */}
          {activePage === 'embassy' && (
            <div className="space-y-8 animate-fadeIn" id="page-embassy">
              <div className="border-b border-stone-900 pb-4">
                <h2 className="text-3xl font-black text-white flex items-center gap-2">
                  <Building2 className="w-8 h-8 text-emerald-450" /> Pakistan Embassy Oman Directory
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Detailed, official contact references and consular services schedules for the Pakistan Embassy in Muscat, Sultanate of Oman. Supporting Pakhtoon workmen with passport and card renewals.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Contact and address Card column */}
                <div className="lg:col-span-4 bg-slate-900 border border-stone-850 p-6 rounded-2xl space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl text-yellow-500">🇵🇰</span>
                    <div>
                      <h3 className="font-extrabold text-white text-md">Embassy of Pakistan</h3>
                      <p className="text-xs text-emerald-400">Muscat Sultanate of Oman</p>
                    </div>
                  </div>

                  <ul className="space-y-4 text-xs font-medium text-stone-300">
                    <li className="flex items-start gap-2.5">
                      <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-white mb-0.5">Physical Address:</p>
                        <p>Villa No. Way 2107, Diplomatic Quarter, Ruwi, Muscat, Oman</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5 font-mono">
                      <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="font-sans font-bold text-stone-100 mb-0.5">Telephone Inquiries:</p>
                        <p>+968 2469 6141</p>
                        <p>+968 2469 6143 (Emergency Attache)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FileText className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-white mb-0.5">Consular Email Desk:</p>
                        <p className="font-mono text-emerald-400">parepmuscat@mofa.gov.pk</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Services list column on Right */}
                <div className="lg:col-span-8 space-y-6 bg-slate-900/30 p-5 rounded-2xl border border-stone-850">
                  <h3 className="text-lg font-bold text-white border-b border-stone-800 pb-2 uppercase tracking-tight">Key Services Guides</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-300">
                    
                    <div className="bg-slate-950 p-4 rounded-xl border border-stone-850 space-y-1.5 hover:border-yellow-905 transition-all">
                      <span className="text-xl">🎴</span>
                      <h4 className="font-bold text-white uppercase mt-1">NADRA Card (NICOP / CNIC)</h4>
                      <p className="text-stone-400 leading-normal">
                        Processed instantly through the biometric systems desks inside the embassy lobby. Dual-national identity certificates require physical fingerprinting of the passport holder.
                      </p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-stone-850 space-y-1.5 hover:border-yellow-905/30 transition-all">
                      <span className="text-xl">📕</span>
                      <h4 className="font-bold text-white uppercase mt-1">Machine Readable Passports (MRP)</h4>
                      <p className="text-stone-400 leading-normal">
                        Passport printing systems queues renewal processes between Sunday and Thursday early morning (08:30 AM to 12:30 AM). Standard execution takes 15 business days.
                      </p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-stone-850 space-y-1.5 hover:border-yellow-905/30 transition-all">
                      <span className="text-xl">📜</span>
                      <h4 className="font-bold text-white uppercase mt-1">Foreign Document Attestations</h4>
                      <p className="text-stone-400 leading-normal">
                        Attestation of marriage certificates, higher degrees, and power of attorney. Documents originating from Pakistan must first be recognized by the Ministry of Foreign Affairs (MOFA) Islamabad.
                      </p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-stone-850 space-y-1.5 hover:border-yellow-905/30 transition-all">
                      <span className="text-xl">🚑</span>
                      <h4 className="font-bold text-white uppercase mt-1">Emergency Remittance Repatriations</h4>
                      <p className="text-stone-400 leading-normal">
                        If a citizen is hospitalized or passes away in distant zones (such as Salalah or Duqm), the Attache Welfare desk organizes emergency support and coordinates with community standard committees.
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== 10. ADMIN CONTROLS PORTAL VIEW ==================== */}
          {activePage === 'admin' && (
            <AdminPanel 
              members={members}
              setMembers={setMembers}
              cabinet={cabinet}
              setCabinet={setCabinet}
              reports={reports}
              setReports={setReports}
              donations={donations}
              setDonations={setDonations}
              lawArticles={lawArticles}
              setLawArticles={setLawArticles}
              candidates={candidates}
              setCandidates={setCandidates}
              pressReleases={pressReleases}
              setPressReleases={setPressReleases}
              announcements={announcements}
              setAnnouncements={setAnnouncements}
              
              googleToken={googleToken}
              setGoogleToken={setGoogleToken}
              googleSheetId={googleSheetId}
              setGoogleSheetId={setGoogleSheetId}
            />
          )}

        </div>
      </main>

      {/* Structured Solid Footer */}
      <Footer />

      {selectedCertMember && (
        <MembershipCertificate
          member={selectedCertMember}
          onClose={() => setSelectedCertMember(null)}
        />
      )}

    </div>
  );
}
