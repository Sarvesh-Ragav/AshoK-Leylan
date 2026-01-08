
export type UserRole = 'Employee' | 'Supervisor' | 'Admin' | null;

export type EntryStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ProductionEntry {
  id: string;
  date: string;
  shop: string;
  shift: string;
  machine: string;
  part: string;
  plannedQty: number;
  actualQty: number;
  rejectedQty: number;
  status: EntryStatus;
}

export interface AppState {
  role: UserRole;
  entries: ProductionEntry[];
}
