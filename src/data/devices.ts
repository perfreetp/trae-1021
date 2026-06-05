import type { Device, EnergyRecord, DailyReport, StaffPerformance } from '../types';

export const devices: Device[] = [
  {
    id: 'dev-001',
    name: '1号循环水泵',
    type: 'pump',
    poolId: 'pool-001',
    poolNo: 'A区',
    status: 'running',
    lastMaintenance: '2026-05-20',
    runHours: 852,
  },
  {
    id: 'dev-002',
    name: '2号循环水泵',
    type: 'pump',
    poolId: 'pool-007',
    poolNo: 'B区',
    status: 'running',
    lastMaintenance: '2026-05-18',
    runHours: 920,
  },
  {
    id: 'dev-003',
    name: '1号增氧机',
    type: 'aerator',
    poolId: 'pool-001',
    poolNo: 'A01-A03',
    status: 'running',
    lastMaintenance: '2026-05-25',
    runHours: 720,
  },
  {
    id: 'dev-004',
    name: '3号增氧机',
    type: 'aerator',
    poolId: 'pool-007',
    poolNo: 'B01-B03',
    status: 'fault',
    lastMaintenance: '2026-05-10',
    runHours: 1050,
  },
  {
    id: 'dev-005',
    name: '主过滤系统',
    type: 'filter',
    status: 'running',
    lastMaintenance: '2026-06-01',
    runHours: 1200,
  },
  {
    id: 'dev-006',
    name: '1号温控系统',
    type: 'heater',
    poolId: 'pool-001',
    poolNo: 'A区',
    status: 'stopped',
    lastMaintenance: '2026-05-15',
    runHours: 450,
  },
  {
    id: 'dev-007',
    name: '水质监测传感器组',
    type: 'sensor',
    poolId: 'pool-001',
    poolNo: 'A01',
    status: 'running',
    lastMaintenance: '2026-06-03',
    runHours: 2100,
  },
  {
    id: 'dev-008',
    name: '备用发电机',
    type: 'pump',
    status: 'stopped',
    lastMaintenance: '2026-05-01',
    runHours: 12,
  },
];

export const energyRecords: EnergyRecord[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date('2026-05-06');
  date.setDate(date.getDate() + i);
  return {
    id: `energy-${i + 1}`,
    date: date.toISOString().split('T')[0],
    electricityUsage: Math.round(450 + Math.random() * 150),
    waterUsage: Math.round(80 + Math.random() * 40),
    oxygenUsage: Math.round(20 + Math.random() * 10),
  };
});

export const dailyReports: DailyReport[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date('2026-05-30');
  date.setDate(date.getDate() + i);
  return {
    date: date.toISOString().split('T')[0],
    totalFeedAmount: Math.round(280 + Math.random() * 80),
    totalDeathCount: Math.round(5 + Math.random() * 25),
    avgTemperature: +(25 + Math.random() * 2).toFixed(1),
    avgDissolvedOxygen: +(6.5 + Math.random() * 1.5).toFixed(1),
    avgPh: +(7.0 + Math.random() * 0.5).toFixed(1),
    taskCompletionRate: Math.round(85 + Math.random() * 15),
    electricityUsage: Math.round(450 + Math.random() * 150),
    waterUsage: Math.round(80 + Math.random() * 40),
  };
});

export const staffPerformances: StaffPerformance[] = [
  {
    id: 'u-001',
    name: '张师傅',
    role: '饲养员',
    tasksCompleted: 24,
    tasksTotal: 26,
    completionRate: 92.3,
    feedAmount: 2850,
    samplingCount: 0,
  },
  {
    id: 'u-002',
    name: '刘师傅',
    role: '饲养员',
    tasksCompleted: 22,
    tasksTotal: 25,
    completionRate: 88.0,
    feedAmount: 2680,
    samplingCount: 0,
  },
  {
    id: 'u-003',
    name: '李质检',
    role: '质检人员',
    tasksCompleted: 12,
    tasksTotal: 12,
    completionRate: 100.0,
    feedAmount: 0,
    samplingCount: 28,
  },
  {
    id: 'u-004',
    name: '王质检',
    role: '质检人员',
    tasksCompleted: 10,
    tasksTotal: 11,
    completionRate: 90.9,
    feedAmount: 0,
    samplingCount: 22,
  },
  {
    id: 'u-005',
    name: '陈主管',
    role: '车间主管',
    tasksCompleted: 8,
    tasksTotal: 8,
    completionRate: 100.0,
    feedAmount: 0,
    samplingCount: 0,
  },
];
