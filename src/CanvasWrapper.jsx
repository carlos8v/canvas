import { Canvas } from './components/Canvas'
import { Tools } from './components/Tools'

import { CanvasProvider } from './contexts/CanvasContext'
import { usePaintContext } from './contexts/PaintContext'

import { useCanvas } from './hooks/useCanvas'

export function CanvasWrapper() {
  const { canvasRef } = useCanvas()
  const { handlePaint } = usePaintContext()

  function handleClick(e) {
    handlePaint({
      x: e.clientX,
      y: e.clientY,
    })
  }

  return (
    <CanvasProvider>
      <main className="min-w-screen min-h-screen flex flex-col bg-zinc-950">
        <Tools />
        <Canvas ref={canvasRef} onClick={handleClick} />
      </main>
    </CanvasProvider>
  )
}
