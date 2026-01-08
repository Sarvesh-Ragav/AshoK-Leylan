
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
    <div className="flex-1 flex flex-col space-y-3 h-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-2 border border-slate-200 rounded shadow-sm gap-3">
        <div>
          <h2 className="text-[14px] font-bold text-slate-900 uppercase">Review Console</h2>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select 
            value={shopFilter} 
            onChange={(e) => setShopFilter(e.target.value)}
            className="flex-1 h-7 p-1 border border-slate-300 font-bold text-slate-700 bg-white outline-none rounded text-[11px]"
          >
            <option value="">All Areas</option>
            {SHOPS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            value={shiftFilter} 
            onChange={(e) => setShiftFilter(e.target.value)}
            className="flex-1 h-7 p-1 border border-slate-300 font-bold text-slate-700 bg-white outline-none rounded text-[11px]"
          >
            <option value="">All Shifts</option>
            {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {message && (
        <div className={`p-1.5 border font-bold text-[10px] text-center uppercase tracking-widest rounded ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-900' :
          message.type === 'error' ? 'bg-red-50 border-red-200 text-red-900' :
          'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 shadow-sm">
              <tr className="text-slate-500 font-bold uppercase tracking-tight">
                <th className="p-2 border-r border-slate-100">Equipment / Record</th>
                <th className="p-2 border-r border-slate-100 text-right">P / A / R</th>
                <th className="p-2 border-r border-slate-100 text-center">Status</th>
                <th className="p-2 text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.map(entry => {
                const isEditing = editingId === entry.id;
                const isPending = entry.status === 'Pending';
                return (
                  <tr key={entry.id} className={`h-10 hover:bg-slate-50 transition-colors ${!isPending && 'opacity-60'}`}>
                    <td className="p-2 border-r border-slate-50">
                      <div className="font-bold text-slate-900 leading-none mb-0.5">{entry.machine}</div>
                      <div className="text-[10px] text-slate-500 uppercase leading-none">{entry.date} • {entry.shop} • {entry.shift}</div>
                    </td>
                    <td className="p-2 border-r border-slate-50 text-right">
                      {isEditing ? (
                        <div className="flex gap-1 justify-end max-w-[140px] ml-auto">
                          <input className="w-10 h-7 p-1 border border-slate-300 font-bold text-center rounded text-[11px]" type="number" value={editValues.plannedQty} onChange={e => setEditValues({...editValues, plannedQty: parseInt(e.target.value)})} />
                          <input className="w-10 h-7 p-1 border border-slate-300 font-bold text-center rounded text-[11px]" type="number" value={editValues.actualQty} onChange={e => setEditValues({...editValues, actualQty: parseInt(e.target.value)})} />
                          <input className="w-10 h-7 p-1 border border-slate-300 font-bold text-center rounded text-[11px]" type="number" value={editValues.rejectedQty} onChange={e => setEditValues({...editValues, rejectedQty: parseInt(e.target.value)})} />
                        </div>
                      ) : (
                        <div className="font-bold tracking-tight">
                          <span className="text-slate-900">{entry.plannedQty}</span>
                          <span className="mx-1 text-slate-300">/</span>
                          <span className="text-green-800">{entry.actualQty}</span>
                          <span className="mx-1 text-slate-300">/</span>
                          <span className="text-red-700">{entry.rejectedQty}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-2 border-r border-slate-50 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded-sm text-[9px] font-bold border uppercase ${
                        entry.status === 'Approved' ? 'bg-green-50 text-green-900 border-green-200' :
                        entry.status === 'Rejected' ? 'bg-red-50 text-red-900 border-red-200' :
                        'bg-yellow-50 text-yellow-900 border-yellow-300'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="p-2 text-right">
                      <div className="flex justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button onClick={() => handleSaveEdit(entry.id)} className="bg-slate-900 text-white px-2 py-1 font-bold text-[10px] uppercase rounded">Save</button>
                            <button onClick={() => setEditingId(null)} className="bg-white border border-slate-200 px-2 py-1 font-bold text-[10px] uppercase rounded">X</button>
                          </>
                        ) : isPending ? (
                          <>
                            <button onClick={() => updateEntry(entry.id, {status:'Approved'})} className="bg-green-700 text-white px-2 py-1 font-bold text-[10px] uppercase rounded">OK</button>
                            <button onClick={() => handleEditClick(entry)} className="bg-white border border-slate-300 px-2 py-1 font-bold text-[10px] uppercase rounded">Edit</button>
                            <button onClick={() => updateEntry(entry.id, {status:'Rejected'})} className="bg-white border border-red-300 text-red-700 px-2 py-1 font-bold text-[10px] uppercase rounded">NO</button>
                          </>
                        ) : (
                          <span className="text-slate-300 font-bold text-[9px] uppercase italic">Final</span>
                        )}
                      </div>
                    </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupervisorReview;
