
import React, { useState } from 'react';
import { useAppState } from '../App';
import { ProductionEntry } from '../types';

declare const XLSX: any;

type UploadStep = 'SELECT_FILE' | 'SELECT_SHEET' | 'PREVIEW_CONFIRM' | 'SUCCESS';

const ExcelUpload: React.FC = () => {
  const { addEntry } = useAppState();
  const [step, setStep] = useState<UploadStep>('SELECT_FILE');
  const [workbook, setWorkbook] = useState<any>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setErrorMessage("System Error: Use .XLSX");
      return;
    }
    setErrorMessage("");
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        setWorkbook(wb);
        setSheetNames(wb.SheetNames);
        if (wb.SheetNames.length === 1) processSheet(wb, wb.SheetNames[0]);
        else setStep('SELECT_SHEET');
      } catch (err) {
        setErrorMessage("Read error.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const processSheet = (wb: any, sName: string) => {
    setSelectedSheet(sName);
    const sheet = wb.Sheets[sName];
    const json = XLSX.utils.sheet_to_json(sheet);
    setPreviewData(json);
    setStep('PREVIEW_CONFIRM');
  };

  const handleImport = () => {
    previewData.forEach((row: any) => {
      const findVal = (keys: string[]) => {
        const rowKeys = Object.keys(row);
        const match = rowKeys.find(rk => keys.some(k => rk.toLowerCase().includes(k.toLowerCase())));
        return match ? row[match] : null;
      };
      const newEntry: ProductionEntry = {
        id: Math.random().toString(36).substring(7),
        date: new Date().toLocaleDateString(),
        shop: findVal(['shop', 'area']) || 'EXT-AUDIT',
        shift: findVal(['shift', 'time']) || 'EXT-SHIFT',
        machine: findVal(['machine', 'mch', 'equipment']) || 'MCH-EXT',
        part: findVal(['part', 'comp', 'item']) || 'PRT-EXT',
        plannedQty: parseInt(findVal(['planned', 'target', 'goal']) || 0),
        actualQty: parseInt(findVal(['actual', 'produced', 'total']) || 0),
        rejectedQty: parseInt(findVal(['rejected', 'scrap', 'defect']) || 0),
        status: 'Approved'
      };
      addEntry(newEntry);
    });
    setStep('SUCCESS');
  };

  const resetFlow = () => {
    setStep('SELECT_FILE');
    setWorkbook(null);
    setSheetNames([]);
    setSelectedSheet("");
    setPreviewData([]);
    setErrorMessage("");
  };

  if (step === 'SELECT_FILE') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-6 w-full max-w-lg border-b border-slate-200 pb-2">
          <h2 className="text-[14px] font-bold text-slate-900 uppercase">Data Ingestion Module</h2>
        </div>
        <div className="w-full max-w-xl bg-white p-10 border border-dashed border-slate-300 text-center space-y-4 rounded">
          <label className="block cursor-pointer">
            <span className="sr-only">Access local storage</span>
            <div className="bg-slate-900 text-white px-6 py-2 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 transition rounded inline-block shadow-sm">Select Import Source</div>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
          </label>
          {errorMessage && <div className="text-red-800 font-bold uppercase text-[9px]">{errorMessage}</div>}
          <p className="text-[9px] text-slate-400 font-bold uppercase">Format: .XLSX / .XLS</p>
        </div>
      </div>
    );
  }

  if (step === 'SELECT_SHEET') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-4 w-full max-w-xs border-b border-slate-200 pb-1">
          <h2 className="text-[12px] font-bold text-slate-900 uppercase">Sheet Mapping</h2>
        </div>
        <div className="flex flex-col gap-1.5 w-full max-w-xs">
          {sheetNames.map(name => (
            <button key={name} onClick={() => processSheet(workbook, name)} className="p-2 text-[11px] font-bold border border-slate-200 bg-white text-slate-900 hover:border-slate-800 transition rounded text-left shadow-sm">Container: {name}</button>
          ))}
        </div>
        <button onClick={resetFlow} className="mt-4 text-slate-400 font-bold text-[9px] uppercase tracking-widest underline underline-offset-4">Abandon Ingestion</button>
      </div>
    );
  }

  if (step === 'PREVIEW_CONFIRM') {
    return (
      <div className="flex-1 flex flex-col space-y-3 w-full max-w-full overflow-hidden">
        <div className="text-center border-b border-slate-200 pb-1">
          <h2 className="text-[14px] font-bold text-slate-900 uppercase">Audit Ingestion</h2>
          <p className="text-[10px] text-slate-500 italic">Reviewing {previewData.length} entries from "{selectedSheet}"</p>
        </div>
        <div className="bg-white border border-slate-200 rounded shadow-sm flex-1 flex flex-col overflow-hidden min-h-[250px]">
          <div className="overflow-auto flex-1">
            <table className="w-full text-[10px] font-bold uppercase tracking-tight">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 z-10 shadow-sm">
                <tr className="text-slate-400">
                  {Object.keys(previewData[0] || {}).map(k => <th key={k} className="p-2 border-r border-slate-100 whitespace-nowrap">{k}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {previewData.slice(0, 50).map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 h-7">
                    {Object.values(row).map((v: any, j) => <td key={j} className="p-2 text-slate-800 whitespace-nowrap border-r border-slate-50">{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex gap-3 justify-center py-2 border-t border-slate-100">
          <button onClick={resetFlow} className="px-5 py-1.5 bg-slate-100 text-slate-600 border border-slate-300 font-bold text-[10px] uppercase rounded">Discard</button>
          <button onClick={handleImport} className="px-10 py-1.5 bg-slate-900 text-white font-bold text-[10px] uppercase rounded shadow-sm">Authorize Ingestion</button>
        </div>
      </div>
    );
  }

  if (step === 'SUCCESS') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <div className="w-12 h-12 bg-slate-50 text-slate-900 border border-slate-900 flex items-center justify-center text-sm font-black rounded mb-4 uppercase shadow-sm">OK</div>
        <h2 className="text-[12px] font-bold text-slate-900 uppercase mb-6">Bulk Import Complete</h2>
        <button onClick={resetFlow} className="px-10 py-2 bg-slate-900 text-white font-bold text-[10px] uppercase rounded">Return to Console</button>
      </div>
    );
  }

  return null;
};

export default ExcelUpload;
