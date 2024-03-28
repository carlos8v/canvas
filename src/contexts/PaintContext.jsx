import { createContext, useContext, useEffect } from 'react'

import { useCanvas } from '../hooks/useCanvas'

import { usePaintStore } from '../store/paintStore'
import { bindEvents } from '../utils/events'
import { drawBackground, drawByType } from '../utils/draw'

const paintContext = createContext({
  mode: 'pointer',
  setMode: () => {},
  handlePaint: () => {},
  draw: () => {},
  isDrawing: false,
  setPreviewPoint: () => {},
  cancelPreview: () => {},
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

  const proportional = usePaintStore((store) => store.proportional)
  const setProportional = usePaintStore((store) => store.setProportional)

  const originPoint = usePaintStore((store) => store.originPoint)
  const setOriginPoint = usePaintStore((store) => store.setOriginPoint)

  const previewPoint = usePaintStore((store) => store.previewPoint)
  const setPreviewPoint = usePaintStore((store) => store.setPreviewPoint)

  useEffect(() => {
    const events = [
      {
        key: 'shift',
        option: 'keydown',
        cb: () => setProportional(true),
      },
      {
        key: 'shift',
        option: 'keyup',
        cb: () => setProportional(false),
      },
    ]

    const cleanup = bindEvents(events)
    return () => cleanup()
  }, [])

  useEffect(() => {
    draw()
  }, [drawings, previewPoint])

  function handlePaint({ x, y }) {
    if (!isDrawing) {
      setOriginPoint({ x, y })
      setIsDrawing(true)
      return
    }

    setIsDrawing(false)

    if (originPoint.x !== x && originPoint.y !== y) {
      addDraw({
        id: new Date().toISOString(),
        type: mode,
        proportional,
        positions: [originPoint, { x, y }],
      })
    }

    setOriginPoint({ x: 0, y: 0 })
  }

  function drawPreview() {
    if (isDrawing) {
      const drawFn = drawByType[mode]
      if (drawFn) {
        drawFn(ctx.current, {
          positions: [originPoint, previewPoint],
          proportional,
        })
      }
    }
  }

  function draw() {
    if (!ctx.current) return

    drawBackground(ctx.current)
    for (const drawing of drawings) {
      const drawFn = drawByType[drawing.type]
      if (drawFn) drawFn(ctx.current, drawing)
    }
    drawPreview()
  }

  function cancelPreview() {
    setIsDrawing(false)
    setOriginPoint({ x: 0, y: 0 })
    setPreviewPoint({ x: 0, y: 0 })
  }

  return (
    <paintContext.Provider
      value={{
        mode,
        setMode,
        handlePaint,
        draw,
        isDrawing,
        setPreviewPoint,
        cancelPreview,
      }}
    >
      {children}
    </paintContext.Provider>
  )
}
