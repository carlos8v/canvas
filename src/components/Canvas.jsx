import { useRef, useEffect, useState, forwardRef } from 'react'

export const Canvas = forwardRef((props, ref) => {
  const wrapperRef = useRef(null)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const [canvasHeight, setCanvasHeight] = useState(0)

  useEffect(() => {
    getCanvasDimensions()

    const canvas = ref.current
    const context = canvas.getContext('2d')
    context.fillStyle = '#09090b'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
  }, [])

  useEffect(() => {
    window.addEventListener('resize', getCanvasDimensions)

    return () => {
      window.removeEventListener('resize', getCanvasDimensions)
    }
  }, [])

  function getCanvasDimensions() {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect()
      setCanvasHeight(rect.height)
      setCanvasWidth(rect.width)
    }
  }

  return (
    <div ref={wrapperRef} className="flex-1">
      <canvas
        ref={ref}
        width={canvasWidth}
        height={canvasHeight}
        onClick={props.onClick}
        {...props}
      ></canvas>
    </div>
  )
})
