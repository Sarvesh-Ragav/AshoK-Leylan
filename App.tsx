
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import { UserRole, ProductionEntry, AppState } from './types';
import { INITIAL_DUMMY_DATA } from './constants';
import Login from './pages/Login';
import EmployeeEntry from './pages/EmployeeEntry';
import SupervisorReview from './pages/SupervisorReview';
import Reports from './pages/Reports';
import ExcelUpload from './pages/ExcelUpload';

interface AppContextType {
  state: AppState;
  setRole: (role: UserRole) => void;
  addEntry: (entry: ProductionEntry) => void;
  updateEntry: (id: string, updates: Partial<ProductionEntry>) => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppState must be used within AppProvider");
  return context;
};

const Header: React.FC = () => {
  const { state, setRole, resetDemo } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  if (location.pathname === '/') return null;

  return (
    <header className="bg-slate-900 text-white shadow-sm sticky top-0 z-50 h-10 border-b border-slate-700 flex items-center px-3">
      <div className="flex-1 flex items-center gap-3">
        <div className="text-[12px] font-bold tracking-tight uppercase border-r border-slate-700 pr-3">
          MES Console
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden sm:block">
          PRD-NODE-04
        </div>
      </div>
      
      <nav className="flex items-center gap-3">
        <div className="text-right mr-1 hidden md:block">
          <p className="font-bold text-[11px] text-blue-400 uppercase leading-none">{state.role}</p>
        </div>
        
        <div className="flex gap-1">
          {state.role === 'Admin' && (
            <>
              <Link to="/reports" className="bg-slate-800 hover:bg-slate-700 px-2 py-1 border border-slate-600 font-bold text-[10px] uppercase transition rounded-sm">BI Reports</Link>
              <Link to="/upload" className="bg-slate-800 hover:bg-slate-700 px-2 py-1 border border-slate-600 font-bold text-[10px] uppercase transition rounded-sm">Import</Link>
            </>
          )}
          {state.role === 'Supervisor' && (
            <Link to="/supervisor" className="bg-slate-800 hover:bg-slate-700 px-2 py-1 border border-slate-600 font-bold text-[10px] uppercase transition rounded-sm">Review Queue</Link>
          )}
          <button 
            onClick={resetDemo}
            className="bg-red-950/40 text-red-300 hover:bg-red-900/50 px-2 py-1 border border-red-900 font-bold text-[10px] uppercase transition rounded-sm"
          >
            Reset
          </button>
          <button 
            onClick={handleLogout}
            className="bg-white text-slate-900 hover:bg-slate-100 px-2 py-1 font-bold text-[10px] uppercase transition border border-slate-200 rounded-sm"
          >
            Logoff
          </button>
        </div>
      </nav>
    </header>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('demo_state_registry');
    return saved ? JSON.parse(saved) : { role: null, entries: INITIAL_DUMMY_DATA };
  });

  useEffect(() => {
    localStorage.setItem('demo_state_registry', JSON.stringify(state));
  }, [state]);

  const setRole = (role: UserRole) => setState(prev => ({ ...prev, role }));
  const addEntry = (entry: ProductionEntry) => setState(prev => ({ ...prev, entries: [...prev.entries, entry] }));
  const updateEntry = (id: string, updates: Partial<ProductionEntry>) => {
    setState(prev => ({
      ...prev,
      entries: prev.entries.map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  };
  const resetDemo = () => {
    if (window.confirm("Restore system baseline data? Current session will be wiped.")) {
      setState({ role: state.role, entries: INITIAL_DUMMY_DATA });
    }
  };

  return (
    <AppContext.Provider value={{ state, setRole, addEntry, updateEntry, resetDemo }}>
      <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-[#fbfcfd] selection:bg-blue-900 selection:text-white text-[12px]">
        <Header />
        <main className="flex-1 flex flex-col p-2 md:p-3 w-full">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/entry" element={<EmployeeEntry />} />
            <Route path="/supervisor" element={<SupervisorReview />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/upload" element={<ExcelUpload />} />
          </Routes>
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;
