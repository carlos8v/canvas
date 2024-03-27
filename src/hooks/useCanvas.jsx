import { useEffect, useRef } from 'react'
import { useCanvasContext } from '../contexts/CanvasContext'

export const useCanvas = () => {
  const canvasCtx = useRef(null)
  const canvasRef = useCanvasContext()

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvasCtx.current = canvas.getContext('2d')
    }
  }, [canvasRef.current])

  return {
    ctx: canvasCtx,
    canvasRef,
  }
}
