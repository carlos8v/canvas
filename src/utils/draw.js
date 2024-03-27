export function drawBackground(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // TODO: remove mocked
  ctx.fillStyle = '#09090b'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

export function drawLine(ctx, { positions }) {
  const [p1, p2] = positions

  // TODO: remove mocked
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2;

  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
}

export const drawByType = {
  line: drawLine,
}
