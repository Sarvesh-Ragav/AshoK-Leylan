
export const SHOPS = ['Shop 1', 'Shop 2'];
export const SHIFTS = ['Shift 1', 'Shift 2', 'Shift 3'];

export const SHOP_MACHINES: Record<string, string[]> = {
  'Shop 1': ['MCH-01', 'MCH-02', 'MCH-03'],
  'Shop 2': ['MCH-04', 'MCH-05'],
};

export const MACHINE_PARTS: Record<string, string[]> = {
  'MCH-01': ['PRT-101', 'PRT-102'],
  'MCH-02': ['PRT-201', 'PRT-202'],
  'MCH-03': ['PRT-301', 'PRT-302'],
  'MCH-04': ['PRT-401', 'PRT-402'],
  'MCH-05': ['PRT-501', 'PRT-502'],
};

/**
 * ENTERPRISE BASELINE DATASET
 * Expanded to cover multiple months and years for report demonstration.
 */
export const INITIAL_DUMMY_DATA: any[] = [
  // 2024 Data (Current Year)
  { id: 'd1', date: '10/05/2024', shop: 'Shop 1', shift: 'Shift 1', machine: 'MCH-01', part: 'PRT-101', plannedQty: 100, actualQty: 98, rejectedQty: 1, status: 'Approved' },
  { id: 'd2', date: '15/05/2024', shop: 'Shop 1', shift: 'Shift 2', machine: 'MCH-02', part: 'PRT-201', plannedQty: 150, actualQty: 145, rejectedQty: 3, status: 'Approved' },
  { id: 'd3', date: '20/06/2024', shop: 'Shop 2', shift: 'Shift 1', machine: 'MCH-04', part: 'PRT-401', plannedQty: 200, actualQty: 190, rejectedQty: 5, status: 'Approved' },
  { id: 'd4', date: '05/07/2024', shop: 'Shop 1', shift: 'Shift 3', machine: 'MCH-03', part: 'PRT-301', plannedQty: 80, actualQty: 75, rejectedQty: 2, status: 'Approved' },
  { id: 'd5', date: '12/08/2024', shop: 'Shop 1', shift: 'Shift 1', machine: 'MCH-01', part: 'PRT-102', plannedQty: 120, actualQty: 118, rejectedQty: 0, status: 'Approved' },
  { id: 'd6', date: '13/09/2024', shop: 'Shop 2', shift: 'Shift 2', machine: 'MCH-05', part: 'PRT-501', plannedQty: 250, actualQty: 240, rejectedQty: 8, status: 'Approved' },
  { id: 'd7', date: '14/10/2024', shop: 'Shop 1', shift: 'Shift 1', machine: 'MCH-02', part: 'PRT-202', plannedQty: 150, actualQty: 140, rejectedQty: 4, status: 'Approved' },
  
  // 2023 Data (Historical)
  { id: 'h1', date: '10/05/2023', shop: 'Shop 1', shift: 'Shift 1', machine: 'MCH-01', part: 'PRT-101', plannedQty: 100, actualQty: 90, rejectedQty: 2, status: 'Approved' },
  { id: 'h2', date: '15/08/2023', shop: 'Shop 2', shift: 'Shift 3', machine: 'MCH-04', part: 'PRT-401', plannedQty: 200, actualQty: 205, rejectedQty: 1, status: 'Approved' },
  { id: 'h3', date: '20/12/2023', shop: 'Shop 1', shift: 'Shift 2', machine: 'MCH-02', part: 'PRT-201', plannedQty: 150, actualQty: 148, rejectedQty: 2, status: 'Approved' },
  
  // Recent Pending Record
  { id: 'p1', date: '25/10/2024', shop: 'Shop 1', shift: 'Shift 2', machine: 'MCH-03', part: 'PRT-302', plannedQty: 90, actualQty: 88, rejectedQty: 0, status: 'Pending' }
];
