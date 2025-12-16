import React, { useState } from 'react';
import { UserRole } from '../types';
import type { User } from '../types';
import { Button } from '../components/UIComponents';
import { Mail, Lock, User as UserIcon, ArrowRight, LogIn, UserPlus } from 'lucide-react';

interface AuthPageProps {
  onLogin: (user: User) => void;
  onRegister: () => void;
  users: User[];
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister, users }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Simple mock authentication
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // For demo purposes, we accept any password if user exists, or create a mock session
    // In a real app, you would verify password hash here
    if (user) {
       // Simulate checking password (mock)
       if (password === 'password' || password === user.password || true) { // allowing loose auth for demo
         onLogin(user);
       } else {
         setError('Invalid credentials');
       }
    } else {
       // Demo fallback for specific hardcoded emails if not in users array yet
       if (email === 'admin@gab.com' && password === 'admin') {
         // This case should ideally be handled by the main app logic or pre-seeded user
         setError('User not found');
       } else {
         setError('User not found. Please sign up.');
       }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-emerald-600 p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-emerald-600 font-bold text-3xl">G</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-emerald-100 mt-2">Log in to manage your freelance career</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button className="w-full py-3 mt-2" onClick={() => {}}>
              <LogIn size={18} /> Log In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Don't have an account?{' '}
              <button onClick={onRegister} className="text-emerald-600 font-bold hover:underline">
                Sign Up
              </button>
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100">
             <p className="text-xs text-center text-slate-400 mb-2">Demo Credentials</p>
             <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">ahmed@example.com</span>
                <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">sana@example.com</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RegisterPageProps {
  onRegisterComplete: (user: User) => void;
  onBack: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterComplete, onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password, // In a real app, never store plain text
      role,
      verified: false,
      balance: 0,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      status: 'Active'
    };
    
    onRegisterComplete(newUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-center relative">
          <button onClick={onBack} className="absolute left-4 top-4 text-slate-400 hover:text-white">
             <ArrowRight size={24} className="rotate-180" />
          </button>
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-900/50">
            <UserPlus className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 mt-2">Join Pakistan's safest freelance marketplace</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Ali Khan"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="ali@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Create a strong password"
                  required
                />
              </div>
            </div>
            
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-2">I want to:</label>
               <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setRole(UserRole.CLIENT)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${role === UserRole.CLIENT ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    Hire Talent
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole(UserRole.FREELANCER)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${role === UserRole.FREELANCER ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    Find Work
                  </button>
               </div>
            </div>

            <Button className="w-full py-3 mt-4" onClick={() => {}}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Already have an account?{' '}
              <button onClick={onBack} className="text-emerald-600 font-bold hover:underline">
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
