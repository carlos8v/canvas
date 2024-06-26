import { create } from 'zustand'

export const defaultBorderColors = [
  '#f8f8f2',
  '#ff5555',
  '#50fa7b',
  '#8be9fd',
  '#ffb86c',
  '#ff79c6',
]

export const defaultShapeColors = [
  'transparent',
  '#710311',
  '#104f01',
  '#094a79',
  '#61340c',
  '#730641',
]

export const usePaintStore = create((set) => ({
  mode: 'selection',
  setMode: (mode) => set({ mode }),
  tool: 'selection',
  setTool: (tool) => set({ tool }),
  shapes: [],
  addShape: (newShape) => {
    set(({ shapes: prevShapes }) => ({
      shapes: [...prevShapes, newShape],
    }))
  },
  shapeColor: defaultShapeColors[0],
  setShapeColor: (color) => set({ shapeColor: color }),
  borderColor: defaultBorderColors[0],
  setBorderColor: (color) => set({ borderColor: color }),
  isHovering: false,
  setIsHovering: (isHovering) => set({ isHovering }),
  selectedShape: null,
  setSelectedShape: (selectedShape) => set({ selectedShape }),
  proportional: false,
  setProportional: (proportional) => set({ proportional }),
  isDrawing: false,
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  previewPosition: { x: 0, y: 0 },
  setPreviewPosition: ({ x, y }) => set({ previewPosition: { x, y } }),
  originPosition: { x: 0, y: 0 },
  setOriginPosition: ({ x, y }) => set({ originPosition: { x, y } }),
}))
