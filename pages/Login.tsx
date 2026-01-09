
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../App';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const { setRole } = useAppState();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setRole(role);
    if (role === 'Employee') navigate('/entry');
    else if (role === 'Supervisor') navigate('/supervisor');
    else if (role === 'Admin') navigate('/reports');
  };

  const Icons = {
    Employee: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    Supervisor: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    Admin: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-slate-50">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      
      <div className="max-w-5xl w-full z-10 flex flex-col items-center">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded mb-6 shadow-lg">
            Role Selection
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">
            System Identity Access
          </h1>
          <div className="h-1.5 w-16 bg-blue-600 mx-auto rounded-full mb-4"></div>
          <p className="text-[12px] text-slate-500 font-bold uppercase tracking-widest opacity-60">
            Select your assigned role to proceed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {[
            { 
              role: 'Employee', 
              title: 'Employee', 
              desc: 'Shop floor operator responsible for daily production entry and machine logs.',
              color: 'text-blue-600',
              bg: 'bg-blue-50/50',
              border: 'hover:border-blue-600',
              icon: Icons.Employee
            },
            { 
              role: 'Supervisor', 
              title: 'Supervisor', 
              desc: 'Production management and quality audit. Can enter logs and approve worker records.',
              color: 'text-emerald-600',
              bg: 'bg-emerald-50/50',
              border: 'hover:border-emerald-600',
              icon: Icons.Supervisor
            },
            { 
              role: 'Admin', 
              title: 'Admin', 
              desc: 'Full system ownership. Handles master data, analytics, and bulk imports.',
              color: 'text-slate-900',
              bg: 'bg-slate-100/50',
              border: 'hover:border-slate-900',
              icon: Icons.Admin
            }
          ].map((p) => (
            <button
              key={p.role}
              onClick={() => handleRoleSelect(p.role as UserRole)}
              className={`group relative flex flex-col items-center text-center p-8 bg-white border border-slate-200 rounded-3xl shadow-sm transition-all duration-300 ${p.border} hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] overflow-hidden`}
            >
              <div className={`w-16 h-16 ${p.bg} ${p.color} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}>
                {p.icon}
              </div>
              
              <h2 className="text-xl font-black text-slate-900 uppercase mb-3 tracking-tight">
                {p.title}
              </h2>
              <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-tight mb-8">
                {p.desc}
              </p>
              
              <div className="mt-auto flex items-center gap-2 px-6 py-2 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100 transition-all">
                <span>Select Role</span>
                <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auth Active</span>
            </div>
          </div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
            Enterprise Application Framework v2.4.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
