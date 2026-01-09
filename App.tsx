
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

  const isAdmin = state.role === 'Admin';
  const isSupervisor = state.role === 'Supervisor';
  const isEmployee = state.role === 'Employee';

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 h-12 border-b border-slate-700 flex items-center px-4">
      <div className="flex-1 flex items-center gap-4">
        <Link to="/" className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-black text-sm">AL</Link>
        <div className="flex flex-col">
          <div className="text-[11px] font-black tracking-tight uppercase leading-none">
            MES Terminal
          </div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">
            Factory Node: {state.role?.toUpperCase()}
          </div>
        </div>
      </div>
      
      <nav className="flex items-center gap-4">
        <div className="flex gap-2">
          {/* Universal Production Entry for all roles */}
          <Link to="/entry" className={`px-3 py-1.5 font-black text-[9px] uppercase transition rounded-lg border ${location.pathname === '/entry' ? 'bg-white text-slate-900 border-white' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}`}>Production Entry</Link>
          
          {(isSupervisor || isAdmin) && (
            <Link to="/supervisor" className={`px-3 py-1.5 font-black text-[9px] uppercase transition rounded-lg border ${location.pathname === '/supervisor' ? 'bg-white text-slate-900 border-white' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}`}>Review Queue</Link>
          )}

          {isAdmin && (
            <>
              <Link to="/reports" className={`px-3 py-1.5 font-black text-[9px] uppercase transition rounded-lg border ${location.pathname === '/reports' ? 'bg-white text-slate-900 border-white' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}`}>BI Reports</Link>
              <Link to="/upload" className={`px-3 py-1.5 font-black text-[9px] uppercase transition rounded-lg border ${location.pathname === '/upload' ? 'bg-white text-slate-900 border-white' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}`}>Import</Link>
            </>
          )}
        </div>

        <div className="h-6 w-px bg-slate-700 mx-2"></div>

        <div className="flex gap-2">
          <button 
            onClick={resetDemo}
            className="text-red-400 hover:bg-red-950/30 px-3 py-1.5 font-black text-[9px] uppercase transition rounded-lg border border-transparent"
          >
            Reset
          </button>
          <button 
            onClick={handleLogout}
            className="bg-slate-800 text-white hover:bg-slate-700 px-4 py-1.5 font-black text-[9px] uppercase transition border border-slate-600 rounded-lg shadow-sm"
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
