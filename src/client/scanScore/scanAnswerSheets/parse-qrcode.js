import jsQR from 'jsqr'
import log from './log'

// export const qrRectWidth = 110;
// export const qrCodeResizeWidth = qrRectWidth * 2;
export const paddingRight = 20
export const paddingTop = 90
export const qrPadding = 10
export const connerPadding = 20
export const connerWidth = 60

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

export const detectQRCode = (cv, matSrc, qrRect) => {
  let croppedQR = matSrc.roi(qrRect)

  croppedQR.convertTo(croppedQR, -1, 1, 30)

  let result = null
  const sz = new cv.Size(qrRect.width * 2, qrRect.height * 2)
  cv.resize(croppedQR, croppedQR, sz)
  log('croppedQr', croppedQR)
  let qrCodeData = jsQR(
    croppedQR.data,
    croppedQR.size().width,
    croppedQR.size().height
  )
  if (qrCodeData) {
    result = qrCodeData
  }
  croppedQR.delete()
  return result
}

export const detectParentRectangle = (cv, matSrc) => {
  const parentRectangle = findParentRectangle(cv, matSrc)

  if (parentRectangle) {
    const { parentCodePoints, qrCodeData } = parentRectangle
    parentCodePoints.sort((firstItem, secondItem) => firstItem.y - secondItem.y)

    let topLeftCorner
    let topRightCorner
    let bottomLeftCorner
    let bottomRightCorner

    if (parentCodePoints[0].x < parentCodePoints[1].x) {
      topLeftCorner = parentCodePoints[0]
      topRightCorner = parentCodePoints[1]
    } else if (parentCodePoints[0].x > parentCodePoints[1].x) {
      topRightCorner = parentCodePoints[0]
      topLeftCorner = parentCodePoints[1]
    }

    if (parentCodePoints[2].x < parentCodePoints[3].x) {
      bottomLeftCorner = parentCodePoints[2]
      bottomRightCorner = parentCodePoints[3]
    } else if (parentCodePoints[2].x > parentCodePoints[3].x) {
      bottomRightCorner = parentCodePoints[2]
      bottomLeftCorner = parentCodePoints[3]
    }

    const rectanglePosition = {
      topLeftCorner: topLeftCorner,
      topRightCorner: topRightCorner,
      bottomLeftCorner: bottomLeftCorner,
      bottomRightCorner: bottomRightCorner,
    }
    return { rectanglePosition: rectanglePosition, qrCodeData: qrCodeData }
  }

  return null
}

export const findParentRectangle = (cv, matSrc) => {
  let contours = new cv.MatVector()
  let hierarchy = new cv.Mat()
  let matImg = new cv.Mat()

  cv.cvtColor(matSrc, matImg, cv.COLOR_RGBA2GRAY, 0)
  let kernel = cv.Mat.ones(7, 7, cv.CV_8U)
  cv.erode(matImg, matImg, kernel)

  cv.threshold(matImg, matImg, 115, 255, cv.THRESH_OTSU)
  // cv.imshow('workingCanvas', matImg);
  cv.findContours(
    matImg,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_NONE
  )

  let rectPoints = null
  let rectangles = []
  let qrCode = null
  for (let i = 0; i < contours.size(); ++i) {
    let cnt = contours.get(i)
    let rotatedRect = cv.minAreaRect(cnt)
    let vertices = cv.RotatedRect.points(rotatedRect)

    let topLeftCorner
    let topRightCorner
    let bottomLeftCorner
    let bottomRightCorner

    let points = vertices
    points.sort((firstItem, secondItem) => firstItem.y - secondItem.y)

    if (points[0].x <= points[1].x) {
      topLeftCorner = points[0]
      topRightCorner = points[1]
    } else if (points[0].x > points[1].x) {
      topRightCorner = points[0]
      topLeftCorner = points[1]
    }

    if (points[2].x <= points[3].x) {
      bottomLeftCorner = points[2]
      bottomRightCorner = points[3]
    } else if (points[2].x > points[3].x) {
      bottomRightCorner = points[2]
      bottomLeftCorner = points[3]
    }

    let width = getWidthOfQR(topLeftCorner, topRightCorner)
    let height = getWidthOfQR(topLeftCorner, bottomLeftCorner)
    const screenWidth = matSrc.size().width
    const screenHeight = matSrc.size().width
    if (width > height) {
      if (
        width / height < 1.25 &&
        width / height > 1.15 &&
        width > screenWidth / 5 &&
        height > screenHeight / 5
      ) {
        rectangles.push([
          topLeftCorner,
          topRightCorner,
          bottomRightCorner,
          bottomLeftCorner,
        ])
      }
    } else if (width < height) {
      if (
        height / width > 1.8 &&
        height / width < 2 &&
        width > screenWidth / 5 &&
        height > screenHeight / 5
      ) {
        rectangles.push([
          topLeftCorner,
          topRightCorner,
          bottomRightCorner,
          bottomLeftCorner,
        ])
      }
    }

    if (
      width / height < 1.1 &&
      width / height > 0.9 &&
      width > screenWidth / 10 &&
      height > screenHeight / 10
    ) {
      vertices = [
        topLeftCorner,
        topRightCorner,
        bottomRightCorner,
        bottomLeftCorner,
      ]
      // for (let i = 0 ; i < vertices.length ; i++) {
      //     cv.line(matSrc, vertices[i], vertices[(i + 1) % vertices.length] , [0, 0, 255, 255], 2);
      // }
      let rect = cv.boundingRect(cnt)
      qrCode = detectQRCode(cv, matSrc, rect)
    }
    cnt.delete()
  }

  hierarchy.delete()
  contours.delete()
  matImg.delete()

  if (rectangles.length === 0 || qrCode === null) {
    return null
  } else {
    rectPoints = rectangles[0]
    let isOut = false
    for (let i = 0; i < rectPoints.length; i++) {
      if (
        rectPoints[i].x < 0 ||
        rectPoints[i].x > matSrc.size().width ||
        rectPoints[i].y < 0 ||
        rectPoints[i].y > matSrc.size().height
      ) {
        isOut = true
      }
    }
    if (isOut) {
      for (let i = 0; i < rectPoints.length; i++) {
        cv.line(
          matSrc,
          rectPoints[i],
          rectPoints[(i + 1) % rectPoints.length],
          [255, 255, 0, 255],
          2
        )
      }
      return null
    }
    for (let i = 0; i < rectPoints.length; i++) {
      cv.line(
        matSrc,
        rectPoints[i],
        rectPoints[(i + 1) % rectPoints.length],
        [0, 255, 0, 255],
        2
      )
    }
  }
  return { parentCodePoints: rectPoints, qrCodeData: qrCode }
}

export const calculateCenterPt = (points, startPt) => {
  if (!points) {
    return null
  }
  let sumX = 0
  let sumY = 0
  for (let i = 0; i < points.length; i++) {
    sumX = sumX + points[i].x
    sumY = sumY + points[i].y
  }
  const centerPt = {
    x: parseInt(sumX / 4) + startPt.x,
    y: parseInt(sumY / 4) + startPt.y,
  }
  return centerPt
}

// export const drawBorderOfQR = (cv, matSrc, qrCodeData, qrRect) => {
//     // calculate real position of qrcode.
//     // Todo: image is resized in detectQRCode() so to get the real position of qrcode must calculate of ratio.
//
//     const bottomLeftCorner = {
//         x: qrCodeData.location.bottomLeftCorner.x * qrRectWidth / qrCodeResizeWidth + qrRect.x,
//         y: qrCodeData.location.bottomLeftCorner.y * qrRectWidth / qrCodeResizeWidth + paddingTop
//     };
//     const bottomRightCorner = {
//         x: qrCodeData.location.bottomRightCorner.x * qrRectWidth / qrCodeResizeWidth + qrRect.x,
//         y: qrCodeData.location.bottomRightCorner.y * qrRectWidth / qrCodeResizeWidth + paddingTop
//     };
//     const topLeftCorner = {
//         x: qrCodeData.location.topLeftCorner.x * qrRectWidth / qrCodeResizeWidth + qrRect.x,
//         y: qrCodeData.location.topLeftCorner.y * qrRectWidth / qrCodeResizeWidth + paddingTop
//     };
//     const topRightCorner = {
//         x: qrCodeData.location.topRightCorner.x * qrRectWidth / qrCodeResizeWidth + qrRect.x,
//         y: qrCodeData.location.topRightCorner.y * qrRectWidth / qrCodeResizeWidth + paddingTop
//     };
//
//     qrCodeData.location.topRightCorner = topRightCorner;
//     qrCodeData.location.bottomLeftCorner = bottomLeftCorner;
//     qrCodeData.location.bottomRightCorner = bottomRightCorner;
//     qrCodeData.location.topLeftCorner = topLeftCorner;
//     return qrCodeData;
// }
//
// export const drawRegionOfQR = (cv, matSrc) => {
//     const rectStartPoint = { x: matSrc.size().width - qrRectWidth - paddingRight + qrPadding, y: paddingTop + qrPadding };
//     const rectEndPoint = { x: matSrc.size().width - paddingRight - qrPadding, y: qrRectWidth + paddingTop - qrPadding };
//     // cv.rectangle(matSrc, rectStartPoint, rectEndPoint, [0, 0, 255, 255], 2);
//     // cv.putText(matSrc, 'Put QR code', {
//     //     x: rectStartPoint.x + 2,
//     //     y: rectStartPoint.y - 5
//     // }, cv.FONT_HERSHEY_SIMPLEX, 0.4, [0, 0, 255, 255]);
//
//     const leftTopPt = { x: connerPadding, y: connerPadding };
//     const rightTopPt = { x: matSrc.size().width - connerPadding, y: connerPadding };
//     const leftBottomPt = { x: connerPadding, y: matSrc.size().height - connerPadding };
//     const rightBottomPt = { x: matSrc.size().width - connerPadding, y: matSrc.size().height - connerPadding };
//
//     cv.rectangle(matSrc, leftTopPt, { x: leftTopPt.x + connerWidth, y: leftTopPt.y + connerWidth }, [0, 0, 255, 255], 2);
//     cv.rectangle(matSrc, rightTopPt, { x: rightTopPt.x - connerWidth, y: rightTopPt.y + connerWidth }, [0, 0, 255, 255], 2);
//     cv.rectangle(matSrc, leftBottomPt, { x: leftBottomPt.x + connerWidth, y: leftBottomPt.y - connerWidth }, [0, 0, 255, 255], 2);
//     cv.rectangle(matSrc, rightBottomPt, { x: rightBottomPt.x - connerWidth, y: rightBottomPt.y - connerWidth }, [0, 0, 255, 255], 2);
//
//     let qrRect = new cv.Rect(matSrc.size().width - qrRectWidth - paddingRight, paddingTop, qrRectWidth, qrRectWidth);
//     let croppedQR = matSrc.roi(qrRect);
//
//     // cv.line(matSrc, leftTopPt, { x: leftTopPt.x + width, y: leftTopPt.y }, [255, 0, 0, 255], 2);
//     // cv.line(matSrc, leftTopPt, { x: leftTopPt.x, y: leftTopPt.y + width }, [255, 0, 0, 255], 2);
//
//     // cv.line(matSrc, rightTopPt, { x: rightTopPt.x - width, y: rightTopPt.y }, [255, 0, 0, 255], 2);
//     // cv.line(matSrc, rightTopPt, { x: rightTopPt.x, y: rightTopPt.y + width }, [255, 0, 0, 255], 2);
//
//     // cv.line(matSrc, leftBottomPt, { x: leftBottomPt.x + width, y: leftBottomPt.y }, [255, 0, 0, 255], 2);
//     // cv.line(matSrc, leftBottomPt, { x: leftBottomPt.x, y: leftBottomPt.y - width }, [255, 0, 0, 255], 2);
//
//     // cv.line(matSrc, rightBottomPt, { x: rightBottomPt.x - width, y: rightBottomPt.y }, [255, 0, 0, 255], 2);
//     // cv.line(matSrc, rightBottomPt, { x: rightBottomPt.x, y: rightBottomPt.y - width }, [255, 0, 0, 255], 2);
// }
