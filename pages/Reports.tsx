
import React, { useMemo, useState } from 'react';
import { useAppState } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SHIFTS } from '../constants';

type TimeMode = 'Weekly' | 'Monthly' | 'Yearly';

const Reports: React.FC = () => {
  const { state } = useAppState();
  const [timeMode, setTimeMode] = useState<TimeMode>('Monthly');
  const [selectedShift, setSelectedShift] = useState<string>('All');
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const approvedEntries = useMemo(() => 
    state.entries.filter(e => e.status === 'Approved'), 
  [state.entries]);

  // Unified Filtered Set for both Graph and KPIs
  const filteredEntries = useMemo(() => {
    let list = [...approvedEntries];
    if (selectedShift !== 'All') {
      list = list.filter(e => e.shift === selectedShift);
    }
    return list;
  }, [approvedEntries, selectedShift]);

  // Helper to parse DD/MM/YYYY
  const parseDate = (dateStr: string) => {
    const [d, m, y] = dateStr.split('/').map(Number);
    return new Date(y, m - 1, d);
  };

  // Helper for ISO week number
  const getWeekNumber = (d: Date) => {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };

  const chartData = useMemo(() => {
    const groups: Record<string, { label: string; planned: number; actual: number; timestamp: number }> = {};

    filteredEntries.forEach(entry => {
      const d = parseDate(entry.date);
      let key = "";
      let label = "";

      if (timeMode === 'Weekly') {
        const week = getWeekNumber(d);
        key = `${d.getFullYear()}-W${week}`;
        label = `Wk ${week}`;
      } else if (timeMode === 'Monthly') {
        const month = d.toLocaleString('default', { month: 'short' });
        key = `${d.getFullYear()}-${d.getMonth()}`;
        label = `${month} ${d.getFullYear()}`;
      } else {
        key = `${d.getFullYear()}`;
        label = key;
      }

      if (!groups[key]) {
        groups[key] = { label, planned: 0, actual: 0, timestamp: d.getTime() };
      }
      groups[key].planned += entry.plannedQty;
      groups[key].actual += entry.actualQty;
    });

    return Object.values(groups).sort((a, b) => a.timestamp - b.timestamp);
  }, [filteredEntries, timeMode]);

  const kpis = useMemo(() => {
    const totalPlanned = filteredEntries.reduce((acc, curr) => acc + (curr.plannedQty || 0), 0);
    const totalActual = filteredEntries.reduce((acc, curr) => acc + (curr.actualQty || 0), 0);
    const totalRejected = filteredEntries.reduce((acc, curr) => acc + (curr.rejectedQty || 0), 0);
    
    const achievement = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;
    const yieldRate = totalActual > 0 ? ((totalActual - totalRejected) / totalActual) * 100 : 100;

    return { totalPlanned, totalActual, totalRejected, achievement, yieldRate };
  }, [filteredEntries]);

  const handlePrint = () => {
    window.print();
  };

  if (approvedEntries.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">No Validated Data Found</h2>
        <p className="text-[11px] text-slate-500 mt-2">Validated production logs are required for business intelligence generation.</p>
      </div>
    );
  }

  // --- Print Preview Overlay ---
  if (showPrintPreview) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-100 flex flex-col items-center overflow-auto p-4 md:p-8 print:p-0 print:bg-white">
        <div className="flex justify-between w-full max-w-[210mm] mb-6 print:hidden items-center">
          <button 
            onClick={() => setShowPrintPreview(false)}
            className="flex items-center gap-2 text-slate-600 font-bold uppercase text-[10px] hover:text-slate-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Return to Dashboard
          </button>
          <button 
            onClick={handlePrint}
            className="bg-slate-900 text-white px-6 py-2 rounded-sm font-black text-[10px] uppercase shadow-lg hover:bg-slate-800"
          >
            Print Full Multi-Page PDF
          </button>
        </div>

        {/* Paper Container (Multi-Page Capable) */}
        <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-2xl p-[15mm] border border-slate-200 print:shadow-none print:border-none print:m-0 print:p-0">
          
          {/* Section 1: Executive Header (Page 1) */}
          <div className="border-b-4 border-slate-900 pb-6 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase leading-none mb-1">Comprehensive Audit Master Report</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise Production Management System • Unified Node v2.4</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">REF: {Math.random().toString(36).substring(7).toUpperCase()}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase">{new Date().toLocaleString()}</p>
            </div>
          </div>

          {/* Section 2: KPIs & Scope */}
          <div className="grid grid-cols-2 gap-10 mb-8">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <h3 className="text-[10px] font-black text-slate-900 uppercase mb-3 border-b border-slate-200 pb-1">Report Parameters</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px]"><span className="text-slate-500">Temporal Filter:</span> <span className="font-bold text-slate-900 uppercase">{timeMode} Grouping</span></div>
                <div className="flex justify-between text-[11px]"><span className="text-slate-500">Operational Shift:</span> <span className="font-bold text-slate-900 uppercase">{selectedShift}</span></div>
                <div className="flex justify-between text-[11px]"><span className="text-slate-500">Dataset Size:</span> <span className="font-bold text-slate-900 uppercase">{filteredEntries.length} Validated Logs</span></div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <h3 className="text-[10px] font-black text-slate-900 uppercase mb-3 border-b border-slate-200 pb-1">Operational Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px]"><span className="text-slate-500">Gross Actual Output:</span> <span className="font-bold text-slate-900">{kpis.totalActual.toLocaleString()} Units</span></div>
                <div className="flex justify-between text-[11px]"><span className="text-slate-500">Weighted Pass Rate:</span> <span className="font-bold text-emerald-700">{kpis.yieldRate.toFixed(2)}%</span></div>
                <div className="flex justify-between text-[11px]"><span className="text-slate-500">Verified Rejections:</span> <span className="font-bold text-red-600">{kpis.totalRejected} Defective Units</span></div>
              </div>
            </div>
          </div>

          {/* Section 3: Visual Analytics (The Graph in PDF) */}
          <div className="mb-12">
            <h3 className="text-[11px] font-black text-slate-900 uppercase mb-4 tracking-tighter border-l-4 border-slate-900 pl-3">Performance Trends (Visual Analysis)</h3>
            <div className="h-[280px] w-full border border-slate-100 p-2 rounded">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 9, fontWeight: 800, fill: '#64748b' }} 
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} 
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Bar 
                    isAnimationActive={false} 
                    dataKey="planned" 
                    name="Target" 
                    fill="#1e293b" 
                    barSize={32} 
                    radius={[2, 2, 0, 0]} 
                  />
                  <Bar 
                    isAnimationActive={false} 
                    dataKey="actual" 
                    name="Actual" 
                    fill="#10b981" 
                    barSize={32} 
                    radius={[2, 2, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Section 4: Multi-page Table Ledger */}
          <div className="print:mt-10">
            <h3 className="text-[11px] font-black text-slate-900 uppercase mb-4 tracking-tighter border-l-4 border-slate-900 pl-3">Detailed Audit Record Ledger</h3>
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-slate-900 text-white text-[9px] font-black uppercase">
                  <th className="p-2 border border-slate-900">Index Date</th>
                  <th className="p-2 border border-slate-900">Area/Shop</th>
                  <th className="p-2 border border-slate-900">Equipment ID</th>
                  <th className="p-2 border border-slate-900">Component Ref</th>
                  <th className="p-2 border border-slate-900 text-right">Target</th>
                  <th className="p-2 border border-slate-900 text-right">Actual</th>
                  <th className="p-2 border border-slate-900 text-right">Rejected</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, idx) => (
                  <tr key={entry.id} className={`text-[10px] break-inside-avoid ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                    <td className="p-2 border border-slate-200 font-bold whitespace-nowrap">{entry.date}</td>
                    <td className="p-2 border border-slate-200">{entry.shop}</td>
                    <td className="p-2 border border-slate-200 font-bold text-slate-700">{entry.machine}</td>
                    <td className="p-2 border border-slate-200 italic text-slate-600">{entry.part}</td>
                    <td className="p-2 border border-slate-200 text-right font-medium">{entry.plannedQty}</td>
                    <td className="p-2 border border-slate-200 text-right font-black text-slate-900">{entry.actualQty}</td>
                    <td className="p-2 border border-slate-200 text-right font-bold text-red-600">{entry.rejectedQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-start opacity-40">
            <div className="text-[8px] font-black uppercase tracking-widest text-slate-500">
              Generated by MES Enterprise Intelligence Suite <br />
              Secure Export Node: US-EAST-PRD-04
            </div>
            <div className="text-[8px] font-black uppercase text-right text-slate-500">
              INTERNAL AUDIT ONLY • SUBJECT TO REGULATORY REVIEW <br />
              CONFIDENTIAL DOCUMENT
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Normal Dashboard View ---
  return (
    <div className="flex-1 flex flex-col space-y-4 w-full max-w-full overflow-hidden">
      {/* Control Strip */}
      <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-2.5 border border-slate-200 rounded-lg shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-[14px] font-black text-slate-900 uppercase leading-none mb-1">Operational Analytics</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enterprise MIS Node</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-end">
          {/* Time Filter */}
          <div className="flex p-0.5 bg-slate-100 rounded-md border border-slate-200">
            {(['Weekly', 'Monthly', 'Yearly'] as TimeMode[]).map(m => (
              <button 
                key={m}
                onClick={() => setTimeMode(m)}
                className={`px-4 py-1 text-[10px] font-black rounded-md transition-all duration-200 ${timeMode === m ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Shift Filter */}
          <div className="flex p-0.5 bg-slate-100 rounded-md border border-slate-200">
            {['All', ...SHIFTS].map(s => (
              <button 
                key={s}
                onClick={() => setSelectedShift(s)}
                className={`px-4 py-1 text-[10px] font-black rounded-md transition-all duration-200 ${selectedShift === s ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {s === 'All' ? 'ALL' : s.replace('Shift ', 'S')}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowPrintPreview(true)}
            className="bg-white border border-slate-200 text-slate-900 px-4 py-1 text-[10px] font-black uppercase rounded-md shadow-sm hover:bg-slate-50 flex items-center gap-2"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Export .PDF
          </button>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2 relative z-10">Production Volume</p>
          <div className="flex items-end gap-2 relative z-10">
            <p className="text-3xl font-black text-slate-900 leading-none">{kpis.totalActual.toLocaleString()}</p>
            <p className="text-[11px] font-bold text-blue-600 mb-0.5">Units Produced</p>
          </div>
          <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden relative z-10">
            <div className="h-full bg-blue-600" style={{ width: `${Math.min(kpis.achievement, 100)}%` }}></div>
          </div>
          <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">Target Achievement: {kpis.achievement.toFixed(1)}%</p>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2 relative z-10">Quality Yield</p>
          <div className="flex items-end gap-2 relative z-10">
            <p className="text-3xl font-black text-emerald-700 leading-none">{kpis.yieldRate.toFixed(1)}%</p>
            <p className="text-[11px] font-bold text-emerald-600 mb-0.5">Pass Rate</p>
          </div>
          <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden relative z-10">
            <div className="h-full bg-emerald-600" style={{ width: `${kpis.yieldRate}%` }}></div>
          </div>
          <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">System Health: Nominal</p>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2 relative z-10">Capacity Utilization</p>
          <div className="flex items-end gap-2 relative z-10">
            <p className="text-3xl font-black text-slate-900 leading-none">{filteredEntries.length}</p>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Active Logs</p>
          </div>
          <div className="mt-4 flex gap-1">
             {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => (
               <div key={d} className="h-1 flex-1 bg-slate-200 rounded-full"></div>
             ))}
          </div>
          <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">Current Filter: {selectedShift} Basis</p>
        </div>
      </div>

      {/* Primary Analytical Graph */}
      <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Target vs. Actual Variance Chart</h3>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase">Target</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase">Actual</span>
             </div>
          </div>
        </div>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} 
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }}
              />
              <Bar dataKey="planned" name="Target" fill="#1e293b" barSize={40} radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill="#10b981" barSize={40} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Record Ledger */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex-1 min-h-[200px]">
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Master Audit Ledger</h3>
          <span className="text-[9px] font-black text-slate-400 uppercase">{filteredEntries.length} Records Verified</span>
        </div>
        <div className="overflow-auto max-h-[220px]">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead className="bg-white sticky top-0 border-b border-slate-200 z-10">
              <tr className="text-slate-400 font-black uppercase tracking-tight">
                <th className="p-3 border-r border-slate-50">Date Index</th>
                <th className="p-3 border-r border-slate-50">Equipment</th>
                <th className="p-3 border-r border-slate-50">Operational Shift</th>
                <th className="p-3 text-right pr-6">Net Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredEntries.slice().reverse().map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 h-8 transition-colors group">
                  <td className="p-3 text-slate-900 border-r border-slate-50 font-bold group-hover:text-blue-600">{entry.date}</td>
                  <td className="p-3 text-slate-700 border-r border-slate-50">{entry.machine}</td>
                  <td className="p-3 text-slate-700 border-r border-slate-50 italic">{entry.shift}</td>
                  <td className="p-3 text-right font-black text-slate-900 pr-6">{entry.actualQty.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
