
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

  // Helper icons for professional look
  const Icons = {
    Employee: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    Supervisor: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    Admin: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-slate-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      
      <div className="max-w-5xl w-full z-10 flex flex-col items-center">
        {/* Main Branding Section */}
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
            Authorized Personnel Only
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">
            Manufacturing Execution System
          </h1>
          <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full mb-3"></div>
          <p className="text-[12px] text-slate-500 font-medium italic">
            Enterprise Operational Portal • Secure Access Terminal
          </p>
        </div>

        {/* Portal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[
            { 
              role: 'Employee', 
              title: 'Operational Entry', 
              desc: 'Live shop floor data capture, machine logs, and production metrics.',
              color: 'text-blue-600',
              hover: 'hover:border-blue-600 hover:shadow-blue-900/10',
              icon: Icons.Employee
            },
            { 
              role: 'Supervisor', 
              title: 'Quality Assurance', 
              desc: 'Record validation, variance approval, and supervisor overrides.',
              color: 'text-emerald-600',
              hover: 'hover:border-emerald-600 hover:shadow-emerald-900/10',
              icon: Icons.Supervisor
            },
            { 
              role: 'Admin', 
              title: 'Management Hub', 
              desc: 'Advanced business intelligence, bulk imports, and factory MIS.',
              color: 'text-slate-700',
              hover: 'hover:border-slate-900 hover:shadow-slate-900/10',
              icon: Icons.Admin
            }
          ].map((p) => (
            <button
              key={p.role}
              onClick={() => handleRoleSelect(p.role as UserRole)}
              className={`group relative flex flex-col p-6 bg-white border border-slate-200 rounded-lg shadow-sm transition-all duration-300 text-left ${p.hover} active:scale-[0.98] overflow-hidden`}
            >
              {/* Subtle accent corner */}
              <div className={`absolute top-0 right-0 w-12 h-12 -mr-6 -mt-6 rounded-full opacity-10 transition-transform group-hover:scale-150 ${p.color.replace('text', 'bg')}`}></div>
              
              <div className={`${p.color} mb-4 transition-transform group-hover:scale-110 duration-300`}>
                {p.icon}
              </div>
              
              <h2 className="text-[13px] font-extrabold text-slate-900 uppercase mb-2 tracking-wide">
                {p.title}
              </h2>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium mb-6 flex-1">
                {p.desc}
              </p>
              
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                <span>Enter Portal</span>
                <svg className="w-3 h-3 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* System Health / Footer Info */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-200 pt-8 w-full max-w-4xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Network: Stable</span>
          </div>
          <div className="hidden sm:block text-slate-300">|</div>
          <div>Node: US-EAST-PRD-04</div>
          <div className="hidden sm:block text-slate-300">|</div>
          <div>Version: v2.4.0 (Enterprise)</div>
          <div className="flex-1 text-center sm:text-right mt-4 sm:mt-0 text-slate-500">
            © 2024 Industrial Systems Group
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
