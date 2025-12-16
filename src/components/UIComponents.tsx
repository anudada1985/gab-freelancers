import React from 'react';
import { 
  ShieldCheck, 
  Clock,
  Star,
  Heart
} from 'lucide-react';
import type { Job, FreelancerProfile, Service } from '../types';

// --- Badges ---

export const VerificationBadge = () => (
  <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
    <ShieldCheck size={12} />
    <span>NADRA Verified</span>
  </div>
);

export const Badge = ({ children, color = 'slate' }: { children?: React.ReactNode, color?: 'slate' | 'emerald' | 'blue' | 'red' | 'yellow' }) => {
  const colors = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    yellow: 'bg-yellow-50 text-yellow-800 border-yellow-100'
  };
  
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
};

export const PaymentMethodBadge = ({ method }: { method: string }) => {
  const colors: Record<string, string> = {
    'JazzCash': 'bg-red-50 text-red-700 border-red-100',
    'EasyPaisa': 'bg-green-50 text-green-700 border-green-100',
    'Bank Transfer': 'bg-blue-50 text-blue-700 border-blue-100',
  };
  const colorClass = colors[method] || 'bg-gray-50 text-gray-700';
  
  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${colorClass}`}>
      {method}
    </span>
  );
};

// --- Cards ---

export const JobCard: React.FC<{ job: Job; onClick: () => void }> = ({ job, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
          {job.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
          <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-xs">{job.category}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Clock size={12} /> Posted {new Date(job.postedAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="text-right shrink-0 ml-4">
        <div className="text-lg font-bold text-slate-900 whitespace-nowrap">
          PKR {job.budget.toLocaleString()}
        </div>
        <div className="text-xs text-slate-500 uppercase">{job.type}</div>
      </div>
    </div>
    
    <p className="text-slate-600 text-sm line-clamp-2 mb-4">
      {job.description}
    </p>

    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
      <div className="flex items-center gap-2">
        {job.postedBy.verified && <VerificationBadge />}
        <span className="text-xs text-slate-400">by {job.postedBy.name}</span>
      </div>
      <div className="flex items-center gap-2">
         {job.status === 'In Progress' && <Badge color="blue">In Progress</Badge>}
         {job.status === 'Completed' && <Badge color="emerald">Completed</Badge>}
         <span className="text-xs font-medium text-emerald-600">
          {job.applicants} Proposals
         </span>
      </div>
    </div>
  </div>
);

export const ServiceCard: React.FC<{ service: Service; onClick: () => void }> = ({ service, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer flex flex-col h-full"
  >
    <div className="relative h-48 overflow-hidden">
      <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full hover:bg-white text-slate-400 hover:text-red-500 transition-colors shadow-sm">
        <Heart size={16} />
      </div>
    </div>
    
    <div className="p-4 flex-1 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <img src={service.freelancer.avatar} className="w-6 h-6 rounded-full border border-slate-100" />
        <span className="text-sm font-bold text-slate-900 truncate">{service.freelancer.name}</span>
        {service.freelancer.verified && <ShieldCheck size={12} className="text-emerald-500" />}
      </div>
      
      <h3 className="font-medium text-slate-800 mb-2 line-clamp-2 hover:text-emerald-600 transition-colors flex-1">
        {service.title}
      </h3>
      
      <div className="flex items-center gap-1 text-sm text-yellow-500 font-bold mb-4">
        <Star size={14} fill="currentColor" />
        <span>{service.rating}</span>
        <span className="text-slate-400 font-normal">({service.reviewsCount})</span>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
        <div className="text-xs text-slate-500 uppercase font-medium">Starting at</div>
        <div className="text-lg font-bold text-emerald-600">PKR {service.price.toLocaleString()}</div>
      </div>
    </div>
  </div>
);

export const FreelancerCard: React.FC<{ profile: FreelancerProfile; onViewProfile?: () => void }> = ({ profile, onViewProfile }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4 mb-4">
      <img src={profile.user.avatar} alt={profile.user.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100" />
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900">{profile.user.name}</h3>
          {profile.user.verified && <VerificationBadge />}
        </div>
        <p className="text-emerald-600 text-sm font-medium">{profile.title}</p>
        <div className="flex items-center gap-1 text-yellow-500 text-sm mt-0.5">
          <Star size={14} fill="currentColor" />
          <span className="font-bold">{profile.rating}</span>
          <span className="text-slate-400 font-normal">({profile.jobsCompleted} jobs)</span>
        </div>
      </div>
    </div>
    
    <p className="text-slate-600 text-sm mb-4 line-clamp-3">{profile.bio}</p>
    
    <div className="flex flex-wrap gap-2 mb-4">
      {profile.skills.slice(0, 3).map(skill => (
        <span key={skill} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
          {skill}
        </span>
      ))}
      {profile.skills.length > 3 && (
        <span className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded-full">+{profile.skills.length - 3}</span>
      )}
    </div>

    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
      <span className="font-bold text-slate-900">PKR {profile.hourlyRate}/hr</span>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onViewProfile?.();
        }}
        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
      >
        View Profile
      </button>
    </div>
  </div>
);

// --- Inputs & Buttons ---

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick, 
  disabled = false, 
  isLoading = false 
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-emerald-200",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : children}
    </button>
  );
};
