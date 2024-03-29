import { createContext, useContext, useEffect } from 'react'

import { useCanvas } from '../hooks/useCanvas'

import { usePaintStore } from '../store/paintStore'
import { bindEvents } from '../utils/events'
import {
  createShape,
  drawBackground,
  drawByType,
  hasSelectShape,
} from '../utils/canvas'

const paintContext = createContext({
  mode: 'selection',
  changeTool: () => {},
  handlePaint: () => {},
  draw: () => {},
  isDrawing: false,
  setPreviewPosition: () => {},
  cancelPreview: () => {},
  selectedShape: null,
  selectShape: () => {},
  isHovering: false,
  checkHoveringShape: () => {},
})

export const usePaintContext = () => useContext(paintContext)

export const PaintProvider = ({ children }) => {
  const { ctx } = useCanvas()

  const shapes = usePaintStore((store) => store.shapes)
  const addShape = usePaintStore((store) => store.addShape)

  const selectedShape = usePaintStore((store) => store.selectedShape)
  const setSelectedShape = usePaintStore((store) => store.setSelectedShape)

  const mode = usePaintStore((store) => store.mode)
  const setMode = usePaintStore((store) => store.setMode)
  const tool = usePaintStore((store) => store.tool)
  const setTool = usePaintStore((store) => store.setTool)

  const isHovering = usePaintStore((store) => store.isHovering)
  const setIsHovering = usePaintStore((store) => store.setIsHovering)

  const isDrawing = usePaintStore((store) => store.isDrawing)
  const setIsDrawing = usePaintStore((store) => store.setIsDrawing)

  const proportional = usePaintStore((store) => store.proportional)
  const setProportional = usePaintStore((store) => store.setProportional)

  const originPosition = usePaintStore((store) => store.originPosition)
  const setOriginPosition = usePaintStore((store) => store.setOriginPosition)

  const previewPosition = usePaintStore((store) => store.previewPosition)
  const setPreviewPosition = usePaintStore((store) => store.setPreviewPosition)

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
  }, [shapes, previewPosition, selectedShape])

  function changeTool(newTool) {
    setTool(newTool)

    if (newTool !== 'selection') {
      setSelectedShape(null)
      setMode('drawing')
      setIsHovering(false)
    } else {
      setMode('selection')
    }
  }

  function handlePaint({ x, y }) {
    if (!isDrawing) {
      setOriginPosition({ x, y })
      setIsDrawing(true)
      return
    }

    setIsDrawing(false)

    if (originPosition.x !== x && originPosition.y !== y) {
      addShape(
        createShape({
          type: tool,
          proportional,
          positions: [originPosition, { x, y }],
        })
      )
    }

    setOriginPosition({ x: 0, y: 0 })
  }

  function drawPreview() {
    if (isDrawing) {
      const drawFn = drawByType[tool]
      if (drawFn) {
        drawFn(ctx.current, {
          positions: [originPosition, previewPosition],
          proportional,
        })
      }
    }
  }

  function draw() {
    if (!ctx.current) return

    drawBackground(ctx.current)
    for (const shape of shapes) {
      const drawFn = drawByType[shape.type]
      if (drawFn)
        drawFn(ctx.current, {
          ...shape,
          selected: selectedShape?.id === shape.id,
        })
    }
    drawPreview()
  }

  function isHoveringShape(selectPosition) {
    for (const shape of shapes) {
      if (mode !== 'selection') continue

      if (
        hasSelectShape(selectPosition, {
          ...shape,
          selected: selectedShape?.id === shape.id,
        })
      ) {
        return shape
      }
    }

    return null
  }

  function selectShape(selectPosition) {
    if (mode !== 'selection') return
    const hoveredShape = isHoveringShape(selectPosition)
    setSelectedShape(hoveredShape ?? null)
  }

  function checkHoveringShape(selectPosition) {
    if (mode !== 'selection') return
    const hoveredShape = isHoveringShape(selectPosition)
    setIsHovering(Boolean(hoveredShape?.id))
  }

  function cancelPreview() {
    setIsDrawing(false)
    setOriginPosition({ x: 0, y: 0 })
    setPreviewPosition({ x: 0, y: 0 })
  }

  return (
    <paintContext.Provider
      value={{
        mode,
        tool,
        changeTool,
        handlePaint,
        draw,
        isDrawing,
        setPreviewPosition,
        cancelPreview,
        selectedShape,
        selectShape,
        isHovering,
        checkHoveringShape,
      }}
    >
      {children}
    </paintContext.Provider>
  )
}
