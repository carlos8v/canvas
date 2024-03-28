export function drawBackground(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // TODO: remove mocked
  ctx.fillStyle = '#09090b'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
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
    const xm = originPoint.x + width / 2
    const ym = originPoint.y + height / 2

    const radius = Math.sqrt(
      Math.pow(xm - originPoint.x, 2) + Math.pow(ym - originPoint.y, 2)
    )

    ctx.beginPath()
    ctx.arc(xm, ym, radius, 0, Math.PI * 2)
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

export const drawByType = {
  line: drawLine,
  ellipse: drawEllipse,
}
