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
  setPreviewPoint: () => {},
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
  }, [shapes, previewPoint, selectedShape])

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
      setOriginPoint({ x, y })
      setIsDrawing(true)
      return
    }

    setIsDrawing(false)

    if (originPoint.x !== x && originPoint.y !== y) {
      addShape(
        createShape({
          type: tool,
          proportional,
          positions: [originPoint, { x, y }],
        })
      )
    }

    setOriginPoint({ x: 0, y: 0 })
  }

  function drawPreview() {
    if (isDrawing) {
      const drawFn = drawByType[tool]
      if (drawFn) {
        drawFn(ctx.current, {
          positions: [originPoint, previewPoint],
          proportional,
        })
      }
    }
  }

  function drawSelection() {
    if (!Boolean(selectedShape?.id)) return

    const drawFn = drawByType[selectedShape.type]
    if (drawFn) drawFn(ctx.current, { ...selectedShape, selected: true })
  }

  function draw() {
    if (!ctx.current) return

    drawBackground(ctx.current)
    for (const shape of shapes) {
      const drawFn = drawByType[shape.type]
      if (drawFn) drawFn(ctx.current, shape)
    }
    drawPreview()
    drawSelection()
  }

  function isHoveringShape(selectPoint) {
    for (const shape of shapes) {
      if (mode !== 'selection') continue

      if (
        hasSelectShape(selectPoint, {
          ...shape,
          selected: Boolean(selectedShape?.id),
        })
      ) {
        return shape
      }
    }

    return null
  }

  function selectShape(selectPoint) {
    if (mode !== 'selection') return
    const hoveredShape = isHoveringShape(selectPoint)
    setSelectedShape(hoveredShape ?? null)
  }

  function checkHoveringShape(selectPoint) {
    if (mode !== 'selection') return
    const hoveredShape = isHoveringShape(selectPoint)
    setIsHovering(Boolean(hoveredShape?.id))
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
        tool,
        changeTool,
        handlePaint,
        draw,
        isDrawing,
        setPreviewPoint,
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
