function getTopLeftPoint(p1, p2, offsetX = 0, offsetY = 0) {
  return {
    x: p1.x <= p2.x ? p1.x : p1.x - offsetX,
    y: p1.y <= p2.y ? p1.y : p1.y - offsetY,
  }
}

export function drawBackground(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // TODO: remove mocked
  ctx.fillStyle = '#09090B'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

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

export function drawEllipse(ctx, { positions, proportional = false }) {
  const [originPoint, endPoint] = positions

  // TODO: remove mocked
  ctx.strokeStyle = '#fff'

  const width = endPoint.x - originPoint.x
  const height = endPoint.y - originPoint.y

  if (proportional) {
    const xMiddle = originPoint.x + width / 2
    const yMiddle = originPoint.y + height / 2

    const distance = Math.sqrt(
      Math.pow(xMiddle - originPoint.x, 2) +
        Math.pow(yMiddle - originPoint.y, 2)
    )

    ctx.beginPath()
    ctx.arc(xm, ym, distance, 0, Math.PI * 2)
    ctx.stroke()

    return
  }

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
}

export function drawRectangle(
  ctx,
  { positions, proportional = false, selected = false }
) {
  const [originPoint, endPoint] = positions

  // TODO: remove mocked
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2

  const width = Math.abs(endPoint.x - originPoint.x)
  const height = Math.abs(endPoint.y - originPoint.y)
  const offset = Math.max(width, height)

  if (proportional) {
    const { x, y } = getTopLeftPoint(originPoint, endPoint, offset, offset)

    ctx.beginPath()
    ctx.rect(x, y, offset, offset)
    ctx.stroke()
  } else {
    const x = Math.min(originPoint.x, endPoint.x)
    const y = Math.min(originPoint.y, endPoint.y)

    ctx.beginPath()
    ctx.rect(x, y, width, height)
    ctx.stroke()
  }

  if (selected) {
    const startBoxPoint = getTopLeftPoint(
      originPoint,
      endPoint,
      proportional ? offset : width,
      proportional ? offset : height
    )
    drawBoundingBox(
      ctx,
      startBoxPoint,
      proportional ? offset : width,
      proportional ? offset : height
    )
  }
}

export function drawDiamond(ctx, { positions, proportional = false }) {
  const [originPoint, endPoint] = positions

  const width = Math.abs(endPoint.x - originPoint.x)
  const height = Math.abs(endPoint.y - originPoint.y)

  // TODO: remove mocked
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2

  if (proportional) {
    const distance = Math.max(width, height)

    const x =
      originPoint.x <= endPoint.x
        ? Math.min(originPoint.x, endPoint.x)
        : Math.max(originPoint.x, endPoint.x) - distance

    const y =
      originPoint.y <= endPoint.y
        ? Math.min(originPoint.y, endPoint.y)
        : Math.max(originPoint.y, endPoint.y) - distance

    const xm = x + distance / 2
    const ym = y + distance / 2

    ctx.beginPath()
    ctx.moveTo(xm, y)
    ctx.lineTo(xm - distance / 2, ym) // top left edge
    ctx.lineTo(xm, y + distance) // bottom left edge
    ctx.lineTo(xm + distance / 2, ym) // bottom right edge
    ctx.lineTo(xm, y) // top right edge
    ctx.stroke()
    return
  }

  const x = Math.min(originPoint.x, endPoint.x)
  const y = Math.min(originPoint.y, endPoint.y)
  const xm = x + width / 2
  const ym = y + height / 2

  ctx.beginPath()
  ctx.moveTo(xm, y)
  ctx.lineTo(xm - width / 2, ym) // top left edge
  ctx.lineTo(xm, y + height) // bottom left edge
  ctx.lineTo(xm + width / 2, ym) // bottom right edge
  ctx.lineTo(xm, y) // top right edge
  ctx.stroke()
}

export const drawByType = {
  line: drawLine,
  ellipse: drawEllipse,
  rectangle: drawRectangle,
  diamond: drawDiamond,
}
