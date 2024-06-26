import { useEffect } from 'react'
import { Canvas } from './components/Canvas'
import { Tools } from './components/Tools'
import { ObjectOptions } from './components/ObjectOptions'

import { CanvasProvider } from './contexts/CanvasContext'
import { usePaintContext } from './contexts/PaintContext'

import { useCanvas } from './hooks/useCanvas'

export function CanvasWrapper() {
  const { canvasRef } = useCanvas()
  const {
    mode,
    handlePaint,
    isDrawing,
    setPreviewPosition,
    cancelPreview,
    selectShape,
    checkHoveringShape,
  } = usePaintContext()

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboard)

    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [])

  function handleKeyboard(e) {
    if (e.key === 'Escape') {
      cancelPreview()
    }
  }

  function handleOriginPosition(e) {
    if (mode === 'selection') return

    handlePaint({
      x: e.clientX,
      y: e.clientY,
    })
  }

  function handleEndPosition(e) {
    if (mode === 'selection') {
      selectShape({
        x: e.clientX,
        y: e.clientY,
      })

      return
    }

    if (isDrawing) {
      handlePaint({
        x: e.clientX,
        y: e.clientY,
      })
    }
  }

  function handlePreview(e) {
    if (mode === 'selection') {
      checkHoveringShape({
        x: e.clientX,
        y: e.clientY,
      })

      return
    }

    if (isDrawing) {
      setPreviewPosition({
        x: e.clientX,
        y: e.clientY,
      })
    }
  }

  return (
    <CanvasProvider>
      <main className="min-w-screen min-h-screen flex flex-col bg-zinc-950">
        <Tools />
        <ObjectOptions />
        <Canvas
          ref={canvasRef}
          onMouseDown={handleOriginPosition}
          onMouseMove={handlePreview}
          onClick={handleEndPosition}
        />
      </main>
    </CanvasProvider>
  )
}
