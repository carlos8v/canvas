import { create } from 'zustand'

export const usePaintStore = create((set) => ({
  drawings: [],
  addDraw: (newDraw) => {
    set(({ drawings: prevDrawings }) => ({
      drawings: [...prevDrawings, newDraw],
    }))
  },
  mode: 'pointer',
  setMode: (mode) => set({ mode }),
  isDrawing: false,
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  firstPoint: { x: 0, y: 0 },
  setFirstPoint: ({ x, y }) => set({ firstPoint: { x, y } }),
}))
