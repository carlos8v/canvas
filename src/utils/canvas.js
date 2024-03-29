/**
 * @typedef {Object} Position
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} Shape
 * @property {Position[]} positions
 * @property {boolean} proportional
 * @property {boolean} selected
 */

/**
 * @param {Position} p1 
 * @param {Position} p2 
 * @param {number} offsetX 
 * @param {number} offsetY 
 * @returns {Position}
 */
function getTopLeftPoint(p1, p2, offsetX = 0, offsetY = 0) {
  return {
    x: p1.x <= p2.x ? p1.x : p1.x - offsetX,
    y: p1.y <= p2.y ? p1.y : p1.y - offsetY,
  }
}

/** 
 * @param {CanvasRenderingContext2D} ctx 
 */
export function drawBackground(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // TODO: remove mocked
  ctx.fillStyle = '#09090B'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Position} originPoint 
 * @param {number} width 
 * @param {number} height 
 */
export function drawBoundingBox(ctx, originPoint, width, height) {
  const padding = 10

  // TODO: remove mocked
  ctx.strokeStyle = '#8B5CF6'
  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.rect(
    originPoint.x - padding,
    originPoint.y - padding,
    width + padding * 2,
    height + padding * 2
  )
  ctx.stroke()
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Shape} shape 
 */
export function drawLine(ctx, { positions }) {
  const [originPoint, endPoint] = positions

  // TODO: remove mocked
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.moveTo(originPoint.x, originPoint.y)
  ctx.lineTo(endPoint.x, endPoint.y)
  ctx.stroke()
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Shape} shape 
 */
export function drawEllipse(ctx, shape) {
  const { positions, proportional = false, selected = false } = shape
  const [originPoint, endPoint] = positions

  // TODO: remove mocked
  ctx.strokeStyle = '#fff'

  if (proportional) {
    const middlePoint = {
      x: (originPoint.x + endPoint.x) / 2,
      y: (originPoint.y + endPoint.y) / 2,
    }

    const radius = Math.sqrt(
      Math.pow(middlePoint.x - originPoint.x, 2) +
        Math.pow(middlePoint.y - originPoint.y, 2)
    )

    ctx.beginPath()
    ctx.arc(middlePoint.x, middlePoint.y, radius, 0, Math.PI * 2)
    ctx.stroke()

    if (selected) {
      const topLeftPoint = {
        x: middlePoint.x - radius,
        y: middlePoint.y - radius,
      }

      drawBoundingBox(ctx, topLeftPoint, radius * 2, radius * 2)
    }
  } else {
    const width = endPoint.x - originPoint.x
    const height = endPoint.y - originPoint.y

    const kappa = 0.5522848,
      ox = (width / 2) * kappa, // control point offset horizontal
      oy = (height / 2) * kappa, // control point offset vertical
      xe = originPoint.x + width, // x-end
      ye = originPoint.y + height, // y-end
      xm = originPoint.x + width / 2, // x-middle
      ym = originPoint.y + height / 2 // y-middle

    ctx.beginPath()
    ctx.moveTo(originPoint.x, ym)
    ctx.bezierCurveTo(
      originPoint.x,
      ym - oy,
      xm - ox,
      originPoint.y,
      xm,
      originPoint.y
    )
    ctx.bezierCurveTo(xm + ox, originPoint.y, xe, ym - oy, xe, ym)
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye)
    ctx.bezierCurveTo(xm - ox, ye, originPoint.x, ym + oy, originPoint.x, ym)
    ctx.stroke()

    if (selected) {
      const boundingWidth = Math.abs(width)
      const boundingHeight = Math.abs(height)
      const topLeftPoint = getTopLeftPoint(
        originPoint,
        endPoint,
        boundingWidth,
        boundingHeight
      )
      drawBoundingBox(ctx, topLeftPoint, boundingWidth, boundingHeight)
    }
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Shape} shape 
 */
export function drawRectangle(ctx, shape) {
  const { positions, proportional = false, selected = false } = shape
  const [originPoint, endPoint] = positions

  const width = Math.abs(endPoint.x - originPoint.x)
  const height = Math.abs(endPoint.y - originPoint.y)

  // TODO: remove mocked
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2

  const maxOffset = Math.max(width, height)
  const offsetX = proportional ? maxOffset : width
  const offsetY = proportional ? maxOffset : height

  const topLeftPoint = getTopLeftPoint(
    originPoint,
    endPoint,
    proportional ? maxOffset : width,
    proportional ? maxOffset : height
  )

  ctx.beginPath()
  ctx.rect(topLeftPoint.x, topLeftPoint.y, offsetX, offsetY)
  ctx.stroke()

  if (selected) {
    drawBoundingBox(
      ctx,
      topLeftPoint,
      proportional ? maxOffset : width,
      proportional ? maxOffset : height
    )
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Shape} shape 
 */
export function drawDiamond(ctx, shape) {
  const { positions, proportional = false } = shape
  const [originPoint, endPoint] = positions

  const width = Math.abs(endPoint.x - originPoint.x)
  const height = Math.abs(endPoint.y - originPoint.y)

  // TODO: remove mocked
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2

  const offset = Math.max(width, height)
  const offsetX = proportional ? offset : width
  const offsetY = proportional ? offset : height
  const { x, y } = getTopLeftPoint(
    originPoint,
    endPoint,
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
 * @param {Position} selectPoint 
 * @param {Shape} shape 
 */
export function hasSelectEllipse(selectPoint, shape) {
  const [p1, p2] = shape.positions

  if (shape.proportional) {
    const middlePoint = {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    }

    const radius = Math.sqrt(
      Math.pow(middlePoint.x - p1.x, 2) + Math.pow(middlePoint.y - p1.y, 2)
    )

    return (
      Math.pow(selectPoint.x - middlePoint.x, 2) +
        Math.pow(selectPoint.y - middlePoint.y, 2) <=
      Math.pow(radius, 2)
    )
  }

  const width = Math.abs(p2.x - p1.x)
  const height = Math.abs(p2.y - p1.y)
  const boundingMinPoint = getTopLeftPoint(p1, p2, width, height)
  const boundingMaxPoint = {
    x: boundingMinPoint.x + width,
    y: boundingMinPoint.y + height,
  }

  return (
    selectPoint.x >= boundingMinPoint.x &&
    selectPoint.x <= boundingMaxPoint.x &&
    selectPoint.y >= boundingMinPoint.y &&
    selectPoint.y <= boundingMaxPoint.y
  )
}

/**
 * @param {Position} selectPoint 
 * @param {Shape} shape 
 */
function hasSelectedRectangle(selectPoint, shape) {
  const [p1, p2] = shape.positions

  const width = Math.abs(p2.x - p1.x)
  const height = Math.abs(p2.y - p1.y)

  const boundingMinPoint = getTopLeftPoint(p1, p2, width, height)
  const boundingMaxPoint = {
    x: Math.max(p1.x, p2.x),
    y: Math.max(p1.y, p2.y),
  }

  return (
    selectPoint.x >= boundingMinPoint.x &&
    selectPoint.x <= boundingMaxPoint.x &&
    selectPoint.y >= boundingMinPoint.y &&
    selectPoint.y <= boundingMaxPoint.y
  )
}

/**
 * @param {Position} ctx 
 * @param {Shape} shape 
 */
export function hasSelectShape(selectPoint, shape) {
  if (!allowedSelectedShapes.has(shape.type)) {
    return false
  }

  const handleSelectionFn = new Map([
    ['rectangle', hasSelectedRectangle],
    ['ellipse', hasSelectEllipse],
  ])

  const selectionFn = handleSelectionFn.get(shape.type)
  return selectionFn?.(selectPoint, shape) ?? false
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
