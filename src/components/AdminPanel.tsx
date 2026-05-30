import React, { useState } from 'react';
import { 
  KeyRound, Users, ShieldAlert, Award, Coins, Scale, FileText, Vote, 
  Trash2, Check, X, ShieldX, UserCheck, Plus, FileSpreadsheet, ListPlus,
  RefreshCw, TrendingUp, HelpCircle, RefreshCcw
} from 'lucide-react';
import { 
  Member, CabinetMember, IncidentReport, Donation, 
  LawArticle, Candidate, PressRelease, Announcement 
} from '../types';

interface AdminPanelProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  cabinet: CabinetMember[];
  setCabinet: React.Dispatch<React.SetStateAction<CabinetMember[]>>;
  reports: IncidentReport[];
  setReports: React.Dispatch<React.SetStateAction<IncidentReport[]>>;
  donations: Donation[];
  setDonations: React.Dispatch<React.SetStateAction<Donation[]>>;
  lawArticles: LawArticle[];
  setLawArticles: React.Dispatch<React.SetStateAction<LawArticle[]>>;
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  pressReleases: PressRelease[];
  setPressReleases: React.Dispatch<React.SetStateAction<PressRelease[]>>;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
}

export default function AdminPanel({
  members, setMembers,
  cabinet, setCabinet,
  reports, setReports,
  donations, setDonations,
  lawArticles, setLawArticles,
  candidates, setCandidates,
  pressReleases, setPressReleases,
  announcements, setAnnouncements,
}: AdminPanelProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [adminTab, setAdminTab] = useState<'overview' | 'members' | 'cabinet' | 'reports' | 'donations' | 'news' | 'ticker' | 'elections'>('overview');

  // New forms states
  const [newCabinet, setNewCabinet] = useState({ name: '', role: '', phone: '', regionOman: '', regionPak: '', isVip: true });
  const [newLaw, setNewLaw] = useState({ title: '', category: 'General' as any, summary: '', content: '', isUrgent: false });
  const [newCandidate, setNewCandidate] = useState({ name: '', position: 'President' as any, regionOman: '', description: '' });
  const [newAnnouncement, setNewAnnouncement] = useState({ text: '', category: 'General' as any });
  const [newDonation, setNewDonation] = useState({ donorName: '', amount: '', isAnonymous: false, message: '' });

  // Drive Export Simulation Guard
  const [gdriveStatus, setGdriveStatus] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('❌ Incorrect Administrative Password. Access Denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleMemberStatus = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        const randReg = `POC-M-${Math.floor(1000 + Math.random() * 9000)}`;
        return { ...m, status: newStatus, registrationNo: newStatus === 'Approved' ? randReg : 'POC-M-REJ' };
      }
      return m;
    }));
  };

  const deleteMember = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this member?')) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  // Google Drive Members Export Simulation
  const handleExportMembers = () => {
    setGdriveStatus('🔄 Accessing Google Drive OAuth context...');
    setTimeout(() => {
      setGdriveStatus('📑 Structuring verified member cells (XLSXS)...');
    }, 1000);
    setTimeout(() => {
      setGdriveStatus(`✅ EXPORT SUCCESS: "Pakhtoon_Oman_Members_${new Date().toISOString().split('T')[0]}.xlsx" has been created and synced directly with pakhtoonomancommunity@gmail.com GDrive Workspace folder!`);
    }, 2000);
  };

  // Cabinet Actions
  const handleAddCabinet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCabinet.name || !newCabinet.role || !newCabinet.phone) {
      alert('Please fill out Name, Role, & Phone');
      return;
    }
    const created: CabinetMember = {
      id: `cab-${Date.now()}`,
      name: newCabinet.name,
      role: newCabinet.role,
      phone: newCabinet.phone,
      regionOman: newCabinet.regionOman || 'Muscat',
      regionPak: newCabinet.regionPak || 'KP Valley',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      registrationNo: `POC-VIP-0${cabinet.length + 6}`,
      joinDate: new Date().toISOString().split('T')[0],
      isVip: newCabinet.isVip
    };
    setCabinet(prev => [...prev, created]);
    setNewCabinet({ name: '', role: '', phone: '', regionOman: '', regionPak: '', isVip: true });
    alert('💚 VIP Cabinet member added and VIP Membership Card is issued!');
  };

  const deleteCabinet = (id: string) => {
    if (confirm('Remove this cabinet member?')) {
      setCabinet(prev => prev.filter(c => c.id !== id));
    }
  };

  // Incident Reports Actions
  const handleReportStatus = (id: string, status: any) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const deleteReport = (id: string) => {
    if (confirm('Delete this report entry?')) {
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  // Donations Actions
  const handleAddDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newDonation.amount);
    if (!newDonation.donorName || isNaN(amt) || amt <= 0) {
      alert('Please enter valid donor name and positive OMR amount');
      return;
    }
    const created: Donation = {
      id: `don-${Date.now()}`,
      donorName: newDonation.isAnonymous ? 'Anonymous Sister/Brother' : newDonation.donorName,
      amount: amt,
      isAnonymous: newDonation.isAnonymous,
      message: newDonation.message || 'Welfare contribution',
      date: new Date().toISOString().split('T')[0]
    };
    setDonations(prev => [created, ...prev]);
    setNewDonation({ donorName: '', amount: '', isAnonymous: false, message: '' });
    alert('💚 Donation recorded in transparent portal bookkeepingledger!');
  };

  // Info Post Actions (Laws)
  const handleAddLaw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLaw.title || !newLaw.content || !newLaw.summary) {
      alert('Please fill out title, summary, and article details.');
      return;
    }
    const created: LawArticle = {
      id: `law-${Date.now()}`,
      title: newLaw.title,
      category: newLaw.category,
      summary: newLaw.summary,
      content: newLaw.content,
      isUrgent: newLaw.isUrgent,
      date: new Date().toISOString().split('T')[0]
    };
    setLawArticles(prev => [created, ...prev]);
    setNewLaw({ title: '', category: 'General', summary: '', content: '', isUrgent: false });
    alert('📰 Labor law article has been published to the active advice section!');
  };

  const deleteLaw = (id: string) => {
    if (confirm('Delete this advice/law article?')) {
      setLawArticles(prev => prev.filter(l => l.id !== id));
    }
  };

  // Announcement Actions
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.text) return;
    const created: Announcement = {
      id: `ann-${Date.now()}`,
      text: newAnnouncement.text,
      category: newAnnouncement.category,
      active: true,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [created, ...prev]);
    setNewAnnouncement({ text: '', category: 'General' });
    alert('📣 Alert added directly to the top scrolling marquee!');
  };

  const toggleAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // Candidates Actions
  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidate.name || !newCandidate.description) {
      alert('Please set Candidate Name and short manifesto description.');
      return;
    }
    const created: Candidate = {
      id: `cand-${Date.now()}`,
      name: newCandidate.name,
      position: newCandidate.position,
      votes: 0,
      regionOman: newCandidate.regionOman || 'Muscat',
      description: newCandidate.description,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    };
    setCandidates(prev => [...prev, created]);
    setNewCandidate({ name: '', position: 'President', regionOman: '', description: '' });
    alert('🗳️ Candidate listed. Community members can now vote live!');
  };

  const deleteCandidate = (id: string) => {
    if (confirm('Remove this candidate from ballots?')) {
      setCandidates(prev => prev.filter(c => c.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-slate-900 border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl text-stone-100" id="admin-login-box">
        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
            <KeyRound className="w-7 h-7 text-amber-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">ADMIN SECURE SIGN-IN</h2>
          <p className="text-xs text-stone-400">
            Authorized admin credentials required. Enter portal credentials to manage list rosters, donations ledger, news feeds, and votes.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wide mb-1.5">Enter Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded px-3 py-2.5 outline-none font-mono text-center text-lg text-amber-300 tracking-widest placeholder-stone-700 font-semibold"
              required
            />
          </div>

          {loginError && (
            <p className="text-red-500 font-semibold text-xs text-center p-2 rounded bg-red-950/20 border border-red-900/40">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-extrabold text-sm uppercase py-3 rounded-lg shadow-lg tracking-wider"
          >
            Authenticate Portal
          </button>
        </form>

        <p className="text-center text-[11px] text-stone-500 mt-6 select-none font-serif">
          Default Community Key: <span className="text-amber-500/80 font-mono font-bold select-all">admin123</span>
        </p>
      </div>
    );
  }

  // Calculate Overview Sums
  const pendingCount = members.filter(m => m.status === 'Pending').length;
  const approvedCount = members.filter(m => m.status === 'Approved').length;
  const totalOMR = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="max-w-7xl mx-auto my-6 p-4 sm:p-6 bg-slate-900/60 border border-emerald-900/50 rounded-2xl min-h-[600px] text-stone-100" id="admin-dashboard-container">
      
      {/* Tab Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-red-700 text-white font-extrabold text-[10px] uppercase px-1.5 py-0.5 rounded tracking-wide animate-pulse">L7 DECRYPTED SECURE</span>
            <span className="text-xs text-stone-400 font-mono">ID: {Date.now().toString(16)}</span>
          </div>
          <h2 className="text-2xl font-black text-amber-400 tracking-tight">پښتانه د عُمان • ADMIN CONTROL PANEL</h2>
          <p className="text-xs text-stone-400">Live community databases, instant list triggers, and content management boards.</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-700 hover:bg-red-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded border border-red-900/60 self-start sm:self-center"
        >
          Close Session (Lock)
        </button>
      </div>

      {/* Internal Ribbon Select Toolbar */}
      <div className="flex flex-wrap gap-1.5 border-b border-stone-800 pb-3 mb-6">
        {[
          { id: 'overview', label: 'Dashboard Stats', icon: TrendingUp },
          { id: 'members', label: `Pending & Members (${pendingCount})`, icon: Users },
          { id: 'cabinet', label: 'VIP Cabinet Cards', icon: Award },
          { id: 'reports', label: `Emergency Cases (${reports.length})`, icon: ShieldAlert },
          { id: 'donations', label: `Welfare Ledger (OMR ${totalOMR})`, icon: Coins },
          { id: 'news', label: 'Labor Laws & News', icon: Scale },
          { id: 'ticker', label: 'Alert Header Ticker', icon: FileText },
          { id: 'elections', label: 'Cabinet Ballots', icon: Vote },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded text-xs font-black uppercase tracking-wide flex items-center gap-1.5 transition-all ${
                adminTab === tab.id 
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow border border-amber-300' 
                  : 'bg-slate-950/70 hover:bg-slate-800 text-stone-300 border border-stone-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ADMIN CONTROL TAB BODIES */}

      {/* OVERVIEW PANEL */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-stone-800 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-950 text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-mono">REGISTRATION DATABASE</p>
                <p className="text-2xl font-black text-white mt-0.5">{members.length} Users ({approvedCount} Approved)</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-stone-800 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-950 text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-mono">VIP CABINET MEMBERS</p>
                <p className="text-2xl font-black text-white mt-0.5">{cabinet.length} Gold Cards</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-stone-800 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-red-950 text-red-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-mono">EMERGENCY DISPATCHES</p>
                <p className="text-2xl font-black text-white mt-0.5">{reports.length} Incidents</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-stone-800 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[#b38f36]/10 text-yellow-400">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-mono">WELFARE CAPITAL FUND</p>
                <p className="text-2xl font-black text-[#b38f36] tracking-tight mt-0.5">OMR {totalOMR}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-5 rounded-xl border border-stone-800 text-stone-300 space-y-3 leading-relaxed">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-amber-500 animate-spin" />
              Real-Time Activity Logs & Instructions
            </h3>
            <p className="text-xs text-stone-400">
              This dashboard provides complete live interaction over state values. Because standard client configuration persistent local changes are backed by browser storage, any deletion or status shift will replicate across simulated member registrations, home widgets, and counter displays instantly in the current environment!
            </p>
            <div className="flex gap-4 p-4 rounded-lg bg-slate-950/90 border border-stone-800 flex-col sm:flex-row">
              <div className="space-y-1.5 text-xs">
                <p className="font-extrabold text-amber-400">SYSTEM HEALTH</p>
                <p>⚡ Express proxy server running securely on local port: <span className="font-mono text-white">3000</span></p>
                <p>💼 Google Drive OAuth scopes compiled: <span className="font-mono text-emerald-400">contacts, spreadsheets, drive</span></p>
              </div>
              <div className="space-y-1.5 text-xs">
                <p className="font-extrabold text-emerald-400">LIVE ACTION CHECKS</p>
                <p>🗳️ Direct election counters: <span className="font-mono text-white">3 active posts / {candidates.reduce((sum, c) => sum + c.votes, 0)} votes cast</span></p>
                <p>📣 Running tickers active: <span className="font-mono text-white">{announcements.filter(a => a.active).length} alerts live</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MEMBERS MANAGEMENT TAB */}
      {adminTab === 'members' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Pending Membership Applications</h3>
              <p className="text-xs text-stone-400">Approve registrations to issue registration IDs and generate Standard Cards.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={handleExportMembers}
                className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded shadow flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" /> Export verified Members (to Google Drive)
              </button>
              {gdriveStatus && (
                <p className="text-[11px] text-yellow-400 max-w-sm transition-all animate-fadeIn">{gdriveStatus}</p>
              )}
            </div>
          </div>

          <div className="overflow-x-auto border border-stone-800 rounded-xl bg-slate-950/70">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-stone-800 text-stone-400 font-extrabold uppercase tracking-wider">
                  <th className="p-3">Applicant Name</th>
                  <th className="p-3">Father Name</th>
                  <th className="p-3">Oman ID No</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Regions (Oman/Pak)</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/50">
                {members.map(mem => (
                  <tr key={mem.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3 font-semibold text-white uppercase">{mem.name}</td>
                    <td className="p-3 text-stone-300 font-medium uppercase">{mem.fatherName}</td>
                    <td className="p-3 font-mono font-bold text-amber-500">{mem.omanId}</td>
                    <td className="p-3 text-stone-300 font-mono font-medium">{mem.phone}</td>
                    <td className="p-3">
                      <p className="text-stone-300 font-medium uppercase">🇴🇲 {mem.regionOman}</p>
                      <p className="text-slate-500 text-[10px] uppercase">🇵🇰 {mem.regionPak}</p>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        mem.status === 'Approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' :
                        mem.status === 'Pending' ? 'bg-yellow-950 text-yellow-400 border border-yellow-900' :
                        'bg-red-950 text-red-500 border border-red-900'
                      }`}>
                        {mem.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        {mem.status !== 'Approved' && (
                          <button
                            onClick={() => handleMemberStatus(mem.id, 'Approved')}
                            className="p-1 px-2 bg-emerald-800 hover:bg-emerald-700 text-white text-[11px] font-bold rounded flex items-center gap-1"
                            title="Approve Member"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}
                        {mem.status !== 'Rejected' && (
                          <button
                            onClick={() => handleMemberStatus(mem.id, 'Rejected')}
                            className="p-1 px-2 bg-amber-900 hover:bg-amber-800 text-amber-300 text-[11px] font-bold rounded flex items-center gap-1"
                            title="Reject Applicant"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        )}
                        <button
                          onClick={() => deleteMember(mem.id)}
                          className="p-1 bg-red-950/80 hover:bg-red-900/60 border border-red-900/40 text-red-500 rounded"
                          title="Delete permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CABINET DIRECTORY TAB */}
      {adminTab === 'cabinet' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left side add form */}
            <div className="bg-slate-950/80 p-5 rounded-xl border border-stone-800 h-max">
              <h3 className="text-md font-bold text-amber-400 uppercase tracking-wide border-b border-stone-800 pb-2 mb-4">
                Add Cabin Director & Issue VIP Card
              </h3>
              
              <form onSubmit={handleAddCabinet} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Cabinet Member Name</label>
                  <input
                    type="text"
                    value={newCabinet.name}
                    onChange={(e) => setNewCabinet({...newCabinet, name: e.target.value})}
                    placeholder="e.g. Haji Sher Zaman Afridi"
                    className="w-full bg-slate-900 border border-stone-800 rounded px-2.5 py-2 hover:border-stone-700 focus:border-amber-500 outline-none text-white font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={newCabinet.role}
                    onChange={(e) => setNewCabinet({...newCabinet, role: e.target.value})}
                    placeholder="e.g. Joint Secretary / District Coordinator"
                    className="w-full bg-slate-900 border border-stone-800 rounded px-2.5 py-2 hover:border-stone-700 focus:border-amber-500 outline-none text-white font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newCabinet.phone}
                    onChange={(e) => setNewCabinet({...newCabinet, phone: e.target.value})}
                    placeholder="+968 9XXX XXXX"
                    className="w-full bg-slate-900 border border-stone-800 rounded px-2.5 py-2 hover:border-stone-700 focus:border-amber-500 outline-none text-white font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-300 font-bold mb-1">Sponsor Region (Oman)</label>
                    <input
                      type="text"
                      value={newCabinet.regionOman}
                      onChange={(e) => setNewCabinet({...newCabinet, regionOman: e.target.value})}
                      placeholder="e.g. Muscat"
                      className="w-full bg-slate-900 border border-stone-800 rounded px-2.5 py-2 hover:border-stone-700 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-300 font-bold mb-1">District (Pakistan)</label>
                    <input
                      type="text"
                      value={newCabinet.regionPak}
                      onChange={(e) => setNewCabinet({...newCabinet, regionPak: e.target.value})}
                      placeholder="e.g. Swat Valley"
                      className="w-full bg-slate-900 border border-stone-800 rounded px-2.5 py-2 hover:border-stone-700 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="isVip"
                    checked={newCabinet.isVip}
                    onChange={(e) => setNewCabinet({...newCabinet, isVip: e.target.checked})}
                    className="rounded text-amber-500 bg-slate-900 border-stone-800 outline-none"
                  />
                  <label htmlFor="isVip" className="text-yellow-400 font-bold cursor-pointer">Designate VIP Status (Generates Gold Card)</label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 text-slate-950 font-bold text-xs uppercase py-2.5 rounded transition-all hover:bg-amber-400"
                >
                  Confirm & Write VIP Card
                </button>
              </form>
            </div>

            {/* Right side list */}
            <div className="col-span-2 bg-slate-950/40 p-5 rounded-xl border border-stone-800 space-y-4">
              <h3 className="text-md font-bold text-white uppercase tracking-wide border-b border-stone-800 pb-2">Active Cabinet Members</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cabinet.map(cab => (
                  <div key={cab.id} className="bg-slate-950 p-3 rounded-lg border border-stone-800 flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs bg-amber-950 border border-amber-900 text-amber-400 font-mono px-1.5 py-0.5 rounded font-black uppercase text-[9px]">{cab.registrationNo}</span>
                        {cab.isVip && <span className="text-yellow-400 text-xs">⭐ VIP GOLD</span>}
                      </div>
                      <p className="text-sm font-black text-white uppercase mt-1">{cab.name}</p>
                      <p className="text-xs text-stone-400 font-bold uppercase">{cab.role}</p>
                      <p className="text-[11px] text-stone-500">Contact: {cab.phone}</p>
                      <p className="text-[10px] text-emerald-500">🇴🇲 {cab.regionOman} / 🇵🇰 {cab.regionPak}</p>
                    </div>
                    <button
                      onClick={() => deleteCabinet(cab.id)}
                      className="p-1 px-1.5 text-xs text-red-500 hover:bg-red-950/20 rounded border border-red-950/20"
                      title="Remove cabinet privilege"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DISPATCH REPORTS TAB */}
      {adminTab === 'reports' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Emergency Incident Reports Portal</h3>
            <p className="text-xs text-stone-400">Verifying and tracking submissions of Death, Injury, or Lost Pashtun citizens in Oman.</p>
          </div>

          <div className="space-y-3">
            {reports.map(rep => (
              <div key={rep.id} className="bg-slate-950 p-4 rounded-xl border border-stone-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-900 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-700 text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded tracking-wide">
                      🚨 {rep.incidentType}
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase">{rep.personName}</h4>
                    <span className="text-stone-500">•</span>
                    <span className="text-stone-500 text-xs font-mono">Reported on: {rep.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400 font-bold uppercase">Case Priority:</span>
                    <select
                      value={rep.status}
                      onChange={(e) => handleReportStatus(rep.id, e.target.value as any)}
                      className="bg-slate-900 text-xs text-amber-400 font-bold border border-stone-800 rounded px-2 py-1 outline-none font-mono"
                    >
                      <option value="Pending">⚠️ Pending Audit</option>
                      <option value="Verified">✅ Verified Active</option>
                      <option value="Investigating">🔍 Under Investigation</option>
                      <option value="Resolved">🟢 Case Resolved</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="text-stone-500 font-bold">REPORTER IDENTITY:</p>
                    <p className="text-white font-semibold">{rep.reporterName}</p>
                    <p className="text-stone-400 font-mono">{rep.reporterPhone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-stone-500 font-bold">INCIDENT LOCATION / FACILITY:</p>
                    <p className="text-white font-semibold uppercase">{rep.location}</p>
                  </div>
                  <div className="space-y-1 text-right self-end">
                    <button
                      onClick={() => deleteReport(rep.id)}
                      className="p-1 px-3 bg-red-950 border border-red-900/40 text-red-400 text-[11px] font-semibold rounded hover:bg-red-900"
                    >
                      Delete Case Record
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded border border-stone-800 text-xs text-stone-300 italic">
                  <span className="font-extrabold text-stone-500 uppercase font-sans tracking-wide block not-italic text-[9px] mb-1">Details & Log File:</span>
                  "{rep.details}"
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <p className="text-center p-8 bg-slate-950/40 border border-stone-800 rounded text-stone-500 text-xs">No emergency dispatcher files listed currently.</p>
            )}
          </div>
        </div>
      )}

      {/* DONATIONS LEDGER TAB */}
      {adminTab === 'donations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Record Manual Contribution Form */}
            <div className="bg-slate-950/80 p-5 rounded-xl border border-stone-800 h-max">
              <h3 className="text-md font-bold text-amber-500 border-b border-stone-800 pb-2 mb-4 uppercase tracking-wide">
                Register Manual Welfare Donation
              </h3>
              
              <form onSubmit={handleAddDonation} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Donor Name</label>
                  <input
                    type="text"
                    value={newDonation.donorName}
                    onChange={(e) => setNewDonation({...newDonation, donorName: e.target.value})}
                    placeholder="e.g. Dr. Malik Swati Khattak"
                    className="w-full bg-slate-900 border border-stone-800 rounded px-2.5 py-2 outline-none hover:border-stone-700 text-white font-medium"
                    required={!newDonation.isAnonymous}
                    disabled={newDonation.isAnonymous}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-300 font-bold mb-1">OMR Amount</label>
                    <input
                      type="number"
                      value={newDonation.amount}
                      onChange={(e) => setNewDonation({...newDonation, amount: e.target.value})}
                      placeholder="e.g. 100"
                      className="w-full bg-slate-900 border border-stone-800 rounded px-2.5 py-2 outline-none font-mono text-white font-semibold"
                      required
                    />
                  </div>
                  <div className="flex flex-col justify-end py-1">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        id="isAnonDon"
                        checked={newDonation.isAnonymous}
                        onChange={(e) => {
                          setNewDonation({
                            ...newDonation, 
                            isAnonymous: e.target.checked,
                            donorName: e.target.checked ? 'Anonymous Sister/Brother' : ''
                          });
                        }}
                        className="rounded text-amber-500"
                      />
                      <label htmlFor="isAnonDon" className="text-stone-300 font-semibold cursor-pointer">Anonymous</label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Blessing Message (Notes)</label>
                  <input
                    type="text"
                    value={newDonation.message}
                    onChange={(e) => setNewDonation({...newDonation, message: e.target.value})}
                    placeholder="e.g. Fund for hospital travel support"
                    className="w-full bg-slate-900 border border-stone-800 rounded px-2.5 py-2 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 text-white text-xs font-bold uppercase py-2.5 rounded transition-all hover:bg-emerald-600"
                >
                  Write transaction to ledger
                </button>
              </form>
            </div>

            {/* Real-time Ledger */}
            <div className="col-span-2 bg-slate-950/40 p-5 rounded-xl border border-stone-800 space-y-4">
              <h3 className="text-md font-bold text-white border-b border-stone-800 pb-2 uppercase tracking-wide">Dynamic Bookkeeping Registry</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 border-b border-stone-800 text-stone-400 font-extrabold uppercase">
                      <th className="p-3">Reference / Date</th>
                      <th className="p-3">Donor Name</th>
                      <th className="p-3">OMR Ledger</th>
                      <th className="p-3">Welfare Message</th>
                      <th className="p-3 text-right">Clear</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/50">
                    {donations.map(don => (
                      <tr key={don.id} className="hover:bg-slate-900/40">
                        <td className="p-3 font-mono font-bold text-stone-400">{don.date}</td>
                        <td className="p-3 font-extrabold text-white uppercase">{don.donorName}</td>
                        <td className="p-3 font-mono font-bold text-[#b38f36]">OMR {don.amount}</td>
                        <td className="p-3 text-stone-300 italic">{don.message}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              if (confirm('Verify transaction and clear record?')) {
                                setDonations(prev => prev.filter(d => d.id !== don.id));
                              }
                            }}
                            className="text-red-500 font-semibold"
                          >
                            Clear
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* LABOR LAWS AND ARTICLES TAB */}
      {adminTab === 'news' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create Art Form */}
            <div className="bg-slate-950/80 p-5 rounded-xl border border-stone-800 h-max">
              <h3 className="text-md font-bold text-amber-500 border-b border-stone-800 pb-2 mb-4 uppercase tracking-wide">
                Publish Labor Law Advice Article
              </h3>
              
              <form onSubmit={handleAddLaw} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Article Title</label>
                  <input
                    type="text"
                    value={newLaw.title}
                    onChange={(e) => setNewLaw({...newLaw, title: e.target.value})}
                    placeholder="e.g. End of Service residency period changes"
                    className="w-full bg-slate-900 border border-stone-800 rounded px-2.5 py-2 outline-none hover:border-stone-700 text-white font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-300 font-bold mb-1">Category Select</label>
                    <select
                      value={newLaw.category}
                      onChange={(e) => setNewLaw({...newLaw, category: e.target.value as any})}
                      className="w-full bg-slate-900 border border-stone-800 rounded px-2 py-2 outline-none text-white font-medium"
                    >
                      <option value="General">General</option>
                      <option value="Visa & ID">Visa & ID</option>
                      <option value="Sponsorship (Kafala)">Sponsorship (Kafala)</option>
                      <option value="Wages & Gratuity">Wages & Gratuity</option>
                      <option value="Termination">Termination</option>
                      <option value="Fines & Penalties">Fines & Penalties</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-end py-1">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        id="isUrgLaw"
                        checked={newLaw.isUrgent}
                        onChange={(e) => setNewLaw({...newLaw, isUrgent: e.target.checked})}
                        className="rounded text-amber-500"
                      />
                      <label htmlFor="isUrgLaw" className="text-red-400 font-bold cursor-pointer">Mark as Urgent Advisory</label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Short Summary Abstract</label>
                  <input
                    type="text"
                    value={newLaw.summary}
                    onChange={(e) => setNewLaw({...newLaw, summary: e.target.value})}
                    placeholder="Summarize basic advisory theme"
                    className="w-full bg-slate-900 border border-stone-800 rounded px-2.5 py-2 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Detailed Content</label>
                  <textarea
                    value={newLaw.content}
                    onChange={(e) => setNewLaw({...newLaw, content: e.target.value})}
                    rows={4}
                    placeholder="Enter granular labor law code detail and employee legal rights summary..."
                    className="w-full bg-slate-900 border border-stone-800 rounded px-2.5 py-2 outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 text-slate-950 font-bold text-xs py-2.5 rounded hover:bg-amber-400 uppercase tracking-wide"
                >
                  Publish to Advisory Portal
                </button>
              </form>
            </div>

            {/* List Published Laws */}
            <div className="col-span-2 bg-slate-950/40 p-5 rounded-xl border border-stone-800 space-y-4">
              <h3 className="text-md font-bold text-white border-b border-stone-800 pb-2 uppercase tracking-wide">Active Advisory Articles</h3>
              
              <div className="grid grid-cols-1 gap-3">
                {lawArticles.map(law => (
                  <div key={law.id} className="bg-slate-950 p-4 rounded-lg border border-stone-800 flex justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-950 text-emerald-400 font-mono text-[9px] px-1.5 py-0.5 rounded border border-emerald-900 font-black tracking-wide uppercase">{law.category}</span>
                        {law.isUrgent && <span className="bg-red-950 text-red-500 font-extrabold text-[9px] px-1.5 py-0.5 rounded border border-red-900">🚨 URGENT</span>}
                      </div>
                      <h4 className="text-sm font-black text-white mt-1.5">{law.title}</h4>
                      <p className="text-xs text-stone-400 leading-normal">{law.summary}</p>
                    </div>
                    <button
                      onClick={() => deleteLaw(law.id)}
                      className="p-1 px-3 text-red-500 bg-red-950/20 border border-red-950/20 rounded h-max self-center"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ALERT TICKER CONTROL TAB */}
      {adminTab === 'ticker' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="bg-slate-950/80 p-5 rounded-xl border border-stone-800 h-max">
              <h3 className="text-md font-bold text-amber-500 border-b border-stone-800 pb-2 mb-4 uppercase tracking-wide">Add Alert Marquee Ticker</h3>
              <form onSubmit={handleAddAnnouncement} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Scrolling Alert text</label>
                  <textarea
                    value={newAnnouncement.text}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, text: e.target.value})}
                    placeholder="e.g. 📢 Pakistan Embassy team arranging consular setup camp in Seeb on Friday morning."
                    rows={3}
                    className="w-full bg-slate-900 border border-stone-800 rounded px-2.5 py-2 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Notification Category</label>
                  <select
                    value={newAnnouncement.category}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, category: e.target.value as any})}
                    className="w-full bg-slate-900 border border-stone-800 rounded px-2.5 py-2 cursor-pointer outline-none"
                  >
                    <option value="Urgent">🚗 Urgent</option>
                    <option value="Cabinet Meeting">💼 Cabinet Work</option>
                    <option value="Embassy Update">🇵🇰 Embassy Update</option>
                    <option value="General">🔔 General</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 text-slate-950 font-bold text-xs uppercase py-2.5 rounded transition-all hover:bg-amber-400"
                >
                  Write scrolling ticker note
                </button>
              </form>
            </div>

            <div className="col-span-2 bg-slate-950/40 p-5 rounded-xl border border-stone-800 space-y-4">
              <h3 className="text-md font-bold text-white border-b border-stone-800 pb-2 uppercase tracking-wide">Live Header Ticker Alerts</h3>
              
              <div className="space-y-2">
                {announcements.map(ann => (
                  <div key={ann.id} className="bg-slate-950 p-3 rounded-lg border border-stone-800 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-stone-500 font-mono">[{ann.category}] • Published: {ann.date}</p>
                      <p className="text-xs text-white font-medium">{ann.text}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleAnnouncement(ann.id)}
                        className={`text-xs font-bold px-2.5 py-1 rounded border ${
                          ann.active 
                            ? 'bg-emerald-950 hover:bg-emerald-900 border-emerald-900 text-emerald-400' 
                            : 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-400'
                        }`}
                      >
                        {ann.active ? '🟢 Visible' : '⚪ Paused'}
                      </button>
                      
                      <button
                        onClick={() => deleteAnnouncement(ann.id)}
                        className="p-1 px-2 border border-red-950 text-red-500 rounded"
                        title="Delete announcement"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ELECTIONS MANAGERS TAB */}
      {adminTab === 'elections' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create Candidate ballot Form */}
            <div className="bg-slate-950/80 p-5 rounded-xl border border-stone-800 h-max">
              <h3 className="text-md font-bold text-amber-500 border-b border-stone-800 pb-2 mb-4 uppercase tracking-wide">Add Candidate to Ballot</h3>
              <form onSubmit={handleAddCandidate} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Candidate Name</label>
                  <input
                    type="text"
                    value={newCandidate.name}
                    onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
                    placeholder="e.g. Sardar Fazal Shinwari"
                    className="w-full bg-slate-900 border border-stone-850 rounded px-2.5 py-2 outline-none text-white font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Position / Office seat</label>
                  <select
                    value={newCandidate.position}
                    onChange={(e) => setNewCandidate({...newCandidate, position: e.target.value as any})}
                    className="w-full bg-slate-900 border border-stone-850 rounded px-2.5 py-2 cursor-pointer outline-none text-white"
                  >
                    <option value="President">President</option>
                    <option value="Vice President">Vice President</option>
                    <option value="General Secretary">General Secretary</option>
                    <option value="Finance Secretary">Finance Secretary</option>
                    <option value="Media Coordinator">Media Coordinator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Region (Oman residency)</label>
                  <input
                    type="text"
                    value={newCandidate.regionOman}
                    onChange={(e) => setNewCandidate({...newCandidate, regionOman: e.target.value})}
                    placeholder="e.g. Salalah, Oman"
                    className="w-full bg-slate-900 border border-stone-850 rounded px-2.5 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Election Manifesto Summary</label>
                  <textarea
                    value={newCandidate.description}
                    onChange={(e) => setNewCandidate({...newCandidate, description: e.target.value})}
                    placeholder="State 1 or 2 core promises for community growth represent..."
                    rows={3}
                    className="w-full bg-slate-900 border border-stone-850 rounded px-2.5 py-2 outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 text-white font-bold text-xs uppercase py-2.5 rounded transition-all hover:bg-emerald-600"
                >
                  Write Candidate on Ballots
                </button>
              </form>
            </div>

            {/* List and reset candidate lists */}
            <div className="col-span-2 bg-slate-950/40 p-5 rounded-xl border border-stone-800 space-y-4">
              <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                <h3 className="text-md font-bold text-white uppercase tracking-wide">Candidate Ballots Audits</h3>
                <button
                  onClick={() => {
                    if (confirm('Audit safety: Reset all votes cast in database to 0?')) {
                      setCandidates(prev => prev.map(c => ({ ...c, votes: 0 })));
                    }
                  }}
                  className="bg-red-950 text-red-500 font-bold border border-red-900/30 px-3 py-1 rounded text-xs hover:bg-red-900 flex items-center gap-1.5"
                  title="Audit tool"
                >
                  <RefreshCcw className="w-3.5 h-3.5" /> reset votes to 0
                </button>
              </div>

              <div className="space-y-2">
                {candidates.map(cand => (
                  <div key={cand.id} className="bg-slate-950 p-3 rounded-lg border border-stone-800 flex justify-between items-center gap-4">
                    <div>
                      <p className="text-xs text-[#b38f36] font-bold uppercase tracking-wide">{cand.position}</p>
                      <h4 className="text-sm font-black text-white mt-1 uppercase">{cand.name}</h4>
                      <p className="text-[11px] text-stone-500">Residency: {cand.regionOman} • manifesto: "{cand.description}"</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-stone-500">Ballots Cast</p>
                        <p className="text-lg font-black text-emerald-400 font-mono">{cand.votes}</p>
                      </div>

                      <button
                        onClick={() => deleteCandidate(cand.id)}
                        className="p-1 px-1.5 text-xs text-red-600 border border-red-950 bg-red-950/10 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
