import { createContext, useContext, useRef } from 'react'

const canvasContext = createContext(null)

export const useCanvasContext = () => useContext(canvasContext)

export const CanvasProvider = ({ children }) => {
  const canvasRef = useRef(null)

  return (
    <canvasContext.Provider value={canvasRef}>
      {children}
    </canvasContext.Provider>
  )
}
