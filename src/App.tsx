import { useState } from 'react';
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
  BarChart2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { JobCard, FreelancerCard, Button, VerificationBadge, Badge } from './components/UIComponents';
import { UserRole } from './types';
import type { Job, FreelancerProfile, User, Transaction, Advertisement, PayoutDetails, PlatformPaymentDetails } from './types';
import { generateJobDescription } from './services/geminiService';

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
  avatar: 'https://picsum.photos/seed/ahmed/200/200',
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
    postedBy: { ...MOCK_USER, id: 'c1', name: 'Sapphire Textiles', role: UserRole.CLIENT },
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
    postedBy: { ...MOCK_USER, id: 'c2', name: 'TechPakistan', role: UserRole.CLIENT },
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
    postedBy: { ...MOCK_USER, id: 'c3', name: 'SoftSync Solutions', role: UserRole.CLIENT },
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
      avatar: 'https://picsum.photos/seed/sana/200/200', 
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
      avatar: 'https://picsum.photos/seed/bilal/200/200', 
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

const HomePage = ({ setPage, categories, activeAds }: { setPage: (p: string) => void, categories: string[], activeAds: Advertisement[] }) => (
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
          {INITIAL_JOBS.slice(0,3).map(job => (
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

const JobDetailsPage = ({ job, onBack, user }: { job: Job; onBack: () => void; user: User }) => {
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [bidAmount, setBidAmount] = useState(job.budget.toString());
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitProposal = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Proposal submitted successfully! The client will review your bid.');
      onBack();
    }, 1500);
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
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                {job.type}
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

          {showProposalForm && user.role === UserRole.FREELANCER && (
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
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-1">Project Budget</p>
              <p className="text-2xl font-bold text-slate-900">PKR {job.budget.toLocaleString()}</p>
            </div>
            
            {user.role === UserRole.FREELANCER ? (
              !showProposalForm ? (
                <Button onClick={() => setShowProposalForm(true)} className="w-full mb-4">Apply Now</Button>
              ) : (
                <div className="text-center text-sm text-emerald-600 font-medium bg-emerald-50 p-3 rounded-lg mb-4">
                  Drafting Proposal...
                </div>
              )
            ) : (
              <Button variant="secondary" className="w-full mb-4">Edit Job Post</Button>
            )}
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Proposals</span>
                <span className="font-medium">{job.applicants}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkroomPage = ({ onBack, user, onReleaseFunds }: { onBack: () => void; user: User; onReleaseFunds: () => void }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! Thanks for accepting my proposal. I'm excited to start.", sender: 'freelancer', time: '10:00 AM' },
    { id: 2, text: "Welcome aboard! Here are the Figma files you need.", sender: 'client', time: '10:05 AM', attachment: 'Design_v1.fig' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isFundsReleased, setIsFundsReleased] = useState(false);

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { id: Date.now(), text: inputText, sender: user.role === UserRole.CLIENT ? 'client' : 'freelancer', time: 'Just now' }]);
    setInputText('');
  };

  const handleReleaseClick = () => {
    if (confirm("Are you sure you want to release PKR 135,000 to the freelancer? This action cannot be undone.")) {
      onReleaseFunds();
      setIsFundsReleased(true);
      setMessages([...messages, { 
        id: Date.now(), 
        text: "PAYMENT RELEASED: The client has approved the work and released funds from escrow.", 
        sender: 'system', 
        time: 'Just now' 
      }]);
    }
  }

  return (
    <div className="h-[calc(100vh-80px)] max-w-7xl mx-auto px-4 lg:px-8 py-4 flex gap-6">
      <div className="w-1/3 bg-white border border-slate-200 rounded-xl hidden md:flex flex-col">
        <div className="p-4 border-b border-slate-100 font-bold text-lg">Active Contracts</div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 cursor-pointer">
            <h4 className="font-medium text-slate-900">E-commerce React Dev...</h4>
            <p className="text-xs text-slate-500 mt-1">Sapphire Textiles</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
           <div>
             <h3 className="font-bold">E-commerce React Developer</h3>
             <span className="text-xs text-emerald-600 flex items-center gap-1"><ShieldCheck size={12}/> Escrow Funded: PKR 150,000</span>
           </div>
           <div className="flex items-center gap-2">
             {user.role === UserRole.CLIENT && !isFundsReleased && (
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
                  {msg.attachment && (
                    <div className="mt-2 flex items-center gap-2 bg-slate-100/10 p-2 rounded text-xs border border-white/10">
                      <FileText size={14} /> {msg.attachment}
                    </div>
                  )}
                  <p className={`text-[10px] mt-1 text-right ${msg.sender === (user.role === UserRole.CLIENT ? 'client' : 'freelancer') ? 'text-emerald-100' : 'text-slate-400'}`}>{msg.time}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex gap-2">
            <button className="text-slate-400 hover:text-emerald-600 p-2"><Paperclip size={20}/></button>
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

const FreelancersPage = ({ freelancers }: { freelancers: FreelancerProfile[] }) => (
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
        <FreelancerCard key={profile.id} profile={profile} />
      ))}
    </div>
  </div>
);

const PostJobPage = ({ onPost, categories }: { onPost: (job: Job) => void, categories: string[] }) => {
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
      postedBy: { ...MOCK_USER, role: UserRole.CLIENT },
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

const DashboardPage = ({ 
  user, 
  onOpenWorkroom, 
  activeAds, 
  transactions,
  onDeposit,
  onWithdraw
}: { 
  user: User; 
  onOpenWorkroom: () => void, 
  activeAds: Advertisement[], 
  transactions: Transaction[],
  onDeposit: () => void,
  onWithdraw: () => void
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
            <Wallet size={18} /> {user.role === UserRole.CLIENT ? 'Payment Methods' : 'Payout Methods'}
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Briefcase size={18} className="text-emerald-600"/> Active Contracts
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">1 Active</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <h4 className="font-medium text-slate-900">E-commerce React Developer</h4>
              <p className="text-sm text-slate-500">Sapphire Textiles • Due in 5 days</p>
            </div>
            <Button variant="primary" className="text-sm py-1" onClick={onOpenWorkroom}>Enter Workroom</Button>
          </div>
        </div>

        {/* Stats Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold mb-6">Earnings Overview (PKR)</h3>
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
  const [user, setUser] = useState<User>(MOCK_USER);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  
  // New States for Admin features
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [activeAds, setActiveAds] = useState<Advertisement[]>([]);
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>(INITIAL_FREELANCERS);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [platformPaymentDetails, setPlatformPaymentDetails] = useState<PlatformPaymentDetails>(INITIAL_PLATFORM_PAYMENT);

  // Payment Logic States
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalType, setWalletModalType] = useState<'Deposit' | 'Withdrawal'>('Deposit');

  // Compliance State
  const [complianceAgreements, setComplianceAgreements] = useState({
    commission: false,
    legal: false
  });
  
  // Compliance Form Data
  const [payoutForm, setPayoutForm] = useState<PayoutDetails>({
    method: 'Bank Transfer',
    bankName: '',
    accountTitle: '',
    accountNumber: ''
  });

  const toggleRole = () => {
    // Only toggle between Client and Freelancer for normal users
    if (user.role === UserRole.CLIENT) {
      // If switching to freelancer, check compliance first
      if (!user.agreedToTerms) {
        setIsComplianceModalOpen(true);
      } else {
        setUser(prev => ({ ...prev, role: UserRole.FREELANCER }));
      }
    } else if (user.role === UserRole.FREELANCER) {
      setUser(prev => ({ ...prev, role: UserRole.CLIENT }));
    }
    // If Admin, they can switch back to Client to see the site normally
    if (user.role === UserRole.ADMIN) {
      setUser(prev => ({ ...prev, role: UserRole.CLIENT }));
    }
  };

  const handleAdminLogin = () => {
    if (adminUsername === 'Ansar' && adminPassword === 'Anudada@007') {
      setUser({ ...user, role: UserRole.ADMIN, name: 'Admin (Ansar)', verified: true });
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
      // Basic validation
      if (!payoutForm.accountNumber || !payoutForm.accountTitle) {
        alert("Please complete your payout details so we can send you money.");
        return;
      }
      
      setUser(prev => ({ 
        ...prev, 
        role: UserRole.FREELANCER, 
        agreedToTerms: true,
        payoutDetails: payoutForm
      }));
      setIsComplianceModalOpen(false);
    } else {
      alert("You must accept all terms to proceed.");
    }
  };

  const handleToggleFreelancerStatus = (id: string, status: 'Active' | 'Banned') => {
    setFreelancers(prev => prev.map(f => f.id === id ? { ...f, user: { ...f.user, status: status } } : f));
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setCurrentPage('job-details');
  };

  const handlePostJob = (newJob: Job) => {
    setJobs([newJob, ...jobs]);
    setCurrentPage('jobs');
  }

  // --- Payment Functions ---
  
  const handleWalletAction = (amount: number, method: string) => {
    if (walletModalType === 'Deposit') {
      setUser(prev => ({ ...prev, balance: prev.balance + amount }));
      const newTx: Transaction = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        amount,
        type: 'Deposit',
        method: method as any,
        status: 'Completed'
      };
      setTransactions(prev => [newTx, ...prev]);
    } else {
      // Withdrawal
      if (user.balance >= amount) {
        setUser(prev => ({ ...prev, balance: prev.balance - amount }));
        const newTx: Transaction = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          amount,
          type: 'Withdrawal',
          method: method as any,
          status: 'Completed'
        };
        setTransactions(prev => [newTx, ...prev]);
      } else {
        alert("Insufficient balance.");
      }
    }
  };

  const handleReleaseFunds = () => {
    // 1. Log Transaction for current user (Client view)
    const newTx: Transaction = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        amount: 150000,
        type: 'Payment',
        method: 'Bank Transfer', // internal
        status: 'Completed'
    };
    setTransactions(prev => [newTx, ...prev]);

    // 2. Update Job Status to Completed
    if (currentPage === 'workroom') {
       // In workroom we assume we know which job it is. For demo, we'll update the first 'In Progress' one or mock logic
       // Finding the job associated with the workroom
       const jobIndex = jobs.findIndex(j => j.status === 'In Progress');
       if (jobIndex !== -1) {
          const updatedJobs = [...jobs];
          updatedJobs[jobIndex].status = 'Completed';
          setJobs(updatedJobs);
       }
    }
  };
  
  const handleMarkJobPaid = (jobId: string) => {
     if(confirm("Are you sure you have transferred the money? This will mark the job as Paid and remove it from the pending queue.")) {
       setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'Paid' } : j));
     }
  };

  const openDeposit = () => { setWalletModalType('Deposit'); setIsWalletModalOpen(true); };
  const openWithdraw = () => { setWalletModalType('Withdrawal'); setIsWalletModalOpen(true); };


  const navItems = [
    { id: 'jobs', label: 'Find Work' },
    { id: 'freelancers', label: 'Hire Talent' },
    { id: 'dashboard', label: 'Dashboard' },
  ];

  const renderPage = () => {
  switch (currentPage) {
    case 'home':
      return (
        <HomePage
          setPage={setCurrentPage}
          categories={categories}
          activeAds={activeAds}
        />
      );

    case 'jobs':
      return (
        <JobsPage
          onSelectJob={handleSelectJob}
          categories={categories}
          jobs={jobs}
        />
      );

    case 'job-details':
      return selectedJob ? (
        <JobDetailsPage
          job={selectedJob}
          user={user}
          onBack={() => setCurrentPage('jobs')}
        />
      ) : (
        <JobsPage
          onSelectJob={handleSelectJob}
          categories={categories}
          jobs={jobs}
        />
      );

    case 'freelancers':
      return <FreelancersPage freelancers={freelancers} />;

    case 'post-job':
      return (
        <PostJobPage
          onPost={handlePostJob}
          categories={categories}
        />
      );

    case 'dashboard':
      return (
        <DashboardPage
          user={user}
          onOpenWorkroom={() => setCurrentPage('workroom')}
          activeAds={activeAds}
          transactions={transactions}
          onDeposit={openDeposit}
          onWithdraw={openWithdraw}
        />
      );

    case 'workroom':
      return (
        <WorkroomPage
          user={user}
          onBack={() => setCurrentPage('dashboard')}
          onReleaseFunds={handleReleaseFunds}
        />
      );

    case 'admin':
      return (
        <AdminPage
          categories={categories}
          onAddCategory={(c: string) => setCategories(prev => [...prev, c])}
          onDeleteCategory={(c: string) => setCategories(prev => prev.filter(x => x !== c))}
          freelancers={freelancers}
          onToggleFreelancerStatus={handleToggleFreelancerStatus}
          ads={activeAds}
          onAddAd={(ad: Advertisement) => setActiveAds(prev => [...prev, ad])}
          onDeleteAd={(id: string) => setActiveAds(prev => prev.filter(a => a.id !== id))}
          onToggleTheme={() => setIsDarkTheme(p => !p)}
          isDarkTheme={isDarkTheme}
          jobs={jobs}
          platformPayment={platformPaymentDetails}
          onUpdatePlatformPayment={setPlatformPaymentDetails}
          onMarkJobPaid={handleMarkJobPaid}
        />
      );

    default:
      return (
        <HomePage
          setPage={setCurrentPage}
          categories={categories}
          activeAds={activeAds}
        />
      );
  }
};

  return (
  <div className={isDarkTheme ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}>
    
    {/* TOP NAV */}
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1
          className="font-bold text-lg cursor-pointer"
          onClick={() => setCurrentPage('home')}
        >
          Gab Freelancers Dashboard
        </h1>

        <nav className="hidden md:flex gap-6 text-sm">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className="hover:text-emerald-600 font-medium"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>

    {/* PAGE CONTENT */}
    <main className="min-h-screen">
      {renderPage()}
    </main>

    {/* WALLET MODAL */}
    <WalletModal
      isOpen={isWalletModalOpen}
      onClose={() => setIsWalletModalOpen(false)}
      type={walletModalType}
      onConfirm={handleWalletAction}
      platformDetails={platformPaymentDetails}
    />
  </div>
);

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

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 border-b shadow-sm ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Logo - Trigger for Admin Login */}
            <div 
              className="flex items-center cursor-pointer group select-none" 
              onClick={() => setCurrentPage('home')}
              onDoubleClick={(e) => {
                e.preventDefault();
                if (user.role !== UserRole.ADMIN) {
                   setIsAdminLoginOpen(true);
                } else {
                   // Already admin, maybe go to admin dashboard?
                   setCurrentPage('admin');
                }
              }}
            >
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-2 group-hover:bg-emerald-700 transition-colors">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className={`font-bold text-xl tracking-tight ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>GAB <span className="text-emerald-600">Freelancers</span></span>
            </div>

            {/* Desktop Nav */}
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
              {user.role === UserRole.ADMIN && (
                <button onClick={() => setCurrentPage('admin')} className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                  <Settings size={14}/> Admin Panel
                </button>
              )}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={toggleRole} className="text-xs text-slate-400 hover:text-emerald-600 uppercase font-semibold">
                Switch Role ({user.role})
              </button>
              <div className="h-6 w-px bg-slate-200"></div>
              {user.role === UserRole.CLIENT && (
                 <Button onClick={() => setCurrentPage('post-job')} className="py-1.5 text-sm">
                   <PlusCircle size={16} /> Post a Job
                 </Button>
              )}
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('dashboard')}>
                 <img src={user.avatar} className="w-8 h-8 rounded-full border border-slate-200" alt="Avatar" />
              </div>
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
            {user.role === UserRole.ADMIN && (
              <button onClick={() => { setCurrentPage('admin'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-base font-bold text-emerald-600">
                Admin Panel
              </button>
            )}
            <div className="pt-2 border-t border-slate-100">
              <Button onClick={() => { setCurrentPage('post-job'); setIsMenuOpen(false); }} className="w-full justify-center">
                Post a Job
              </Button>
              <button onClick={() => { toggleRole(); setIsMenuOpen(false); }} className="w-full mt-2 text-sm text-slate-500 py-2">
                Switch Role ({user.role})
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
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
              <li>Find Work</li>
              <li>Create Profile</li>
              <li>Success Stories</li>
              <li>Resources</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">For Clients</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li>Post a Job</li>
              <li>Find Talent</li>
              <li>Enterprise Solutions</li>
              <li>Escrow Protection</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Payment Partners</h4>
            <div className="flex gap-2">
               <div className="bg-white/10 px-2 py-1 rounded text-xs">JazzCash</div>
               <div className="bg-white/10 px-2 py-1 rounded text-xs">EasyPaisa</div>
               <div className="bg-white/10 px-2 py-1 rounded text-xs">Raast</div>
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
