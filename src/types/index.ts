export interface Pool {
  id: string;
  poolNo: string;
  area: number;
  volume: number;
  status: 'normal' | 'warning' | 'alarm' | 'maintenance';
  currentBatchId?: string;
  temperature: number;
  dissolvedOxygen: number;
  ph: number;
}

export interface Batch {
  id: string;
  batchNo: string;
  species: string;
  initialCount: number;
  currentCount: number;
  initialWeight: number;
  currentWeight: number;
  stockDate: string;
  expectedHarvestDate: string;
  stage: 'fry' | 'juvenile' | 'adult' | 'ready';
  poolId: string;
  survivalRate: number;
}

export interface WaterParam {
  id: string;
  poolId: string;
  timestamp: string;
  temperature: number;
  dissolvedOxygen: number;
  ph: number;
  ammoniaNitrogen: number;
  nitrite: number;
  flowRate: number;
  waterLevel: number;
}

export interface FeedingRecord {
  id: string;
  batchId: string;
  time: string;
  feedAmount: number;
  feedType: string;
  operatorName: string;
}

export interface Task {
  id: string;
  type: 'feeding' | 'inspection' | 'disinfection' | 'medicine' | 'transfer' | 'harvest';
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate: string;
  assignedTo: string;
  poolId?: string;
  poolNo?: string;
}

export interface SamplingRecord {
  id: string;
  batchId: string;
  batchNo: string;
  sampleDate: string;
  sampleCount: number;
  avgWeight: number;
  avgLength: number;
  inspectorName: string;
  notes?: string;
}

export interface DeathRecord {
  id: string;
  batchId: string;
  batchNo: string;
  date: string;
  count: number;
  cause: string;
  disposalMethod: string;
  recorderName: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'pump' | 'aerator' | 'filter' | 'heater' | 'sensor';
  poolId?: string;
  poolNo?: string;
  status: 'running' | 'stopped' | 'fault' | 'maintenance';
  lastMaintenance: string;
  runHours: number;
}

export interface EnergyRecord {
  id: string;
  date: string;
  electricityUsage: number;
  waterUsage: number;
  oxygenUsage: number;
  poolId?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'supervisor' | 'feeder' | 'inspector';
  phone: string;
  avatar?: string;
}

export interface DailyReport {
  date: string;
  totalFeedAmount: number;
  totalDeathCount: number;
  avgTemperature: number;
  avgDissolvedOxygen: number;
  avgPh: number;
  taskCompletionRate: number;
  electricityUsage: number;
  waterUsage: number;
}

export interface StaffPerformance {
  id: string;
  name: string;
  role: string;
  tasksCompleted: number;
  tasksTotal: number;
  completionRate: number;
  feedAmount: number;
  samplingCount: number;
}

export interface Alert {
  id: string;
  type: 'temperature' | 'oxygen' | 'ph' | 'device' | 'ammonia';
  level: 'info' | 'warning' | 'danger';
  message: string;
  poolNo: string;
  timestamp: string;
  resolved: boolean;
}
