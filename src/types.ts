export interface Member {
  id: string;
  name: string;
  fatherName: string;
  phone: string;
  passportNo: string;
  omanId: string;
  regionOman: string;
  regionPak: string;
  bloodGroup: string;
  cardType: 'Standard' | 'VIP';
  status: 'Pending' | 'Approved' | 'Rejected';
  joinDate: string;
  registrationNo: string;
  photoUrl?: string;
  feeAmount?: number;
  feeStatus?: 'Unpaid' | 'Paid';
}

export interface CabinetMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  regionOman: string;
  regionPak: string;
  photoUrl: string;
  registrationNo: string;
  joinDate: string;
  isVip: boolean;
}

export interface IncidentReport {
  id: string;
  reporterName: string;
  reporterPhone: string;
  incidentType: 'Death' | 'Injury' | 'Lost Person' | 'Labor Dispute' | 'Other';
  personName: string;
  details: string;
  location: string;
  status: 'Pending' | 'Verified' | 'Investigating' | 'Resolved';
  date: string;
}

export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  isAnonymous: boolean;
  message: string;
  date: string;
}

export interface LawArticle {
  id: string;
  title: string;
  category: 'General' | 'Visa & ID' | 'Sponsorship (Kafala)' | 'Wages & Gratuity' | 'Termination' | 'Fines & Penalties';
  summary: string;
  content: string;
  isUrgent: boolean;
  date: string;
}

export interface Candidate {
  id: string;
  name: string;
  position: 'President' | 'Vice President' | 'General Secretary' | 'Finance Secretary' | 'Media Coordinator';
  votes: number;
  regionOman: string;
  description: string;
  photoUrl: string;
}

export interface PressRelease {
  id: string;
  title: string;
  date: string;
  content: string;
  issuedBy: string;
  reads: number;
}

export interface Announcement {
  id: string;
  text: string;
  category: 'Urgent' | 'Cabinet Meeting' | 'Embassy Update' | 'General';
  active: boolean;
  date: string;
}
