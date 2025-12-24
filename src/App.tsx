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
  Palette,
  FileSignature,
  Download,
  Upload,
  CreditCard,
  Building,
  BarChart2,
  Save,
  LogIn,
  UserPlus,
  Star,
  MessageSquare,
  Package,
  Gift,
  Wallet,
  Calendar,
  Sun,
  Snowflake,
  Moon,
  CloudRain,
  Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { JobCard, FreelancerCard, Button, VerificationBadge, Badge, ServiceCard } from './components/UIComponents';
import type { Job, FreelancerProfile, User, Transaction, Advertisement, PayoutDetails, PlatformPaymentDetails, Proposal, Service, DirectOffer, WorkroomMessage, ThemeConfig } from './types';
import { UserRole } from './types';
import { generateJobDescription } from './services/geminiService';
import { AuthPage, RegisterPage } from './auth/Enhanced_Auth_Registration';

// --- Theme Definitions ---

const THEMES: ThemeConfig[] = [
  { id: 'classic', name: 'GAB Classic', primary: '#10b981', hover: '#059669', light: '#ecfdf5', text: 'text-emerald-600', icon: 'emerald' },
  { id: 'ramadan', name: 'Ramadan', primary: '#7c3aed', hover: '#6d28d9', light: '#f5f3ff', text: 'text-violet-600', icon: 'moon' },
  { id: 'eid', name: 'Eid Celebration', primary: '#047857', hover: '#065f46', light: '#f0fdf4', text: 'text-green-700', icon: 'gift' },
  { id: 'summer', name: 'Summer Hot', primary: '#f59e0b', hover: '#d97706', light: '#fffbeb', text: 'text-amber-600', icon: 'sun' },
  { id: 'winter', name: 'Winter Chill', primary: '#0ea5e9', hover: '#0284c7', light: '#f0f9ff', text: 'text-sky-600', icon: 'snow' },
  { id: 'sakura', name: 'Sakura Spring', primary: '#ec4899', hover: '#db2777', light: '#fdf2f8', text: 'text-pink-600', icon: 'flower' },
  { id: 'autumn', name: 'Autumn Maple', primary: '#c2410c', hover: '#9a3412', light: '#fff7ed', text: 'text-orange-700', icon: 'leaf' },
  { id: 'ocean', name: 'Deep Ocean', primary: '#0d9488', hover: '#0f766e', light: '#f0fdfa', text: 'text-teal-600', icon: 'waves' },
  { id: 'midnight', name: 'Midnight Neon', primary: '#3b82f6', hover: '#2563eb', light: '#eff6ff', text: 'text-blue-600', icon: 'zap' },
  { id: 'royal', name: 'Royal Gold', primary: '#854d0e', hover: '#713f12', light: '#fefce8', text: 'text-yellow-800', icon: 'crown' }
];

// --- Constants ---

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

// --- Utility Components ---

const ThemeSwitcher = ({ currentTheme, onSelect }: { currentTheme: string, onSelect: (id: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-slate-100 transition-colors flex items-center gap-2"
        title="Change Occasion Theme"
      >
        <Palette size={20} className="text-slate-600" />
        <span className="hidden lg:inline text-xs font-bold uppercase tracking-wider text-slate-400">Themes</span>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-2 grid grid-cols-1 gap-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1">Select Occasion</div>
            {THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => { onSelect(theme.id); setIsOpen(false); }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${currentTheme === theme.id ? 'bg-slate-100 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primary }} />
                  {theme.name}
                </div>
                {currentTheme === theme.id && <CheckCircle2 size={14} className="text-emerald-500" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- Pages ---

const HomePage = ({ setPage, categories, jobs, services }: any) => (
  <div className="space-y-16 pb-12">
    <section className="relative bg-slate-900 text-white rounded-3xl overflow-hidden mx-4 mt-4 py-20 px-6 lg:px-20 shadow-2xl">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center"></div>
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          Find Trusted Talent & Jobs in Pakistan
        </h1>
        <p className="text-slate-300 text-lg mb-8">
          The safest way to hire and work. Verified professionals, local payments, and secure escrow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => setPage('jobs')} className="h-12 text-lg px-8">Find Work</Button>
          <Button onClick={() => setPage('freelancers')} variant="secondary" className="h-12 text-lg px-8">Hire Talent</Button>
        </div>
      </div>
    </section>

    {services.length > 0 && (
      <section className="px-6 lg:px-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Professional Services</h2>
          <button onClick={() => setPage('jobs')} className="text-[var(--primary)] font-medium hover:underline">View All</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.slice(0, 4).map((service: any) => (
            <ServiceCard key={service.id} service={service} onClick={() => setPage('jobs')} />
          ))}
        </div>
      </section>
    )}

    <section className="px-6 lg:px-20">
      <h2 className="text-2xl font-bold text-slate-900 mb-8">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.slice(0, 10).map((cat: string) => (
          <div key={cat} onClick={() => setPage('jobs')} className="p-6 bg-white border border-slate-200 rounded-xl hover:border-[var(--primary)] hover:shadow-md cursor-pointer transition-all text-center group">
            <div className="w-12 h-12 bg-[var(--primary-light)] text-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
              <Briefcase size={20} />
            </div>
            <h3 className="font-medium text-slate-900 text-sm">{cat}</h3>
          </div>
        ))}
      </div>
    </section>

    <section className="px-6 lg:px-20 bg-slate-50 py-16 -mx-4 lg:-mx-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Jobs</h2>
            <p className="text-slate-600">Top opportunities for you today</p>
          </div>
          <button onClick={() => setPage('jobs')} className="text-[var(--primary)] font-medium hover:underline">View All</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.slice(0, 3).map((job: any) => (
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
        <input type="text" placeholder="Search jobs..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none" />
      </div>
    </div>
    <div className="grid lg:grid-cols-4 gap-8">
      <div className="hidden lg:block space-y-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map(cat => (
              <label key={cat} className="flex items-center gap-2 text-slate-600 cursor-pointer hover:text-[var(--primary)] text-sm">
                <input type="checkbox" className="rounded text-[var(--primary)] focus:ring-[var(--primary)]" />
                {cat}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:col-span-3 space-y-4">
        {jobs.map(job => <JobCard key={job.id} job={job} onClick={() => onSelectJob(job)} />)}
      </div>
    </div>
  </div>
);

const JobDetailsPage = ({ job, onBack, user, onApply, proposals, onHire, onMessage }: any) => {
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [bidAmount, setBidAmount] = useState(job.budget.toString());
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visibleProposals = user?.id === job.postedBy.id 
    ? proposals.filter((p: any) => p.jobId === job.id)
    : proposals.filter((p: any) => p.jobId === job.id && p.freelancerId === user?.id);

  const hasApplied = user && proposals.some((p: any) => p.freelancerId === user.id && p.jobId === job.id);

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
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-[var(--primary)] mb-6"><ChevronLeft size={18} /> Back to Jobs</button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">{job.title}</h1>
            <p className="whitespace-pre-wrap text-slate-700 leading-relaxed mb-6">{job.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-500 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2"><Briefcase size={16} /><span>{job.category}</span></div>
              <div className="flex items-center gap-2"><Clock size={16} /><span>Posted {new Date(job.postedAt).toLocaleDateString()}</span></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4">{user?.id === job.postedBy.id ? `Received Proposals (${visibleProposals.length})` : 'Your Proposal'}</h2>
            {visibleProposals.length === 0 ? <p className="text-slate-500 italic">No proposals to display.</p> : (
              <div className="space-y-4">
                {visibleProposals.map((p: any) => (
                  <div key={p.id} className="border p-4 rounded-lg hover:border-[var(--primary)] transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div><h4 className="font-bold text-slate-900">{p.freelancerName}</h4><p className="text-sm text-slate-500">{new Date(p.submittedAt).toLocaleDateString()}</p></div>
                      <div className="text-right">
                        <span className="font-bold text-[var(--primary)] block">PKR {p.bidAmount.toLocaleString()}</span>
                        {user?.id === job.postedBy.id && p.status === 'Pending' && job.status === 'Open' && (
                          <div className="flex gap-2 mt-2"><Button variant="secondary" className="text-xs py-1 h-8" onClick={() => onMessage(p.freelancerId, p.freelancerName)}>Message</Button><Button className="text-xs py-1 h-8" onClick={() => onHire(p)}>Hire Now</Button></div>
                        )}
                        <Badge color={p.status === 'Accepted' ? 'brand' : 'slate'}>{p.status}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">{p.coverLetter}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {user?.role === UserRole.FREELANCER && job.status === 'Open' && !hasApplied && showProposalForm && (
            <div className="bg-white p-8 rounded-xl border border-[var(--primary)] shadow-lg">
              <h3 className="text-xl font-bold mb-6">Submit Your Proposal</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Bid Amount (PKR)</label><input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Cover Letter</label><textarea rows={6} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" /></div>
                <div className="flex gap-4"><Button onClick={handleSubmitProposal} isLoading={isSubmitting}>Submit Proposal</Button><Button variant="ghost" onClick={() => setShowProposalForm(false)}>Cancel</Button></div>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="mb-6"><p className="text-sm text-slate-500 mb-1">Budget</p><p className="text-2xl font-bold text-slate-900">PKR {job.budget.toLocaleString()}</p></div>
            {user?.role === UserRole.FREELANCER && !hasApplied && !showProposalForm && <Button onClick={() => setShowProposalForm(true)} className="w-full">Apply Now</Button>}
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkroomPage = ({ onBack, user, onReleaseFunds, job, messages, onSendMessage }: any) => {
  const [inputText, setInputText] = useState('');
  const handleSend = () => { if (!inputText.trim()) return; onSendMessage(inputText); setInputText(''); };
  return (
    <div className="h-[calc(100vh-80px)] max-w-7xl mx-auto px-4 lg:px-8 py-4 flex gap-6">
      <div className="w-1/3 bg-white border border-slate-200 rounded-xl hidden md:flex flex-col">
        <div className="p-4 border-b border-slate-100 font-bold text-lg">Workroom Details</div>
        <div className="p-4 bg-[var(--primary-light)] border-l-4 border-[var(--primary)]"><h4 className="font-medium">{job.title}</h4><p className="text-xs text-slate-500 mt-1">Client: {job.postedBy.name}</p><div className="mt-2 text-sm font-bold text-[var(--primary)]">PKR {job.budget.toLocaleString()}</div></div>
      </div>
      <div className="flex-1 bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
           <h3 className="font-bold truncate max-w-xs">{job.title}</h3>
           <div className="flex items-center gap-2">
             {user.role === UserRole.CLIENT && job.status === 'In Progress' && <Button onClick={onReleaseFunds} className="text-xs h-8">Release Payment</Button>}
             <Button variant="outline" className="text-xs h-8" onClick={onBack}>Exit</Button>
           </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg: any) => (
            <div key={msg.id} className={`flex ${msg.senderRole === 'SYSTEM' ? 'justify-center' : (msg.senderId === user.id ? 'justify-end' : 'justify-start')}`}>
              {msg.senderRole === 'SYSTEM' ? <div className="bg-[var(--primary-light)] text-[var(--primary)] px-4 py-2 rounded-full text-[10px] font-bold border border-[var(--primary-light)]">{msg.text}</div> : (
                <div className={`max-w-[70%] rounded-xl p-3 shadow-sm ${msg.senderId === user.id ? 'bg-[var(--primary)] text-white rounded-br-none' : 'bg-white border border-slate-200 rounded-bl-none'}`}>
                  <p className="text-[10px] font-bold mb-1 opacity-70">{msg.senderName}</p><p className="text-sm">{msg.text}</p>
                  <p className="text-[9px] mt-1 text-right opacity-50">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-100 flex gap-2">
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 border border-slate-300 rounded-lg px-4 focus:outline-none focus:border-[var(--primary)]" />
          <button onClick={handleSend} className="bg-[var(--primary)] text-white p-2 rounded-lg hover:bg-[var(--hover)]"><Send size={20}/></button>
        </div>
      </div>
    </div>
  );
};

const FreelancersPage = ({ freelancers, onViewProfile }: any) => (
  <div className="px-4 lg:px-20 py-8">
    <h1 className="text-2xl font-bold mb-8">Hire Top Talent</h1>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {freelancers.filter((f: any) => f.user.status === 'Active').map((profile: any) => (
        <FreelancerCard key={profile.id} profile={profile} onViewProfile={() => onViewProfile(profile)} />
      ))}
    </div>
  </div>
);

const DashboardPage = ({ user, onEnterWorkroom, transactions, onDeposit, onWithdraw, jobs }: any) => {
  const activeContracts = jobs.filter((j: any) => j.status === 'In Progress' && (j.postedBy.id === user.id || j.assignedTo === user.id));
  return (
    <div className="px-4 lg:px-20 py-8 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <img src={user.avatar} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-[var(--primary-light)]" />
            <h2 className="text-xl font-bold">{user.name}</h2>
            <div className="border-t border-slate-100 mt-4 pt-4">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Balance</p>
              <p className="text-2xl font-bold text-[var(--primary)] mb-4">PKR {user.balance.toLocaleString()}</p>
              <div className="flex flex-col gap-2">
                <Button onClick={onDeposit} className="w-full text-sm">Add Funds</Button>
                {user.role === UserRole.FREELANCER && <Button onClick={onWithdraw} variant="secondary" className="w-full text-sm">Withdraw</Button>}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[var(--primary-light)] shadow-sm ring-1 ring-[var(--primary-light)]">
            <h3 className="font-bold flex items-center gap-2 mb-4"><Briefcase size={18} className="text-[var(--primary)]"/> Active Contracts</h3>
            {activeContracts.length === 0 ? <p className="text-center py-8 text-slate-500 text-sm">No active projects.</p> : (
              <div className="space-y-3">
                {activeContracts.map((j: any) => (
                  <div key={j.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div><h4 className="font-medium">{j.title}</h4><p className="text-sm text-slate-500">Status: {j.status}</p></div>
                    <Button variant="primary" className="text-sm py-1" onClick={() => onEnterWorkroom(j)}>Enter Workroom</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><h3 className="font-bold mb-6">Activity Overview</h3><div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={MOCK_EARNINGS}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
        </div>
      </div>
    </div>
  );
};

const PostJobPage = ({ onPost, categories, user }: any) => {
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [budget, setBudget] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const handlePost = () => { if (!title || !description || !budget) { alert("Fill all fields"); return; } onPost({ id: Date.now().toString(), title, description, budget: Number(budget), currency: 'PKR', postedBy: user, postedAt: new Date().toISOString(), category, type: 'Fixed Price', applicants: 0, status: 'Open' }); };
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div><label className="block text-sm font-medium mb-1">Job Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Category</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg">{categories.map((c: string) => <option key={c} value={c}>{c}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-1">Required Skills</label><input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Budget (PKR)</label><input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" /></div>
        <div><textarea rows={8} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" placeholder="Describe the project..." /></div>
        <Button onClick={handlePost} className="w-full">Post Job Now</Button>
      </div>
    </div>
  );
};

// --- App Root ---

const App = () => {
  const [currentPage, setCurrentPage] = useState('home'); 
  const [user, setUser] = useState<User | null>(null);
  const [themeId, setThemeId] = useState(() => localStorage.getItem('gab_theme') || 'classic');
  
  const [users, setUsers] = useState<User[]>(() => JSON.parse(localStorage.getItem('gab_users_v5') || '[]'));
  const [jobs, setJobs] = useState<Job[]>(() => JSON.parse(localStorage.getItem('gab_jobs_v5') || '[]'));
  const [proposals, setProposals] = useState<Proposal[]>(() => JSON.parse(localStorage.getItem('gab_proposals_v5') || '[]'));
  const [workroomMessages, setWorkroomMessages] = useState<WorkroomMessage[]>(() => JSON.parse(localStorage.getItem('gab_workroom_v5') || '[]'));
  const [transactions, setTransactions] = useState<Transaction[]>(() => JSON.parse(localStorage.getItem('gab_transactions_v5') || '[]'));

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeWorkroomJob, setActiveWorkroomJob] = useState<Job | undefined>(undefined);

  useEffect(() => { localStorage.setItem('gab_users_v5', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('gab_jobs_v5', JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem('gab_proposals_v5', JSON.stringify(proposals)); }, [proposals]);
  useEffect(() => { localStorage.setItem('gab_workroom_v5', JSON.stringify(workroomMessages)); }, [workroomMessages]);
  useEffect(() => { localStorage.setItem('gab_transactions_v5', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('gab_theme', themeId); }, [themeId]);

  useEffect(() => { const s = localStorage.getItem('gab_session_v5'); if (s) { const p = JSON.parse(s); const f = users.find(u => u.id === p.id) || p; setUser(f); } }, []);
  useEffect(() => { if (user) localStorage.setItem('gab_session_v5', JSON.stringify(user)); else localStorage.removeItem('gab_session_v5'); }, [user]);

  // Handle Theme Variable Injection
  useEffect(() => {
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --primary: ${theme.primary};
        --hover: ${theme.hover};
        --primary-light: ${theme.light};
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, [themeId]);

  const handleHire = (p: Proposal) => {
    if(!user || user.balance < p.bidAmount) { alert("Deposit funds first!"); return; }
    setUser({ ...user, balance: user.balance - p.bidAmount });
    setJobs(jobs.map(j => j.id === p.jobId ? { ...j, status: 'In Progress', assignedTo: p.freelancerId, budget: p.bidAmount } : j));
    setProposals(proposals.map(pr => pr.id === p.id ? { ...pr, status: 'Accepted' } : pr));
    setWorkroomMessages([{ id: Date.now().toString(), jobId: p.jobId, senderId: 'system', senderName: 'GAB Bot', senderRole: 'SYSTEM', text: `Freelancer hired. Funds secured in Escrow.`, timestamp: new Date().toISOString() }, ...workroomMessages]);
    setCurrentPage('dashboard');
  };

  const onSendMessage = (text: string) => {
    if(!user || !activeWorkroomJob) return;
    setWorkroomMessages([{ id: Date.now().toString(), jobId: activeWorkroomJob.id, senderId: user.id, senderName: user.name, senderRole: user.role as any, text, timestamp: new Date().toISOString() }, ...workroomMessages]);
  };

  const handleReleaseFunds = () => {
    if(!activeWorkroomJob) return;
    setJobs(jobs.map(j => j.id === activeWorkroomJob.id ? { ...j, status: 'Completed' } : j));
    setWorkroomMessages([{ id: Date.now().toString(), jobId: activeWorkroomJob.id, senderId: 'system', senderName: 'GAB Bot', senderRole: 'SYSTEM', text: `Payment released. Job completed.`, timestamp: new Date().toISOString() }, ...workroomMessages]);
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900`}>
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-4 lg:px-20 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <div className="w-8 h-8 bg-[var(--primary)] rounded flex items-center justify-center text-white font-bold transition-colors">G</div>
          <span className="font-bold text-xl hidden sm:inline">GAB <span className="text-[var(--primary)]">Freelancers</span></span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => setCurrentPage('jobs')} className="text-sm font-medium hover:text-[var(--primary)] transition-colors">Find Work</button>
          <button onClick={() => setCurrentPage('freelancers')} className="text-sm font-medium hover:text-[var(--primary)] transition-colors">Talent</button>
          <button onClick={() => setCurrentPage('dashboard')} className="text-sm font-medium hover:text-[var(--primary)] transition-colors">Dashboard</button>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher currentTheme={themeId} onSelect={setThemeId} />
          {!user ? (
            <Button onClick={() => setCurrentPage('auth')}>Join Now</Button>
          ) : (
            <div className="flex items-center gap-3">
              <img src={user.avatar} className="w-8 h-8 rounded-full border cursor-pointer" onClick={() => setCurrentPage('dashboard')} />
              <LogOut size={18} className="text-slate-400 cursor-pointer hover:text-red-500" onClick={() => { setUser(null); setCurrentPage('home'); }} />
            </div>
          )}
        </div>
      </nav>

      <main className="min-h-[calc(100vh-64px)]">
        {currentPage === 'auth' && <AuthPage onLogin={(u) => { setUser(u); setCurrentPage('dashboard'); }} onRegister={() => setCurrentPage('register')} users={users} />}
        {currentPage === 'register' && <RegisterPage onRegisterComplete={(u) => { setUsers([...users, u]); setUser(u); setCurrentPage('dashboard'); }} onBack={() => setCurrentPage('auth')} />}
        {currentPage === 'home' && <HomePage setPage={setCurrentPage} categories={INITIAL_CATEGORIES} jobs={jobs} services={[]} />}
        {currentPage === 'jobs' && <JobsPage onSelectJob={(j) => { setSelectedJob(j); setCurrentPage('job-details'); }} categories={INITIAL_CATEGORIES} jobs={jobs} />}
        {currentPage === 'job-details' && selectedJob && <JobDetailsPage job={selectedJob} user={user} onBack={() => setCurrentPage('jobs')} onApply={(jid: string, bid: number, cover: string) => setProposals([{ id: Date.now().toString(), jobId: jid, freelancerId: user!.id, freelancerName: user!.name, coverLetter: cover, bidAmount: bid, submittedAt: new Date().toISOString(), status: 'Pending' }, ...proposals])} proposals={proposals} onHire={handleHire} onMessage={() => setCurrentPage('dashboard')} />}
        {currentPage === 'freelancers' && <FreelancersPage freelancers={users.filter(u => u.role === UserRole.FREELANCER).map(u => ({ id: u.id, user: u, title: u.title || 'Freelancer', bio: u.bio || '', hourlyRate: u.hourlyRate || 0, skills: u.skills || [], rating: 4.5, jobsCompleted: 0, totalEarned: 0 }))} onViewProfile={(p: any) => { alert('Profile view coming soon'); }} />}
        {currentPage === 'dashboard' && user && <DashboardPage user={user} onEnterWorkroom={(j: any) => { setActiveWorkroomJob(j); setCurrentPage('workroom'); }} activeAds={[]} transactions={transactions} onDeposit={() => setUser({...user, balance: user.balance + 10000})} onWithdraw={() => {}} jobs={jobs} />}
        {currentPage === 'workroom' && user && activeWorkroomJob && <WorkroomPage onBack={() => setCurrentPage('dashboard')} user={user} onReleaseFunds={handleReleaseFunds} job={activeWorkroomJob} messages={workroomMessages.filter(m => m.jobId === activeWorkroomJob.id)} onSendMessage={onSendMessage} />}
        {currentPage === 'post-job' && user && <PostJobPage onPost={(j: any) => { setJobs([j, ...jobs]); setCurrentPage('jobs'); }} categories={INITIAL_CATEGORIES} user={user} />}
      </main>

      <footer className="bg-white py-12 px-4 lg:px-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="font-bold text-lg">GAB <span className="text-[var(--primary)]">Freelancers</span></span>
            <p className="text-sm text-slate-400 mt-1">Occasion: {THEMES.find(t => t.id === themeId)?.name}</p>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <button onClick={() => setCurrentPage('post-job')} className="hover:text-[var(--primary)]">Post a Job</button>
            <button onClick={() => setCurrentPage('freelancers')} className="hover:text-[var(--primary)]">Browse Talent</button>
            <button onClick={() => setCurrentPage('jobs')} className="hover:text-[var(--primary)]">Find Work</button>
          </div>
          <p className="text-xs text-slate-400">© 2024 GAB Freelancers. Built for Pakistan.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
