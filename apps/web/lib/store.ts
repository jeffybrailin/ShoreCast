import { create } from "zustand";
import type { Beach, LiveBeachData } from "./api";

interface Alert {
  beach_name: string;
  message: string;
  severity: string;
  timestamp: string;
}

interface ShorecastStore {
  beaches: Beach[];
  selectedBeach: LiveBeachData | null;
  alerts: Alert[];
  mapCenter: [number, number];
  setBeaches: (beaches: Beach[]) => void;
  setSelectedBeach: (beach: LiveBeachData | null) => void;
  addAlert: (alert: Alert) => void;
  setMapCenter: (center: [number, number]) => void;
}

export const useShorecastStore = create<ShorecastStore>((set) => ({
  beaches: [],
  selectedBeach: null,
  alerts: [],
  mapCenter: [80.2785, 20.5937],
  setBeaches: (beaches) => set({ beaches }),
  setSelectedBeach: (beach) => set({ selectedBeach: beach }),
  addAlert: (alert) =>
    set((s) => ({ alerts: [alert, ...s.alerts].slice(0, 10) })),
  setMapCenter: (mapCenter) => set({ mapCenter }),
}));
