import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_FACTORY_ADDRESS = '0xc3f1030491964136a466c699a96395d4B931a2E1' as const;

interface FactoryStore {
  factoryAddress: `0x${string}`;
  setFactoryAddress: (address: `0x${string}`) => void;
  resetToDefault: () => void;
}

export const useFactoryStore = create<FactoryStore>()(
  persist(
    (set) => ({
      factoryAddress: DEFAULT_FACTORY_ADDRESS,
      setFactoryAddress: (address) => set({ factoryAddress: address }),
      resetToDefault: () => set({ factoryAddress: DEFAULT_FACTORY_ADDRESS }),
    }),
    {
      name: 'eventsure-factory-storage',
    }
  )
);

export const DEFAULT_FACTORY = DEFAULT_FACTORY_ADDRESS;
