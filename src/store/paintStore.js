import { create } from 'zustand'

export const usePaintStore = create((set) => ({
  drawings: [],
  addDraw: (newDraw) => {
    set(({ drawings: prevDrawings }) => ({
      drawings: [...prevDrawings, newDraw],
    }))
  },
  proportional: false,
  setProportional: (proportional) => set({ proportional }),
  mode: 'pointer',
  setMode: (mode) => set({ mode }),
  isDrawing: false,
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  previewPoint: { x: 0, y: 0 },
  setPreviewPoint: ({ x, y }) => set({ previewPoint: { x, y } }),
  originPoint: { x: 0, y: 0 },
  setOriginPoint: ({ x, y }) => set({ originPoint: { x, y } }),
}))
