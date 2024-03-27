import { createContext, useContext, useEffect } from 'react'

import { useCanvas } from '../hooks/useCanvas'

import { usePaintStore } from '../store/paintStore'
import { drawBackground, drawByType, drawLine } from '../utils/draw'

const paintContext = createContext({
  mode: 'pointer',
  setMode: () => {},
  handlePaint: () => {},
  draw: () => {},
})

export const usePaintContext = () => useContext(paintContext)

export const PaintProvider = ({ children }) => {
  const { ctx } = useCanvas()

  const drawings = usePaintStore((store) => store.drawings)
  const addDraw = usePaintStore((store) => store.addDraw)

  const mode = usePaintStore((store) => store.mode)
  const setMode = usePaintStore((store) => store.setMode)

  const isDrawing = usePaintStore((store) => store.isDrawing)
  const setIsDrawing = usePaintStore((store) => store.setIsDrawing)

  const firstPoint = usePaintStore((store) => store.firstPoint)
  const setFirstPoint = usePaintStore((store) => store.setFirstPoint)

  useEffect(() => {
    draw()
  }, [drawings])

  function handlePaint({ x, y }) {
    if (mode === 'line') {
      if (!isDrawing) {
        setFirstPoint({ x, y })
        setIsDrawing(true)
        return
      }

      setIsDrawing(false)
      addDraw({
        id: new Date().toISOString(),
        type: 'line',
        positions: [firstPoint, { x, y }],
      })

      setFirstPoint({ x: 0, y: 0 })
    }
  }

  function draw() {
    if (!ctx.current) return

    drawBackground(ctx.current)
    for (const draw of drawings) {
      const drawFn = drawByType[draw.type]
      if (drawFn) drawFn(ctx.current, draw)
    }
  }

  return (
    <paintContext.Provider
      value={{
        mode,
        setMode,
        handlePaint,
        draw,
      }}
    >
      {children}
    </paintContext.Provider>
  )
}
