import { Member, CabinetMember, IncidentReport, Donation, LawArticle, Candidate, PressRelease, Announcement } from '../types';

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    text: '📢 VIP Gold Membership cards are now available for registered cabinet directors. Apply online today!',
    category: 'Urgent',
    active: true,
    date: '2026-05-28'
  },
  {
    id: 'a2',
    text: '🇵🇰 Announcement: Embassy of Pakistan Oman announces a special consular camp in Salalah on June 15th.',
    category: 'Embassy Update',
    active: true,
    date: '2026-05-30'
  },
  {
    id: 'a3',
    text: '💚 Help repatriation support: We have successfully raised OMR 1,450 for standard medical transportation.',
    category: 'General',
    active: true,
    date: '2026-05-29'
  }
];

export const INITIAL_CABINET: CabinetMember[] = [
  {
    id: 'cab1',
    name: 'Al-Haj Muhammad Rafiq Sinwari',
    role: 'Supreme Patron-in-Chief',
    phone: '+968 9110 4433',
    regionOman: 'Muscat (Ruwi)',
    regionPak: 'Khyber Agency',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    registrationNo: 'POC-VIP-001',
    joinDate: '2019-01-10',
    isVip: true
  },
  {
    id: 'cab2',
    name: 'Engr. Shah Faisal Khan Yousafzai',
    role: 'President',
    phone: '+968 9876 5432',
    regionOman: 'Ghubrah, Muscat',
    regionPak: 'Swat Valley',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    registrationNo: 'POC-VIP-002',
    joinDate: '2020-03-15',
    isVip: true
  },
  {
    id: 'cab3',
    name: 'Sardar Fazal-ur-Rehman Afridi',
    role: 'Vice President',
    phone: '+968 9234 5678',
    regionOman: 'Suhar',
    regionPak: 'Peshawar',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    registrationNo: 'POC-VIP-003',
    joinDate: '2020-03-20',
    isVip: true
  },
  {
    id: 'cab4',
    name: 'Dr. Amjad Khan Khattak',
    role: 'General Secretary',
    phone: '+968 9911 2233',
    regionOman: 'Salalah',
    regionPak: 'Nowshera',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    registrationNo: 'POC-VIP-004',
    joinDate: '2021-02-18',
    isVip: true
  },
  {
    id: 'cab5',
    name: 'Sher Zaman Banuchi',
    role: 'Finance Secretary',
    phone: '+968 9544 8877',
    regionOman: 'Nizwa',
    regionPak: 'Bannu',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
    registrationNo: 'POC-VIP-005',
    joinDate: '2021-05-11',
    isVip: true
  }
];

export const INITIAL_MEMBERS: Member[] = [];

export const INITIAL_DONATIONS: Donation[] = [
  {
    id: 'd1',
    donorName: 'Malik Jahangir Afridi',
    amount: 500,
    isAnonymous: false,
    message: 'Welfare fund for emergency repatriation support of brothers.',
    date: '2026-05-29'
  },
  {
    id: 'd2',
    donorName: 'Anonymous Brother',
    amount: 250,
    isAnonymous: true,
    message: 'For Oman-Pakhtoon school and education sponsorships.',
    date: '2026-05-28'
  },
  {
    id: 'd3',
    donorName: 'Gul Zaman Swati',
    amount: 100,
    isAnonymous: false,
    message: 'General support for the Muscat community gather-up expenses.',
    date: '2026-05-25'
  },
  {
    id: 'd4',
    donorName: 'Wazir Khan',
    amount: 50,
    isAnonymous: false,
    message: 'Special support for high medical expense of injured brother in Suhar.',
    date: '2026-05-21'
  }
];

export const INITIAL_LAW_ARTICLES: LawArticle[] = [
  {
    id: 'law1',
    title: 'Withholding Pasport is Strictly Illegal',
    category: 'Sponsorship (Kafala)',
    summary: 'Under Oman Ministerial Decision 164/2005, employers are strictly prohibited from retaining the passport of expatriates.',
    content: 'According to Omani labor laws, the passport is a personal identity document owned by the government of the expatriate and issued to the citizen for travel and identification. Retention of passport without written consent is an administrative and legal violation. Employees whose passports are retained against their will can file a grievance with the Ministry of Labor or the police.',
    isUrgent: true,
    date: '2026-05-15'
  },
  {
    id: 'law2',
    title: 'Grace Period and Overstay Visa Fine Waivers',
    category: 'Visa & ID',
    summary: 'Rules regarding the processing of work visas, renewal grace periods, and rules for avoiding structural penalties.',
    content: 'Expatriate workers have a standard legal period to renew their resident cards. If residency has expired, there is a penalty computed daily. The card must be renewed within 30 days of standard expiry. If looking to transfer sponsorship, a legally sound No Objection Certificate (NOC) or compliant resignation with appropriate notice is required.',
    isUrgent: false,
    date: '2026-05-10'
  },
  {
    id: 'law3',
    title: 'End of Service Gratuity Computations',
    category: 'Wages & Gratuity',
    summary: 'New Labor Law calculations for expatriate workers completed service rewards.',
    content: 'Under the Royal Decree 53/2023 (new Labour Law), the end-of-service gratuity is calculated based on the employee\'s last basic salary. Expatriate workers receive 1 full month of basic salary for each year of service. This represents a significant increase from previous calculations and must be paid within 7 days of contract termination.',
    isUrgent: true,
    date: '2026-05-01'
  },
  {
    id: 'law4',
    title: 'Maximum Working Hours & Heat Safety Guidelines',
    category: 'General',
    summary: 'Prohibition of midday work in open sites during high summer temperatures.',
    content: 'Under Ministry of Labor directives, open-air labor shifts must halt between 12:30 PM and 3:30 PM from June to August due to heat exhaustion dangers. Employers violating the mid-day rest break will face severe legal penalties and stop-work orders.',
    isUrgent: false,
    date: '2026-05-22'
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  // President Candidates
  {
    id: 'c1',
    name: 'Engr. Shah Faisal Khan Yousafzai',
    position: 'President',
    votes: 412,
    regionOman: 'Muttrah, Muscat',
    description: 'Serving Swat valley origin members, champion of the Muscat School Project and digital membership portal creation.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  {
    id: 'c2',
    name: 'Malik Khan Afzal Khattak',
    position: 'President',
    votes: 384,
    regionOman: 'Salalah',
    description: 'Decades of experience in construction dispute counseling and arranging emergency welfare flight travel.',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  // Vice President Candidates
  {
    id: 'c3',
    name: 'Sardar Fazal-ur-Rehman Afridi',
    position: 'Vice President',
    votes: 310,
    regionOman: 'Suhar',
    description: 'Promoting local sports events (Pushtun Khattak Atan & cricket) and supporting Suhar hospital visits.',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
  },
  {
    id: 'c4',
    name: 'Najeeb Ullah Shinwari',
    position: 'Vice President',
    votes: 295,
    regionOman: 'Barka',
    description: 'Expert counselor for custom cleared cargo transport, driving licensing issues, and labor law support.',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150'
  },
  // General Secretary Candidates
  {
    id: 'c5',
    name: 'Dr. Amjad Khan Khattak',
    position: 'General Secretary',
    votes: 520,
    regionOman: 'Muscat',
    description: 'Welfare organizer, coordinating primary medical care, blood drives, and active embassy liaisons.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  {
    id: 'c6',
    name: 'Israr Ahmed Yousafzai',
    position: 'General Secretary',
    votes: 218,
    regionOman: 'Duqm',
    description: 'Representing industrial zone laborers, focusing on legal compliance and accommodation standards disputes.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  }
];

export const INITIAL_PRESS_RELEASES: PressRelease[] = [
  {
    id: 'pr1',
    title: 'Joint Meeting with Welfare Wing of Pakistan Embassy Muscat',
    date: '2026-05-24',
    content: 'The official cabinet members, led by Patron-in-chief Muhammad Rafiq, held an formal high-level consultation at the Pakistan Embassy in Muscat, meeting with the Comunity Welfare Attache. The discussions focused on speeding up the passport renewal procedures for workers in distant regions, resolving emergency legal status cases, and organizing high-priority labor law training classes across Suhar, Ibri, Nizwa, and Duqm.',
    issuedBy: 'Official Cabinet Press Wing',
    reads: 114
  },
  {
    id: 'pr2',
    title: 'Resolution Approved for Emergency Welfare Fund (OMR 10,000 Target)',
    date: '2026-05-18',
    content: 'The Pakhtoon Community Oman Cabinet has officially approved a structural resolution to establish an emergency emergency-welfare pool of OMR 10,000. This fund will be independently managed by a sub-committee to secure fast flights for medical disasters, assist with the tragic repatriation of bodies, and deliver support to workers injured in workplace incidents without insurance coverage.',
    issuedBy: 'Executive Finance Council',
    reads: 89
  },
  {
    id: 'pr3',
    title: 'Sports Festival - All Oman Pashtun Cricket Cup Announced',
    date: '2026-05-05',
    content: 'To foster unity, social wellness, and athletic engagement among the community youth, the Community sports forum is launching the "All Oman Pashtun Cricket Cup 2026" in Seeb starting from next month. Interested teams are requested to contact District Coordinators for registration. Standard rules and high-quality venues have been secured.',
    issuedBy: 'Sports and Cultural Wing',
    reads: 201
  }
];

export const INITIAL_REPORTS: IncidentReport[] = [
  {
    id: 'rep1',
    reporterName: 'Kashif Wazir',
    reporterPhone: '+968 9111 8844',
    incidentType: 'Injury',
    personName: 'Shaukat Zaman Yousafzai',
    details: 'Fractured lower leg at construction site in Nizwa. Hospitalized. Employer is delaying medical claim processing. Needs legal representative.',
    location: 'Nizwa General Hospital',
    status: 'Investigating',
    date: '2026-05-28'
  },
  {
    id: 'rep2',
    reporterName: 'Amir Khan Afridi',
    reporterPhone: '+968 9543 2199',
    incidentType: 'Lost Person',
    personName: 'Irfan Afridi',
    details: 'Has not been reachable for over 72 hours. Last seen near Ruwi bus terminal. Family in Khyber Agency is highly concerned.',
    location: 'Ruwi, Muscat',
    status: 'Pending',
    date: '2026-05-30'
  }
];
