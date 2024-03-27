import React from 'react'
import { Canvas } from './components/Canvas'
import { Tools } from './components/Tools'

import { useCanvas } from './hooks/useCanvas'
import { CanvasProvider } from './contexts/CanvasContext'

export function CanvasWrapper() {
  const { canvasRef, ctx } = useCanvas()

  function handleClick(e) {
    ctx.current.fillStyle = '#fff'
    ctx.current.beginPath()
    ctx.current.arc(e.clientX, e.clientY, 20, 0, 2 * Math.PI)
    ctx.current.fill()
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
