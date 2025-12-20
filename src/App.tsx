
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
  TrendingUp,
  ShieldCheck,
  ChevronLeft,
  Send,
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
  Save,
  LogIn,
  UserPlus,
  Star,
  MessageSquare,
  Package,
  Gift,
  Wallet
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { JobCard, FreelancerCard, Button, VerificationBadge, Badge, ServiceCard } from './components/UIComponents';
import type { Job, FreelancerProfile, User, Transaction, Advertisement, PayoutDetails, PlatformPaymentDetails, Proposal, Service, DirectOffer, WorkroomMessage } from './types';
import { UserRole } from './types';
import { generateJobDescription } from './services/geminiService';
import { AuthPage, RegisterPage } from './auth/Enhanced_Auth_Registration';

// --- Constants (Configuration Only) ---

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

const MOCK_EARNINGS = [
  { name: 'Jan', amount: 45000 },
  { name: 'Feb', amount: 52000 },
  { name: 'Mar', amount: 38000 },
  { name: 'Apr', amount: 65000 },
  { name: 'May', amount: 58000 },
  { name: 'Jun', amount: 85000 },
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

const HireModal = ({
  isOpen,
  onClose,
  freelancer,
  onConfirm
}: {
  isOpen: boolean;
  onClose: () => void;
  freelancer: FreelancerProfile | null;
  onConfirm: (jobDetails: any) => void;
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [jobType, setJobType] = useState('Fixed Price');

  if (!isOpen || !freelancer) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="text-emerald-600"/> Hire {freelancer.user.name}
          </h3>
          <button onClick={onClose}><X size={20} className="text-slate-400"/></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Need a React Component"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Type</label>
            <select 
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Fixed Price">Fixed Price</option>
              <option value="Hourly">Hourly Rate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {jobType === 'Fixed Price' ? 'Total Budget (PKR)' : 'Hourly Rate (PKR/hr)'}
            </label>
            <input 
              type="number" 
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder={jobType === 'Fixed Price' ? "15000" : freelancer.hourlyRate.toString()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="Describe the work required..."
            />
          </div>

          <Button 
            className="w-full mt-2" 
            onClick={() => {
              if (title && budget && description) {
                onConfirm({ title, type: jobType, budget: Number(budget), description });
                onClose();
              } else {
                alert("Please fill all fields");
              }
            }}
          >
            Send Offer & Hire
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Pages ---

const HomePage = ({ setPage, categories, activeAds, jobs, services }: { setPage: (p: string) => void, categories: string[], activeAds: Advertisement[], jobs: Job[], services: Service[] }) => (
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
          <Button onClick={() => setPage('services')} variant="secondary" className="h-12 text-lg px-8">Browse Services</Button>
        </div>
      </div>
    </section>

    {/* Featured Services (Gigs) */}
    {services.length > 0 && (
      <section className="px-6 lg:px-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Popular Services</h2>
          <button onClick={() => setPage('services')} className="text-emerald-600 font-medium hover:underline">View All</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.slice(0, 4).map(service => (
            <ServiceCard key={service.id} service={service} onClick={() => setPage('services')} />
          ))}
        </div>
      </section>
    )}

    {/* Categories */}
    <section className="px-6 lg:px-20">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Browse by Category</h2>
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
    {jobs.length > 0 && (
      <section className="px-6 lg:px-20 bg-emerald-50/50 py-16 -mx-4 lg:-mx-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Latest Jobs</h2>
              <p className="text-slate-600">Fresh opportunities posted recently</p>
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
    )}
  </div>
);

const ServicesPage = ({ services, onSelectService }: { services: Service[], onSelectService: (s: Service) => void }) => (
  <div className="px-4 lg:px-20 py-8">
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <h1 className="text-2xl font-bold">Browse Professional Services</h1>
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="What are you looking for?" 
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>
    </div>
    
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
      {services.length === 0 ? (
        <div className="col-span-full text-center py-20">
          <Package className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-600">No Services Found</h3>
        </div>
      ) : (
        services.map(service => (
          <ServiceCard key={service.id} service={service} onClick={() => onSelectService(service)} />
        ))
      )}
    </div>
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
        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
            <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-600">No Jobs Found</h3>
            <p className="text-slate-500">Be the first to post a job!</p>
          </div>
        ) : (
          jobs.map(job => (
            <JobCard key={job.id} job={job} onClick={() => onSelectJob(job)} />
          ))
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
  onHire,
  onMessage
}: { 
  job: Job; 
  onBack: () => void; 
  user: User | null; 
  onApply: (jobId: string, bid: number, cover: string) => void;
  proposals: Proposal[];
  onHire: (proposal: Proposal) => void;
  onMessage: (freelancerId: string, name: string) => void;
}) => {
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [bidAmount, setBidAmount] = useState(job.budget.toString());
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // LOGIC: Show ALL proposals to Client, but only OWN proposal to Freelancer
  const visibleProposals = user?.id === job.postedBy.id 
    ? proposals.filter(p => p.jobId === job.id)
    : proposals.filter(p => p.jobId === job.id && p.freelancerId === user?.id);

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
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${job.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {job.status}
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {job.type}
                  </span>
                </div>
              </div>
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

          {/* Corrected Shared Proposal Visibility */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4">
              {user?.id === job.postedBy.id ? `Received Proposals (${visibleProposals.length})` : 'Your Proposal'}
            </h2>
            {visibleProposals.length === 0 ? (
              <p className="text-slate-500 italic">No proposals to display.</p>
            ) : (
              <div className="space-y-4">
                {visibleProposals.map(p => (
                  <div key={p.id} className="border p-4 rounded-lg hover:border-emerald-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900">{p.freelancerName}</h4>
                        <p className="text-sm text-slate-500">{new Date(p.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600 block">PKR {p.bidAmount.toLocaleString()}</span>
                        {user?.id === job.postedBy.id && p.status === 'Pending' && job.status === 'Open' && (
                          <div className="flex gap-2 mt-2 justify-end">
                            <Button variant="secondary" className="text-xs py-1 px-3 h-8" onClick={() => onMessage(p.freelancerId, p.freelancerName)}>Message</Button>
                            <Button className="text-xs py-1 px-3 h-8" onClick={() => { if(confirm("Hire this freelancer? Funds will move to Escrow.")) onHire(p); }}>Hire Now</Button>
                          </div>
                        )}
                        <Badge color={p.status === 'Accepted' ? 'emerald' : 'slate'}>{p.status}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">{p.coverLetter}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Freelancer View: Application Form */}
          {user?.role === UserRole.FREELANCER && job.status === 'Open' && !hasApplied && showProposalForm && (
             <div className="bg-white p-8 rounded-xl border border-emerald-200 shadow-lg ring-1 ring-emerald-100">
               <h3 className="text-xl font-bold mb-6">Submit Your Proposal</h3>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Bid Amount (PKR)</label>
                   <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                   <p className="text-xs text-slate-500 mt-1">GAB Service Fee (10%): PKR {(Number(bidAmount) * 0.1).toLocaleString()}</p>
                   <p className="text-xs font-bold text-emerald-600 mt-0.5">Estimated Earning: PKR {(Number(bidAmount) * 0.9).toLocaleString()}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Cover Letter</label>
                   <textarea rows={6} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Why are you the best fit?" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
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
              <p className="text-sm text-slate-500 mb-1">{job.type === 'Fixed Price' ? 'Project Budget' : 'Hourly Rate'}</p>
              <p className="text-2xl font-bold text-slate-900">PKR {job.budget.toLocaleString()}{job.type === 'Hourly' && <span className="text-sm font-normal text-slate-500">/hr</span>}</p>
            </div>
            {user?.role === UserRole.FREELANCER && !hasApplied && !showProposalForm && <Button onClick={() => setShowProposalForm(true)} className="w-full mb-4">Apply Now</Button>}
            {user?.role === UserRole.CLIENT && user.id === job.postedBy.id && <Button variant="secondary" className="w-full mb-4" onClick={() => alert("Coming soon!")}>Edit Job Post</Button>}
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkroomPage = ({ 
  onBack, 
  user, 
  onReleaseFunds, 
  job,
  messages,
  onSendMessage
}: { 
  onBack: () => void; 
  user: User; 
  onReleaseFunds: () => void; 
  job: Job;
  messages: WorkroomMessage[];
  onSendMessage: (text: string) => void;
}) => {
  const [inputText, setInputText] = useState('');
  const isFundsReleased = job.status === 'Completed' || job.status === 'Paid';

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

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
          <div className="text-xs text-slate-500 px-2">Status: <span className="font-bold uppercase text-slate-700">{job.status}</span></div>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
           <div>
             <h3 className="font-bold truncate max-w-xs">{job.title}</h3>
             <span className="text-xs text-emerald-600 flex items-center gap-1">
                <ShieldCheck size={12}/> {isFundsReleased ? 'Funds Released' : 'Escrow Funded'}
             </span>
           </div>
           <div className="flex items-center gap-2">
             {user.role === UserRole.CLIENT && !isFundsReleased && job.status === 'In Progress' && (
               <Button onClick={() => { if(confirm("Release funds?")) onReleaseFunds(); }} className="text-xs h-8 bg-emerald-600">Release Payment</Button>
             )}
             <Button variant="outline" className="text-xs px-2 py-1 h-8" onClick={onBack}>Exit</Button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderRole === 'SYSTEM' ? 'justify-center' : (msg.senderId === user.id ? 'justify-end' : 'justify-start')}`}>
              {msg.senderRole === 'SYSTEM' ? (
                <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-[10px] font-bold border border-emerald-200">{msg.text}</div>
              ) : (
                <div className={`max-w-[70%] rounded-xl p-3 shadow-sm ${msg.senderId === user.id ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-slate-200 rounded-bl-none'}`}>
                  <p className="text-[10px] font-bold mb-1 opacity-70">{msg.senderName}</p>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[9px] mt-1 text-right opacity-50`}>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex gap-2">
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 border border-slate-300 rounded-lg px-4 focus:outline-none focus:border-emerald-500" />
            <button onClick={handleSend} className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700"><Send size={20}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Missing Pages ---

/**
 * FreelancersPage component displays a filtered list of freelancers.
 * Fixes Error on line 813: Cannot find name 'FreelancersPage'.
 */
const FreelancersPage = ({ freelancers, onViewProfile }: { freelancers: FreelancerProfile[]; onViewProfile: (p: FreelancerProfile) => void }) => (
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
        <FreelancerCard key={profile.id} profile={profile} onViewProfile={() => onViewProfile(profile)} />
      ))}
    </div>
  </div>
);

/**
 * DashboardPage component provides an overview for both Clients and Freelancers.
 * Fixes Error on line 814: Cannot find name 'DashboardPage'.
 */
const DashboardPage = ({ 
  user, 
  onEnterWorkroom, 
  transactions,
  onDeposit,
  onWithdraw,
  jobs
}: { 
  user: User; 
  onEnterWorkroom: (job: Job) => void; 
  activeAds: Advertisement[]; 
  transactions: Transaction[]; 
  onDeposit: () => void; 
  onWithdraw: () => void;
  jobs: Job[];
  proposals: Proposal[];
  services: Service[];
  onCreateService: () => void;
  directOffers: DirectOffer[];
  onRespondToOffer: () => void;
}) => {
  const activeContracts = jobs.filter(j => j.status === 'In Progress' && (j.postedBy.id === user.id || j.assignedTo === user.id));

  return (
    <div className="px-4 lg:px-20 py-8 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-emerald-50" />
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-slate-500 mb-2">{user.role === UserRole.CLIENT ? 'Client Account' : 'Freelancer'}</p>
            {user.verified && <div className="flex justify-center mb-4"><VerificationBadge /></div>}
            
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Available Balance</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                 <p className="text-2xl font-bold text-emerald-600">PKR {user.balance.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={onDeposit} className="w-full text-sm">
                  <Upload size={14} /> Add Funds
                </Button>
                {user.role === UserRole.FREELANCER && (
                  <Button onClick={onWithdraw} variant="secondary" className="w-full text-sm">
                    <Download size={14} /> Withdraw
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Wallet size={18} /> Financial Status
            </h3>
            {user.payoutDetails ? (
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium">{user.payoutDetails.method}</span>
                <p className="text-xs text-slate-400 mt-1">{user.payoutDetails.accountNumber}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">Configure payment details to withdraw.</p>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm ring-1 ring-emerald-50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Briefcase size={18} className="text-emerald-600"/> Active Contracts
            </h3>
            {activeContracts.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No active projects at the moment.
              </div>
            ) : (
              <div className="space-y-3">
                {activeContracts.map(j => (
                  <div key={j.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <h4 className="font-medium text-slate-900">{j.title}</h4>
                      <p className="text-sm text-slate-500">Status: {j.status}</p>
                    </div>
                    <Button variant="primary" className="text-sm py-1" onClick={() => onEnterWorkroom(j)}>Enter Workroom</Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold mb-6">Activity Overview</h3>
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

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold mb-4">Transactions</h3>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-4 text-slate-400 text-sm">No transaction history.</div>
              ) : (
                transactions.slice(0, 5).map(tx => (
                  <div key={tx.id} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${tx.type === 'Withdrawal' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {tx.type === 'Withdrawal' ? <LogOut size={16} /> : <TrendingUp size={16} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{tx.type} ({tx.method})</p>
                        <p className="text-xs text-slate-400">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${tx.type === 'Withdrawal' ? 'text-slate-900' : 'text-emerald-600'}`}>
                        {tx.type === 'Withdrawal' ? '-' : '+'} PKR {tx.amount.toLocaleString()}
                      </p>
                      <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{tx.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const ProfilePage = ({ user, onSave, onBack }: { user: User, onSave: (u: User) => void, onBack: () => void }) => {
  const [formData, setFormData] = useState({ name: user.name, title: user.title || '', bio: user.bio || '', hourlyRate: user.hourlyRate || 0, skills: user.skills?.join(', ') || '' });
  const handleSave = () => { onSave({ ...user, ...formData, skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean), hourlyRate: Number(formData.hourlyRate) }); onBack(); };
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-emerald-600 mb-6"><ChevronLeft size={18} /> Back</button>
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Full Name</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg"/></div>
          <div><label className="block text-sm font-medium mb-1">Professional Title</label><input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg"/></div>
          <div><label className="block text-sm font-medium mb-1">Bio</label><textarea rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Hourly Rate (PKR)</label><input type="number" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: Number(e.target.value)})} className="w-full p-2 border border-slate-300 rounded-lg"/></div>
            <div><label className="block text-sm font-medium mb-1">Skills (comma separated)</label><input value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg"/></div>
          </div>
          <div className="pt-4 flex gap-4"><Button onClick={handleSave}>Save Changes</Button><Button variant="ghost" onClick={onBack}>Cancel</Button></div>
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
  const handleGenerate = async () => { if (!title || !skills) { alert("Fill title/skills first."); return; } setIsGenerating(true); const desc = await generateJobDescription(title, skills); setDescription(desc); setIsGenerating(false); };
  const handlePost = () => { if (!title || !description || !budget) { alert("Fill all fields"); return; } onPost({ id: Date.now().toString(), title, description, budget: Number(budget), currency: 'PKR', postedBy: user, postedAt: new Date().toISOString(), category, type: 'Fixed Price', applicants: 0, status: 'Open' }); };
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div><label className="block text-sm font-medium mb-1">Job Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Category</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-1">Required Skills</label><input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Budget (PKR)</label><input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" /></div>
        <div><div className="flex justify-between items-center mb-1"><label className="block text-sm font-medium">Description</label><button onClick={handleGenerate} disabled={isGenerating} className="text-xs text-purple-600 font-medium">{isGenerating ? 'Thinking...' : '✨ AI Generate'}</button></div><textarea rows={8} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" /></div>
        <Button onClick={handlePost} className="w-full">Post Job Now</Button>
      </div>
    </div>
  );
};

// --- App ---

const App = () => {
  const [currentPage, setCurrentPage] = useState('home'); 
  const [user, setUser] = useState<User | null>(null);
  
  // Persisted States - V4 for synced workroom and corrected proposals
  const [users, setUsers] = useState<User[]>(() => { const s = localStorage.getItem('gab_users_v4'); return s ? JSON.parse(s) : []; });
  const [jobs, setJobs] = useState<Job[]>(() => { const s = localStorage.getItem('gab_jobs_v4'); return s ? JSON.parse(s) : []; });
  const [proposals, setProposals] = useState<Proposal[]>(() => { const s = localStorage.getItem('gab_proposals_v4'); return s ? JSON.parse(s) : []; });
  const [services, setServices] = useState<Service[]>(() => { const s = localStorage.getItem('gab_services_v4'); return s ? JSON.parse(s) : []; });
  const [directOffers, setDirectOffers] = useState<DirectOffer[]>(() => { const s = localStorage.getItem('gab_offers_v4'); return s ? JSON.parse(s) : []; });
  const [workroomMessages, setWorkroomMessages] = useState<WorkroomMessage[]>(() => { const s = localStorage.getItem('gab_workroom_v4'); return s ? JSON.parse(s) : []; });
  const [transactions, setTransactions] = useState<Transaction[]>(() => { const s = localStorage.getItem('gab_transactions_v4'); return s ? JSON.parse(s) : []; });

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedFreelancer, setSelectedFreelancer] = useState<FreelancerProfile | null>(null);
  const [activeWorkroomJob, setActiveWorkroomJob] = useState<Job | undefined>(undefined);

  useEffect(() => { localStorage.setItem('gab_users_v4', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('gab_jobs_v4', JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem('gab_proposals_v4', JSON.stringify(proposals)); }, [proposals]);
  useEffect(() => { localStorage.setItem('gab_services_v4', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('gab_offers_v4', JSON.stringify(directOffers)); }, [directOffers]);
  useEffect(() => { localStorage.setItem('gab_workroom_v4', JSON.stringify(workroomMessages)); }, [workroomMessages]);
  useEffect(() => { localStorage.setItem('gab_transactions_v4', JSON.stringify(transactions)); }, [transactions]);

  useEffect(() => { const s = localStorage.getItem('gab_session_v4'); if (s) { const p = JSON.parse(s); const f = users.find(u => u.id === p.id) || p; setUser(f); } }, []);
  useEffect(() => { if (user) localStorage.setItem('gab_session_v4', JSON.stringify(user)); else localStorage.removeItem('gab_session_v4'); }, [user]);

  const handlePostJob = (j: Job) => { setJobs([j, ...jobs]); setCurrentPage('jobs'); };
  const handleApplyJob = (jobId: string, bid: number, cover: string) => { if(!user) return; setProposals([{ id: Date.now().toString(), jobId, freelancerId: user.id, freelancerName: user.name, coverLetter: cover, bidAmount: bid, submittedAt: new Date().toISOString(), status: 'Pending' }, ...proposals]); setJobs(jobs.map(j => j.id === jobId ? { ...j, applicants: j.applicants + 1 } : j)); };
  
  const handleHire = (p: Proposal) => {
    if(!user || user.balance < p.bidAmount) { alert("Deposit funds first!"); return; }
    setUser({ ...user, balance: user.balance - p.bidAmount });
    setJobs(jobs.map(j => j.id === p.jobId ? { ...j, status: 'In Progress', assignedTo: p.freelancerId, budget: p.bidAmount } : j));
    setProposals(proposals.map(pr => pr.id === p.id ? { ...pr, status: 'Accepted' } : pr));
    // Add shared system message
    setWorkroomMessages([{ id: Date.now().toString(), jobId: p.jobId, senderId: 'system', senderName: 'GAB Bot', senderRole: 'SYSTEM', text: `Freelancer ${p.freelancerName} has been hired. Funds are secured in GAB Escrow.`, timestamp: new Date().toISOString() }, ...workroomMessages]);
    setCurrentPage('dashboard');
  };

  const onSendMessage = (text: string) => {
    if(!user || !activeWorkroomJob) return;
    const msg: WorkroomMessage = { id: Date.now().toString(), jobId: activeWorkroomJob.id, senderId: user.id, senderName: user.name, senderRole: user.role as any, text, timestamp: new Date().toISOString() };
    setWorkroomMessages([msg, ...workroomMessages]);
  };

  const handleReleaseFunds = () => {
    if(!activeWorkroomJob) return;
    setJobs(jobs.map(j => j.id === activeWorkroomJob.id ? { ...j, status: 'Completed' } : j));
    setWorkroomMessages([{ id: Date.now().toString(), jobId: activeWorkroomJob.id, senderId: 'system', senderName: 'GAB Bot', senderRole: 'SYSTEM', text: `Payment released from escrow. Job marked as Completed.`, timestamp: new Date().toISOString() }, ...workroomMessages]);
  };

  const toggleRole = () => {
    if (!user) return;
    if (user.role === UserRole.CLIENT) setUser({ ...user, role: UserRole.FREELANCER, agreedToTerms: true });
    else setUser({ ...user, role: UserRole.CLIENT });
  };

  return (
    <div className={`min-h-screen ${user?.role === UserRole.ADMIN ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-4 lg:px-20 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white font-bold">G</div>
          <span className="font-bold text-xl">GAB <span className="text-emerald-600">Freelancers</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => setCurrentPage('jobs')} className="text-sm font-medium hover:text-emerald-600">Find Work</button>
          <button onClick={() => setCurrentPage('freelancers')} className="text-sm font-medium hover:text-emerald-600">Hire Talent</button>
          <button onClick={() => setCurrentPage('dashboard')} className="text-sm font-medium hover:text-emerald-600">Dashboard</button>
        </div>
        <div className="flex items-center gap-4">
          {!user ? (
            <Button onClick={() => setCurrentPage('auth')}>Login / Join</Button>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={toggleRole} className="text-[10px] uppercase font-bold text-slate-400 hover:text-emerald-600">Role: {user.role}</button>
              <img src={user.avatar} className="w-8 h-8 rounded-full border cursor-pointer" onClick={() => setCurrentPage('dashboard')} />
              <LogOut size={18} className="text-slate-400 cursor-pointer hover:text-red-500" onClick={() => { setUser(null); setCurrentPage('home'); }} />
            </div>
          )}
        </div>
      </nav>

      <main className="min-h-[calc(100vh-64px)]">
        {currentPage === 'auth' && <AuthPage onLogin={(u) => { setUser(u); setCurrentPage('dashboard'); }} onRegister={() => setCurrentPage('register')} users={users} />}
        {currentPage === 'register' && <RegisterPage onRegisterComplete={(u) => { setUsers([...users, u]); setUser(u); setCurrentPage('dashboard'); }} onBack={() => setCurrentPage('auth')} />}
        {currentPage === 'home' && <HomePage setPage={setCurrentPage} categories={INITIAL_CATEGORIES} activeAds={[]} jobs={jobs} services={services} />}
        {currentPage === 'jobs' && <JobsPage onSelectJob={(j) => { setSelectedJob(j); setCurrentPage('job-details'); }} categories={INITIAL_CATEGORIES} jobs={jobs} />}
        {currentPage === 'job-details' && selectedJob && <JobDetailsPage job={selectedJob} user={user} onBack={() => setCurrentPage('jobs')} onApply={handleApplyJob} proposals={proposals} onHire={handleHire} onMessage={() => setCurrentPage('dashboard')} />}
        {currentPage === 'freelancers' && <FreelancersPage freelancers={users.filter(u => u.role === UserRole.FREELANCER).map(u => ({ id: u.id, user: u, title: u.title || 'Freelancer', bio: u.bio || '', hourlyRate: u.hourlyRate || 0, skills: u.skills || [], rating: 4.5, jobsCompleted: 0, totalEarned: 0 }))} onViewProfile={(p) => { setSelectedFreelancer(p); setCurrentPage('profile'); }} />}
        {currentPage === 'dashboard' && user && <DashboardPage user={user} onEnterWorkroom={(j) => { setActiveWorkroomJob(j); setCurrentPage('workroom'); }} activeAds={[]} transactions={transactions} onDeposit={() => setUser({...user, balance: user.balance + 10000})} onWithdraw={() => {}} jobs={jobs} proposals={proposals} services={services.filter(s => s.freelancerId === user.id)} onCreateService={() => setCurrentPage('profile')} directOffers={[]} onRespondToOffer={() => {}} />}
        {currentPage === 'workroom' && user && activeWorkroomJob && <WorkroomPage onBack={() => setCurrentPage('dashboard')} user={user} onReleaseFunds={handleReleaseFunds} job={activeWorkroomJob} messages={workroomMessages.filter(m => m.jobId === activeWorkroomJob.id)} onSendMessage={onSendMessage} />}
        {currentPage === 'profile' && user && <ProfilePage user={user} onSave={(u) => { setUsers(users.map(existing => existing.id === u.id ? u : existing)); setUser(u); }} onBack={() => setCurrentPage('dashboard')} />}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 px-4 lg:px-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p>© 2024 GAB Freelancers Pakistan. Synced & Shared Workrooms.</p>
          <div className="flex gap-4">
            <span className="text-xs">JazzCash</span>
            <span className="text-xs">EasyPaisa</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
