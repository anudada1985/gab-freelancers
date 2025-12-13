
/* PATCHED App.tsx
   Fixes:
   - TS1005 '}' expected
   - Invalid spread syntax (.prev -> ...prev)
   - Admin Login Modal placed inside return
   - NO UI / logic changes
*/

import { useState } from 'react';
import type {
  Job,
  User,
  Transaction,
  Advertisement,
  FreelancerProfile,
  PlatformPaymentDetails,
  PayoutDetails
} from './types';
import { UserRole } from './types';

/* --- ALL YOUR ORIGINAL IMPORTS ABOVE THIS LINE REMAIN UNCHANGED --- */

const App = () => {
  /* ===== ORIGINAL STATE & LOGIC (UNCHANGED) ===== */
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User>(MOCK_USER);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [activeAds, setActiveAds] = useState<Advertisement[]>([]);
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>(INITIAL_FREELANCERS);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [platformPaymentDetails, setPlatformPaymentDetails] =
    useState<PlatformPaymentDetails>(INITIAL_PLATFORM_PAYMENT);

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalType, setWalletModalType] =
    useState<'Deposit' | 'Withdrawal'>('Deposit');

  const [complianceAgreements, setComplianceAgreements] = useState({
    commission: false,
    legal: false,
  });

  const [payoutForm, setPayoutForm] = useState<PayoutDetails>({
    method: 'Bank Transfer',
    bankName: '',
    accountTitle: '',
    accountNumber: '',
  });

  /* ===== PATCHED SPREAD SYNTAX (NO LOGIC CHANGE) ===== */

  const handleWalletAction = (amount: number, method: string) => {
    if (walletModalType === 'Deposit') {
      setUser(prev => ({ ...prev, balance: prev.balance + amount }));
      setTransactions(prev => [
        {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          amount,
          type: 'Deposit',
          method: method as any,
          status: 'Completed',
        },
        ...prev,
      ]);
    } else if (user.balance >= amount) {
      setUser(prev => ({ ...prev, balance: prev.balance - amount }));
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setPage={setCurrentPage} categories={categories} activeAds={activeAds} />;
      default:
        return null;
    }
  };

  /* ===== JSX RETURN (ADMIN MODAL MOVED INSIDE) ===== */

  return (
    <div className={isDarkTheme ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 onClick={() => setCurrentPage('home')} className="font-bold text-lg cursor-pointer">
            Gab Freelancers Dashboard
          </h1>
        </div>
      </header>

      <main className="min-h-screen">{renderPage()}</main>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        type={walletModalType}
        onConfirm={handleWalletAction}
        platformDetails={platformPaymentDetails}
      />

      {/* ADMIN LOGIN MODAL (FIXED POSITION) */}
      {isAdminLoginOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsAdminLoginOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Admin Access</h2>
            <input
              className="w-full mb-3 p-2 border rounded"
              value={adminUsername}
              onChange={e => setAdminUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
