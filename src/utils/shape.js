export const boundingBoxPadding = 10

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
export function getTopLeftPoint(p1, p2, offsetX = 0, offsetY = 0) {
  return {
    x: p1.x <= p2.x ? p1.x : p1.x - offsetX,
    y: p1.y <= p2.y ? p1.y : p1.y - offsetY,
  }
}

/**
 * @param {Position} selectPoint
 * @param {Position} topLeftPoint
 * @param {Position} bottomRightPoint
 */
export function isInsideRectangle(
  selectPoint,
  topLeftPoint,
  bottomRightPoint,
  offset = 0
) {
  return (
    selectPoint.x >= topLeftPoint.x - offset &&
    selectPoint.x <= bottomRightPoint.x + offset &&
    selectPoint.y >= topLeftPoint.y - offset &&
    selectPoint.y <= bottomRightPoint.y + offset
  )
}

/**
 * @param {Position} originPoint
 * @param {number} width
 * @param {number} height
 * @returns {[Position, Position, Position, Position]} boundingPoints
 */
export function getBoundingBoxPoints(originPoint, width, height) {
  const topLeftPoint = {
    x: originPoint.x - boundingBoxPadding,
    y: originPoint.y - boundingBoxPadding,
  }
  const topRightPoint = {
    x: originPoint.x + width + boundingBoxPadding,
    y: originPoint.y - boundingBoxPadding,
  }
  const bottomRightPoint = {
    x: originPoint.x + width + boundingBoxPadding,
    y: originPoint.y + height + boundingBoxPadding,
  }
  const bottomLeftPoint = {
    x: originPoint.x - boundingBoxPadding,
    y: originPoint.y + height + boundingBoxPadding,
  }

  return [topLeftPoint, topRightPoint, bottomRightPoint, bottomLeftPoint]
}

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

    if (!shape.selected) {
      return (
        Math.pow(selectPoint.x - middlePoint.x, 2) +
          Math.pow(selectPoint.y - middlePoint.y, 2) <=
        Math.pow(radius + boundingBoxPadding, 2)
      )
    }

    const topLeftPoint = {
      x: middlePoint.x - radius,
      y: middlePoint.y - radius,
    }
    const bottomRightPoint = {
      x: topLeftPoint.x + radius * 2,
      y: topLeftPoint.y + radius * 2,
    }

    return isInsideRectangle(
      selectPoint,
      topLeftPoint,
      bottomRightPoint,
      boundingBoxPadding
    )
  }

  const width = Math.abs(p2.x - p1.x)
  const height = Math.abs(p2.y - p1.y)
  const topLeftPoint = getTopLeftPoint(p1, p2, width, height)
  const bottomRightPoint = {
    x: topLeftPoint.x + width,
    y: topLeftPoint.y + height,
  }

  return isInsideRectangle(
    selectPoint,
    topLeftPoint,
    bottomRightPoint,
    boundingBoxPadding
  )
}

/**
 * @param {Position} selectPoint
 * @param {Shape} shape
 */
export function hasSelectedRectangle(selectPoint, shape) {
  const [p1, p2] = shape.positions

  const width = Math.abs(p2.x - p1.x)
  const height = Math.abs(p2.y - p1.y)
  const topLeftPoint = getTopLeftPoint(p1, p2, width, height)

  const [boundingTopLeft, _, boundingBottomRight] = getBoundingBoxPoints(
    topLeftPoint,
    width,
    height
  )

  return isInsideRectangle(selectPoint, boundingTopLeft, boundingBottomRight)
}
