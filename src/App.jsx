import React from 'react'
import { Canvas } from './components/Canvas'
import { Tools } from './components/Tools'

import { useCanvas } from './hooks/useCanvas'

function App() {
  const { canvasRef, getContext } = useCanvas()

  const draw = (ctx) => {
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(50, 100, 20, 0, 2 * Math.PI)
    ctx.fill()
  }

  function handleClick(e) {
    const ctx = getContext()
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(e.clientX, e.clientY, 20, 0, 2 * Math.PI)
    ctx.fill()
  }

  return (
    <main className="min-w-screen min-h-screen flex flex-col bg-zinc-950">
      <Tools />
      <Canvas ref={canvasRef} onClick={handleClick} />
    </main>
  )
}

export default App
