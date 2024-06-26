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
 * @property {string} shapeColor
 * @property {string} borderColor
 * @property {boolean} selected
 */

/**
 * @param {Position} p1
 * @param {Position} p2
 * @param {number} offsetX
 * @param {number} offsetY
 * @returns {Position}
 */
export function getTopLeftPosition(p1, p2, offsetX = 0, offsetY = 0) {
  return {
    x: p1.x <= p2.x ? p1.x : p1.x - offsetX,
    y: p1.y <= p2.y ? p1.y : p1.y - offsetY,
  }
}

/**
 * @param {Position} selectPosition
 * @param {Position} topLeftPosition
 * @param {Position} bottomRightPosition
 */
export function isInsideRectangle(
  selectPosition,
  topLeftPosition,
  bottomRightPosition,
  offset = 0
) {
  return (
    selectPosition.x >= topLeftPosition.x - offset &&
    selectPosition.x <= bottomRightPosition.x + offset &&
    selectPosition.y >= topLeftPosition.y - offset &&
    selectPosition.y <= bottomRightPosition.y + offset
  )
}

/**
 * @param {Position} originPosition
 * @param {number} width
 * @param {number} height
 * @returns {[Position, Position, Position, Position]} boundingPositions
 */
export function getBoundingBoxPositions(originPosition, width, height) {
  const topLeftPosition = {
    x: originPosition.x - boundingBoxPadding,
    y: originPosition.y - boundingBoxPadding,
  }
  const topRightPosition = {
    x: originPosition.x + width + boundingBoxPadding,
    y: originPosition.y - boundingBoxPadding,
  }
  const bottomRightPosition = {
    x: originPosition.x + width + boundingBoxPadding,
    y: originPosition.y + height + boundingBoxPadding,
  }
  const bottomLeftPosition = {
    x: originPosition.x - boundingBoxPadding,
    y: originPosition.y + height + boundingBoxPadding,
  }

  return [
    topLeftPosition,
    topRightPosition,
    bottomRightPosition,
    bottomLeftPosition,
  ]
}

/**
 * @param {Position} selectPosition
 * @param {Shape} shape
 */
export function hasSelectEllipse(selectPosition, shape) {
  const [p1, p2] = shape.positions

  if (shape.proportional) {
    const middlePosition = {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    }

    const radius = Math.sqrt(
      Math.pow(middlePosition.x - p1.x, 2) +
        Math.pow(middlePosition.y - p1.y, 2)
    )

    if (!shape.selected) {
      return (
        Math.pow(selectPosition.x - middlePosition.x, 2) +
          Math.pow(selectPosition.y - middlePosition.y, 2) <=
        Math.pow(radius + boundingBoxPadding, 2)
      )
    }

    const topLeftPosition = {
      x: middlePosition.x - radius,
      y: middlePosition.y - radius,
    }
    const bottomRightPosition = {
      x: topLeftPosition.x + radius * 2,
      y: topLeftPosition.y + radius * 2,
    }

    return isInsideRectangle(
      selectPosition,
      topLeftPosition,
      bottomRightPosition,
      boundingBoxPadding
    )
  }

  const width = Math.abs(p2.x - p1.x)
  const height = Math.abs(p2.y - p1.y)
  const topLeftPosition = getTopLeftPosition(p1, p2, width, height)
  const bottomRightPosition = {
    x: topLeftPosition.x + width,
    y: topLeftPosition.y + height,
  }

  return isInsideRectangle(
    selectPosition,
    topLeftPosition,
    bottomRightPosition,
    boundingBoxPadding
  )
}

/**
 * @param {Position} selectPosition
 * @param {Shape} shape
 */
export function hasSelectedRectangle(selectPosition, shape) {
  const [p1, p2] = shape.positions

  const width = Math.abs(p2.x - p1.x)
  const height = Math.abs(p2.y - p1.y)
  const topLeftPosition = getTopLeftPosition(p1, p2, width, height)

  const [boundingTopLeft, _, boundingBottomRight] = getBoundingBoxPositions(
    topLeftPosition,
    width,
    height
  )

  return isInsideRectangle(selectPosition, boundingTopLeft, boundingBottomRight)
}
