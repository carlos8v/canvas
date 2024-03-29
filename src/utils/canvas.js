const lineWidth = 2
const lineColor = '#FFFFFF'
const backgroundColor = '#09090B'
const selectionColor = '#8B5CF6'

import {
  boundingBoxPadding,
  getBoundingBoxPositions,
  getTopLeftPosition,
  hasSelectEllipse,
  hasSelectedRectangle,
} from './shape'

/**
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawBackground(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./shape').Position} originPosition
 * @param {number} width
 * @param {number} height
 */
export function drawBoundingBox(ctx, originPosition, width, height) {
  ctx.fillStyle = selectionColor
  ctx.strokeStyle = selectionColor
  ctx.lineWidth = lineWidth

  // Draw box
  ctx.beginPath()
  ctx.rect(
    originPosition.x - boundingBoxPadding,
    originPosition.y - boundingBoxPadding,
    width + boundingBoxPadding * 2,
    height + boundingBoxPadding * 2
  )
  ctx.stroke()

  // Draw box corners
  for (const boundingPosition of getBoundingBoxPositions(
    originPosition,
    width,
    height
  )) {
    ctx.beginPath()
    ctx.arc(boundingPosition.x, boundingPosition.y, 5, 0, Math.PI * 2)
    ctx.fill()
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./shape').Shape} shape
 */
export function drawLine(ctx, { positions }) {
  const [originPosition, endPosition] = positions

  ctx.strokeStyle = lineColor
  ctx.lineWidth = lineWidth

  ctx.beginPath()
  ctx.moveTo(originPosition.x, originPosition.y)
  ctx.lineTo(endPosition.x, endPosition.y)
  ctx.stroke()
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./shape').Shape} shape
 */
export function drawEllipse(ctx, shape) {
  const { positions, proportional = false, selected = false } = shape
  const [originPosition, endPosition] = positions

  ctx.lineWidth = lineWidth
  ctx.strokeStyle = lineColor

  if (proportional) {
    const middlePosition = {
      x: (originPosition.x + endPosition.x) / 2,
      y: (originPosition.y + endPosition.y) / 2,
    }

    const radius = Math.sqrt(
      Math.pow(middlePosition.x - originPosition.x, 2) +
        Math.pow(middlePosition.y - originPosition.y, 2)
    )

    ctx.beginPath()
    ctx.arc(middlePosition.x, middlePosition.y, radius, 0, Math.PI * 2)
    ctx.stroke()

    if (selected) {
      const topLeftPosition = {
        x: middlePosition.x - radius,
        y: middlePosition.y - radius,
      }

      drawBoundingBox(ctx, topLeftPosition, radius * 2, radius * 2)
    }
  } else {
    const width = endPosition.x - originPosition.x
    const height = endPosition.y - originPosition.y

    const kappa = 0.5522848,
      ox = (width / 2) * kappa, // control point offset horizontal
      oy = (height / 2) * kappa, // control point offset vertical
      xe = originPosition.x + width, // x-end
      ye = originPosition.y + height, // y-end
      xm = originPosition.x + width / 2, // x-middle
      ym = originPosition.y + height / 2 // y-middle

    ctx.beginPath()
    ctx.moveTo(originPosition.x, ym)
    ctx.bezierCurveTo(
      originPosition.x,
      ym - oy,
      xm - ox,
      originPosition.y,
      xm,
      originPosition.y
    )
    ctx.bezierCurveTo(xm + ox, originPosition.y, xe, ym - oy, xe, ym)
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye)
    ctx.bezierCurveTo(
      xm - ox,
      ye,
      originPosition.x,
      ym + oy,
      originPosition.x,
      ym
    )
    ctx.stroke()

    if (selected) {
      const boundingWidth = Math.abs(width)
      const boundingHeight = Math.abs(height)
      const topLeftPosition = getTopLeftPosition(
        originPosition,
        endPosition,
        boundingWidth,
        boundingHeight
      )
      drawBoundingBox(ctx, topLeftPosition, boundingWidth, boundingHeight)
    }
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./shape').Shape} shape
 */
export function drawRectangle(ctx, shape) {
  const { positions, proportional = false, selected = false } = shape
  const [originPosition, endPosition] = positions

  const width = Math.abs(endPosition.x - originPosition.x)
  const height = Math.abs(endPosition.y - originPosition.y)

  ctx.strokeStyle = lineColor
  ctx.lineWidth = lineWidth

  const maxOffset = Math.max(width, height)
  const offsetX = proportional ? maxOffset : width
  const offsetY = proportional ? maxOffset : height

  const topLeftPosition = getTopLeftPosition(
    originPosition,
    endPosition,
    proportional ? maxOffset : width,
    proportional ? maxOffset : height
  )

  ctx.beginPath()
  ctx.rect(topLeftPosition.x, topLeftPosition.y, offsetX, offsetY)
  ctx.stroke()

  if (selected) {
    drawBoundingBox(
      ctx,
      topLeftPosition,
      proportional ? maxOffset : width,
      proportional ? maxOffset : height
    )
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./shape').Shape} shape
 */
export function drawDiamond(ctx, shape) {
  const { positions, proportional = false } = shape
  const [originPosition, endPosition] = positions

  const width = Math.abs(endPosition.x - originPosition.x)
  const height = Math.abs(endPosition.y - originPosition.y)

  ctx.strokeStyle = lineColor
  ctx.lineWidth = lineWidth

  const offset = Math.max(width, height)
  const offsetX = proportional ? offset : width
  const offsetY = proportional ? offset : height
  const { x, y } = getTopLeftPosition(
    originPosition,
    endPosition,
    proportional ? offset : width,
    proportional ? offset : height
  )
  const xm = x + offsetX / 2
  const ym = y + offsetY / 2

  ctx.beginPath()
  ctx.moveTo(xm, y)
  ctx.lineTo(xm - offsetX / 2, ym) // top left edge
  ctx.lineTo(xm, y + offsetY) // bottom left edge
  ctx.lineTo(xm + offsetX / 2, ym) // bottom right edge
  ctx.lineTo(xm, y) // top right edge
  ctx.stroke()
}

// TODO: remove mocked tools verification
const allowedSelectedShapes = new Set(['rectangle', 'ellipse'])

/**
 * @param {import('./shape').Position} selectPosition
 * @param {import('./shape').Shape} shape
 */
export function hasSelectShape(selectPosition, shape) {
  if (!allowedSelectedShapes.has(shape.type)) {
    return false
  }

  const handleSelectionFn = new Map([
    ['rectangle', hasSelectedRectangle],
    ['ellipse', hasSelectEllipse],
  ])

  const selectionFn = handleSelectionFn.get(shape.type)
  return selectionFn?.(selectPosition, shape) ?? false
}

export function createShape({ type, proportional, positions }) {
  return {
    id: new Date().toISOString(),
    type,
    proportional,
    positions,
  }
}

export const drawByType = {
  line: drawLine,
  ellipse: drawEllipse,
  rectangle: drawRectangle,
  diamond: drawDiamond,
}
