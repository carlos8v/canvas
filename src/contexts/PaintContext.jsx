import { createContext, useContext, useEffect, useState } from 'react'

import { useCanvas } from '../hooks/useCanvas'

import { usePaintStore } from '../store/paintStore'
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

// TODO: remove supported form verification
const supportedForms = new Set(['line', 'ellipse', 'rectangle'])

export const PaintProvider = ({ children }) => {
  const { ctx } = useCanvas()

  const drawings = usePaintStore((store) => store.drawings)
  const addDraw = usePaintStore((store) => store.addDraw)

  const mode = usePaintStore((store) => store.mode)
  const setMode = usePaintStore((store) => store.setMode)

  const isDrawing = usePaintStore((store) => store.isDrawing)
  const setIsDrawing = usePaintStore((store) => store.setIsDrawing)

  const originPoint = usePaintStore((store) => store.originPoint)
  const setOriginPoint = usePaintStore((store) => store.setOriginPoint)

  const previewPoint = usePaintStore((store) => store.previewPoint)
  const setPreviewPoint = usePaintStore((store) => store.setPreviewPoint)

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

    // TODO: remove supported form verification
    if (
      originPoint.x !== x &&
      originPoint.y !== y &&
      supportedForms.has(mode)
    ) {
      addDraw({
        id: new Date().toISOString(),
        type: mode,
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
