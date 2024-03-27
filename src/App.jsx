import React from 'react'

import { CanvasProvider } from './contexts/CanvasContext'

import { CanvasWrapper } from './CanvasWrapper'

function App() {
  return (
    <CanvasProvider>
      <CanvasWrapper />
    </CanvasProvider>
  )
}

export default App
