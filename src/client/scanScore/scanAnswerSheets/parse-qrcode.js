import jsQR from 'jsqr'

export const qrRectWidth = 180
export const rectPadding = 10
export const getAngleOfQR = (point1, point2, point3) => {
  const dx21 = point2.x - point1.x
  const dx31 = point3.x - point1.x
  const dy21 = point2.y - point1.y
  const dy31 = point3.y - point1.y
  const m12 = Math.sqrt(dx21 * dx21 + dy21 * dy21)
  const m13 = Math.sqrt(dx31 * dx31 + dy31 * dy31)
  let result = 0
  if (point2.y > point1.y) {
    result = Math.acos((dx21 * dx31 + dy21 * dy31) / (m12 * m13))
  } else {
    result = Math.acos((dx21 * dx31 + dy21 * dy31) / (m12 * m13)) * -1
  }
  return (result * 180) / Math.PI
}

export const getWidthOfQR = (point1, point2) => {
  const x = Math.pow(point1.x - point2.x, 2)
  const y = Math.pow(point1.y - point2.y, 2)
  const result = Math.sqrt(x + y)
  return result
}

export const detectQRCode = (cv, matSrc) => {
  // Todo: "200" is the best value to detect QRCode.

  let padding = 0
  let qrRect = new cv.Rect(
    matSrc.size().width - qrRectWidth - padding,
    padding,
    qrRectWidth,
    qrRectWidth
  )
  let croppedQR = matSrc.roi(qrRect)

  let result = null
  const sz = new cv.Size(200, 200)
  cv.resize(croppedQR, croppedQR, sz)
  const qrCodeData = jsQR(
    croppedQR.data,
    croppedQR.size().width,
    croppedQR.size().height
  )
  if (qrCodeData) {
    result = qrCodeData
    drawBorderOfQR(cv, matSrc, qrCodeData, qrRect)
  }
  croppedQR.delete()
  return result
}

export const drawBorderOfQR = (cv, matSrc, qrCodeData, qrRect) => {
  // calculate real position of qrcode.
  // Todo: image is resized in detectQRCode() so to get the real position of qrcode must calculate of ratio.
  // Todo: "200" is the width of the image is resized.

  let leftBottomPoint = {
    x: (qrCodeData.location.bottomLeftCorner.x * qrRectWidth) / 200 + qrRect.x,
    y: (qrCodeData.location.bottomLeftCorner.y * qrRectWidth) / 200,
  }
  let rightBottomPoint = {
    x: (qrCodeData.location.bottomRightCorner.x * qrRectWidth) / 200 + qrRect.x,
    y: (qrCodeData.location.bottomRightCorner.y * qrRectWidth) / 200,
  }
  let leftTopPoint = {
    x: (qrCodeData.location.topLeftCorner.x * qrRectWidth) / 200 + qrRect.x,
    y: (qrCodeData.location.topLeftCorner.y * qrRectWidth) / 200,
  }
  let rightTopPoint = {
    x: (qrCodeData.location.topRightCorner.x * qrRectWidth) / 200 + qrRect.x,
    y: (qrCodeData.location.topRightCorner.y * qrRectWidth) / 200,
  }

  cv.line(matSrc, leftBottomPoint, rightBottomPoint, [0, 255, 0, 255], 1)
  cv.line(matSrc, rightBottomPoint, rightTopPoint, [0, 255, 0, 255], 1)
  cv.line(matSrc, rightTopPoint, leftTopPoint, [0, 255, 0, 255], 1)
  cv.line(matSrc, leftTopPoint, leftBottomPoint, [0, 255, 0, 255], 1)
}

export const drawRegionOfQR = (cv, matSrc, hideText = false) => {
  const rectStartPoint = {
    x: matSrc.size().width - qrRectWidth - rectPadding,
    y: rectPadding,
  }
  const rectEndPoint = {
    x: matSrc.size().width - rectPadding,
    y: rectPadding + qrRectWidth,
  }
  cv.rectangle(matSrc, rectStartPoint, rectEndPoint, [0, 0, 255, 255], 2)
  if (!hideText) {
    cv.putText(
      matSrc,
      'Place QR code',
      {
        x: rectStartPoint.x + 20,
        y: rectStartPoint.y + 25,
      },
      cv.FONT_HERSHEY_SIMPLEX,
      0.6,
      [0, 0, 255, 255]
    )
  }
}
