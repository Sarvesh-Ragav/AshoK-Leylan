
import React, { useState, useMemo } from 'react';
import { useAppState } from '../App';
import { ProductionEntry } from '../types';
import { SHOPS, SHIFTS } from '../constants';

const SupervisorReview: React.FC = () => {
  const { state, updateEntry } = useAppState();
  
  const [shopFilter, setShopFilter] = useState<string>('');
  const [shiftFilter, setShiftFilter] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<ProductionEntry>>({});
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditClick = (entry: ProductionEntry) => {
    setEditingId(entry.id);
    setEditValues({
      plannedQty: entry.plannedQty,
      actualQty: entry.actualQty,
      rejectedQty: entry.rejectedQty
    });
  };

  const handleSaveEdit = (id: string) => {
    const p = editValues.plannedQty || 0;
    const a = editValues.actualQty || 0;
    const r = editValues.rejectedQty || 0;

    if (p <= 0 || a < 0 || r > a) {
      showMessage("Validation failed.", "error");
      return;
    }

    updateEntry(id, { plannedQty: p, actualQty: a, rejectedQty: r });
    setEditingId(null);
    showMessage("Updated.", "info");
  };

  const filteredEntries = useMemo(() => {
    let list = [...state.entries];
    if (shopFilter) list = list.filter(e => e.shop === shopFilter);
    if (shiftFilter) list = list.filter(e => e.shift === shiftFilter);
    return list.sort((a, b) => (a.status === 'Pending' ? -1 : 1));
  }, [state.entries, shopFilter, shiftFilter]);

  return (
    <div className="flex-1 flex flex-col space-y-4 w-full max-w-full overflow-hidden p-2">
      {/* Control Strip */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 border border-slate-200 rounded-xl shadow-sm gap-4">
        <div>
          <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Quality Assurance Portal</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Supervisor Approval Workflow</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select 
            value={shopFilter} 
            onChange={(e) => setShopFilter(e.target.value)}
            className="flex-1 h-10 px-3 border border-slate-200 font-black text-slate-900 bg-white outline-none rounded-lg text-[11px] shadow-sm"
          >
            <option value="">All Areas</option>
            {SHOPS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            value={shiftFilter} 
            onChange={(e) => setShiftFilter(e.target.value)}
            className="flex-1 h-10 px-3 border border-slate-200 font-black text-slate-900 bg-white outline-none rounded-lg text-[11px] shadow-sm"
          >
            <option value="">All Shifts</option>
            {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {message && (
        <div className={`p-2 border font-black text-[10px] text-center uppercase tracking-widest rounded-lg shadow-sm ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
          message.type === 'error' ? 'bg-red-50 border-red-200 text-red-900' :
          'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          {message.text}
        </div>
      )}

      {/* Branded Review Table */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-1 flex flex-col">
        {/* Branding Header Area */}
        <div className="flex justify-between items-end mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-md">AL</div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-slate-900 uppercase leading-none tracking-tighter">ASHOK LEYLAND LIMITED</h1>
              <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mt-1">FOUNDRY DIVISION • MACHINE SHOP MIS</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">PENDING AUDIT QUEUE</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">GENERATED: {new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).toUpperCase()}</p>
          </div>
        </div>

        <div className="h-[3px] bg-slate-900 mb-6 rounded-full w-full"></div>

        <div className="overflow-auto flex-1 rounded-lg">
          <table className="w-full text-left border-collapse text-[11px] min-w-[900px]">
            <thead className="bg-slate-900 text-white sticky top-0 z-20">
              <tr className="font-black uppercase tracking-wider">
                <th className="p-3 border-r border-slate-800">EQUIPMENT / RECORD</th>
                <th className="p-3 border-r border-slate-800 text-center">PLAN / ACT / REJ</th>
                <th className="p-3 border-r border-slate-800 text-center">STATUS</th>
                <th className="p-3 text-center">ACTION CONTROLS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.map(entry => {
                const isEditing = editingId === entry.id;
                const isPending = entry.status === 'Pending';
                return (
                  <tr key={entry.id} className={`hover:bg-slate-50 transition-colors ${!isPending && 'opacity-60 bg-slate-50/50'}`}>
                    <td className="p-3 border-r border-slate-100">
                      <div className="font-black text-slate-900 leading-none mb-1 text-[13px]">{entry.machine}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase leading-none tracking-tight">
                        {entry.date} • {entry.shop} • {entry.shift}
                      </div>
                      <div className="text-[9px] text-slate-500 italic mt-1">{entry.part}</div>
                    </td>
                    <td className="p-3 border-r border-slate-100 text-center">
                      {isEditing ? (
                        <div className="flex gap-2 justify-center items-center">
                          {/* WHITE BOXED INPUTS */}
                          <div className="flex flex-col items-center">
                            <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Plan</span>
                            <input 
                              className="w-14 h-10 px-1 bg-white border border-slate-300 font-black text-center rounded-xl text-[14px] text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                              type="number" 
                              value={editValues.plannedQty} 
                              onChange={e => setEditValues({...editValues, plannedQty: parseInt(e.target.value)})} 
                            />
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Act</span>
                            <input 
                              className="w-14 h-10 px-1 bg-white border border-slate-300 font-black text-center rounded-xl text-[14px] text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                              type="number" 
                              value={editValues.actualQty} 
                              onChange={e => setEditValues({...editValues, actualQty: parseInt(e.target.value)})} 
                            />
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Rej</span>
                            <input 
                              className="w-14 h-10 px-1 bg-white border border-slate-300 font-black text-center rounded-xl text-[14px] text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                              type="number" 
                              value={editValues.rejectedQty} 
                              onChange={e => setEditValues({...editValues, rejectedQty: parseInt(e.target.value)})} 
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="font-black text-[13px] tracking-tighter">
                          <span className="text-slate-400">{entry.plannedQty}</span>
                          <span className="mx-2 text-slate-200">/</span>
                          <span className="text-indigo-600">{entry.actualQty}</span>
                          <span className="mx-2 text-slate-200">/</span>
                          <span className="text-red-500">{entry.rejectedQty}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 border-r border-slate-100 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${
                        entry.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        entry.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        {isEditing ? (
                          <>
                            <button onClick={() => handleSaveEdit(entry.id)} className="bg-slate-900 text-white px-4 py-1.5 font-black text-[10px] uppercase rounded-lg shadow-sm hover:bg-slate-800 transition-colors">Save</button>
                            <button onClick={() => setEditingId(null)} className="bg-white border border-slate-200 px-4 py-1.5 font-black text-[10px] uppercase rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                          </>
                        ) : isPending ? (
                          <>
                            <button onClick={() => updateEntry(entry.id, {status:'Approved'})} className="bg-emerald-600 text-white px-4 py-1.5 font-black text-[10px] uppercase rounded-lg shadow-sm hover:bg-emerald-700 active:scale-95 transition-all">Approve</button>
                            <button onClick={() => handleEditClick(entry)} className="bg-white border border-slate-300 px-4 py-1.5 font-black text-[10px] uppercase rounded-lg hover:border-slate-900 active:scale-95 transition-all">Edit</button>
                            <button onClick={() => updateEntry(entry.id, {status:'Rejected'})} className="bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 font-black text-[10px] uppercase rounded-lg hover:bg-red-100 active:scale-95 transition-all">Reject</button>
                          </>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-slate-300 font-black text-[9px] uppercase tracking-widest">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            Audit Finalized
                          </div>
                        )}
                      </div>
                    </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SupervisorReview;
