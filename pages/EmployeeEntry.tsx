
import React, { useState } from 'react';
import { useAppState } from '../App';
import { SHOPS, SHIFTS, SHOP_MACHINES, MACHINE_PARTS } from '../constants';
import { ProductionEntry } from '../types';

const EmployeeEntry: React.FC = () => {
  const { state, addEntry } = useAppState();
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [formData, setFormData] = useState<Partial<ProductionEntry>>({
    shop: '',
    shift: '',
    machine: '',
    part: '',
    plannedQty: 0,
    actualQty: 0,
    rejectedQty: 0
  });

  const handleSave = () => {
    const newEntry: ProductionEntry = {
      ...formData as ProductionEntry,
      id: Math.random().toString(36).substring(7),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Pending'
    };
    addEntry(newEntry);
    setStep('SUCCESS');
  };

  const increment = (field: keyof ProductionEntry) => {
    const val = (formData[field] as number) || 0;
    setFormData({ ...formData, [field]: val + 1 });
  };

  const decrement = (field: keyof ProductionEntry) => {
    const val = (formData[field] as number) || 0;
    if (val > 0) {
      setFormData({ ...formData, [field]: val - 1 });
    }
  };

  const goodQty = (formData.actualQty || 0) - (formData.rejectedQty || 0);

  const isInvalid = !formData.shop || !formData.shift || !formData.machine || !formData.part || 
                    (formData.plannedQty || 0) <= 0 || (formData.actualQty || 0) < 0 || 
                    (formData.rejectedQty || 0) > (formData.actualQty || 0);

  if (step === 'SUCCESS') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-xl font-black rounded-full mb-4 shadow-sm">✓</div>
        <h2 className="text-lg font-black text-slate-900 uppercase mb-2">Success</h2>
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-6">Entry Logged & Pending Approval</p>
        <button 
          onClick={() => { setStep('FORM'); setFormData({shop: '', shift: '', machine: '', part: '', plannedQty: 0, actualQty: 0, rejectedQty: 0}); }}
          className="px-8 py-3 bg-slate-900 text-white font-black text-[10px] uppercase rounded shadow-lg hover:bg-slate-800 transition-all active:scale-95 tracking-widest"
        >
          Add New Record
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col space-y-6 w-full max-w-full mx-auto p-2">
      {/* A. HEADER SELECTION */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
           <span className="text-[11px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">A</span>
           <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">General Information</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Shop Area</label>
            <select 
              value={formData.shop} 
              onChange={e => setFormData({...formData, shop: e.target.value, machine: '', part: ''})}
              className="w-full h-12 px-4 border border-slate-200 bg-white rounded-xl text-[13px] text-slate-900 font-black focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
            >
              <option value="">Select Shop</option>
              {SHOPS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Shift</label>
            <select 
              value={formData.shift} 
              onChange={e => setFormData({...formData, shift: e.target.value})}
              className="w-full h-12 px-4 border border-slate-200 bg-white rounded-xl text-[13px] text-slate-900 font-black focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
            >
              <option value="">Select Shift</option>
              {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Machine</label>
            <select 
              value={formData.machine} 
              disabled={!formData.shop}
              onChange={e => setFormData({...formData, machine: e.target.value, part: ''})}
              className="w-full h-12 px-4 border border-slate-200 bg-white rounded-xl text-[13px] text-slate-900 font-black focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm disabled:bg-slate-50 disabled:text-slate-300"
            >
              <option value="">Select Equipment</option>
              {(SHOP_MACHINES[formData.shop!] || []).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Component</label>
            <select 
              value={formData.part} 
              disabled={!formData.machine}
              onChange={e => setFormData({...formData, part: e.target.value})}
              className="w-full h-12 px-4 border border-slate-200 bg-white rounded-xl text-[13px] text-slate-900 font-black focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm disabled:bg-slate-50 disabled:text-slate-300"
            >
              <option value="">Select Part</option>
              {(MACHINE_PARTS[formData.machine!] || []).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* B. QUANTITIES */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
           <span className="text-[11px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">B</span>
           <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Quantities</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Planned Qty Card */}
          <div className="bg-[#f8f9fa] border border-slate-100 rounded-2xl p-4 flex flex-col justify-between min-h-[110px] shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Planned Qty</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-slate-900">{formData.plannedQty}</span>
              <div className="flex gap-1">
                <button onClick={() => decrement('plannedQty')} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm active:scale-90">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                </button>
                <button onClick={() => increment('plannedQty')} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm active:scale-90">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Actual Qty Card */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col justify-between min-h-[110px] shadow-sm">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Actual Qty</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-indigo-700">{formData.actualQty}</span>
              <div className="flex gap-1">
                <button onClick={() => decrement('actualQty')} className="w-10 h-10 rounded-full bg-white border border-indigo-200 flex items-center justify-center text-indigo-300 hover:text-indigo-600 hover:border-indigo-400 transition-all shadow-sm active:scale-90">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                </button>
                <button onClick={() => increment('actualQty')} className="w-10 h-10 rounded-full bg-white border border-indigo-200 flex items-center justify-center text-indigo-300 hover:text-indigo-600 hover:border-indigo-400 transition-all shadow-sm active:scale-90">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Rejected Qty Card */}
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex flex-col justify-between min-h-[110px] shadow-sm">
            <span className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Rejected Qty</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-red-600">{formData.rejectedQty}</span>
              <div className="flex gap-1">
                <button onClick={() => decrement('rejectedQty')} className="w-10 h-10 rounded-full bg-white border border-red-200 flex items-center justify-center text-red-300 hover:text-red-600 hover:border-red-400 transition-all shadow-sm active:scale-90">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                </button>
                <button onClick={() => increment('rejectedQty')} className="w-10 h-10 rounded-full bg-white border border-red-200 flex items-center justify-center text-red-300 hover:text-red-600 hover:border-red-400 transition-all shadow-sm active:scale-90">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* RFT/Good Qty Card (Calculated) */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between min-h-[110px] shadow-sm">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Good Qty</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-emerald-700">{goodQty < 0 ? 0 : goodQty}</span>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end items-center">
          <button 
            disabled={isInvalid}
            onClick={handleSave} 
            className={`px-12 py-3 font-black text-[12px] uppercase transition-all rounded-xl shadow-lg tracking-widest ${
              isInvalid ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
            }`}
          >
            Save Production Record
          </button>
        </div>
      </section>

      {/* C. PRODUCTION HISTORY - BRANDED TABLE */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Branding Header Area (Matches Reference) */}
        <div className="flex justify-between items-end mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-md">AL</div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-slate-900 uppercase leading-none tracking-tighter">ASHOK LEYLAND LIMITED</h1>
              <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mt-1">FOUNDRY DIVISION • MACHINE SHOP MIS</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">MY PRODUCTION HISTORY</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">GENERATED: {new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).toUpperCase()}</p>
          </div>
        </div>

        {/* Thick Branding Separation Line */}
        <div className="h-[3px] bg-slate-900 mb-6 rounded-full w-full"></div>

        {/* Master Table with Dark Headers */}
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider">
                <th className="p-3 border-r border-slate-800">DATE/SHIFT</th>
                <th className="p-3 border-r border-slate-800">LINE/MACHINE</th>
                <th className="p-3 border-r border-slate-800">OP/PART</th>
                <th className="p-3 text-center border-r border-slate-800">PLAN</th>
                <th className="p-3 text-center border-r border-slate-800">ACT</th>
                <th className="p-3 text-center border-r border-slate-800">REJ</th>
                <th className="p-3 text-center border-r border-slate-800">RFT</th>
                <th className="p-3 border-r border-slate-800">LOSS CONTEXT</th>
                <th className="p-3 text-center border-r border-slate-800">AUDIT</th>
                <th className="p-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {state.entries.slice().reverse().map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-900">
                    {entry.date} <br />
                    <span className="text-[9px] text-slate-400 font-black">{entry.shift}</span>
                  </td>
                  <td className="p-3 text-slate-700 font-black">
                    {entry.shop} / {entry.machine}
                  </td>
                  <td className="p-3 italic text-slate-500 font-medium">
                    {entry.part}
                  </td>
                  <td className="p-3 text-center font-bold text-slate-400">{entry.plannedQty}</td>
                  <td className="p-3 text-center font-black text-slate-900">{entry.actualQty}</td>
                  <td className="p-3 text-center font-bold text-red-600">{entry.rejectedQty}</td>
                  <td className="p-3 text-center font-bold text-emerald-600">{entry.actualQty - entry.rejectedQty}</td>
                  <td className="p-3 text-slate-300 font-bold uppercase text-[9px]">NO CONTEXT PROVIDED</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                      entry.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 
                      entry.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button className="text-slate-300 hover:text-slate-900 transition-colors">
                      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default EmployeeEntry;
