import { useRef, useEffect, useState, forwardRef } from 'react'

import { classnames } from '../utils/classnames'
import { usePaintContext } from '../contexts/PaintContext'

export const Canvas = forwardRef((props, ref) => {
  const wrapperRef = useRef(null)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const [canvasHeight, setCanvasHeight] = useState(0)

  const { mode, draw } = usePaintContext()

  useEffect(() => {
    getCanvasDimensions()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', getCanvasDimensions)

    return () => {
      window.removeEventListener('resize', getCanvasDimensions)
    }
  }, [])

  useEffect(() => {
    draw()
  }, [canvasWidth, canvasHeight])

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
        className={classnames({
          'cursor-crosshair': mode !== 'pointer',
        })}
        {...props}
      ></canvas>
    </div>
  )
})
