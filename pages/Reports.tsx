
import React, { useMemo, useState } from 'react';
import { useAppState } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  const filteredEntries = useMemo(() => {
    let list = [...approvedEntries];
    if (selectedShift !== 'All') {
      list = list.filter(e => e.shift === selectedShift);
    }
    return list;
  }, [approvedEntries, selectedShift]);

  const parseDate = (dateStr: string) => {
    const [d, m, y] = dateStr.split('/').map(Number);
    return new Date(y, m - 1, d);
  };

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
        <h2 className="text-[14px] font-black text-slate-900 uppercase">Insufficient Validated Data</h2>
        <p className="text-[11px] text-slate-500 mt-2">Reports require approved production logs.</p>
      </div>
    );
  }

  if (showPrintPreview) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-100 flex flex-col items-center overflow-auto p-4 md:p-8 print:p-0 print:bg-white">
        <div className="flex justify-between w-full max-w-[210mm] mb-6 print:hidden items-center">
          <button onClick={() => setShowPrintPreview(false)} className="flex items-center gap-2 text-slate-600 font-bold uppercase text-[10px]">Return</button>
          <button onClick={handlePrint} className="bg-slate-900 text-white px-6 py-2 rounded-sm font-black text-[10px] uppercase shadow-lg">Download PDF (Print to PDF)</button>
        </div>
        <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-2xl p-[15mm] border border-slate-200 print:shadow-none print:border-none print:m-0 print:p-0">
          <div className="border-b-4 border-slate-900 pb-6 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase leading-none mb-1">Ashok Leyland Limited</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Audit Report • Factory MIS Node v2.4</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-900 uppercase">ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase">{new Date().toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 mb-8">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <h3 className="text-[10px] font-black text-slate-900 uppercase mb-3 border-b border-slate-200 pb-1">Report Scope</h3>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between"><span className="text-slate-500">Period:</span> <span className="font-bold">{timeMode}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Shift:</span> <span className="font-bold">{selectedShift}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Volume:</span> <span className="font-bold">{kpis.totalActual.toLocaleString()} Units</span></div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <h3 className="text-[10px] font-black text-slate-900 uppercase mb-3 border-b border-slate-200 pb-1">Primary Metrics</h3>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between"><span className="text-slate-500">Target Achieved:</span> <span className="font-bold">{kpis.achievement.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Quality Yield:</span> <span className="font-bold text-emerald-700">{kpis.yieldRate.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Material Loss:</span> <span className="font-bold text-red-600">{kpis.totalRejected} Units</span></div>
              </div>
            </div>
          </div>
          <div className="mb-12">
            <h3 className="text-[11px] font-black text-slate-900 uppercase mb-4 border-l-4 border-slate-900 pl-3">Performance Trends</h3>
            <div className="h-[280px] w-full border border-slate-100 p-2 rounded relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 9, fontWeight: 800, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <Bar isAnimationActive={false} dataKey="planned" name="Target" fill="#1e293b" barSize={32} radius={[2, 2, 0, 0]} />
                  <Bar isAnimationActive={false} dataKey="actual" name="Actual" fill="#10b981" barSize={32} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="print:mt-10">
            <h3 className="text-[11px] font-black text-slate-900 uppercase mb-4 border-l-4 border-slate-900 pl-3">Audit Log Registry</h3>
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-slate-900 text-white text-[9px] font-black uppercase">
                  <th className="p-2 border border-slate-900">Date Index</th>
                  <th className="p-2 border border-slate-900">Area/Shop</th>
                  <th className="p-2 border border-slate-900">Equipment</th>
                  <th className="p-2 border border-slate-900 text-right">Actual</th>
                  <th className="p-2 border border-slate-900 text-right">Loss</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, idx) => (
                  <tr key={entry.id} className={`text-[10px] break-inside-avoid ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                    <td className="p-2 border border-slate-200 font-bold">{entry.date}</td>
                    <td className="p-2 border border-slate-200 uppercase">{entry.shop}</td>
                    <td className="p-2 border border-slate-200 font-black">{entry.machine}</td>
                    <td className="p-2 border border-slate-200 text-right font-black">{entry.actualQty}</td>
                    <td className="p-2 border border-slate-200 text-right font-bold text-red-600">{entry.rejectedQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col space-y-4 w-full overflow-hidden p-2">
      <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-4 border border-slate-200 rounded-xl shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
          </div>
          <div>
            <h1 className="text-[16px] font-black text-slate-900 uppercase leading-none mb-1">Operational Analytics</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">MIS Reports Engine</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTimeMode('Weekly')} className={`px-4 py-2 text-[10px] font-black rounded-lg ${timeMode === 'Weekly' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>WEEKLY</button>
          <button onClick={() => setTimeMode('Monthly')} className={`px-4 py-2 text-[10px] font-black rounded-lg ${timeMode === 'Monthly' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>MONTHLY</button>
          <button onClick={() => setTimeMode('Yearly')} className={`px-4 py-2 text-[10px] font-black rounded-lg ${timeMode === 'Yearly' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>YEARLY</button>
          <button onClick={() => setShowPrintPreview(true)} className="bg-blue-600 text-white px-6 py-2 text-[10px] font-black uppercase rounded-lg shadow-lg hover:bg-blue-700">Detailed PDF</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Gross Output</p>
          <p className="text-3xl font-black text-slate-900">{kpis.totalActual.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">Achievement: {kpis.achievement.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Quality Yield</p>
          <p className="text-3xl font-black text-emerald-700">{kpis.yieldRate.toFixed(1)}%</p>
          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">Status: Nominal</p>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Scrap Count</p>
          <p className="text-3xl font-black text-red-600">{kpis.totalRejected}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">Waste Index: {((kpis.totalRejected / kpis.totalActual) * 100 || 0).toFixed(1)}%</p>
        </div>
      </div>
      <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm flex-1 relative min-h-[300px]">
        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6 border-b pb-2">Production Variance Trend</h3>
        <div className="h-[300px] w-full relative">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Bar dataKey="planned" name="Target" fill="#1e293b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
