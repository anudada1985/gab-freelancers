export const UserRole = {
  FREELANCER: 'FREELANCER',
  CLIENT: 'CLIENT',
  ADMIN: 'ADMIN'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface PayoutDetails {
  method: 'Bank Transfer' | 'EasyPaisa' | 'JazzCash';
  bankName?: string; // e.g., HBL, Meezan
  accountTitle: string;
  accountNumber: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  role: UserRole;
  verified: boolean;
  balance: number;
  status?: 'Active' | 'Banned';
  agreedToTerms?: boolean;
  payoutDetails?: PayoutDetails;
  title?: string;
  bio?: string;
  hourlyRate?: number;
  skills?: string[];
  rating?: number;
  jobsCompleted?: number;
}

export interface PlatformPaymentDetails {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  easyPaisaNumber: string;
  jazzCashNumber: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  currency: string;
  postedBy: User;
  postedAt: string;
  category: string;
  type: 'Fixed Price' | 'Hourly';
  applicants: number;
  status: 'Open' | 'In Progress' | 'Completed' | 'Paid' | 'Cancelled';
  assignedTo?: string;
}

// Fiverr-style "Gig"
export interface Service {
  id: string;
  freelancerId: string;
  freelancer: User;
  title: string; // e.g., "I will build a React app"
  description: string;
  price: number;
  deliveryTime: number; // in days
  category: string;
  image: string;
  rating: number;
  reviewsCount: number;
}

export interface Proposal {
  id: string;
  jobId: string;
  freelancerId: string;
  freelancerName: string;
  coverLetter: string;
  bidAmount: number;
  submittedAt: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

// New: Direct Offer from Client to Freelancer
export interface DirectOffer {
  id: string;
  fromClient: User;
  toFreelancerId: string;
  title: string;
  description: string;
  price: number;
  days: number;
  status: 'Pending' | 'Accepted' | 'Rejected';
  sentAt: string;
}

export interface FreelancerProfile {
  id: string;
  user: User;
  title: string;
  bio: string;
  hourlyRate: number;
  skills: string[];
  rating: number;
  jobsCompleted: number;
  totalEarned: number;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'Withdrawal' | 'Deposit' | 'Payment';
  method: 'JazzCash' | 'EasyPaisa' | 'Bank Transfer';
  status: 'Completed' | 'Pending';
}

export interface Advertisement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
}
