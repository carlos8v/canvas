import { useEffect } from 'react'
import { Canvas } from './components/Canvas'
import { Tools } from './components/Tools'

import { CanvasProvider } from './contexts/CanvasContext'
import { usePaintContext } from './contexts/PaintContext'

import { useCanvas } from './hooks/useCanvas'

export function CanvasWrapper() {
  const { canvasRef } = useCanvas()
  const { handlePaint, isDrawing, setPreviewPoint, cancelPreview } =
    usePaintContext()

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
    handlePaint({
      x: e.clientX,
      y: e.clientY,
    })
  }

  function handleEndPosition(e) {
    if (isDrawing) {
      handlePaint({
        x: e.clientX,
        y: e.clientY,
      })
    }
  }

  function handlePreview(e) {
    if (isDrawing) {
      setPreviewPoint({
        x: e.clientX,
        y: e.clientY,
      })
    }
  }

  return (
    <CanvasProvider>
      <main className="min-w-screen min-h-screen flex flex-col bg-zinc-950">
        <Tools />
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
