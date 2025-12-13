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
  email: string; // Added email
  password?: string; // Added for auth simulation
  avatar: string;
  role: UserRole;
  verified: boolean; // Simulates NADRA verification
  balance: number;
  status?: 'Active' | 'Banned';
  agreedToTerms?: boolean;
  payoutDetails?: PayoutDetails; // For Freelancers to receive money
  // Freelancer specific fields directly on User for simplicity in this demo
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

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  currency: string;
  postedBy: User;
  postedAt: string; // ISO Date
  category: string;
  type: 'Fixed Price' | 'Hourly';
  applicants: number;
  status: 'Open' | 'In Progress' | 'Completed' | 'Paid' | 'Cancelled';
  assignedTo?: string; // Freelancer ID
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
