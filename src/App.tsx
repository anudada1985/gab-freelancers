import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  Users, 
  LayoutDashboard, 
  PlusCircle, 
  Menu, 
  X, 
  LogOut,
  Wallet,
  TrendingUp,
  ShieldCheck,
  ChevronLeft,
  Send,
  Paperclip,
  CheckCircle2,
  FileText,
  Clock,
  Trash2,
  Settings,
  Lock,
  Megaphone,
  Ban,
  Palette,
  FileSignature,
  Download,
  Upload,
  CreditCard,
  Building,
  BarChart2,
  UserCircle,
  Mail,
  Key,
  Save,
  LogIn,
  UserPlus,
  Camera,
  FileBadge,
  Star
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { JobCard, FreelancerCard, Button, VerificationBadge, PaymentMethodBadge, Badge } from './components/UIComponents';
import type { Job, FreelancerProfile, User, Transaction, Advertisement, PayoutDetails, PlatformPaymentDetails, Proposal } from './types';
import { UserRole } from './types';
import { generateJobDescription } from './services/geminiService';
import { AuthPage, RegisterPage } from './auth/Enhanced_Auth_Registration';

// --- Constants & Mock Data ---

const INITIAL_CATEGORIES = [
  'Web Development',
  'Graphic Design',
  'Content Writing',
  'Digital Marketing',
  'Video Animation',
  'Legal Services',
  'Tax Services',
  'Accountancy Services',
  'E-commerce',
  'Others'
];

const INITIAL_PLATFORM_PAYMENT: PlatformPaymentDetails = {
  bankName: 'Meezan Bank',
  accountTitle: 'GAB Freelancers Pvt Ltd',
  accountNumber: '01010101010101',
  iban: 'PK36MEZN0001010101010101',
  easyPaisaNumber: '0300-1234567',
  jazzCashNumber: '0300-7654321'
};

const MOCK_USER: User = {
  id: 'u1',
  name: 'Ahmed Hassan',
  email: 'ahmed@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Ahmed+Hassan&background=random',
  role: UserRole.FREELANCER,
  verified: true,
  balance: 154000,
  status: 'Active',
  agreedToTerms: true,
  payoutDetails: {
    method: 'Bank Transfer',
    bankName: 'HBL',
    accountTitle: 'Ahmed Hassan',
    accountNumber: '1234567890'
  }
};

const INITIAL_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'E-commerce React Developer for Local Brand',
    description: 'We need an experienced React developer to build a clothing store frontend. Must integrate with JazzCash payment gateway API. The design is ready in Figma.\n\nResponsibilities:\n- Convert Figma designs to React components\n- Integrate JazzCash/EasyPaisa APIs\n- Ensure mobile responsiveness\n\nRequirements:\n- 3+ years React experience\n- Portfolio of e-commerce sites\n- Based in Pakistan for occasional syncs',
    budget: 150000,
    currency: 'PKR',
    postedBy: { ...MOCK_USER, id: 'c1', name: 'Sapphire Textiles', email: 'hr@sapphire.com', role: UserRole.CLIENT, avatar: 'https://ui-avatars.com/api/?name=Sapphire+Textiles&background=random' },
    postedAt: new Date().toISOString(),
    category: 'Web Development',
    type: 'Fixed Price',
    applicants: 12,
    status: 'In Progress',
    assignedTo: 'f1'
  },
  {
    id: 'j2',
    title: 'Urdu Content Writer for Tech Blog',
    description: 'Looking for a native Urdu speaker who understands technology terms. You will translate and write 5 articles per week about latest gadgets and software.\n\nMust have strong command over Urdu grammar and technical vocabulary.',
    budget: 5000,
    currency: 'PKR',
    postedBy: { ...MOCK_USER, id: 'c2', name: 'TechPakistan', email: 'editor@techpakistan.com', role: UserRole.CLIENT, avatar: 'https://ui-avatars.com/api/?name=Tech+Pakistan&background=random' },
    postedAt: new Date(Date.now() - 86400000).toISOString(),
    category: 'Content Writing',
    type: 'Fixed Price',
    applicants: 45,
    status: 'Open'
  },
  {
    id: 'j3',
    title: 'Tax Filing Assistant for Small Business',
    description: 'Need a certified tax practitioner to help file annual returns for a small software house in Islamabad. Must be familiar with FBR portal and IT export tax exemptions.',
    budget: 15000,
    currency: 'PKR',
    postedBy: { ...MOCK_USER, id: 'c3', name: 'SoftSync Solutions', email: 'accounts@softsync.pk', role: UserRole.CLIENT, avatar: 'https://ui-avatars.com/api/?name=SoftSync&background=random' },
    postedAt: new Date(Date.now() - 172800000).toISOString(),
    category: 'Tax Services',
    type: 'Fixed Price',
    applicants: 5,
    status: 'Completed',
    assignedTo: 'f2'
  }
];

const INITIAL_FREELANCERS: FreelancerProfile[] = [
  {
    id: 'f1',
    user: { 
      id: 'u2', 
      name: 'Sana Ali', 
      email: 'sana@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Sana+Ali&background=random', 
      role: UserRole.FREELANCER, 
      verified: true, 
      balance: 0, 
      status: 'Active',
      payoutDetails: {
        method: 'EasyPaisa',
        accountTitle: 'Sana Ali',
        accountNumber: '0333-1234567'
      }
    },
    title: 'Full Stack MERN Developer',
    bio: 'Top rated developer with 5 years of experience building scalable web apps for startups in Pakistan and abroad.',
    hourlyRate: 3500,
    skills: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
    rating: 4.9,
    jobsCompleted: 42,
    totalEarned: 2500000
  },
  {
    id: 'f2',
    user: { 
      id: 'u3', 
      name: 'Bilal Khan', 
      email: 'bilal@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Bilal+Khan&background=random', 
      role: UserRole.FREELANCER, 
      verified: false, 
      balance: 0, 
      status: 'Active',
      payoutDetails: {
        method: 'Bank Transfer',
        bankName: 'Bank Alfalah',
        accountTitle: 'Bilal Khan',
        accountNumber: 'PK00BAFL000000001'
      }
    },
    title: 'Corporate Tax Consultant',
    bio: 'FBR registered tax practitioner helping freelancers and businesses save money and stay compliant.',
    hourlyRate: 5000,
    skills: ['Tax Filing', 'FBR', 'Corporate Law', 'Bookkeeping'],
    rating: 5.0,
    jobsCompleted: 120,
    totalEarned: 4500000
  }
];

const MOCK_EARNINGS = [
  { name: 'Jan', amount: 45000 },
  { name: 'Feb', amount: 52000 },
  { name: 'Mar', amount: 38000 },
  { name: 'Apr', amount: 65000 },
  { name: 'May', amount: 58000 },
  { name: 'Jun', amount: 85000 },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2023-06-15', amount: 25000, type: 'Withdrawal', method: 'JazzCash', status: 'Completed' },
  { id: 't2', date: '2023-06-10', amount: 50000, type: 'Payment', method: 'Bank Transfer', status: 'Completed' },
  { id: 't3', date: '2023-06-01', amount: 15000, type: 'Withdrawal', method: 'EasyPaisa', status: 'Completed' },
];

// --- Components ---

const WalletModal = ({ 
  isOpen, 
  onClose, 
  type, 
  onConfirm,
  platformDetails
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  type: 'Deposit' | 'Withdrawal'; 
  onConfirm: (amount: number, method: string) => void;
  platformDetails: PlatformPaymentDetails;
}) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('JazzCash');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            {type === 'Deposit' ? <Upload className="text-emerald-600"/> : <Download className="text-orange-600"/>}
            {type === 'Deposit' ? 'Add Funds' : 'Withdraw Funds'}
          </h3>
          <button onClick={onClose}><X size={20} className="text-slate-400"/></button>
        </div>
        
        {type === 'Deposit' && (
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-sm">
            <h4 className="font-bold text-slate-700 mb-2">Transfer Funds Here:</h4>
            {method === 'Bank Transfer' ? (
              <>
                 <div className="flex justify-between"><span>Bank:</span> <span className="font-medium">{platformDetails.bankName}</span></div>
                 <div className="flex justify-between"><span>Title:</span> <span className="font-medium">{platformDetails.accountTitle}</span></div>
                 <div className="flex justify-between"><span>Account:</span> <span className="font-medium">{platformDetails.accountNumber}</span></div>
                 <div className="flex justify-between"><span>IBAN:</span> <span className="font-medium text-xs">{platformDetails.iban}</span></div>
              </>
            ) : method === 'EasyPaisa' ? (
               <div className="flex justify-between"><span>EasyPaisa:</span> <span className="font-medium text-lg text-emerald-600">{platformDetails.easyPaisaNumber}</span></div>
            ) : (
               <div className="flex justify-between"><span>JazzCash:</span> <span className="font-medium text-lg text-red-600">{platformDetails.jazzCashNumber}</span></div>
            )}
            <p className="text-xs text-slate-400 mt-2 italic">Funds will appear in your wallet after admin verification (simulated instantly here).</p>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
            <select 
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="JazzCash">JazzCash</option>
              <option value="EasyPaisa">EasyPaisa</option>
              <option value="Bank Transfer">Bank Transfer (Raast)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount (PKR)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          {type === 'Withdrawal' && (
            <div className="bg-orange-50 p-3 rounded text-xs text-orange-800 border border-orange-100">
              Note: A 10% platform fee has already been deducted from your earnings. Withdrawal fees may apply by your bank.
            </div>
          )}

          <Button 
            className="w-full mt-2" 
            onClick={() => {
              if (Number(amount) > 0) {
                onConfirm(Number(amount), method);
                setAmount('');
                onClose();
              } else {
                alert("Please enter a valid amount");
              }
            }}
          >
            Confirm {type}
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Pages ---

const HomePage = ({ setPage, categories, activeAds, jobs }: { setPage: (p: string) => void, categories: string[], activeAds: Advertisement[], jobs: Job[] }) => (
  <div className="space-y-16 pb-12">
    {/* Admin Ads Section */}
    {activeAds.length > 0 && (
      <div className="mx-4 lg:mx-20 mt-6 grid gap-4">
        {activeAds.map(ad => (
          <div key={ad.id} className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
            <Megaphone className="text-amber-600 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-bold text-amber-800">{ad.title}</h4>
              <p className="text-amber-700 text-sm">{ad.content}</p>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Hero */}
    <section className="relative bg-emerald-900 text-white rounded-3xl overflow-hidden mx-4 mt-4 py-20 px-6 lg:px-20 shadow-2xl">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          Find Trusted Pakistani Talent & Jobs
        </h1>
        <p className="text-emerald-100 text-lg mb-8">
          The safest way to hire and work in Pakistan. Verified professionals, local payments, and secure escrow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => setPage('jobs')} className="h-12 text-lg px-8 shadow-lg shadow-emerald-900/50">Find Work</Button>
          <Button onClick={() => setPage('freelancers')} variant="secondary" className="h-12 text-lg px-8">Hire Talent</Button>
        </div>
      </div>
    </section>

    {/* Categories */}
    <section className="px-6 lg:px-20">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Popular Categories</h2>
        <button onClick={() => setPage('jobs')} className="text-emerald-600 font-medium hover:underline">View All</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.slice(0, 10).map((cat) => (
          <div key={cat} onClick={() => setPage('jobs')} className="p-6 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all text-center group">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Briefcase size={20} />
            </div>
            <h3 className="font-medium text-slate-900 text-sm">{cat}</h3>
          </div>
        ))}
      </div>
    </section>

    {/* Featured Jobs */}
    <section className="px-6 lg:px-20 bg-emerald-50/50 py-16 -mx-4 lg:-mx-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Jobs</h2>
            <p className="text-slate-600">Top opportunities for you today</p>
          </div>
          <button onClick={() => setPage('jobs')} className="text-emerald-600 font-medium hover:underline">View All</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.slice(0,3).map(job => (
            <JobCard key={job.id} job={job} onClick={() => setPage('jobs')} />
          ))}
        </div>
      </div>
    </section>
  </div>
);

const JobsPage = ({ onSelectJob, categories, jobs }: { onSelectJob: (job: Job) => void, categories: string[], jobs: Job[] }) => (
  <div className="px-4 lg:px-20 py-8">
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <h1 className="text-2xl font-bold">Browse Jobs</h1>
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search jobs, skills, companies..." 
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>
    </div>
    
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Filters Sidebar */}
      <div className="hidden lg:block space-y-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold mb-3">Categories</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {categories.map(cat => (
              <label key={cat} className="flex items-center gap-2 text-slate-600 cursor-pointer hover:text-emerald-600 text-sm">
                <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" />
                {cat}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Job List */}
      <div className="lg:col-span-3 space-y-4">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} onClick={() => onSelectJob(job)} />
        ))}
      </div>
    </div>
  </div>
);

const JobDetailsPage = ({ 
  job, 
  onBack, 
  user, 
  onApply,
  proposals,
  onHire 
}: { 
  job: Job; 
  onBack: () => void; 
  user: User | null; 
  onApply: (jobId: string, bid: number, cover: string) => void;
  proposals: Proposal[];
  onHire: (proposal: Proposal) => void;
}) => {
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [bidAmount, setBidAmount] = useState(job.budget.toString());
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter proposals for this specific job
  const jobProposals = proposals.filter(p => p.jobId === job.id);
  const hasApplied = user && proposals.some(p => p.freelancerId === user.id && p.jobId === job.id);

  const handleSubmitProposal = () => {
    if (!coverLetter) { alert("Please write a cover letter"); return; }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onApply(job.id, Number(bidAmount), coverLetter);
      alert('Proposal submitted successfully!');
      onBack();
    }, 1000);
  };

  return (
    <div className="px-4 lg:px-20 py-8 max-w-5xl mx-auto">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-emerald-600 mb-6">
        <ChevronLeft size={18} className="mr-1" /> Back to Jobs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${job.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {job.status}
              </span>
            </div>
            
            <div className="border-b border-slate-100 pb-6 mb-6">
               <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{job.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Briefcase size={16} />
                <span>{job.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Client View: Show Proposals */}
          {user && user.id === job.postedBy.id && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Received Proposals ({jobProposals.length})</h2>
              {jobProposals.length === 0 ? (
                <p className="text-slate-500 italic">No proposals yet.</p>
              ) : (
                <div className="space-y-4">
                  {jobProposals.map(p => (
                    <div key={p.id} className="border p-4 rounded-lg hover:border-emerald-300 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-slate-900">{p.freelancerName}</h4>
                          <p className="text-sm text-slate-500">{new Date(p.submittedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-600 block">PKR {p.bidAmount.toLocaleString()}</span>
                          {p.status === 'Pending' && job.status === 'Open' && (
                            <Button 
                              className="mt-2 text-xs py-1 px-3" 
                              onClick={() => {
                                if(confirm("Are you sure you want to hire this freelancer? Funds will be moved to Escrow.")) {
                                  onHire(p);
                                }
                              }}
                            >
                              Hire Now
                            </Button>
                          )}
                          {p.status === 'Accepted' && <Badge color="emerald">Hired</Badge>}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">{p.coverLetter}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Freelancer View: Application Form */}
          {user?.role === UserRole.FREELANCER && job.status === 'Open' && !hasApplied && showProposalForm && (
             <div className="bg-white p-8 rounded-xl border border-emerald-200 shadow-lg ring-1 ring-emerald-100">
               <h3 className="text-xl font-bold mb-6">Submit Your Proposal</h3>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Bid Amount (PKR)</label>
                   <input 
                    type="number" 
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                   />
                   <p className="text-xs text-slate-500 mt-1">GAB Service Fee (10%): PKR {(Number(bidAmount) * 0.1).toLocaleString()}</p>
                   <p className="text-xs font-bold text-emerald-600 mt-0.5">Estimated Earning: PKR {(Number(bidAmount) * 0.9).toLocaleString()}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Cover Letter</label>
                   <textarea 
                    rows={6}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Explain why you are the best fit for this job..."
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                   />
                 </div>
                 <div className="flex gap-4 pt-2">
                   <Button onClick={handleSubmitProposal} isLoading={isSubmitting}>Submit Proposal</Button>
                   <Button variant="ghost" onClick={() => setShowProposalForm(false)}>Cancel</Button>
                 </div>
               </div>
             </div>
          )}
          
          {hasApplied && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-700 text-center font-medium">
              You have already submitted a proposal for this job.
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-1">Project Budget</p>
              <p className="text-2xl font-bold text-slate-900">PKR {job.budget.toLocaleString()}</p>
            </div>
            
            {user?.role === UserRole.FREELANCER ? (
              !hasApplied && !showProposalForm ? (
                <Button onClick={() => setShowProposalForm(true)} className="w-full mb-4">Apply Now</Button>
              ) : null
            ) : null}
            
            {user?.role === UserRole.CLIENT && user.id === job.postedBy.id && (
               <Button variant="secondary" className="w-full mb-4" onClick={() => alert("Edit functionality coming soon!")}>Edit Job Post</Button>
            )}
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Proposals</span>
                <span className="font-medium">{job.applicants}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Status</span>
                <span className={`font-medium ${job.status === 'Open' ? 'text-green-600' : 'text-blue-600'}`}>{job.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkroomPage = ({ onBack, user, onReleaseFunds, job }: { onBack: () => void; user: User; onReleaseFunds: () => void; job?: Job }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! Thanks for hiring me. I'm excited to start.", sender: 'freelancer', time: '10:00 AM' },
    { id: 2, text: "Welcome aboard! Let's get this done.", sender: 'client', time: '10:05 AM' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isFundsReleased, setIsFundsReleased] = useState(job?.status === 'Completed' || job?.status === 'Paid');

  // Update local state if job prop updates
  useEffect(() => {
    setIsFundsReleased(job?.status === 'Completed' || job?.status === 'Paid');
  }, [job]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { id: Date.now(), text: inputText, sender: user.role === UserRole.CLIENT ? 'client' : 'freelancer', time: 'Just now' }]);
    setInputText('');
  };

  const handleReleaseClick = () => {
    if (confirm(`Are you sure you want to release funds for ${job?.title}? This action cannot be undone.`)) {
      onReleaseFunds();
      setMessages([...messages, { 
        id: Date.now(), 
        text: "PAYMENT RELEASED: The client has approved the work and released funds from escrow.", 
        sender: 'system', 
        time: 'Just now' 
      }]);
    }
  }

  if (!job) return <div className="p-8 text-center">Job context missing. <button onClick={onBack} className="text-blue-600 underline">Go Back</button></div>;

  return (
    <div className="h-[calc(100vh-80px)] max-w-7xl mx-auto px-4 lg:px-8 py-4 flex gap-6">
      <div className="w-1/3 bg-white border border-slate-200 rounded-xl hidden md:flex flex-col">
        <div className="p-4 border-b border-slate-100 font-bold text-lg">Contract Details</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500">
            <h4 className="font-medium text-slate-900">{job.title}</h4>
            <p className="text-xs text-slate-500 mt-1">Client: {job.postedBy.name}</p>
            <div className="mt-2 text-sm font-bold text-emerald-700">PKR {job.budget.toLocaleString()}</div>
          </div>
          <div className="text-xs text-slate-500 px-2">
             Status: <span className="font-bold uppercase text-slate-700">{job.status}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
           <div>
             <h3 className="font-bold truncate max-w-xs sm:max-w-md">{job.title}</h3>
             <span className="text-xs text-emerald-600 flex items-center gap-1">
                <ShieldCheck size={12}/> {isFundsReleased ? 'Funds Released' : 'Escrow Funded'}
             </span>
           </div>
           <div className="flex items-center gap-2">
             {user.role === UserRole.CLIENT && !isFundsReleased && job.status === 'In Progress' && (
               <Button onClick={handleReleaseClick} className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700">Release Payment</Button>
             )}
             <Button variant="outline" className="text-xs px-2 py-1 h-8" onClick={onBack}>Exit Workroom</Button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'system' ? 'justify-center' : (msg.sender === (user.role === UserRole.CLIENT ? 'client' : 'freelancer') ? 'justify-end' : 'justify-start')}`}>
              {msg.sender === 'system' ? (
                <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-xs font-bold border border-emerald-200">
                  {msg.text}
                </div>
              ) : (
                <div className={`max-w-[70%] rounded-xl p-3 ${msg.sender === (user.role === UserRole.CLIENT ? 'client' : 'freelancer') ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-slate-200 rounded-bl-none'}`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${msg.sender === (user.role === UserRole.CLIENT ? 'client' : 'freelancer') ? 'text-emerald-100' : 'text-slate-400'}`}>{msg.time}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 border border-slate-300 rounded-lg px-4 focus:outline-none focus:border-emerald-500"
            />
            <button onClick={handleSend} className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700"><Send size={20}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FreelancersPage = ({ freelancers, onViewProfile }: { freelancers: FreelancerProfile[], onViewProfile: (p: FreelancerProfile) => void }) => (
  <div className="px-4 lg:px-20 py-8">
     <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <h1 className="text-2xl font-bold">Hire Top Talent</h1>
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search freelancers by skill..." 
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {freelancers.filter(f => f.user.status === 'Active').map(profile => (
        <FreelancerCard 
          key={profile.id} 
          profile={profile} 
          onViewProfile={() => onViewProfile(profile)}
        />
      ))}
    </div>
  </div>
);

const PublicProfilePage = ({ profile, onBack }: { profile: FreelancerProfile, onBack: () => void }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
       <button onClick={onBack} className="flex items-center text-slate-500 hover:text-emerald-600 mb-6">
        <ChevronLeft size={18} className="mr-1" /> Back to Freelancers
      </button>
       <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start border-b border-slate-100 pb-8 mb-8">
             <img src={profile.user.avatar} className="w-32 h-32 rounded-full border-4 border-slate-50 shadow-sm" alt="Profile" />
             <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{profile.user.name}</h1>
                    <p className="text-emerald-600 font-medium text-lg">{profile.title}</p>
                  </div>
                  {profile.user.verified && <VerificationBadge />}
                </div>
                
                <div className="flex gap-4 mt-4 text-sm text-slate-500">
                   <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500" fill="currentColor"/>
                      <span className="font-bold text-slate-900">{profile.rating}</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <Briefcase size={16} />
                      <span>{profile.jobsCompleted} Jobs Completed</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>PKR {profile.hourlyRate}/hr</span>
                   </div>
                </div>
             </div>
             <div>
                <Button className="w-full md:w-auto">Hire Now</Button>
             </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
             <div className="md:col-span-2 space-y-6">
                <section>
                   <h3 className="font-bold text-lg mb-3">About</h3>
                   <p className="text-slate-600 leading-relaxed">{profile.bio}</p>
                </section>
                <section>
                   <h3 className="font-bold text-lg mb-3">Skills</h3>
                   <div className="flex flex-wrap gap-2">
                      {profile.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                           {skill}
                        </span>
                      ))}
                   </div>
                </section>
             </div>
             <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <h4 className="font-bold mb-2 text-sm text-slate-500 uppercase">Total Earned</h4>
                   <p className="text-xl font-bold text-emerald-600">PKR {profile.totalEarned.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <h4 className="font-bold mb-2 text-sm text-slate-500 uppercase">Verification</h4>
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                         <CheckCircle2 size={16} className="text-emerald-500"/> Email Verified
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                         <CheckCircle2 size={16} className="text-emerald-500"/> NADRA ID Verified
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                         <CheckCircle2 size={16} className="text-emerald-500"/> Payment Verified
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}

const PostJobPage = ({ onPost, categories, user }: { onPost: (job: Job) => void, categories: string[], user: User }) => {
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [budget, setBudget] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!title || !skills) {
      alert("Please enter a title and required skills first.");
      return;
    }
    setIsGenerating(true);
    const desc = await generateJobDescription(title, skills);
    setDescription(desc);
    setIsGenerating(false);
  };

  const handlePost = () => {
    if (!title || !description || !budget) {
       alert("Please fill all fields");
       return;
    }
    
    const newJob: Job = {
      id: Date.now().toString(),
      title,
      description,
      budget: Number(budget),
      currency: 'PKR',
      postedBy: user,
      postedAt: new Date().toISOString(),
      category,
      type: 'Fixed Price',
      applicants: 0,
      status: 'Open'
    };
    onPost(newJob);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="e.g. Tax Filing Assistant"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Required Skills</label>
            <input 
              type="text" 
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="e.g. FBR, Tax Law"
            />
          </div>
        </div>
        
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Budget (PKR)</label>
           <input 
             type="number" 
             value={budget}
             onChange={(e) => setBudget(e.target.value)}
             className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
             placeholder="15000"
           />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
            >
              {isGenerating ? 'Thinking...' : '✨ Generate with AI'}
            </button>
          </div>
          <textarea 
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans"
            placeholder="Describe the project details..."
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={handlePost} className="w-full">Post Job Now</Button>
        </div>

      </div>
    </div>
  );
};

const ProfilePage = ({ user, onSave, onBack }: { user: User, onSave: (u: User) => void, onBack: () => void }) => {
  const [formData, setFormData] = useState(user);
  
  const handleSave = () => {
    onSave(formData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-emerald-600 mb-6">
        <ChevronLeft size={18} className="mr-1" /> Back to Dashboard
      </button>
      
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <UserCircle size={24} className="text-emerald-600"/> Edit Profile
        </h1>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email (Read Only)</label>
              <input 
                value={formData.email} 
                disabled
                className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
              />
            </div>
          </div>

          {user.role === UserRole.FREELANCER && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Professional Title</label>
                <input 
                  value={formData.title || ''} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  placeholder="e.g. Senior React Developer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                <textarea 
                  rows={4}
                  value={formData.bio || ''} 
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  placeholder="Tell clients about yourself..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate (PKR)</label>
                  <input 
                    type="number"
                    value={formData.hourlyRate || ''} 
                    onChange={e => setFormData({...formData, hourlyRate: Number(e.target.value)})}
                    className="w-full p-3 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Skills (Comma separated)</label>
                  <input 
                    value={formData.skills?.join(', ') || ''} 
                    onChange={e => setFormData({...formData, skills: e.target.value.split(',').map(s => s.trim())})}
                    className="w-full p-3 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </>
          )}

          <div className="pt-4 flex gap-4">
            <Button onClick={handleSave} className="px-8"><Save size={18}/> Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = ({ 
  user, 
  onEnterWorkroom, 
  activeAds, 
  transactions,
  onDeposit,
  onWithdraw,
  jobs,
  proposals
}: { 
  user: User; 
  onEnterWorkroom: (job: Job) => void, 
  activeAds: Advertisement[], 
  transactions: Transaction[],
  onDeposit: () => void,
  onWithdraw: () => void,
  jobs: Job[],
  proposals: Proposal[]
}) => (
  <div className="px-4 lg:px-20 py-8 min-h-screen">
    
    {/* Advertisements for Revenue */}
    {activeAds.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {activeAds.map(ad => (
          <div key={ad.id} className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] bg-orange-200 text-orange-800 px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">Ad</span>
              <h4 className="font-bold text-slate-800 mt-1">{ad.title}</h4>
              <p className="text-sm text-slate-600">{ad.content}</p>
            </div>
            <Megaphone className="text-orange-400 opacity-50" size={32} />
          </div>
        ))}
      </div>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Sidebar Info */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
          <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-emerald-50" />
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-slate-500 mb-2">{user.role === 'CLIENT' ? 'Client Account' : 'Top Rated Freelancer'}</p>
          {user.verified && <div className="flex justify-center mb-4"><VerificationBadge /></div>}
          
          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Available Balance</p>
            <div className="flex items-center justify-center gap-2 mb-2">
               <p className="text-2xl font-bold text-emerald-600">PKR {user.balance.toLocaleString()}</p>
            </div>
            
            {user.role === UserRole.CLIENT ? (
              <Button onClick={onDeposit} className="w-full text-sm bg-slate-900 hover:bg-slate-800">
                <Upload size={14} /> Add Funds
              </Button>
            ) : (
              <Button onClick={onWithdraw} className="w-full text-sm">
                <Download size={14} /> Withdraw Funds
              </Button>
            )}
          </div>
        </div>

        {/* Commission Transparency (Only for Freelancers and Admin) */}
        {(user.role === UserRole.FREELANCER || user.role === UserRole.ADMIN) && (
          <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm bg-blue-50/50">
            <h3 className="font-bold mb-2 flex items-center gap-2 text-blue-900">
              <FileSignature size={18} /> Service Fee
            </h3>
            <div className="flex justify-between items-center">
               <span className="text-slate-600 text-sm">Commission Rate</span>
               <span className="font-bold text-blue-700">10%</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              A flat 10% service fee is deducted from all earnings upon withdrawal. This covers platform maintenance, escrow security, and support.
            </p>
          </div>
        )}

        {/* Local Payouts Status */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <CreditCard size={18} /> {user.role === UserRole.CLIENT ? 'Payment Methods' : 'Payout Methods'}
          </h3>
          <div className="space-y-3">
            {user.payoutDetails ? (
               <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium">{user.payoutDetails.method}</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No payout methods added.</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Active Contracts / Workroom CTA */}
        <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm ring-1 ring-emerald-50">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Briefcase size={18} className="text-emerald-600"/> Active Contracts</h3>
          {jobs.filter(j => j.status === 'In Progress' && (j.postedBy.id === user.id || j.assignedTo === user.id)).map(job => (
            <div key={job.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 mb-2">
              <div>
                <h4 className="font-medium text-slate-900">{job.title}</h4>
                <p className="text-sm text-slate-500">Status: {job.status}</p>
              </div>
              <Button variant="primary" className="text-sm py-1" onClick={() => onEnterWorkroom(job)}>Enter Workroom</Button>
            </div>
          ))}
          {jobs.filter(j => j.status === 'In Progress' && (j.postedBy.id === user.id || j.assignedTo === user.id)).length === 0 && (
            <p className="text-slate-500 text-sm italic">No active contracts found. Start hiring or applying!</p>
          )}
        </div>

        {/* My Proposals Section (Freelancer Only) */}
        {user.role === UserRole.FREELANCER && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2"><FileText size={18} /> My Proposals</h3>
            <div className="space-y-2">
              {proposals.filter(p => p.freelancerId === user.id).map(p => {
                const job = jobs.find(j => j.id === p.jobId);
                return (
                  <div key={p.id} className="flex justify-between items-center p-3 border-b border-slate-50 last:border-0">
                    <div>
                      <div className="font-medium text-sm text-slate-900">{job?.title || 'Unknown Job'}</div>
                      <div className="text-xs text-slate-500">Bid: PKR {p.bidAmount}</div>
                    </div>
                    <Badge color={p.status === 'Accepted' ? 'emerald' : 'slate'}>{p.status}</Badge>
                  </div>
                );
              })}
              {proposals.filter(p => p.freelancerId === user.id).length === 0 && (
                <p className="text-sm text-slate-500 italic">No proposals submitted yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Earnings Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold">Earnings Overview</h3>
             <select className="text-xs border border-slate-300 rounded p-1">
               <option>Last 6 Months</option>
               <option>This Year</option>
             </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_EARNINGS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => [`PKR ${value.toLocaleString()}`, 'Amount']}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.map(tx => (
              <div key={tx.id} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${tx.type === 'Withdrawal' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {tx.type === 'Withdrawal' ? <LogOut size={16} /> : <TrendingUp size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{tx.type} via {tx.method}</p>
                    <p className="text-xs text-slate-400">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === 'Withdrawal' ? 'text-slate-900' : 'text-emerald-600'}`}>
                    {tx.type === 'Withdrawal' ? '-' : '+'} PKR {tx.amount.toLocaleString()}
                  </p>
                  <span className="text-xs text-slate-400">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  </div>
);

const AdminPage = ({ 
  categories, 
  onAddCategory, 
  onDeleteCategory,
  freelancers,
  onToggleFreelancerStatus,
  ads,
  onAddAd,
  onDeleteAd,
  onToggleTheme,
  isDarkTheme,
  jobs,
  platformPayment,
  onUpdatePlatformPayment,
  onMarkJobPaid
}: any) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'finance' | 'reports'>('overview');
  const [newCat, setNewCat] = useState('');
  const [adTitle, setAdTitle] = useState('');
  const [adContent, setAdContent] = useState('');

  // Finance Form State
  const [paymentForm, setPaymentForm] = useState<PlatformPaymentDetails>(platformPayment);

  const handleUpdatePayment = () => {
    onUpdatePlatformPayment(paymentForm);
    alert('Platform payment details updated successfully.');
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 text-white rounded-lg">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-slate-500">Secure Panel • Logged in as Ansar</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Site Theme:</span>
            <button 
              onClick={onToggleTheme}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-all ${isDarkTheme ? 'bg-slate-800 text-white border-slate-700' : 'bg-white text-slate-700 border-slate-300'}`}
            >
              <Palette size={16} /> {isDarkTheme ? 'Dark Mode' : 'Light Mode'}
            </button>
        </div>
      </div>
      
      {/* Admin Nav Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'overview' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <LayoutDashboard size={16}/> Overview & Users
        </button>
        <button 
          onClick={() => setActiveTab('reports')} 
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'reports' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <BarChart2 size={16}/> Reports & Workflows
        </button>
        <button 
          onClick={() => setActiveTab('finance')} 
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'finance' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <Building size={16}/> Finance Settings
        </button>
      </div>

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Category Management */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Manage Job Categories</h2>
            <div className="flex gap-4 mb-6">
              <input 
                value={newCat} 
                onChange={(e) => setNewCat(e.target.value)} 
                placeholder="Enter new category name..."
                className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <Button onClick={() => { if(newCat) { onAddCategory(newCat); setNewCat(''); } }}>
                <PlusCircle size={18} /> Add Category
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat: string) => (
                <div key={cat} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-slate-50 rounded-full border border-slate-100 text-sm">
                  <span className="font-medium text-slate-700">{cat}</span>
                  <button onClick={() => onDeleteCategory(cat)} className="text-slate-400 hover:text-red-500 p-1"><X size={14}/></button>
                </div>
              ))}
            </div>
          </div>

          {/* Ad Management */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Megaphone size={20} className="text-orange-500"/> Manage Advertisements
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input 
                value={adTitle} 
                onChange={(e) => setAdTitle(e.target.value)} 
                placeholder="Ad Title (e.g. Premium VPN)"
                className="p-3 border border-slate-300 rounded-lg"
              />
              <input 
                value={adContent} 
                onChange={(e) => setAdContent(e.target.value)} 
                placeholder="Ad Content text..."
                className="p-3 border border-slate-300 rounded-lg"
              />
            </div>
            <div className="mb-6 text-right">
              <Button onClick={() => { 
                if(adTitle && adContent) { 
                  onAddAd({id: Date.now().toString(), title: adTitle, content: adContent, isActive: true}); 
                  setAdTitle(''); setAdContent('');
                } 
              }}>Publish Ad</Button>
            </div>
            
            <div className="space-y-3">
              {ads.length === 0 && <p className="text-slate-400 text-sm italic">No active advertisements.</p>}
              {ads.map((ad: Advertisement) => (
                <div key={ad.id} className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <div>
                    <h4 className="font-bold text-orange-900">{ad.title}</h4>
                    <p className="text-sm text-orange-800">{ad.content}</p>
                  </div>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => onDeleteAd(ad.id)}>
                    <Trash2 size={16} /> Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Freelancer Management */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users size={20} className="text-blue-500"/> Freelancer Accounts
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-medium text-slate-500">Name</th>
                    <th className="p-3 font-medium text-slate-500">Earnings</th>
                    <th className="p-3 font-medium text-slate-500">Payment Details</th>
                    <th className="p-3 font-medium text-slate-500">Status</th>
                    <th className="p-3 font-medium text-slate-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {freelancers.map((f: FreelancerProfile) => (
                    <tr key={f.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="p-3 font-medium">{f.user.name}</td>
                      <td className="p-3">PKR {f.totalEarned.toLocaleString()}</td>
                      <td className="p-3">
                        {f.user.payoutDetails ? (
                          <div className="text-xs">
                             <div className="font-bold text-slate-700">{f.user.payoutDetails.method}</div>
                             <div>{f.user.payoutDetails.accountNumber}</div>
                             <div className="text-slate-400">{f.user.payoutDetails.accountTitle}</div>
                          </div>
                        ) : <span className="text-red-500 text-xs">Missing</span>}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${f.user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {f.user.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {f.user.status === 'Active' ? (
                          <button onClick={() => onToggleFreelancerStatus(f.id, 'Banned')} className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs font-medium border border-red-200">
                            <Ban size={12} className="inline mr-1" /> Ban Account
                          </button>
                        ) : (
                          <button onClick={() => onToggleFreelancerStatus(f.id, 'Active')} className="text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded text-xs font-medium border border-emerald-200">
                            <CheckCircle2 size={12} className="inline mr-1" /> Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- REPORTS TAB --- */}
      {activeTab === 'reports' && (
        <div className="space-y-8">
          
          {/* Work In Process */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-2 mb-4">
                <Clock className="text-blue-500" size={20} />
                <h2 className="text-lg font-bold">Work In Process (Active Jobs)</h2>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-3 font-medium">Job Title</th>
                      <th className="p-3 font-medium">Client</th>
                      <th className="p-3 font-medium">Assigned Freelancer</th>
                      <th className="p-3 font-medium">Budget</th>
                      <th className="p-3 font-medium">Escrow Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.filter((j: Job) => j.status === 'In Progress').map((j: Job) => (
                      <tr key={j.id} className="border-b border-slate-100">
                        <td className="p-3 font-medium">{j.title}</td>
                        <td className="p-3">{j.postedBy.name}</td>
                        <td className="p-3">
                           {freelancers.find((f: FreelancerProfile) => f.id === j.assignedTo)?.user.name || 'Unknown'}
                        </td>
                        <td className="p-3">PKR {j.budget.toLocaleString()}</td>
                        <td className="p-3"><Badge color="blue">Funds Locked</Badge></td>
                      </tr>
                    ))}
                    {jobs.filter((j: Job) => j.status === 'In Progress').length === 0 && (
                      <tr><td colSpan={5} className="p-4 text-center text-slate-500 italic">No active jobs right now.</td></tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>

          {/* Work Done / Completed */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-emerald-500" size={20} />
                <h2 className="text-lg font-bold">Work Done (Pending Payout)</h2>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-3 font-medium">Job Title</th>
                      <th className="p-3 font-medium">Freelancer</th>
                      <th className="p-3 font-medium">Freelancer Payout Details</th>
                      <th className="p-3 font-medium">Amount Due (90%)</th>
                      <th className="p-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.filter((j: Job) => j.status === 'Completed').map((j: Job) => {
                       const f = freelancers.find((p: FreelancerProfile) => p.id === j.assignedTo);
                       return (
                        <tr key={j.id} className="border-b border-slate-100">
                          <td className="p-3 font-medium">{j.title}</td>
                          <td className="p-3">{f?.user.name}</td>
                          <td className="p-3 text-xs">
                             {f?.user.payoutDetails ? (
                               <>
                                 <span className="font-bold">{f.user.payoutDetails.method}</span><br/>
                                 {f.user.payoutDetails.accountNumber}
                               </>
                             ) : 'N/A'}
                          </td>
                          <td className="p-3 font-bold text-emerald-600">PKR {(j.budget * 0.9).toLocaleString()}</td>
                          <td className="p-3 text-right">
                             <Button className="text-xs px-2 py-1" onClick={() => onMarkJobPaid(j.id)}>
                               Release Payment
                             </Button>
                          </td>
                        </tr>
                       )
                    })}
                    {jobs.filter((j: Job) => j.status === 'Completed').length === 0 && (
                      <tr><td colSpan={5} className="p-4 text-center text-slate-500 italic">No pending payouts.</td></tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>

          {/* Category Analysis */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h2 className="text-lg font-bold mb-4">Job Distribution by Category</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat: string) => {
                   const count = jobs.filter((j: Job) => j.category === cat).length;
                   if (count === 0) return null;
                   return (
                     <div key={cat} className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                        <div className="text-2xl font-bold text-slate-900">{count}</div>
                        <div className="text-xs text-slate-500">{cat}</div>
                     </div>
                   )
                })}
             </div>
          </div>
        </div>
      )}

      {/* --- FINANCE TAB --- */}
      {activeTab === 'finance' && (
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
               <CreditCard size={20} className="text-slate-600"/> Platform Finance Settings
            </h2>
            <p className="text-sm text-slate-500 mb-6">These details will be shown to Clients when they request to deposit funds.</p>
            
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
                  <input 
                    type="text" 
                    value={paymentForm.bankName}
                    onChange={e => setPaymentForm({...paymentForm, bankName: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Account Title</label>
                    <input 
                      type="text" 
                      value={paymentForm.accountTitle}
                      onChange={e => setPaymentForm({...paymentForm, accountTitle: e.target.value})}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                    <input 
                      type="text" 
                      value={paymentForm.accountNumber}
                      onChange={e => setPaymentForm({...paymentForm, accountNumber: e.target.value})}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">IBAN</label>
                  <input 
                    type="text" 
                    value={paymentForm.iban}
                    onChange={e => setPaymentForm({...paymentForm, iban: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">EasyPaisa Number</label>
                    <input 
                      type="text" 
                      value={paymentForm.easyPaisaNumber}
                      onChange={e => setPaymentForm({...paymentForm, easyPaisaNumber: e.target.value})}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">JazzCash Number</label>
                    <input 
                      type="text" 
                      value={paymentForm.jazzCashNumber}
                      onChange={e => setPaymentForm({...paymentForm, jazzCashNumber: e.target.value})}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
               </div>

               <div className="pt-4">
                 <Button onClick={handleUpdatePayment}>Save Finance Details</Button>
               </div>
            </div>
         </div>
      )}

    </div>
  )
}

// --- Main App Component ---

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedFreelancer, setSelectedFreelancer] = useState<FreelancerProfile | null>(null);
  
  // Data State - Persistence - Uses 'v2' keys to invalidate old cache
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('gab_users_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('gab_jobs_v2');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });
  const [proposals, setProposals] = useState<Proposal[]>(() => {
    const saved = localStorage.getItem('gab_proposals_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('gab_transactions_v2');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  
  // Derived State
  const freelancers: FreelancerProfile[] = users.length > 0 
    ? users.filter(u => u.role === UserRole.FREELANCER).map(u => ({
        id: u.id,
        user: u,
        title: u.title || '',
        bio: u.bio || '',
        hourlyRate: u.hourlyRate || 0,
        skills: u.skills || [],
        rating: u.rating || 0,
        jobsCompleted: u.jobsCompleted || 0,
        totalEarned: 0
      }))
    : INITIAL_FREELANCERS;

  const [activeWorkroomJob, setActiveWorkroomJob] = useState<Job | undefined>(undefined);
  const [activeAds, setActiveAds] = useState<Advertisement[]>([]);
  
  // UI State
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalType, setWalletModalType] = useState<'Deposit' | 'Withdrawal'>('Deposit');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [platformPaymentDetails, setPlatformPaymentDetails] = useState(INITIAL_PLATFORM_PAYMENT);
  const [registerMode, setRegisterMode] = useState(false);

  // New States for Admin features
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  // Compliance Form Data
  const [complianceAgreements, setComplianceAgreements] = useState({
    commission: false,
    legal: false
  });
  const [payoutForm, setPayoutForm] = useState<PayoutDetails>({
    method: 'Bank Transfer',
    bankName: '',
    accountTitle: '',
    accountNumber: ''
  });

  // Persistence Effects - using v2 keys
  useEffect(() => { localStorage.setItem('gab_users_v2', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('gab_jobs_v2', JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem('gab_proposals_v2', JSON.stringify(proposals)); }, [proposals]);
  useEffect(() => { localStorage.setItem('gab_transactions_v2', JSON.stringify(transactions)); }, [transactions]);

  // Load active user session on mount
  useEffect(() => {
    // Note: Changed key to 'gab_session_v2' to invalidate old session
    const savedUser = localStorage.getItem('gab_session_v2');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Try to find the user in the latest users list, fallback to parsedUser
      const freshUser = users.find(u => u.id === parsedUser.id) || parsedUser;
      setUser(freshUser);
    } else {
      // Clear old session just in case
      localStorage.removeItem('gab_active_user'); 
    }
  }, []); 

  // Sync user state to local storage for persistence
  useEffect(() => {
    if (user) {
      localStorage.setItem('gab_session_v2', JSON.stringify(user));
    } else {
      localStorage.removeItem('gab_session_v2');
    }
  }, [user]);

  // --- Handlers ---
  const handleLogin = (u: User) => {
    setUser(u);
    setCurrentPage('dashboard'); 
  };

  const handleRegisterComplete = (newUser: User) => {
    setUsers([...users, newUser]);
    setUser(newUser);
    setCurrentPage('dashboard');
    setRegisterMode(false);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setUser(updatedUser);
  };

  const handlePostJob = (newJob: Job) => {
    setJobs([newJob, ...jobs]);
    setCurrentPage('jobs');
  };

  const handleApplyJob = (jobId: string, bid: number, cover: string) => {
    if (!user) return;
    const newProposal: Proposal = {
      id: Date.now().toString(),
      jobId,
      freelancerId: user.id,
      freelancerName: user.name,
      coverLetter: cover,
      bidAmount: bid,
      submittedAt: new Date().toISOString(),
      status: 'Pending'
    };
    setProposals([...proposals, newProposal]);
    setJobs(jobs.map(j => j.id === jobId ? { ...j, applicants: j.applicants + 1 } : j));
  };

  const handleHire = (proposal: Proposal) => {
    const job = jobs.find(j => j.id === proposal.jobId);
    if (!job || !user) return;

    if (user.balance < proposal.bidAmount) {
      alert("Insufficient balance. Please deposit funds first.");
      setIsWalletModalOpen(true);
      setWalletModalType('Deposit');
      return;
    }

    const updatedClient = { ...user, balance: user.balance - proposal.bidAmount };
    setUsers(users.map(u => u.id === user.id ? updatedClient : u));
    setUser(updatedClient);
    
    setJobs(jobs.map(j => j.id === job.id ? { 
      ...j, 
      status: 'In Progress', 
      assignedTo: proposal.freelancerId,
      budget: proposal.bidAmount
    } : j));

    setProposals(proposals.map(p => p.id === proposal.id ? { ...p, status: 'Accepted' } : p));

    alert("Hired successfully! Funds moved to Escrow.");
    setCurrentPage('dashboard');
  };

  const handleWalletAction = (amount: number, method: string) => {
    if (!user) return;
    let newBalance = user.balance;
    if (walletModalType === 'Deposit') {
      newBalance += amount;
    } else {
      if (user.balance < amount) { alert("Insufficient balance."); return; }
      newBalance -= amount;
    }
    
    const updatedUser = { ...user, balance: newBalance };
    setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    setUser(updatedUser);

    const newTx: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      amount,
      type: walletModalType,
      method: method as any,
      status: 'Completed'
    };
    setTransactions([newTx, ...transactions]);
    setIsWalletModalOpen(false);
  };

  const handleReleaseFunds = () => {
    if (!activeWorkroomJob) return;
    setJobs(jobs.map(j => j.id === activeWorkroomJob.id ? { ...j, status: 'Completed' } : j));
    setActiveWorkroomJob({ ...activeWorkroomJob, status: 'Completed' });
  };
  
  const handleMarkJobPaid = (jobId: string) => {
     if(confirm("Are you sure you have transferred the money? This will mark the job as Paid and remove it from the pending queue.")) {
       setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'Paid' } : j));
     }
  };

  const handleLogout = () => {
    if(confirm("Are you sure you want to logout?")) {
      setUser(null);
      setCurrentPage('home');
      // Clearing the specific session key
      localStorage.removeItem('gab_session_v2');
    }
  };

  const handleAdminLogin = () => {
    if (adminUsername === 'Ansar' && adminPassword === 'Anudada@007') {
      setUser({ 
        id: 'admin',
        name: 'Admin (Ansar)',
        email: 'admin@gab.com',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=000&color=fff',
        role: UserRole.ADMIN,
        verified: true,
        balance: 0,
        status: 'Active'
      });
      setIsAdminLoginOpen(false);
      setCurrentPage('admin');
      setAdminUsername('');
      setAdminPassword('');
    } else {
      alert("Invalid Admin Credentials");
    }
  };
  
  const handleAcceptCompliance = () => {
    if (complianceAgreements.commission && complianceAgreements.legal) {
      if (!payoutForm.accountNumber || !payoutForm.accountTitle) {
        alert("Please complete your payout details so we can send you money.");
        return;
      }
      
      if(user) {
        const updatedUser = { 
          ...user, 
          role: UserRole.FREELANCER, 
          agreedToTerms: true,
          payoutDetails: payoutForm
        };
        setUsers(users.map(u => u.id === user.id ? updatedUser : u));
        setUser(updatedUser);
      }
      setIsComplianceModalOpen(false);
    } else {
      alert("You must accept all terms to proceed.");
    }
  };
  
  const toggleRole = () => {
    if (!user) return;
    if (user.role === UserRole.CLIENT) {
      if (!user.agreedToTerms) {
        setIsComplianceModalOpen(true);
      } else {
        const updatedUser = { ...user, role: UserRole.FREELANCER };
        setUsers(users.map(u => u.id === user.id ? updatedUser : u));
        setUser(updatedUser);
      }
    } else if (user.role === UserRole.FREELANCER) {
      const updatedUser = { ...user, role: UserRole.CLIENT };
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      setUser(updatedUser);
    } else if (user.role === UserRole.ADMIN) {
      setUser({ ...user, role: UserRole.CLIENT });
    }
  };
  
  const handleToggleFreelancerStatus = (id: string, status: 'Active' | 'Banned') => {
    setUsers(users.map(u => u.id === id ? { ...u, status } : u));
  };


  // Auth Guard Helper
  const ProtectedRoute = (component: React.ReactNode) => {
    if (!user) {
      setRegisterMode(false);
      return <AuthPage onLogin={handleLogin} onRegister={() => setRegisterMode(true)} users={users} />;
    }
    return component;
  };
  
  const navItems = [
    { id: 'jobs', label: 'Find Work' },
    { id: 'freelancers', label: 'Hire Talent' },
    { id: 'dashboard', label: 'Dashboard' },
  ];

  const renderPage = () => {
    if (currentPage === 'auth') {
       return registerMode ? (
          <RegisterPage onRegisterComplete={handleRegisterComplete} onBack={() => { setRegisterMode(false); }} />
       ) : (
          <AuthPage onLogin={handleLogin} onRegister={() => setRegisterMode(true)} users={users} />
       );
    }

    switch(currentPage) {
      case 'home': return <HomePage setPage={setCurrentPage} categories={categories} activeAds={activeAds} jobs={jobs} />;
      case 'jobs': return <JobsPage onSelectJob={(job) => { setSelectedJob(job); setCurrentPage('job-details'); }} categories={categories} jobs={jobs} />;
      case 'job-details': return selectedJob ? (
        <JobDetailsPage 
          job={selectedJob} 
          user={user} 
          onBack={() => setCurrentPage('jobs')} 
          onApply={handleApplyJob} 
          proposals={proposals.filter(p => p.jobId === selectedJob.id)}
          onHire={handleHire}
        />
      ) : null;
      case 'freelancers': return (
        <FreelancersPage 
          freelancers={freelancers} 
          onViewProfile={(profile) => {
            setSelectedFreelancer(profile);
            setCurrentPage('public-profile');
          }}
        />
      );
      case 'public-profile': return selectedFreelancer ? (
        <PublicProfilePage 
          profile={selectedFreelancer} 
          onBack={() => setCurrentPage('freelancers')} 
        />
      ) : null;
      case 'dashboard': return ProtectedRoute(
        <DashboardPage 
          user={user!} // ProtectedRoute ensures user is not null
          onEnterWorkroom={(job) => { setActiveWorkroomJob(job); setCurrentPage('workroom'); }} 
          activeAds={activeAds} 
          transactions={transactions}
          onDeposit={() => { setWalletModalType('Deposit'); setIsWalletModalOpen(true); }}
          onWithdraw={() => { setWalletModalType('Withdrawal'); setIsWalletModalOpen(true); }}
          jobs={jobs}
          proposals={proposals}
        />
      );
      case 'profile': return user ? <ProfilePage user={user} onSave={handleUpdateProfile} onBack={() => setCurrentPage('dashboard')} /> : ProtectedRoute(null);
      case 'post-job': return user ? <PostJobPage onPost={handlePostJob} categories={INITIAL_CATEGORIES} user={user} /> : ProtectedRoute(null);
      case 'workroom': return user ? <WorkroomPage onBack={() => setCurrentPage('dashboard')} user={user} onReleaseFunds={handleReleaseFunds} job={activeWorkroomJob} /> : ProtectedRoute(null);
      case 'admin': 
        return user?.role === UserRole.ADMIN ? (
          <AdminPage 
            categories={categories} 
            onAddCategory={(c: string) => setCategories([...categories, c])} 
            onDeleteCategory={(c: string) => setCategories(categories.filter(cat => cat !== c))}
            freelancers={freelancers}
            onToggleFreelancerStatus={handleToggleFreelancerStatus}
            ads={activeAds}
            onAddAd={(ad: Advertisement) => setActiveAds([...activeAds, ad])}
            onDeleteAd={(id: string) => setActiveAds(activeAds.filter(a => a.id !== id))}
            onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
            isDarkTheme={isDarkTheme}
            jobs={jobs}
            platformPayment={platformPaymentDetails}
            onUpdatePlatformPayment={setPlatformPaymentDetails}
            onMarkJobPaid={handleMarkJobPaid}
          />
        ) : <HomePage setPage={setCurrentPage} categories={categories} activeAds={activeAds} jobs={jobs} />;
      
      // ... (Content pages can remain static as they are informational)
      default: return <HomePage setPage={setCurrentPage} categories={categories} activeAds={activeAds} jobs={jobs} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans ${isDarkTheme ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
        type={walletModalType} 
        onConfirm={handleWalletAction}
        platformDetails={platformPaymentDetails}
      />

       {/* Admin Login Modal */}
      {isAdminLoginOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsAdminLoginOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24}/></button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Admin Access</h2>
              <p className="text-sm text-slate-500">Secure Restricted Area</p>
            </div>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Username" 
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg text-slate-900"
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg text-slate-900"
              />
              <Button onClick={handleAdminLogin} className="w-full py-3">Login</Button>
            </div>
          </div>
        </div>
      )}

      {/* Freelancer Compliance Modal */}
      {isComplianceModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl w-full max-w-xl shadow-2xl overflow-y-auto max-h-[90vh]">
             <div className="flex items-center gap-3 mb-6 text-emerald-700">
               <FileSignature size={32} />
               <h2 className="text-2xl font-bold text-slate-900">Freelancer Registration</h2>
             </div>
             
             <div className="space-y-6 text-slate-700">
               {/* 1. Legal Terms */}
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                 <h3 className="font-bold text-slate-900 mb-2">1. Terms & Standards</h3>
                 <ul className="text-sm list-disc pl-5 space-y-1 text-slate-600 mb-3">
                   <li>I accept the <strong>10% Platform Commission Fee</strong>.</li>
                   <li>I agree to complete tasks honestly and respect client confidentiality.</li>
                   <li>I understand that violations result in an immediate ban.</li>
                 </ul>
                 <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-emerald-600" checked={complianceAgreements.commission} onChange={(e) => setComplianceAgreements(prev => ({...prev, commission: e.target.checked}))} />
                      <span className="text-sm font-medium">I accept the 10% fee.</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-emerald-600" checked={complianceAgreements.legal} onChange={(e) => setComplianceAgreements(prev => ({...prev, legal: e.target.checked}))} />
                      <span className="text-sm font-medium">I agree to Legal & Ethical standards.</span>
                    </label>
                 </div>
               </div>
               
               {/* 2. Payout Details Form */}
               <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <CreditCard size={16}/> 2. Your Payout Details
                  </h3>
                  <p className="text-xs text-blue-800 mb-4">We need this to send your earnings. Please enter your Bank, JazzCash or EasyPaisa details.</p>
                  
                  <div className="space-y-3">
                     <div>
                       <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Method</label>
                       <select 
                         value={payoutForm.method}
                         onChange={(e) => setPayoutForm({...payoutForm, method: e.target.value as any})}
                         className="w-full p-2 border border-slate-300 rounded text-sm"
                       >
                         <option>Bank Transfer</option>
                         <option>EasyPaisa</option>
                         <option>JazzCash</option>
                       </select>
                     </div>
                     {payoutForm.method === 'Bank Transfer' && (
                       <div>
                         <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Bank Name</label>
                         <input 
                           type="text" 
                           placeholder="e.g. Meezan Bank"
                           value={payoutForm.bankName}
                           onChange={(e) => setPayoutForm({...payoutForm, bankName: e.target.value})}
                           className="w-full p-2 border border-slate-300 rounded text-sm"
                         />
                       </div>
                     )}
                     <div>
                       <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Account Title</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Ahmed Hassan"
                         value={payoutForm.accountTitle}
                         onChange={(e) => setPayoutForm({...payoutForm, accountTitle: e.target.value})}
                         className="w-full p-2 border border-slate-300 rounded text-sm"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Account Number / IBAN</label>
                       <input 
                         type="text" 
                         placeholder="e.g. 03001234567 or PK36MEZN..."
                         value={payoutForm.accountNumber}
                         onChange={(e) => setPayoutForm({...payoutForm, accountNumber: e.target.value})}
                         className="w-full p-2 border border-slate-300 rounded text-sm"
                       />
                     </div>
                  </div>
               </div>

               <div className="flex gap-3 pt-4">
                 <Button onClick={handleAcceptCompliance} className="flex-1" disabled={!complianceAgreements.commission || !complianceAgreements.legal}>Complete Registration</Button>
                 <Button variant="ghost" onClick={() => setIsComplianceModalOpen(false)}>Cancel</Button>
               </div>
             </div>
          </div>
        </div>
      )}

      <nav className={`sticky top-0 z-50 border-b shadow-sm ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer group select-none" 
              onClick={() => setCurrentPage('home')}
              onDoubleClick={(e) => {
                e.preventDefault();
                if (user?.role !== UserRole.ADMIN) {
                   setIsAdminLoginOpen(true);
                } else {
                   setCurrentPage('admin');
                }
              }}
            >
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-2 group-hover:bg-emerald-700 transition-colors">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className={`font-bold text-xl tracking-tight ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>GAB <span className="text-emerald-600">Freelancers</span></span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === item.id ? 'text-emerald-600' : (isDarkTheme ? 'text-slate-300 hover:text-emerald-500' : 'text-slate-600 hover:text-emerald-600')
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {user?.role === UserRole.ADMIN && (
                <button onClick={() => setCurrentPage('admin')} className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                  <Settings size={14}/> Admin Panel
                </button>
              )}
            </div>
            
            {/* Header Right Side */}
            <div className="hidden md:flex items-center space-x-4">
              {!user ? (
                <>
                  <Button variant="ghost" className="text-slate-600 font-medium" onClick={() => { setRegisterMode(false); setCurrentPage('auth'); }}>
                    <LogIn size={16} /> Log In
                  </Button>
                  <Button onClick={() => { setRegisterMode(true); setCurrentPage('auth'); }}>
                    <UserPlus size={16} /> Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <button onClick={toggleRole} className="text-xs text-slate-400 hover:text-emerald-600 uppercase font-semibold">
                    Switch Role ({user.role})
                  </button>
                  <div className="h-6 w-px bg-slate-200"></div>
                  {user.role === UserRole.CLIENT && (
                     <Button onClick={() => setCurrentPage('post-job')} className="py-1.5 text-sm"><PlusCircle size={16} /> Post a Job</Button>
                  )}
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('dashboard')}>
                     <img src={user.avatar} className="w-8 h-8 rounded-full border border-slate-200" alt="Avatar" />
                     <div className="text-right hidden lg:block">
                        <p className="text-sm font-bold leading-none">{user.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{user.role}</p>
                     </div>
                     <LogOut size={16} className="text-slate-400 hover:text-red-500 ml-2" onClick={(e) => { e.stopPropagation(); handleLogout(); }} />
                  </div>
                </>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
             {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-base font-medium text-slate-600"
              >
                {item.label}
              </button>
            ))}
            {user?.role === UserRole.ADMIN && (
              <button onClick={() => { setCurrentPage('admin'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-base font-bold text-emerald-600">
                Admin Panel
              </button>
            )}
             
             {/* Sign In / Sign Up Mobile */}
             <div className="pt-4 border-t border-slate-100 mt-2">
               {!user ? (
                 <div className="flex flex-col gap-3">
                   <button 
                     onClick={() => { setRegisterMode(false); setCurrentPage('auth'); setIsMenuOpen(false); }} 
                     className="flex items-center gap-2 text-slate-600 font-bold"
                   >
                     <LogIn size={18}/> Log In
                   </button>
                   <button 
                     onClick={() => { setRegisterMode(true); setCurrentPage('auth'); setIsMenuOpen(false); }} 
                     className="flex items-center gap-2 text-emerald-600 font-bold"
                   >
                     <UserPlus size={18}/> Sign Up
                   </button>
                 </div>
               ) : (
                 <div className="space-y-2">
                   {user.role === UserRole.CLIENT && <Button onClick={() => { setCurrentPage('post-job'); setIsMenuOpen(false); }} className="w-full justify-center">Post a Job</Button>}
                   <button onClick={() => { toggleRole(); setIsMenuOpen(false); }} className="w-full text-sm text-slate-500 py-2">Switch Role ({user.role})</button>
                   <Button variant="secondary" className="w-full justify-center text-red-600" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>Logout</Button>
                 </div>
               )}
             </div>
          </div>
        )}
      </nav>

      <main className="min-h-[calc(100vh-64px)]">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className={`${isDarkTheme ? 'bg-slate-950 text-slate-400' : 'bg-slate-900 text-slate-300'} py-12`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div>
             <div className="flex items-center mb-4">
              <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xs">G</span>
              </div>
              <span className="font-bold text-lg text-white">GAB Freelancers</span>
            </div>
            <p className="text-sm opacity-70">
              Pakistan's trusted marketplace. Connecting talent with opportunity through secure local rails.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">For Freelancers</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li>
                <button onClick={() => setCurrentPage('jobs')} className="hover:text-emerald-500 transition-colors text-left">Find Work</button>
              </li>
              <li>
                <button onClick={() => {
                  if (user && user.role === UserRole.FREELANCER) {
                    setCurrentPage('profile');
                  } else if (!user) {
                     setRegisterMode(true);
                     setCurrentPage('auth');
                  } else {
                    alert("Please log in as a freelancer to edit your profile.");
                  }
                }} className="hover:text-emerald-500 transition-colors text-left">Create Profile</button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">For Clients</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li>
                <button onClick={() => {
                  if (user && user.role === UserRole.CLIENT) {
                    setCurrentPage('post-job');
                  } else if (!user) {
                     setRegisterMode(true);
                     setCurrentPage('auth');
                  } else {
                    alert("Please log in as a client to post a job.");
                  }
                }} className="hover:text-emerald-500 transition-colors text-left">Post a Job</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('freelancers')} className="hover:text-emerald-500 transition-colors text-left">Find Talent</button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Payment Partners</h4>
            <div className="flex gap-2">
               <div className="bg-white/10 px-2 py-1 rounded text-xs cursor-help" title="Integrated">JazzCash</div>
               <div className="bg-white/10 px-2 py-1 rounded text-xs cursor-help" title="Integrated">EasyPaisa</div>
               <div className="bg-white/10 px-2 py-1 rounded text-xs cursor-help" title="Integrated">Raast</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs opacity-50">
          © 2024 GAB Freelancers Pakistan. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
