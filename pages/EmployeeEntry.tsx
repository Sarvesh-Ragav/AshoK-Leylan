
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
      date: new Date().toLocaleDateString(),
      status: 'Pending'
    };
    addEntry(newEntry);
    setStep('SUCCESS');
  };

  const isInvalid = !formData.shop || !formData.shift || !formData.machine || !formData.part || 
                    (formData.plannedQty || 0) <= 0 || (formData.actualQty || 0) < 0 || 
                    (formData.rejectedQty || 0) > (formData.actualQty || 0);

  if (step === 'SUCCESS') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <div className="w-12 h-12 bg-green-50 text-green-800 border border-green-800 flex items-center justify-center text-sm font-black rounded mb-2 uppercase">OK</div>
        <h2 className="text-[12px] font-bold text-slate-900 uppercase mb-4">Record Stored Successfully</h2>
        <button 
          onClick={() => { setStep('FORM'); setFormData({shop: '', shift: '', machine: '', part: '', plannedQty: 0, actualQty: 0, rejectedQty: 0}); }}
          className="px-6 py-2 bg-slate-900 text-white font-bold text-[10px] uppercase rounded shadow-sm"
        >
          New Entry
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col space-y-3 w-full">
      <div className="border-b border-slate-200 pb-1">
        <h2 className="text-[14px] font-bold text-slate-900 uppercase">Operational Production Log</h2>
      </div>

      <div className="bg-white border border-slate-200 p-4 rounded shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-wider">Shop Area</label>
            <select 
              value={formData.shop} 
              onChange={e => setFormData({...formData, shop: e.target.value, machine: '', part: ''})}
              className="w-full h-10 px-3 border border-slate-300 bg-white rounded text-[12px] text-slate-900 font-bold focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none transition-all"
            >
              <option value="">Select Shop</option>
              {SHOPS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-wider">Shift</label>
            <select 
              value={formData.shift} 
              onChange={e => setFormData({...formData, shift: e.target.value})}
              className="w-full h-10 px-3 border border-slate-300 bg-white rounded text-[12px] text-slate-900 font-bold focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none transition-all"
            >
              <option value="">Select Shift</option>
              {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-wider">Machine</label>
            <select 
              value={formData.machine} 
              disabled={!formData.shop}
              onChange={e => setFormData({...formData, machine: e.target.value, part: ''})}
              className="w-full h-10 px-3 border border-slate-300 bg-white rounded text-[12px] text-slate-900 font-bold focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">Select Equipment</option>
              {(SHOP_MACHINES[formData.shop!] || []).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-wider">Component</label>
            <select 
              value={formData.part} 
              disabled={!formData.machine}
              onChange={e => setFormData({...formData, part: e.target.value})}
              className="w-full h-10 px-3 border border-slate-300 bg-white rounded text-[12px] text-slate-900 font-bold focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">Select Part</option>
              {(MACHINE_PARTS[formData.machine!] || []).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-wider">Planned</label>
            <input
              type="number"
              value={formData.plannedQty || ''}
              onChange={e => setFormData({...formData, plannedQty: parseInt(e.target.value) || 0})}
              className="w-full h-10 px-3 border border-slate-300 bg-white rounded text-[12px] text-slate-900 font-bold focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-right transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-wider">Actual</label>
            <input
              type="number"
              value={formData.actualQty || ''}
              onChange={e => setFormData({...formData, actualQty: parseInt(e.target.value) || 0})}
              className="w-full h-10 px-3 border border-slate-300 bg-white rounded text-[12px] text-slate-900 font-bold focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-right transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-wider text-red-600">Rejected</label>
            <input
              type="number"
              value={formData.rejectedQty || ''}
              onChange={e => setFormData({...formData, rejectedQty: parseInt(e.target.value) || 0})}
              className="w-full h-10 px-3 border border-red-300 bg-white rounded text-[12px] text-red-700 font-bold focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-right transition-all"
            />
          </div>
          <div>
            <button 
              disabled={isInvalid}
              onClick={handleSave} 
              className={`w-full h-10 font-black text-[10px] uppercase transition-all rounded shadow-sm ${
                isInvalid ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]'
              }`}
            >
              Save Record
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm flex-1 flex flex-col min-h-[200px] overflow-hidden">
        <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Session Ledger</h3>
        </div>
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-white sticky top-0 border-b border-slate-200 z-10 shadow-sm">
              <tr>
                <th className="p-3 font-black text-slate-400 uppercase tracking-tight">Date</th>
                <th className="p-3 font-black text-slate-400 uppercase tracking-tight">Equipment</th>
                <th className="p-3 font-black text-slate-400 uppercase tracking-tight">Shift</th>
                <th className="p-3 font-black text-slate-400 uppercase tracking-tight text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {state.entries.slice().reverse().map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 h-10 group">
                  <td className="p-3 text-slate-900 font-bold">{entry.date}</td>
                  <td className="p-3 text-slate-700 font-medium">{entry.machine}</td>
                  <td className="p-3 text-slate-700 font-medium italic">{entry.shift}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black border uppercase tracking-widest ${
                      entry.status === 'Approved' ? 'bg-green-50 text-green-800 border-green-200' : 
                      entry.status === 'Rejected' ? 'bg-red-50 text-red-800 border-red-200' :
                      'bg-yellow-50 text-yellow-800 border-yellow-300'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeEntry;
