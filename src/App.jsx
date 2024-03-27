import React from 'react'

import { CanvasProvider } from './contexts/CanvasContext'
import { PaintProvider } from './contexts/PaintContext'

import { CanvasWrapper } from './CanvasWrapper'

function App() {
  return (
    <CanvasProvider>
      <PaintProvider>
        <CanvasWrapper />
      </PaintProvider>
    </CanvasProvider>
  )
}

export default App
