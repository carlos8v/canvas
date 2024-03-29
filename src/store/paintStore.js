import { create } from 'zustand'

export const usePaintStore = create((set) => ({
  mode: 'selection',
  setMode: (mode) => set({ mode }),
  tool: 'selection',
  setTool: (tool) => set({ tool }),
  shapes: [],
  addShape: (newShape) => {
    set(({ shapes: prevShapes }) => ({
      shapes: [newShape, ...prevShapes],
    }))
  },
  isHovering: false,
  setIsHovering: (isHovering) => set({ isHovering }),
  selectedShape: null,
  setSelectedShape: (selectedShape) => set({ selectedShape }),
  proportional: false,
  setProportional: (proportional) => set({ proportional }),
  isDrawing: false,
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  previewPoint: { x: 0, y: 0 },
  setPreviewPoint: ({ x, y }) => set({ previewPoint: { x, y } }),
  originPoint: { x: 0, y: 0 },
  setOriginPoint: ({ x, y }) => set({ originPoint: { x, y } }),
}))
