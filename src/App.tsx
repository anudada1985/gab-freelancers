import { useState, useEffect } from 'react';
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
  ChevronRight,
  Star,
  BookOpen,
  Award,
  Globe,
  Shield,
  Edit3,
  Save
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { JobCard, FreelancerCard, Button, VerificationBadge, Badge } from './components/UIComponents';
import { UserRole } from './types';
import type { Job, FreelancerProfile, User, Transaction, Advertisement, PayoutDetails, PlatformPaymentDetails, Proposal } from './types';
import { generateJobDescription } from './services/geminiService';

// --- Constants & Initial Data ---

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

const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    password: 'password',
    avatar: 'https://picsum.photos/seed/ahmed/200/200',
    role: UserRole.FREELANCER,
    verified: true,
    balance: 154000,
    status: 'Active',
    agreedToTerms: true,
    title: 'Senior React Developer',
    bio: 'Experienced developer specializing in React and Node.js. I have built over 20+ e-commerce applications for local and international clients.',
    hourlyRate: 3500,
    skills: ['React', 'Node.js', 'Typescript', 'Next.js'],
    rating: 4.8,
    jobsCompleted: 15,
    payoutDetails: {
      method: 'Bank Transfer',
      bankName: 'HBL',
      accountTitle: 'Ahmed Hassan',
      accountNumber: '1234567890'
    }
  },
  {
    id: 'c1',
    name: 'Sapphire Textiles',
    email: 'hr@sapphire.com',
    password: 'password',
    avatar: 'https://picsum.photos/seed/sapphire/200/200',
    role: UserRole.CLIENT,
    verified: true,
    balance: 500000,
    status: 'Active',
    agreedToTerms: true
  }
];

const INITIAL_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'E-commerce React Developer for Local Brand',
    description: 'We need an experienced React developer to build a clothing store frontend. Must integrate with JazzCash payment gateway API. The design is ready in Figma.\n\nResponsibilities:\n- Convert Figma designs to React components\n- Integrate JazzCash/EasyPaisa APIs\n- Ensure mobile responsiveness\n\nRequirements:\n- 3+ years React experience\n- Portfolio of e-commerce sites\n- Based in Pakistan for occasional syncs',
    budget: 150000,
    currency: 'PKR',
    postedBy: INITIAL_USERS[1],
    postedAt: new Date().toISOString(),
    category: 'Web Development',
    type: 'Fixed Price',
    applicants: 12,
    status: 'In Progress',
    assignedTo: 'u1'
  }
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2023-06-15', amount: 25000, type: 'Withdrawal', method: 'JazzCash', status: 'Completed' },
];

// --- Authentication Components ---

const AuthPage = ({ onLogin, onRegister, users }: { onLogin: (u: User) => void, onRegister: () => void, users: User[] }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      if (email === 'Ansar' && password === 'Anudada@007') {
         const adminUser: User = {
           id: 'admin1',
           name: 'Admin Ansar',
           email: 'admin@gab.com',
           avatar: '',
           role: UserRole.ADMIN,
           verified: true,
           balance: 0,
           status: 'Active'
         };
         onLogin(adminUser);
         return;
      }
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
            <span className="text-white font-bold text-3xl">G</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Login to GAB Freelancers</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email / Username</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="name@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>
          <Button onClick={handleLogin} className="w-full py-3 text-lg">Login</Button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-500">Don't have an account? </span>
          <button onClick={onRegister} className="text-emerald-600 font-bold hover:underline">Create Account</button>
        </div>
        <div className="mt-4 text-center text-xs text-slate-400">
          <p>Demo Login: ahmed@example.com / password</p>
          <p>Client Login: hr@sapphire.com / password</p>
        </div>
      </div>
    </div>
  );
};

const RegisterPage = ({ onRegisterComplete, onBack }: { onRegisterComplete: (u: User) => void, onBack: () => void }) => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>(UserRole.FREELANCER);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    title: '',
    skills: '',
    hourlyRate: '',
    bio: ''
  });

  const handleRegister = () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in basic details");
      return;
    }

    if (role === UserRole.FREELANCER && (!formData.title || !formData.skills)) {
      alert("Please fill in your professional profile");
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      avatar: `https://ui-avatars.com/api/?name=${formData.name}&background=random`,
      role: role,
      verified: false,
      balance: 0,
      status: 'Active',
      agreedToTerms: true,
      title: formData.title,
      skills: formData.skills.split(',').map(s => s.trim()),
      bio: formData.bio,
      hourlyRate: Number(formData.hourlyRate) || 0,
      rating: 0,
      jobsCompleted: 0
    };

    onRegisterComplete(newUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-xl border border-slate-200">
        <button onClick={onBack} className="flex items-center text-slate-400 hover:text-slate-600 mb-6 text-sm">
          <ChevronLeft size={16} /> Back to Login
        </button>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h1>
        <p className="text-slate-500 mb-6">Step {step} of {role === UserRole.FREELANCER ? '2' : '1'}</p>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div 
                onClick={() => setRole(UserRole.FREELANCER)}
                className={`p-4 border rounded-xl cursor-pointer text-center transition-all ${role === UserRole.FREELANCER ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-slate-200 hover:border-emerald-300'}`}
              >
                <UserCircle className={`mx-auto mb-2 ${role === UserRole.FREELANCER ? 'text-emerald-600' : 'text-slate-400'}`} size={32} />
                <h3 className={`font-bold ${role === UserRole.FREELANCER ? 'text-emerald-900' : 'text-slate-700'}`}>I want to Work</h3>
                <p className="text-xs text-slate-500">Freelancer</p>
              </div>
              <div 
                onClick={() => setRole(UserRole.CLIENT)}
                className={`p-4 border rounded-xl cursor-pointer text-center transition-all ${role === UserRole.CLIENT ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-slate-200 hover:border-emerald-300'}`}
              >
                <Briefcase className={`mx-auto mb-2 ${role === UserRole.CLIENT ? 'text-emerald-600' : 'text-slate-400'}`} size={32} />
                <h3 className={`font-bold ${role === UserRole.CLIENT ? 'text-emerald-900' : 'text-slate-700'}`}>I want to Hire</h3>
                <p className="text-xs text-slate-500">Client</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg" placeholder="Ali Khan" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg" placeholder="ali@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg" placeholder="Create a password" />
            </div>

            <Button onClick={() => role === UserRole.FREELANCER ? setStep(2) : handleRegister()} className="w-full mt-4">
              {role === UserRole.FREELANCER ? 'Next: Profile Details' : 'Create Account'}
            </Button>
          </div>
        )}

        {step === 2 && role === UserRole.FREELANCER && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Professional Title</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg" placeholder="e.g. Graphic Designer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate (PKR)</label>
              <input type="number" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg" placeholder="e.g. 2500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Skills (Comma separated)</label>
              <input type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg" placeholder="Photoshop, Illustrator, Logo Design" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bio / Overview</label>
              <textarea rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg" placeholder="Tell clients about yourself..." />
            </div>

            <div className="flex gap-4 mt-6">
              <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">Back</Button>
              <Button onClick={handleRegister} className="flex-1">Complete Profile</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Helper Components ---

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

const ContentPage = ({ title, content, onBack }: { title: string, content: React.ReactNode, onBack: () => void }) => (
  <div className="max-w-4xl mx-auto px-6 py-12">
    <button onClick={onBack} className="flex items-center text-slate-500 hover:text-emerald-600 mb-6">
      <ChevronLeft size={18} className="mr-1" /> Back
    </button>
    <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">{title}</h1>
      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
        {content}
      </div>
    </div>
  </div>
);

// --- Main Pages ---

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
          {/* We assume there are jobs passed from parent, simplified here for display */}
          <div className="p-6 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
             (See Jobs Page for Live Listings)
          </div>
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
        {jobs.length === 0 && (
          <div className="text-center py-12 text-slate-500">No jobs available. Be the first to post one!</div>
        )}
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
  user: User; 
  onApply: (jobId: string, bid: number, cover: string) => void;
  proposals: Proposal[];
  onHire: (proposal: Proposal) => void;
}) => {
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [bidAmount, setBidAmount] = useState(job.budget.toString());
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasApplied = proposals.some(p => p.freelancerId === user.id);
  const jobProposals = proposals; // Already filtered in App

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
          {user.id === job.postedBy.id && job.status === 'Open' && (
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
          {user.role === UserRole.FREELANCER && job.status === 'Open' && !hasApplied && (
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
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Client</span>
                <span className="font-medium">{job.postedBy.name}</span>
              </div>
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

// --- App Root ---

const App = () => {
  const [currentPage, setCurrentPage] = useState('auth'); 
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // Data State - Persistence
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('gab_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('gab_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });
  const [proposals, setProposals] = useState<Proposal[]>(() => {
    const saved = localStorage.getItem('gab_proposals');
    return saved ? JSON.parse(saved) : [];
  });
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  
  // Derived State
  const freelancers: FreelancerProfile[] = users
    .filter(u => u.role === UserRole.FREELANCER)
    .map(u => ({
      id: `f_${u.id}`,
      user: u,
      title: u.title || '',
      bio: u.bio || '',
      hourlyRate: u.hourlyRate || 0,
      skills: u.skills || [],
      rating: u.rating || 0,
      jobsCompleted: u.jobsCompleted || 0,
      totalEarned: 0
    }));

  const [activeWorkroomJob, setActiveWorkroomJob] = useState<Job | undefined>(undefined);
  const [activeAds, setActiveAds] = useState<Advertisement[]>([]);
  
  // UI State
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalType, setWalletModalType] = useState<'Deposit' | 'Withdrawal'>('Deposit');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [platformPaymentDetails, setPlatformPaymentDetails] = useState(INITIAL_PLATFORM_PAYMENT);
  const [registerMode, setRegisterMode] = useState(false);

  // Persistence Effects
  useEffect(() => { localStorage.setItem('gab_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('gab_jobs', JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem('gab_proposals', JSON.stringify(proposals)); }, [proposals]);

  // Sync current user if updated in list
  useEffect(() => {
    if (user) {
      const updatedUser = users.find(u => u.id === user.id);
      if (updatedUser) setUser(updatedUser);
    }
  }, [users]);

  // --- Handlers ---
  const handleLogin = (u: User) => {
    setUser(u);
    setCurrentPage('home');
  };

  const handleRegisterComplete = (newUser: User) => {
    setUsers([...users, newUser]);
    setUser(newUser);
    setCurrentPage('home');
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

    // Deduct from Client
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

  // --- Views ---

  if (!user || currentPage === 'auth') {
    return registerMode ? (
      <RegisterPage onRegisterComplete={handleRegisterComplete} onBack={() => setRegisterMode(false)} />
    ) : (
      <AuthPage onLogin={handleLogin} onRegister={() => setRegisterMode(true)} users={users} />
    );
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <HomePage setPage={setCurrentPage} categories={INITIAL_CATEGORIES} activeAds={activeAds} />;
      case 'jobs': return (
        <div className="px-4 lg:px-20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-2xl font-bold">Browse Jobs</h1>
            <Button onClick={() => setCurrentPage('post-job')} className="md:hidden w-full">Post Job</Button>
          </div>
          <div className="grid lg:grid-cols-1 gap-4">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} onClick={() => { setSelectedJob(job); setCurrentPage('job-details'); }} />
            ))}
            {jobs.length === 0 && <p className="text-slate-500 text-center py-10">No jobs posted yet.</p>}
          </div>
        </div>
      );
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
        <div className="px-4 lg:px-20 py-8">
          <h1 className="text-2xl font-bold mb-8">Hire Top Talent</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map(p => <FreelancerCard key={p.id} profile={p} />)}
          </div>
        </div>
      );
      case 'dashboard': return (
        <div className="px-4 lg:px-20 py-8 min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-emerald-50" />
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-slate-500 mb-2">{user.role}</p>
                {user.verified && <div className="flex justify-center mb-4"><VerificationBadge /></div>}
                
                <Button variant="outline" className="w-full mb-4 text-xs" onClick={() => setCurrentPage('profile')}>
                  <Edit3 size={14}/> Edit Profile
                </Button>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Available Balance</p>
                  <div className="flex items-center justify-center gap-2 mb-2">
                     <p className="text-2xl font-bold text-emerald-600">PKR {user.balance.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => { setWalletModalType('Deposit'); setIsWalletModalOpen(true); }} className="flex-1 text-xs bg-slate-900">Add</Button>
                    <Button onClick={() => { setWalletModalType('Withdrawal'); setIsWalletModalOpen(true); }} className="flex-1 text-xs" variant="secondary">Withdraw</Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm ring-1 ring-emerald-50">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Briefcase size={18}/> Active Contracts</h3>
                {jobs.filter(j => j.status === 'In Progress' && (j.postedBy.id === user.id || j.assignedTo === user.id)).map(job => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 mb-2">
                    <div>
                      <h4 className="font-medium text-slate-900">{job.title}</h4>
                      <p className="text-sm text-slate-500">{job.status}</p>
                    </div>
                    <Button variant="primary" className="text-sm py-1" onClick={() => { setActiveWorkroomJob(job); setCurrentPage('workroom'); }}>Enter Workroom</Button>
                  </div>
                ))}
                {jobs.filter(j => j.status === 'In Progress' && (j.postedBy.id === user.id || j.assignedTo === user.id)).length === 0 && (
                  <p className="text-slate-500 text-sm italic">No active jobs.</p>
                )}
              </div>

              {user.role === UserRole.FREELANCER && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold mb-4">My Proposals</h3>
                  {proposals.filter(p => p.freelancerId === user.id).map(p => (
                    <div key={p.id} className="border-b py-2 last:border-0 flex justify-between">
                      <span className="text-sm">{jobs.find(j => j.id === p.jobId)?.title || 'Unknown Job'}</span>
                      <span className={`text-xs px-2 py-1 rounded ${p.status === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{p.status}</span>
                    </div>
                  ))}
                  {proposals.filter(p => p.freelancerId === user.id).length === 0 && <p className="text-slate-400 text-sm">No proposals sent.</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      );
      case 'profile': return <ProfilePage user={user} onSave={handleUpdateProfile} onBack={() => setCurrentPage('dashboard')} />;
      case 'post-job': return <PostJobPage onPost={handlePostJob} categories={INITIAL_CATEGORIES} user={user} />;
      case 'workroom': return <WorkroomPage onBack={() => setCurrentPage('dashboard')} user={user} onReleaseFunds={handleReleaseFunds} job={activeWorkroomJob} />;
      
      // -- Content Pages --
      case 'success-stories': return (
        <ContentPage 
          title="Success Stories from Pakistan" 
          onBack={() => setCurrentPage('home')}
          content={
            <div className="space-y-8">
              <div className="flex gap-6 items-start p-6 bg-slate-50 rounded-xl border border-slate-100">
                <img src="https://picsum.photos/seed/succ1/100/100" className="w-24 h-24 rounded-xl object-cover" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Ali's Journey to Top Rated</h3>
                  <p className="text-emerald-600 font-medium mb-2">Web Developer • Earned 5 Million+ PKR</p>
                  <p className="italic text-slate-600">"GAB Freelancers gave me the platform to showcase my skills to local businesses. The local payment integration made it so easy to receive funds directly into my JazzCash without worrying about exchange rates."</p>
                </div>
              </div>
              <div className="flex gap-6 items-start p-6 bg-slate-50 rounded-xl border border-slate-100">
                <img src="https://picsum.photos/seed/succ2/100/100" className="w-24 h-24 rounded-xl object-cover" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Sana's Graphic Design Studio</h3>
                  <p className="text-emerald-600 font-medium mb-2">Creative Director • Lahore</p>
                  <p className="italic text-slate-600">"I started as a solo freelancer and now I run a small agency hiring other freelancers from this very platform. It's an ecosystem of growth that understands the Pakistani market."</p>
                </div>
              </div>
            </div>
          }
        />
      );
      case 'resources': return (
        <ContentPage 
          title="Resources & Learning Center" 
          onBack={() => setCurrentPage('home')}
          content={
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border rounded-xl hover:border-emerald-500 transition-all cursor-pointer">
                <BookOpen className="text-emerald-600 mb-4" size={32} />
                <h3 className="font-bold text-lg mb-2">Freelancing 101</h3>
                <p className="text-sm text-slate-600">A complete guide to starting your career, optimizing your profile, and winning your first job on GAB.</p>
              </div>
              <div className="p-6 border rounded-xl hover:border-emerald-500 transition-all cursor-pointer">
                <Shield className="text-emerald-600 mb-4" size={32} />
                <h3 className="font-bold text-lg mb-2">Safety & Security</h3>
                <p className="text-sm text-slate-600">Learn how to stay safe, avoid scams, and use our Escrow protection effectively to guarantee payment.</p>
              </div>
              <div className="p-6 border rounded-xl hover:border-emerald-500 transition-all cursor-pointer">
                <Award className="text-emerald-600 mb-4" size={32} />
                <h3 className="font-bold text-lg mb-2">Skill Certifications</h3>
                <p className="text-sm text-slate-600">Get verified badges for your skills by taking our standardized tests to boost your profile visibility.</p>
              </div>
              <div className="p-6 border rounded-xl hover:border-emerald-500 transition-all cursor-pointer">
                <Globe className="text-emerald-600 mb-4" size={32} />
                <h3 className="font-bold text-lg mb-2">Tax & Compliance</h3>
                <p className="text-sm text-slate-600">Understanding FBR filer status and how to manage your taxes as a freelancer in Pakistan.</p>
              </div>
            </div>
          }
        />
      );
      case 'enterprise': return (
        <ContentPage 
          title="Enterprise Solutions" 
          onBack={() => setCurrentPage('home')}
          content={
            <div>
              <p className="text-xl mb-6 text-slate-700">Scale your workforce with GAB Enterprise. We provide end-to-end talent management for large organizations.</p>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-slate-50 p-6 rounded-xl">
                   <h3 className="font-bold text-lg mb-3">Why Enterprise?</h3>
                   <ul className="space-y-4">
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-600" /> Dedicated Account Manager</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-600" /> Pre-vetted Top 1% Talent</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-600" /> Consolidated Billing & Invoicing</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-600" /> Custom NDA & Compliance</li>
                  </ul>
                </div>
                <div className="flex flex-col justify-center">
                   <p className="mb-4">Perfect for software houses, agencies, and large corporations needing flexible, high-quality talent pools.</p>
                   <Button className="w-full md:w-auto self-start">Contact Sales</Button>
                </div>
              </div>
            </div>
          }
        />
      );
      case 'escrow': return (
        <ContentPage 
          title="Escrow Protection" 
          onBack={() => setCurrentPage('home')}
          content={
            <div>
              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 mb-8">
                <h3 className="text-emerald-800 font-bold text-lg mb-2 flex items-center gap-2"><ShieldCheck /> Your money is safe with us</h3>
                <p className="text-emerald-700">We hold funds securely until the work is approved. This protects both clients and freelancers from fraud and non-payment.</p>
              </div>
              <h3 className="font-bold text-xl mb-6">How it works</h3>
              <div className="space-y-8 relative before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-slate-200">
                <div className="flex gap-6 relative">
                  <div className="w-8 h-8 bg-white border-2 border-emerald-600 rounded-full flex items-center justify-center font-bold text-emerald-600 shrink-0 z-10">1</div>
                  <div>
                    <h4 className="font-bold text-lg">Client Deposits Funds</h4>
                    <p className="text-sm text-slate-600 mt-1">When a client hires a freelancer, the agreed project amount is deposited into our secure, neutral Escrow account.</p>
                  </div>
                </div>
                <div className="flex gap-6 relative">
                  <div className="w-8 h-8 bg-white border-2 border-emerald-600 rounded-full flex items-center justify-center font-bold text-emerald-600 shrink-0 z-10">2</div>
                  <div>
                    <h4 className="font-bold text-lg">Freelancer Works</h4>
                    <p className="text-sm text-slate-600 mt-1">The freelancer completes the work knowing the funds are secured and available.</p>
                  </div>
                </div>
                <div className="flex gap-6 relative">
                  <div className="w-8 h-8 bg-white border-2 border-emerald-600 rounded-full flex items-center justify-center font-bold text-emerald-600 shrink-0 z-10">3</div>
                  <div>
                    <h4 className="font-bold text-lg">Payment Released</h4>
                    <p className="text-sm text-slate-600 mt-1">Once the client reviews and approves the work, funds are instantly released to the freelancer's wallet.</p>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      );

      default: return <HomePage setPage={setCurrentPage} categories={INITIAL_CATEGORIES} activeAds={activeAds} />;
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

      <nav className={`sticky top-0 z-50 border-b shadow-sm ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="font-bold text-xl">GAB <span className="text-emerald-600">Freelancers</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => setCurrentPage('jobs')} className="text-sm font-medium hover:text-emerald-600">Find Work</button>
              <button onClick={() => setCurrentPage('freelancers')} className="text-sm font-medium hover:text-emerald-600">Hire Talent</button>
              <button onClick={() => setCurrentPage('dashboard')} className="text-sm font-medium hover:text-emerald-600">Dashboard</button>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {user.role === UserRole.CLIENT && (
                 <Button onClick={() => setCurrentPage('post-job')} className="py-1.5 text-sm"><PlusCircle size={16} /> Post a Job</Button>
              )}
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
                if(confirm("Logout?")) {
                  setUser(null);
                  setCurrentPage('auth');
                }
              }}>
                 <img src={user.avatar} className="w-8 h-8 rounded-full border border-slate-200" alt="Avatar" />
                 <div className="text-right hidden lg:block">
                    <p className="text-sm font-bold leading-none">{user.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{user.role}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
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
                  } else {
                    alert("Please log in as a freelancer to edit your profile.");
                  }
                }} className="hover:text-emerald-500 transition-colors text-left">Create Profile</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('success-stories')} className="hover:text-emerald-500 transition-colors text-left">Success Stories</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('resources')} className="hover:text-emerald-500 transition-colors text-left">Resources</button>
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
                  } else {
                    alert("Please log in as a client to post a job.");
                  }
                }} className="hover:text-emerald-500 transition-colors text-left">Post a Job</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('freelancers')} className="hover:text-emerald-500 transition-colors text-left">Find Talent</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('enterprise')} className="hover:text-emerald-500 transition-colors text-left">Enterprise Solutions</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('escrow')} className="hover:text-emerald-500 transition-colors text-left">Escrow Protection</button>
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
