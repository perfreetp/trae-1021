import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, SamplingRecord, DeathRecord, Device } from '../types';
import { tasks as initialTasks } from '../data/tasks';
import { samplingRecords as initialSamplings, deathRecords as initialDeaths } from '../data/samplings';
import { devices as initialDevices } from '../data/devices';

interface InspectionRecord {
  id: string;
  deviceId: string;
  deviceName: string;
  date: string;
  inspector: string;
  result: 'normal' | 'abnormal' | 'maintenance';
  notes: string;
}

interface AppState {
  tasks: Task[];
  samplingRecords: SamplingRecord[];
  deathRecords: DeathRecord[];
  devices: Device[];
  inspectionRecords: InspectionRecord[];
  
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  addSamplingRecord: (record: Omit<SamplingRecord, 'id'>) => void;
  addDeathRecord: (record: Omit<DeathRecord, 'id'>) => void;
  addInspectionRecord: (record: Omit<InspectionRecord, 'id'>) => void;
  updateDeviceStatus: (deviceId: string, status: Device['status']) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      samplingRecords: initialSamplings,
      deathRecords: initialDeaths,
      devices: initialDevices,
      inspectionRecords: [],

      updateTaskStatus: (taskId, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
        })),

      addSamplingRecord: (record) =>
        set((state) => ({
          samplingRecords: [
            { ...record, id: `s-${Date.now()}` },
            ...state.samplingRecords,
          ],
        })),

      addDeathRecord: (record) =>
        set((state) => ({
          deathRecords: [{ ...record, id: `d-${Date.now()}` }, ...state.deathRecords],
        })),

      addInspectionRecord: (record) =>
        set((state) => ({
          inspectionRecords: [
            { ...record, id: `i-${Date.now()}` },
            ...state.inspectionRecords,
          ],
        })),

      updateDeviceStatus: (deviceId, status) =>
        set((state) => ({
          devices: state.devices.map((d) => (d.id === deviceId ? { ...d, status } : d)),
        })),
    }),
    {
      name: 'aquaculture-storage',
    }
  )
);
