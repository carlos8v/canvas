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

export const drawByType = {
  line: drawLine,
}
